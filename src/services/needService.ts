import { supabase } from '../utils/supabase';
import { Need } from '../types/need';

export const createNeed = async (need: Omit<Need, 'id' | 'createdAt' | 'updatedAt' | 'chats'>): Promise<Need> => {
  const { data, error } = await supabase.from('needs').insert({
    ...need,
    chats: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }).select().single();
  if (error) throw new Error('Failed to create need');
  return data as Need;
};

export const getNeedById = async (id: string): Promise<Need> => {
  const { data, error } = await supabase.from('needs').select('*').eq('id', id).single();
  if (error) throw new Error('Need not found');
  return data as Need;
};

export const getAllNeeds = async (): Promise<Need[]> => {
  const { data, error } = await supabase.from('needs').select('*');
  if (error) throw new Error('Failed to fetch needs');
  return data as Need[];
};

export const updateNeed = async (id: string, updateData: Partial<Need>): Promise<void> => {
  const { error } = await supabase
    .from('needs')
    .update({ ...updateData, updatedAt: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error('Failed to update need');
};

export const deleteNeed = async (id: string): Promise<void> => {
  const { error } = await supabase.from('needs').delete().eq('id', id);
  if (error) throw new Error('Failed to delete need');
};