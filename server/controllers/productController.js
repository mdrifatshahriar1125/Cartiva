import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Fetch all products with filtering/searching/sorting/pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { 
      category, 
      keyword, 
      sort, 
      featured, 
      minPrice, 
      maxPrice, 
      rating, 
      brand,
      page = 1,
      limit = 12
    } = req.query;
    
    let query = {};
    
    // Search by keyword
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Filter by category slug
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        // If category not found, return empty array
        return res.json({ products: [], page: 1, pages: 0, count: 0 });
      }
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by rating
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Filter by brand
    if (brand) {
      query.brand = brand;
    }

    // Build the query
    let mongooseQuery = Product.find(query).populate('category', 'name slug');
    
    // Sorting
    if (sort === 'price_asc') {
      mongooseQuery = mongooseQuery.sort({ price: 1 });
    } else if (sort === 'price_desc') {
      mongooseQuery = mongooseQuery.sort({ price: -1 });
    } else if (sort === 'rating') {
      mongooseQuery = mongooseQuery.sort({ rating: -1 });
    } else {
      mongooseQuery = mongooseQuery.sort({ createdAt: -1 }); // Newest default
    }
    
    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const count = await Product.countDocuments(query);
    mongooseQuery = mongooseQuery.skip(skip).limit(limitNum);

    const products = await mongooseQuery;
    
    res.json({ 
      products, 
      page: pageNum, 
      pages: Math.ceil(count / limitNum),
      count 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getProducts, getProductById, createProductReview };
