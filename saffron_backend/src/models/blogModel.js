import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        author_name: {
            type: String,
            required: true,
        },
        author_email: {
            type: String,
        },
        image_url: {
            type: String,
        },
        published: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;

