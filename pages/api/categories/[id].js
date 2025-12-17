import connectDB from '../../../lib/mongodb';
import Category from '../../../models/Category';
import { verifyToken } from '../../../middleware/auth';

export default async function handler(req, res) {
  await connectDB();

  // Verify authentication
  const authResult = await verifyToken(req);
  if (!authResult.success) {
    return res.status(401).json({ success: false, message: authResult.message });
  }

  const userId = authResult.user.id;
  const { id } = req.query;

  // Validate category ID
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category ID'
    });
  }

  switch (req.method) {
    case 'GET':
      try {
        const category = await Category.findOne({
          _id: id,
          userId,
          isActive: true
        });

        if (!category) {
          return res.status(404).json({
            success: false,
            message: 'Category not found'
          });
        }

        res.status(200).json({
          success: true,
          category: category.getSummary()
        });
      } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch category'
        });
      }
      break;

    case 'PUT':
      try {
        const { name, type, color, icon, description } = req.body;

        const category = await Category.findOne({
          _id: id,
          userId,
          isActive: true
        });

        if (!category) {
          return res.status(404).json({
            success: false,
            message: 'Category not found'
          });
        }

        // Check if new name conflicts with existing category
        if (name && name.trim() !== category.name) {
          const existingCategory = await Category.findOne({
            userId,
            name: name.trim(),
            _id: { $ne: id },
            isActive: true
          });

          if (existingCategory) {
            return res.status(400).json({
              success: false,
              message: 'Category with this name already exists'
            });
          }
        }

        // Update fields
        if (name) category.name = name.trim();
        if (type && ['Income', 'Expense'].includes(type)) category.type = type;
        if (color) category.color = color;
        if (icon !== undefined) category.icon = icon;
        if (description !== undefined) category.description = description;

        await category.save();

        res.status(200).json({
          success: true,
          message: 'Category updated successfully',
          category: category.getSummary()
        });
      } catch (error) {
        console.error('Error updating category:', error);
        
        if (error.code === 11000) {
          return res.status(400).json({
            success: false,
            message: 'Category with this name already exists'
          });
        }

        res.status(500).json({
          success: false,
          message: 'Failed to update category'
        });
      }
      break;

    case 'DELETE':
      try {
        const category = await Category.findOne({
          _id: id,
          userId,
          isActive: true
        });

        if (!category) {
          return res.status(404).json({
            success: false,
            message: 'Category not found'
          });
        }

        // Soft delete - mark as inactive
        category.isActive = false;
        await category.save();

        res.status(200).json({
          success: true,
          message: 'Category deleted successfully'
        });
      } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to delete category'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      });
  }
}