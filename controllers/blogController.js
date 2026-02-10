const Blog = require('../models/Blog');

// @desc    Get all blogs with search, filter, sort
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: 'published' };

    // Search by title/content
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by status (for admin)
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter featured
    if (req.query.featured === 'true') {
      query.featured = true;
    }

    // Filter by tags
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }

    // Sort
    let sort = {};
    switch (req.query.sort) {
      case 'latest':
        sort = { publishDate: -1 };
        break;
      case 'popular':
        sort = { views: -1 };
        break;
      case 'likes':
        sort = { likes: -1 };
        break;
      case 'title':
        sort = { title: 1 };
        break;
      default:
        sort = { publishDate: -1 };
    }

    const blogs = await Blog.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      // Increment views
      blog.views += 1;
      await blog.save();
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Get blog by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      author,
      authorAvatar,
      category,
      tags,
      featuredImage,
      status,
      featured,
      publishDate,
      readTime,
    } = req.body;

    const blog = new Blog({
      title,
      excerpt,
      content,
      author,
      authorAvatar,
      category,
      tags,
      featuredImage,
      status: status || 'draft',
      featured: featured || false,
      publishDate: publishDate || Date.now(),
      readTime: readTime || '5 min read',
      createdBy: req.user._id,
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      Object.assign(blog, req.body);
      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      await blog.deleteOne();
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle blog status
// @route   PUT /api/blogs/:id/status
// @access  Private/Admin
const toggleBlogStatus = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      const statusOrder = ['draft', 'published', 'scheduled'];
      const currentIndex = statusOrder.indexOf(blog.status);
      blog.status = statusOrder[(currentIndex + 1) % statusOrder.length];
      await blog.save();
      res.json({ status: blog.status });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Toggle blog status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like blog
// @route   POST /api/blogs/:id/like
// @access  Public
const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      blog.likes += 1;
      await blog.save();
      res.json({ likes: blog.likes });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get blog categories
// @route   GET /api/blogs/categories
// @access  Public
const getBlogCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get blog categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  likeBlog,
  getBlogCategories,
};
