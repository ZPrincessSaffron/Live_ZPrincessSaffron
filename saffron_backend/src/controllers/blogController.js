import Blog from "../models/blogModel.js";

// @desc    Create a new blog article
// @route   POST /api/blogs
// @access  Public
export const createBlog = async (req, res) => {
    const { title, content, author_name, author_email, image_url } = req.body;

    try {
        const blog = await Blog.create({
            title,
            content,
            author_name,
            author_email,
            image_url,
        });

        if (blog) {
            res.status(201).json(blog);
        } else {
            res.status(400).json({ message: "Invalid article data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all published blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

