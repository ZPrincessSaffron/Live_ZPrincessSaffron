-- Create blogs table for community articles
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published blogs
CREATE POLICY "Anyone can view published blogs"
ON public.blogs
FOR SELECT
USING (published = true);

-- Allow anyone to insert blogs (community contribution)
CREATE POLICY "Anyone can create blogs"
ON public.blogs
FOR INSERT
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_blogs_updated_at
BEFORE UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Storage policies for blog images
CREATE POLICY "Anyone can view blog images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Anyone can upload blog images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'blog-images');