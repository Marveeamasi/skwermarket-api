import { Router } from 'express';
import {
  handleGetUserById,
  handleGetAllUsers,
  handleUpdateUser,
  handleUpdateManyUsers,
  handleDeleteUser,
  handleDeleteAllUsers,
  handleGetUserByTitle,
} from '../controllers/userController';
import { authenticate, restrictTo } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate); // All routes require authentication
router.get('/title/:title', handleGetUserByTitle);
router.get('/:id', handleGetUserById);
router.get('/', restrictTo('vendor'), handleGetAllUsers); // Only vendors can get all users
router.put('/:id', handleUpdateUser);
router.put('/', restrictTo('vendor'), handleUpdateManyUsers); // Only vendors can update multiple
router.delete('/:id', handleDeleteUser);
router.delete('/', restrictTo('vendor'), handleDeleteAllUsers); // Only vendors can delete all

export default router;