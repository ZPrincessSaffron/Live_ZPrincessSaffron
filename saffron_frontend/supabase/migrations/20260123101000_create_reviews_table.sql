-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_name text NOT NULL,
  location text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Reviews are publicly readable"
ON public.reviews
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert reviews
CREATE POLICY "Authenticated users can insert reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (true);