import connectDB from '../../../lib/mongodb';
import Category from '../../../models/Category';
import { verifyRequestAuth } from '../../../middleware/auth';

export default async function handler(req, res) {
  await connectDB();

  // Verify authentication
  const authResult = await verifyRequestAuth(req);
  if (!authResult.success) {
    return res.status(401).json({ success: false, message: authResult.message });
  }

  const userId = authResult.user.id;

  switch (req.method) {
    case 'GET':
      try {
        const { type } = req.query;
        
        let categories;
        if (type && ['Income', 'Expense'].includes(type)) {
          categories = await Category.findByType(userId, type);
        } else {
          categories = await Category.findUserCategories(userId);
        }

        res.status(200).json({
          success: true,
          categories: categories.map(cat => cat.getSummary())
        });
      } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch categories'
        });
      }
      break;

    case 'POST':
      try {
        const { name, type, color, icon, description } = req.body;

        // Validation
        if (!name || !type) {
          return res.status(400).json({
            success: false,
            message: 'Name and type are required'
          });
        }

        if (!['Income', 'Expense'].includes(type)) {
          return res.status(400).json({
            success: false,
            message: 'Type must be either Income or Expense'
          });
        }

        // Check if category already exists for this user
        const existingCategory = await Category.findOne({
          userId,
          name: name.trim(),
          isActive: true
        });

        if (existingCategory) {
          return res.status(400).json({
            success: false,
            message: 'Category with this name already exists'
          });
        }

        // Create new category
        const category = new Category({
          userId,
          name: name.trim(),
          type,
          color: color || '#6B7280',
          icon: icon || null,
          description: description || ''
        });

        await category.save();

        res.status(201).json({
          success: true,
          message: 'Category created successfully',
          category: category.getSummary()
        });
      } catch (error) {
        console.error('Error creating category:', error);
        
        if (error.code === 11000) {
          return res.status(400).json({
            success: false,
            message: 'Category with this name already exists'
          });
        }

        res.status(500).json({
          success: false,
          message: 'Failed to create category'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      });
  }
}