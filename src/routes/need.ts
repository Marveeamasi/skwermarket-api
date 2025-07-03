import { Router } from 'express';
import { authenticate, restrictTo } from '../middlewares/authMiddleware';
import { handleCreateNeed, handleGetNeedById, handleGetAllNeeds, handleUpdateNeed, handleDeleteNeed } from '../controllers/needController';

const router = Router();

router.use(authenticate);
router.post('/', restrictTo('customer'), handleCreateNeed);
router.get('/:id', handleGetNeedById);
router.get('/', handleGetAllNeeds);
router.put('/:id', restrictTo('customer'), handleUpdateNeed);
router.delete('/:id', restrictTo('customer'), handleDeleteNeed);

export default router;