import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware';
import { getUserById, getAllUsers, updateUserById, updateManyUsers, deleteUserById, deleteAllUsers } from '../services/userService';
import { compressAndUploadFile } from '../services/fileUploadService';
import { supabase } from '../utils/supabase';
import { User } from '../types/user';
import { updateManyUsersSchema, updateUserSchema } from '../utils/validation';

export const handleGetUserByTitle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title } = req.params;
    const { data, error } = await supabase.from('users').select('*').eq('title', title).single();
    if (error || !data) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const handleGetUserById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const handleGetAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const handleUpdateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateUserSchema.parse(req.body);
    const file = (req as any).files?.banner;

    let bannerUrl: string | undefined;
    if (file) {
      const path = `banners/${id}/${Date.now()}-${file.name}`;
      bannerUrl = await compressAndUploadFile(file, 'banners', path);
    }

    const updateData: Partial<User> = {
      ...data,
      ...(bannerUrl && { banner: { type: 'image', url: bannerUrl } }),
    };

    await updateUserById(id, updateData);
    res.status(200).json({ message: 'User updated' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    next(error);
  }
};

export const handleUpdateManyUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ids, updateData } = updateManyUsersSchema.parse(req.body);
    await updateManyUsers(ids, updateData);
    res.status(200).json({ message: 'Users updated' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    next(error);
  }
};

export const handleDeleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteUserById(id);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteAllUsers();
    res.status(200).json({ message: 'All users deleted' });
  } catch (error) {
    next(error);
  }
};