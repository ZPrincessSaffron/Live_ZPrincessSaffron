-- Add phone and address fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS alternate_phone text,
ADD COLUMN IF NOT EXISTS shipping_address text,
ADD COLUMN IF NOT EXISTS shipping_area text,
ADD COLUMN IF NOT EXISTS shipping_city text,
ADD COLUMN IF NOT EXISTS shipping_state text,
ADD COLUMN IF NOT EXISTS shipping_pincode text,
ADD COLUMN IF NOT EXISTS shipping_country text DEFAULT 'India';