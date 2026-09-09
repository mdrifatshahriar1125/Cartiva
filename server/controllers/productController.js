import Product from '../models/Product.js';

// @desc    Fetch all products with optional filtering/searching/sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, keyword, sort, featured, limit } = req.query;
    
    let query = {};
    
    // Search by keyword
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Filter by Category Slug (Need to populate or lookup, but simpler to do two steps or match name)
    // Actually our Category schema has slug. We'd ideally find category by slug first.
    if (category) {
      // For now, we will handle category filtering by assuming we get the objectId or we do a lookup.
      // But let's keep it simple: if the frontend sends the category slug, we'll need the Category model
      // This will be improved in Phase 5.
    }

    let mongooseQuery = Product.find(query).populate('category', 'name slug');
    
    // Limit
    if (limit) {
      mongooseQuery = mongooseQuery.limit(Number(limit));
    }

    const products = await mongooseQuery;
    res.json({ products, count: products.length });
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

export { getProducts, getProductById };
