// src/controllers/offerController.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { createOffer, getOfferById, getAllOffers, updateOffer, approveOffer, deleteOffer } from '../services/offerService';
import { asyncHandler } from '../utils/asyncHandler';

export const handleCreateOffer = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new Error('User not authenticated');
  }
  const offer = await createOffer({ ...req.body, vendorId: req.user.id });
  res.status(201).json(offer);
});

export const handleGetOfferById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const offer = await getOfferById(req.params.id);
  res.status(200).json(offer);
});

export const handleGetAllOffers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const offers = await getAllOffers();
  res.status(200).json(offers);
});

export const handleUpdateOffer = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new Error('User not authenticated');
  }
  await updateOffer(req.params.id, req.body);
  res.status(200).json({ message: 'Offer updated' });
});

export const handleApproveOffer = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new Error('User not authenticated');
  }
  await approveOffer(req.params.id, req.user.id);
  res.status(200).json({ message: 'Offer approved' });
});

export const handleDeleteOffer = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteOffer(req.params.id);
  res.status(200).json({ message: 'Offer deleted' });
});