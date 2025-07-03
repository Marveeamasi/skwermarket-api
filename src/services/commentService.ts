import { supabase } from '../utils/supabase';
import { Comment } from '../types/comment';

export const createComment = async (comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> => {
  const { data: offer, error: fetchError } = await supabase.from('offers').select('commentLength').eq('id', comment.offerId).single();
  if (fetchError) throw new Error('Offer not found');
  const { data, error } = await supabase.from('comments').insert({
    ...comment,
    createdAt: new Date().toISOString(),
  }).select().single();
  if (error) throw new Error('Failed to create comment');
  await supabase.from('offers').update({ commentLength: (offer.commentLength || 0) + 1 }).eq('id', comment.offerId);
  return data as Comment;
};

export const getCommentsByOfferId = async (offerId: string): Promise<Comment[]> => {
  const { data, error } = await supabase.from('comments').select('*').eq('offerId', offerId);
  if (error) throw new Error('Failed to fetch comments');
  return data as Comment[];
};

export const deleteComment = async (id: string, offerId: string): Promise<void> => {
  const { data: offer, error: fetchError } = await supabase.from('offers').select('commentLength').eq('id', offerId).single();
  if (fetchError) throw new Error('Offer not found');
  const { error } = await supabase.from('comments').delete().eq('id', id);
  if (error) throw new Error('Failed to delete comment');
  await supabase.from('offers').update({ commentLength: (offer.commentLength || 0) - 1 }).eq('id', offerId);
};