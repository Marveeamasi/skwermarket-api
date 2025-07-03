export interface Offer {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceUnit: string;
  location: string;
  media: { type: 'image' | 'video'; url: string }[];
  approvals: string[];
  commentLength: number;
  chats: string[];
  isPremium: boolean;
  keyword: string[];
  createdAt: string;
  updatedAt: string;
}