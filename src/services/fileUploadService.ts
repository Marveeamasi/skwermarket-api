import { supabase } from '../utils/supabase';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { createReadStream } from 'fs';
import { UploadedFile } from 'express-fileupload';

export const compressAndUploadFile = async (file: UploadedFile, bucket: string, path: string) => {
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype.startsWith('video/');
  const outputPath = `temp/${Date.now()}-${file.name}`;

  if (isImage) {
    await sharp(file.data)
      .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
  } else if (isVideo) {
    await new Promise((resolve, reject) => {
      ffmpeg(createReadStream(file.tempFilePath))
        .output(outputPath)
        .videoCodec('libx264')
        .size('1920x1080')
        .videoBitrate('1000k')
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  } else {
    throw new Error('Unsupported file type');
  }

  const fileStream = createReadStream(outputPath);
  const { data, error } = await supabase.storage.from(bucket).upload(path, fileStream, {
    contentType: file.mimetype,
  });

  if (error) throw new Error('Failed to upload file to Supabase');
  return data.path;
};