import { supabase } from '../utils/supabase';
import { User } from '../types/user';

export const getUserById = async (id: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) throw new Error('User not found');
  return data as User;
};

export const getAllUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw new Error('Failed to fetch users');
  return data as User[];
};

export const updateUserById = async (id: string, updateData: Partial<User>) => {
  const { error } = await supabase
    .from('users')
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error('Failed to update user');
};

export const updateManyUsers = async (ids: string[], updateData: Partial<User>) => {
  const { error } = await supabase
    .from('users')
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .in('id', ids);
  if (error) throw new Error('Failed to update users');
};

export const deleteUserById = async (id: string) => {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw new Error('Failed to delete user');
};

export const deleteAllUsers = async () => {
  const { error } = await supabase.from('users').delete().neq('id', '0'); // Prevent deleting all without condition
  if (error) throw new Error('Failed to delete users');
};