const Deal = require('../models/Deal');

// @desc    Get all deals with search, filter, sort
// @route   GET /api/deals
// @access  Public
const getDeals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: 'active' };

    // Search by title/description
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by deal type
    if (req.query.type) {
      if (req.query.type === 'flash') query.flashDeal = true;
      if (req.query.type === 'clearance') query.clearance = true;
      if (req.query.type === 'seasonal') query.seasonalDeal = true;
    }

    // Filter by status (for admin)
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.dealPrice = {};
      if (req.query.minPrice) query.dealPrice.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.dealPrice.$lte = Number(req.query.maxPrice);
    }

    // Filter active deals only
    if (req.query.active === 'true') {
      query.startDate = { $lte: new Date() };
      query.endDate = { $gte: new Date() };
    }

    // Sort
    let sort = {};
    switch (req.query.sort) {
      case 'discount-high':
        sort = { discountValue: -1 };
        break;
      case 'price-low':
        sort = { dealPrice: 1 };
        break;
      case 'price-high':
        sort = { dealPrice: -1 };
        break;
      case 'ending-soon':
        sort = { endDate: 1 };
        break;
      case 'latest':
        sort = { createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const deals = await Deal.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Deal.countDocuments(query);

    res.json({
      deals,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single deal by ID
// @route   GET /api/deals/:id
// @access  Public
const getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (deal) {
      res.json(deal);
    } else {
      res.status(404).json({ message: 'Deal not found' });
    }
  } catch (error) {
    console.error('Get deal by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new deal
// @route   POST /api/deals
// @access  Private/Admin
const createDeal = async (req, res) => {
  try {
    const {
      title,
      description,
      discountType,
      discountValue,
      originalPrice,
      dealPrice,
      category,
      featuredImage,
      status,
      flashDeal,
      clearance,
      seasonalDeal,
      startDate,
      endDate,
      maxUsage,
      minOrderAmount,
      productIds,
      terms,
      brand,
      stock,
    } = req.body;

    const deal = new Deal({
      title,
      description,
      discountType,
      discountValue,
      originalPrice,
      dealPrice,
      category,
      featuredImage,
      status: status || 'active',
      flashDeal: flashDeal || false,
      clearance: clearance || false,
      seasonalDeal: seasonalDeal || false,
      startDate: startDate || Date.now(),
      endDate,
      maxUsage: maxUsage || 0,
      minOrderAmount: minOrderAmount || 0,
      productIds,
      terms,
      brand,
      stock: stock || 0,
      createdBy: req.user._id,
    });

    const createdDeal = await deal.save();
    res.status(201).json(createdDeal);
  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update deal
// @route   PUT /api/deals/:id
// @access  Private/Admin
const updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (deal) {
      Object.assign(deal, req.body);
      const updatedDeal = await deal.save();
      res.json(updatedDeal);
    } else {
      res.status(404).json({ message: 'Deal not found' });
    }
  } catch (error) {
    console.error('Update deal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete deal
// @route   DELETE /api/deals/:id
// @access  Private/Admin
const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (deal) {
      await deal.deleteOne();
      res.json({ message: 'Deal removed' });
    } else {
      res.status(404).json({ message: 'Deal not found' });
    }
  } catch (error) {
    console.error('Delete deal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle deal status
// @route   PUT /api/deals/:id/status
// @access  Private/Admin
const toggleDealStatus = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (deal) {
      const statusOrder = ['active', 'inactive', 'scheduled', 'expired'];
      const currentIndex = statusOrder.indexOf(deal.status);
      deal.status = statusOrder[(currentIndex + 1) % statusOrder.length];
      await deal.save();
      res.json({ status: deal.status });
    } else {
      res.status(404).json({ message: 'Deal not found' });
    }
  } catch (error) {
    console.error('Toggle deal status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get deal categories
// @route   GET /api/deals/categories
// @access  Public
const getDealCategories = async (req, res) => {
  try {
    const categories = await Deal.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get deal categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get flash deals
// @route   GET /api/deals/flash
// @access  Public
const getFlashDeals = async (req, res) => {
  try {
    const deals = await Deal.find({
      flashDeal: true,
      status: 'active',
      endDate: { $gte: new Date() },
    }).sort({ endDate: 1 }).limit(10);

    res.json(deals);
  } catch (error) {
    console.error('Get flash deals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  toggleDealStatus,
  getDealCategories,
  getFlashDeals,
};
