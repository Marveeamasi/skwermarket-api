import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { handleCreateComment, handleGetCommentsByOfferId, handleDeleteComment } from '../controllers/commentController';

const router = Router();

router.use(authenticate);
router.post('/:offerId', handleCreateComment);
router.get('/:offerId', handleGetCommentsByOfferId);
router.delete('/:offerId/:id', handleDeleteComment);

export default router;