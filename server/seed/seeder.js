import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Wishlist from '../models/Wishlist.js';
import Review from '../models/Review.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cartiva');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const users = [
  {
    name: 'Admin User',
    email: 'admin@shopsphere.local',
    password: 'password123',
    role: 'admin',
    phone: '1234567890',
  },
  {
    name: 'Customer Demo',
    email: 'customer@shopsphere.local',
    password: 'password123',
    role: 'customer',
    phone: '0987654321',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'customer',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'customer',
  },
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    role: 'customer',
  },
  {
    name: 'Bob Brown',
    email: 'bob@example.com',
    password: 'password123',
    role: 'customer',
  }
];

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Latest electronic gadgets and devices', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Fashion', slug: 'fashion', description: 'Trendy clothing and apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Home & Living', slug: 'home-and-living', description: 'Furniture and home accessories', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Accessories', slug: 'accessories', description: 'Bags, wallets, and more', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Beauty', slug: 'beauty', description: 'Cosmetics and personal care', image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Sports', slug: 'sports', description: 'Sports equipment and gear', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

const generateProducts = (categoryId, categoryName) => {
  const products = [];
  if (categoryName === 'Electronics') {
    products.push(
      { name: 'Wireless Headphones', brand: 'Sony', price: 299.99, stock: 50, featured: true, rating: 4.5, numReviews: 12 },
      { name: 'Mechanical Keyboard', brand: 'Logitech', price: 129.99, originalPrice: 149.99, stock: 30, featured: false, rating: 4.8, numReviews: 8 },
      { name: 'Wireless Mouse', brand: 'Razer', price: 79.99, stock: 100, featured: false, rating: 4.2, numReviews: 24 },
      { name: 'Smart Watch', brand: 'Apple', price: 399.99, stock: 20, featured: true, rating: 4.9, numReviews: 50 },
      { name: 'Bluetooth Speaker', brand: 'JBL', price: 119.99, originalPrice: 139.99, stock: 45, featured: false, rating: 4.4, numReviews: 16 }
    );
  } else if (categoryName === 'Fashion') {
    products.push(
      { name: 'Casual Shirt', brand: 'Zara', price: 49.99, stock: 200, featured: false, rating: 4.0, numReviews: 5 },
      { name: 'Denim Jacket', brand: 'Levi\'s', price: 89.99, originalPrice: 110.00, stock: 80, featured: true, rating: 4.7, numReviews: 32 },
      { name: 'Sneakers', brand: 'Nike', price: 129.99, stock: 150, featured: true, rating: 4.6, numReviews: 45 },
      { name: 'Hoodie', brand: 'H&M', price: 39.99, stock: 300, featured: false, rating: 4.3, numReviews: 18 }
    );
  } else if (categoryName === 'Home & Living') {
    products.push(
      { name: 'Desk Lamp', brand: 'Philips', price: 24.99, stock: 60, featured: false, rating: 4.1, numReviews: 7 },
      { name: 'Coffee Maker', brand: 'Keurig', price: 149.99, stock: 25, featured: true, rating: 4.5, numReviews: 22 },
      { name: 'Table Organizer', brand: 'IKEA', price: 19.99, stock: 120, featured: false, rating: 4.2, numReviews: 11 }
    );
  } else if (categoryName === 'Accessories') {
    products.push(
      { name: 'Leather Wallet', brand: 'Tommy Hilfiger', price: 59.99, originalPrice: 75.00, stock: 40, featured: true, rating: 4.6, numReviews: 15 },
      { name: 'Backpack', brand: 'Herschel', price: 89.99, stock: 75, featured: false, rating: 4.7, numReviews: 28 },
      { name: 'Sunglasses', brand: 'Ray-Ban', price: 159.99, stock: 30, featured: true, rating: 4.8, numReviews: 40 }
    );
  } else if (categoryName === 'Beauty') {
    products.push(
      { name: 'Face Wash', brand: 'Neutrogena', price: 12.99, stock: 150, featured: false, rating: 4.3, numReviews: 55 },
      { name: 'Moisturizer', brand: 'CeraVe', price: 18.99, stock: 100, featured: true, rating: 4.9, numReviews: 120 },
      { name: 'Hair Dryer', brand: 'Dyson', price: 399.99, originalPrice: 429.99, stock: 15, featured: true, rating: 4.8, numReviews: 35 }
    );
  } else if (categoryName === 'Sports') {
    products.push(
      { name: 'Running Shoes', brand: 'Adidas', price: 119.99, stock: 85, featured: true, rating: 4.5, numReviews: 60 },
      { name: 'Yoga Mat', brand: 'Lululemon', price: 68.00, stock: 50, featured: false, rating: 4.7, numReviews: 42 },
      { name: 'Football', brand: 'Nike', price: 29.99, stock: 120, featured: false, rating: 4.4, numReviews: 25 }
    );
  }
  
  return products.map(p => ({
    ...p,
    category: categoryId,
    slug: p.name.toLowerCase().replace(/ /g, '-'),
    description: `High quality ${p.name} from ${p.brand}. Perfect for your everyday needs.`,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    specifications: [
      { key: 'Brand', value: p.brand },
      { key: 'Quality', value: 'Premium' }
    ]
  }));
};

const importData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await Wishlist.deleteMany();
    await Review.deleteMany();

    const createdUsers = await User.insertMany(users);
    const createdCategories = await Category.insertMany(categories);

    let allProducts = [];
    createdCategories.forEach(category => {
      const categoryProducts = generateProducts(category._id, category.name);
      allProducts = [...allProducts, ...categoryProducts];
    });

    await Product.insertMany(allProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await Wishlist.deleteMany();
    await Review.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
