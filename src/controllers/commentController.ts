import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware'; // Import AuthRequest
import { createComment, getCommentsByOfferId, deleteComment } from '../services/commentService';
import { asyncHandler } from '../utils/asyncHandler';

export const handleCreateComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new Error('User not authenticated');
  }
  const comment = await createComment({ ...req.body, user: req.user.id, offerId: req.params.offerId });
  res.status(201).json(comment);
});

export const handleGetCommentsByOfferId = asyncHandler(async (req: AuthRequest, res: Response) => {
  const comments = await getCommentsByOfferId(req.params.offerId);
  res.status(200).json(comments);
});

export const handleDeleteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteComment(req.params.id, req.params.offerId);
  res.status(200).json({ message: 'Comment deleted' });
});