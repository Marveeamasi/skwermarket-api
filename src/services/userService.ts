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

export const followUser = async (followerId: string, followedId: string): Promise<void> => {
  const { data: user, error: fetchError } = await supabase.from('users').select('loyalist').eq('id', followerId).single();
  if (fetchError) throw new Error('User not found');
  const updatedLoyalist = [...(user.loyalist || []), followedId].filter((id, index, self) => self.indexOf(id) === index);
  const { error } = await supabase.from('users').update({ loyalist: updatedLoyalist }).eq('id', followerId);
  if (error) throw new Error('Failed to follow user');
};

export const unfollowUser = async (followerId: string, followedId: string): Promise<void> => {
  const { data: user, error: fetchError } = await supabase.from('users').select('loyalist').eq('id', followerId).single();
  if (fetchError) throw new Error('User not found');
  const updatedLoyalist = (user.loyalist || []).filter((id: string) => id !== followedId);
  const { error } = await supabase.from('users').update({ loyalist: updatedLoyalist }).eq('id', followerId);
  if (error) throw new Error('Failed to unfollow user');
};