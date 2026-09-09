import Product from '../models/Product.js';

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      originalPrice: req.body.originalPrice || req.body.price,
      description: req.body.description,
      images: req.body.images || ['https://via.placeholder.com/400'],
      brand: req.body.brand,
      category: req.body.category,
      stock: req.body.stock || 0,
      featured: req.body.featured || false,
      specifications: req.body.specifications || [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.price = req.body.price ?? product.price;
      product.originalPrice = req.body.originalPrice ?? product.originalPrice;
      product.description = req.body.description || product.description;
      product.images = req.body.images || product.images;
      product.brand = req.body.brand || product.brand;
      product.category = req.body.category || product.category;
      product.stock = req.body.stock ?? product.stock;
      product.featured = req.body.featured ?? product.featured;
      product.specifications = req.body.specifications || product.specifications;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createProduct, updateProduct, deleteProduct };
