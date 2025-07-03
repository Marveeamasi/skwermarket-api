// src/controllers/needController.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { createNeed, getNeedById, getAllNeeds, updateNeed, deleteNeed } from '../services/needService';
import { asyncHandler } from '../utils/asyncHandler';

export const handleCreateNeed = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new Error('User not authenticated');
  }
  const need = await createNeed({ ...req.body, customerId: req.user.id });
  res.status(201).json(need);
});

export const handleGetNeedById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const need = await getNeedById(req.params.id);
  res.status(200).json(need);
});

export const handleGetAllNeeds = asyncHandler(async (req: AuthRequest, res: Response) => {
  const needs = await getAllNeeds();
  res.status(200).json(needs);
});

export const handleUpdateNeed = asyncHandler(async (req: AuthRequest, res: Response) => {
  await updateNeed(req.params.id, req.body);
  res.status(200).json({ message: 'Need updated' });
});

export const handleDeleteNeed = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteNeed(req.params.id);
  res.status(200).json({ message: 'Need deleted' });
});