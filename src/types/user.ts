export interface User {
  id: string;
  email: string;
  password: string;
  country: string;
  role: 'vendor' | 'customer';
  title?: string;
  banner?: { type: string; url: string };
  colors?: { primary: string; accent: string; secondary: string; topBarTextCol: string; topBarBgCol: string; bodyBgCol: string; bodyTextCol: string };
  fonts?: { title: string; heading: string; body: string; action: string };
  about?: string;
  loyalists: string[];
  offers: string[];
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  otp?: string;
  otp_expires?: string;
  email_verified: boolean;
}