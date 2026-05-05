import { useState, useEffect } from 'react';
import Layout from "@/components/layout/Layout";
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Calendar, User, Loader2, ImagePlus, X, Heart, Sparkles, ChefHat } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
import { useToast } from '@/hooks/use-toast';
import { preloadImages } from '@/utils/imageUtils';
import saffronHealth from '@/assets/saffron-health.jpg';
import saffronBeauty from '@/assets/saffron-beauty.jpeg';
import saffronCulinary from '@/assets/saffron-culinary.jpeg';
import { Button } from '@/components/ui/button';

interface Blog {
  id: string;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
  image_url: string | null;
}

const BLOGS_CACHE_KEY = 'z-princess-blogs-cache';

// ─────────────────────────────────────────────────────────────────────────────
// Saffron Benefits
// ─────────────────────────────────────────────────────────────────────────────
const saffronBenefits = [
  {
    id: 'health', title: 'Health Benefits', subtitle: "Nature's Golden Medicine",
    image: saffronHealth, icon: Heart,
    benefits: ['Powerful antioxidant properties that fight free radicals', 'May help improve mood and treat depression symptoms', 'Supports heart health and blood circulation', 'Anti-inflammatory properties for pain relief', 'May enhance memory and cognitive function'],
    gradient: 'from-royal-purple/80 to-charcoal/90'
  },
  {
    id: 'beauty', title: 'Beauty & Skincare', subtitle: 'Radiance from Within',
    image: saffronBeauty, icon: Sparkles,
    benefits: ['Natural skin brightening and glow enhancement', 'Reduces dark spots and hyperpigmentation', 'Anti-aging properties for youthful skin', 'Soothes skin irritation and inflammation', 'Promotes even skin tone and complexion'],
    gradient: 'from-gold/70 to-charcoal/90'
  },
  {
    id: 'culinary', title: 'Culinary Uses', subtitle: 'Aromatic Excellence',
    image: saffronCulinary, icon: ChefHat,
    benefits: ['Biryani & Rice dishes for rich golden color', 'Paella and Mediterranean cuisines', 'Desserts like Kheer, Ice cream & Pastries', 'Saffron milk and traditional beverages', 'Marinades and gourmet sauces'],
    gradient: 'from-amber-700/80 to-deep/90'
  }
];

const waitForImage = (imagePath: string, priority: 'high' | 'auto' = 'auto') =>
  new Promise<void>((resolve) => {
    if (!imagePath) {
      resolve();
      return;
    }

    const image = new Image();
    image.decoding = priority === 'high' ? 'sync' : 'async';
    image.setAttribute('fetchpriority', priority);
    image.src = imagePath;

    if (image.complete) {
      resolve();
      return;
    }

    image.onload = () => resolve();
    image.onerror = () => resolve();
  });

const readCachedBlogs = (): Blog[] => {
  if (typeof window === 'undefined') return [];

  try {
    const cachedBlogs = window.localStorage.getItem(BLOGS_CACHE_KEY);
    if (!cachedBlogs) return [];

    const parsedBlogs = JSON.parse(cachedBlogs);
    return Array.isArray(parsedBlogs) ? parsedBlogs : [];
  } catch {
    return [];
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Blogs page
// ─────────────────────────────────────────────────────────────────────────────
const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();
  const [expandedBlog, setExpandedBlog] = useState<string | null>(null);

  const [formData, setFormData] = useState({ title: '', content: '', author_name: '', author_email: '' });

  useEffect(() => {
    preloadImages(saffronBenefits.map((benefit) => benefit.image), { priority: 'high' });

    const cachedBlogs = readCachedBlogs();
    if (cachedBlogs.length > 0) {
      setBlogs(cachedBlogs);
      setLoading(false);

      const cachedBlogImages = cachedBlogs
        .slice(0, 12)
        .flatMap((blog) => (blog.image_url ? [blog.image_url] : []));

      if (cachedBlogImages.length > 0) {
        preloadImages(cachedBlogImages, { priority: 'high' });
      }
    }

    void fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_URL}/blogs`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogs(data);

        try {
          window.localStorage.setItem(BLOGS_CACHE_KEY, JSON.stringify(data));
        } catch {
          // ignore storage failures and continue with live data
        }

        const allBlogImages = data
          .flatMap((blog: Blog) => (blog.image_url ? [blog.image_url] : []));
        const visibleBlogImages = data
          .slice(0, 6)
          .flatMap((blog: Blog) => (blog.image_url ? [blog.image_url] : []));

        if (allBlogImages.length > 0) {
          preloadImages(allBlogImages);
        }

        if (visibleBlogImages.length > 0) {
          preloadImages(visibleBlogImages, { priority: 'high' });
          void Promise.race([
            Promise.all(
              visibleBlogImages.map((image, index) =>
                waitForImage(image, index < 6 ? 'high' : 'auto')
              )
            ),
            new Promise((resolve) => window.setTimeout(resolve, 1000)),
          ]);
        }

      }
    } catch (err) { console.error('Failed to fetch blogs:', err); }
    finally { setLoading(false); }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribing(true);
    try {
      const res = await fetch(`${API_URL}/newsletter`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: newsletterEmail }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Subscription failed');
      toast({ title: 'Subscribed!', description: data.message || "You're now subscribed." });
      setNewsletterEmail('');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to subscribe.', variant: 'destructive' });
    } finally { setIsSubscribing(false); }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast({ title: 'Error', description: 'Image must be < 5MB', variant: 'destructive' }); return; }
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => { setImagePreview(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
   let imageUrl: string | null = null;
if (imagePreview) imageUrl = imagePreview;
    try {
      const res = await fetch(`${API_URL}/blogs`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, content: formData.content, author_name: formData.author_name, author_email: formData.author_email || null, image_url: imageUrl, published: true })
      });
      if (!res.ok) throw new Error('Failed to publish');
      toast({ title: 'Success!', description: 'Your article has been published successfully.' });
      setFormData({ title: '', content: '', author_name: '', author_email: '' });
      removeImage(); setShowForm(false); fetchBlogs();
    } catch {
      toast({ title: 'Error', description: 'Failed to publish. Please try again.', variant: 'destructive' });
    } finally { setSubmitting(false); }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-ivory">

        {/* ── Hero ── */}
        <section className="relative w-full bg-royal-purple-dark text-ivory overflow-hidden pt-24 md:pt-32 pb-12 md:pb-16 min-h-[250px] md:min-h-[320px] flex flex-col items-center text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/10 blur-[180px]" />
          </div>
          <div className="w-full md:container mx-auto px-4 md:px-6 lg:px-0 relative z-10 text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="max-w-3xl mx-auto text-center">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="mt-10 text-gold/60 text-sm tracking-[0.4em] uppercase">
                ✦ Royal Knowledge ✦
              </motion.div>
              <br /><br />
              <motion.h1
                className="font-cinzel text-2xl md:text-5xl mb-6 tracking-[0.1em] md:tracking-[0.3em] uppercase cursor-default font-medium flex flex-wrap justify-center leading-tight"
                initial="hidden" animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              >
                {'Saffron Insights'.split('').map((char, idx) => (
                  <motion.span key={idx}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    whileHover={{ color: '#D4AF37', textShadow: '0 0 8px rgba(212,175,55,0.7)' }}
                    className="inline-block"
                  >{char === ' ' ? '\u00A0' : char}</motion.span>
                ))}
              </motion.h1>
              <motion.div initial={{ width: 0 }} animate={{ width: '120px' }} transition={{ duration: 1, delay: 0.6 }}
                className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
                className="text-ivory/70 text-md md:text-lg hover:text-ivory transition-colors duration-300">
                Discover the health benefits, beauty secrets, and culinary magic of the world's most precious spice
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── Benefit Cards ── */}
        <section className="py-16 bg-cream">
          <div className="container mx-auto px-4 md:px-6 lg:px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
              {saffronBenefits.map((benefit, index) => (
                <motion.div key={benefit.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative group rounded-2xl overflow-hidden w-[75%] mx-auto lg:w-full lg:max-w-[340px] h-[400px] md:h-[500px] cursor-pointer"
                >
                  <div className="absolute inset-0">
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      fetchPriority="high"
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${benefit.gradient} transition-opacity duration-500`} />
                  </div>
                  <div className="relative h-full flex flex-col justify-end p-6 text-ivory">
                    <div className="mb-4 transform transition-transform duration-500 group-hover:-translate-y-2">
                      <benefit.icon className="w-10 h-10 text-gold mb-3" />
                      <h3 className="font-serif text-2xl mb-1">{benefit.title}</h3>
                      <p className="text-ivory/70 text-sm">{benefit.subtitle}</p>
                    </div>
                    <div className="max-h-0 overflow-hidden transition-all duration-500 ease-out group-hover:max-h-60">
                      <ul className="space-y-2 pt-4 border-t border-ivory/20">
                        {benefit.benefits.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-ivory/80">
                            <span className="text-gold mt-0.5">✦</span><span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-gold/20 rounded-2xl pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="w-full flex items-center justify-center gap-2 md:gap-4 py-12 bg-ivory px-4 md:px-0">
          <div className="h-px w-8 sm:w-16 md:w-20 bg-gold/30 flex-shrink-0" />
          <h2 className="font-serif text-xl sm:text-2xl text-royal-purple text-center">Community Articles</h2>
          <div className="h-px w-8 sm:w-16 md:w-20 bg-gold/30 flex-shrink-0" />
        </div>

        {/* ── Write Article ── */}
        <section className="py-8 bg-ivory">
          <div className="container mx-auto px-4 md:px-6 lg:px-0">
            <div className="text-center mb-12">
              <Button variant="section" onClick={() => setShowForm(!showForm)} className="min-w-[240px]">
                <span className="flex items-center gap-3"><PenLine className="w-4 h-4" />Write an Article</span>
              </Button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="max-w-2xl mx-auto mb-16 overflow-hidden">
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-charcoal/10">
                    <h3 className="font-sans text-center text-2xl font-medium text-purple mb-6">Share Your Knowledge</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="block text-charcoal/70 text-sm mb-2">Your Name *</label>
                        <input type="text" required value={formData.author_name}
                          onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                          className="w-full bg-cream border border-charcoal/20 rounded-full px-4 py-3 text-charcoal focus:border-royal-purple focus:outline-none transition-colors"
                          placeholder="Enter your name" maxLength={100} />
                      </div>
                      <div>
                        <label className="block text-charcoal/70 text-sm mb-2">Email (optional)</label>
                        <input type="email" value={formData.author_email}
                          onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                          className="w-full bg-cream border border-charcoal/20 rounded-full px-4 py-3 text-charcoal focus:border-royal-purple focus:outline-none transition-colors"
                          placeholder="Enter your email" maxLength={255} />
                      </div>
                      <div>
                        <label className="block text-charcoal/70 text-sm mb-2">Article Title *</label>
                        <input type="text" required value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full bg-cream border border-charcoal/20 rounded-full px-4 py-3 text-charcoal focus:border-royal-purple focus:outline-none transition-colors"
                          placeholder="Enter article title" maxLength={200} />
                      </div>
                      <div>
                        <label className="block text-charcoal/70 text-sm mb-2">Cover Image (optional)</label>
                        {imagePreview ? (
                          <div className="relative rounded-2xl overflow-hidden">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              decoding="async"
                              className="w-full h-48 object-cover"
                            />
                            <button type="button" onClick={removeImage}
                              className="absolute top-2 right-2 bg-charcoal/70 text-ivory p-1.5 rounded-full hover:bg-charcoal transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-charcoal/20 rounded-lg cursor-pointer hover:border-royal-purple/50 transition-colors bg-cream">
                            <ImagePlus className="w-8 h-8 text-charcoal/40 mb-2" />
                            <span className="text-charcoal/50 text-sm">Click to upload image</span>
                            <span className="text-charcoal/30 text-xs mt-1">Max 5MB</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                          </label>
                        )}
                      </div>
                      <div>
                        <label className="block text-charcoal/70 text-sm mb-2">Content *</label>
                        <textarea required rows={6} value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          className="w-full bg-cream border border-charcoal/20 rounded-2xl px-4 py-3 text-charcoal focus:border-royal-purple focus:outline-none transition-colors resize-none"
                          placeholder="Write your article about saffron benefits, uses, recipes..." maxLength={10000} />
                      </div>
                      <div className="flex gap-4 pt-2">
                        <Button variant="white" type="button" onClick={() => { setShowForm(false); removeImage(); }} className="flex-1 min-w-0">CANCEL</Button>
                        <Button variant="royal" type="submit" disabled={submitting || uploading} className="flex-1 min-w-0">
                          <span className="flex items-center gap-2">
                            {(submitting || uploading) && <Loader2 className="w-4 h-4 animate-spin" />}
                            {uploading ? 'Uploading...' : submitting ? 'Publishing...' : 'Publish Article'}
                          </span>
                        </Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {loading && blogs.length === 0 ? (
  <div className="flex justify-center py-20">
    <Loader2 className="w-8 h-8 text-royal-purple animate-spin" />
  </div>
) : blogs.length === 0 ? (
  <div className="text-center py-20">
    <p className="text-charcoal/60 text-lg">
      No articles yet. Be the first to share your knowledge!
    </p>
  </div>
) : (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
    {blogs.map((blog, index) => (
      <motion.article
        key={blog.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="w-[88%] mx-auto lg:w-full bg-white rounded-3xl overflow-hidden border border-gold/20
shadow-md hover:shadow-2xl hover:-translate-y-2
transition-all duration-500 group cursor-pointer"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">

          {blog.image_url ? (
            <img
              src={blog.image_url}
              alt={blog.title}
              fetchPriority={index < 6 ? 'high' : 'auto'}
              loading={index < 6 ? 'eager' : 'lazy'}
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold/20 to-royal-purple/30">
              <span className="font-cinzel text-6xl text-gold/60 tracking-widest">
                {blog.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
        </div>

        {/* Content */}
        <div className="p-6">

          {/* Title */}
          <h3 className="font-sans  font-medium text-lg tracking-wider capitalize text-royal-purple mb-3
          group-hover:text-[#C6A85A] transition-colors duration-300 line-clamp-2">
            {blog.title}
          </h3>

          {/* Content preview */}
         <p className="font-rr font-light text-charcoal/70 text-xs mb-4 leading-relaxed">
  {expandedBlog === blog.id
    ? blog.content
    : `${blog.content.slice(0, 150)}...`}
</p>
<button
  onClick={() =>
    setExpandedBlog(expandedBlog === blog.id ? null : blog.id)
  }
  className="text-royal-purple text-sm font-medium hover:text-gold transition"
>
  {expandedBlog === blog.id ? "Read Less ↑" : "Read More →"}
</button>
          {/* Author + Date */}
          <div className="flex items-center justify-between text-xs text-charcoal/60 border-t border-[#C6A85A]/10 pt-3">

            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-royal-purple" />
              <span>{blog.author_name}</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-royal-purple" />
              <span>
                {blog.created_at
                  ? new Date(blog.created_at).toLocaleDateString()
                  : "Just now"}
              </span>
            </div>

          </div>
        </div>
      </motion.article>
    ))}
  </div>
)}
          </div>
        </section>

        {/* ── Newsletter ── */}
        <section className="py-16 bg-cream">
          <div className="container mx-auto px-4 md:px-6 lg:px-0">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-serif text-1xl md:text-3xl  text-royal-purple mb-4">Subscribe to Our Newsletter</h2>
              <p className="font-rr text-charcoal/70 text-sm mb-8">Get the latest articles, recipes, and exclusive offers delivered to your inbox</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input type="email" required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email" className="flex-1 px-5 py-3 rounded-full border border-charcoal/20 focus:outline-none focus:border-royal-purple" />
                <Button variant="royal" type="submit" disabled={isSubscribing} className="w-fit mx-auto sm:w-auto sm:min-w-[180px] px-8">
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default Blogs;
