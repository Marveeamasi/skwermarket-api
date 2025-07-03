import { supabase } from '../utils/supabase';
import { Offer } from '../types/offer';

export const createOffer = async (offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt' | 'commentLength' | 'approvals' | 'chats'>): Promise<Offer> => {
  const { data, error } = await supabase.from('offers').insert({
    ...offer,
    approvals: [],
    commentLength: 0,
    chats: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }).select().single();
  if (error) throw new Error('Failed to create offer');
  return data as Offer;
};

export const getOfferById = async (id: string): Promise<Offer> => {
  const { data, error } = await supabase.from('offers').select('*').eq('id', id).single();
  if (error) throw new Error('Offer not found');
  return data as Offer;
};

export const getAllOffers = async (): Promise<Offer[]> => {
  const { data, error } = await supabase.from('offers').select('*');
  if (error) throw new Error('Failed to fetch offers');
  return data as Offer[];
};

export const updateOffer = async (id: string, updateData: Partial<Offer>): Promise<void> => {
  const { error } = await supabase
    .from('offers')
    .update({ ...updateData, updatedAt: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error('Failed to update offer');
};

export const approveOffer = async (offerId: string, userId: string): Promise<void> => {
  const { data: offer, error: fetchError } = await supabase.from('offers').select('approvals').eq('id', offerId).single();
  if (fetchError) throw new Error('Offer not found');
  const updatedApprovals = [...(offer.approvals || []), userId];
  const { error } = await supabase.from('offers').update({ approvals: updatedApprovals }).eq('id', offerId);
  if (error) throw new Error('Failed to approve offer');
};

export const deleteOffer = async (id: string): Promise<void> => {
  const { error } = await supabase.from('offers').delete().eq('id', id);
  if (error) throw new Error('Failed to delete offer');
};