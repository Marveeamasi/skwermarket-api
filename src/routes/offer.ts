import { Router } from 'express';
import { authenticate, restrictTo } from '../middlewares/authMiddleware';
import { handleCreateOffer, handleGetOfferById, handleGetAllOffers, handleUpdateOffer, handleApproveOffer, handleDeleteOffer } from '../controllers/offerController';

const router = Router();

router.use(authenticate);
router.post('/', restrictTo('vendor'), handleCreateOffer);
router.get('/:id', handleGetOfferById);
router.get('/', handleGetAllOffers);
router.put('/:id', restrictTo('vendor'), handleUpdateOffer);
router.post('/:id/approve', restrictTo('vendor'), handleApproveOffer);
router.delete('/:id', restrictTo('vendor'), handleDeleteOffer);

export default router;