import connectDB from './mongodb';
import Category from '../models/Category';

// Default categories for new users
const DEFAULT_CATEGORIES = [
  // Expense Categories
  { name: 'Food & Dining', type: 'Expense', color: '#FF6B6B', icon: '🍽️' },
  { name: 'Transportation', type: 'Expense', color: '#4ECDC4', icon: '🚗' },
  { name: 'Shopping', type: 'Expense', color: '#45B7D1', icon: '🛍️' },
  { name: 'Entertainment', type: 'Expense', color: '#96CEB4', icon: '🎬' },
  { name: 'Bills & Utilities', type: 'Expense', color: '#FFEAA7', icon: '💡' },
  { name: 'Healthcare', type: 'Expense', color: '#DDA0DD', icon: '🏥' },
  { name: 'Education', type: 'Expense', color: '#98D8C8', icon: '📚' },
  { name: 'Travel', type: 'Expense', color: '#F7DC6F', icon: '✈️' },
  { name: 'Insurance', type: 'Expense', color: '#BB8FCE', icon: '🛡️' },
  { name: 'Personal Care', type: 'Expense', color: '#85C1E9', icon: '💄' },
  
  // Income Categories
  { name: 'Salary', type: 'Income', color: '#58D68D', icon: '💰' },
  { name: 'Freelance', type: 'Income', color: '#F8C471', icon: '💼' },
  { name: 'Investment', type: 'Income', color: '#85C1E9', icon: '📈' },
  { name: 'Business', type: 'Income', color: '#D7BDE2', icon: '🏢' },
  { name: 'Rental', type: 'Income', color: '#A9DFBF', icon: '🏠' },
  { name: 'Other Income', type: 'Income', color: '#F9E79F', icon: '💵' }
];

/**
 * Create default categories for a new user
 * @param {string} userId - The user's ID
 */
export async function createDefaultCategories(userId) {
  try {
    await connectDB();

    // Check if user already has categories
    const existingCategories = await Category.find({ userId, isActive: true });
    
    if (existingCategories.length > 0) {
      console.log(`User ${userId} already has categories`);
      return existingCategories;
    }

    // Create default categories
    const categories = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      userId,
      isDefault: true
    }));

    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} default categories for user ${userId}`);
    
    return createdCategories;
  } catch (error) {
    console.error('Error creating default categories:', error);
    throw error;
  }
}

/**
 * Get category suggestions based on merchant name or description
 * @param {string} text - Merchant name or transaction description
 * @param {string} userId - User ID to get their categories
 */
export async function suggestCategory(text, userId) {
  try {
    await connectDB();

    const userCategories = await Category.findUserCategories(userId);
    
    // Simple keyword matching for category suggestions
    const keywords = {
      'Food & Dining': ['restaurant', 'cafe', 'food', 'dining', 'pizza', 'burger', 'coffee', 'starbucks', 'mcdonalds'],
      'Transportation': ['gas', 'fuel', 'uber', 'lyft', 'taxi', 'bus', 'train', 'parking', 'metro'],
      'Shopping': ['store', 'mall', 'amazon', 'walmart', 'target', 'shop', 'retail'],
      'Entertainment': ['movie', 'cinema', 'netflix', 'spotify', 'game', 'concert', 'theater'],
      'Bills & Utilities': ['electric', 'water', 'internet', 'phone', 'cable', 'utility', 'bill'],
      'Healthcare': ['hospital', 'doctor', 'pharmacy', 'medical', 'clinic', 'dentist'],
      'Education': ['school', 'university', 'course', 'book', 'tuition', 'education'],
      'Travel': ['hotel', 'flight', 'airline', 'booking', 'travel', 'vacation'],
      'Insurance': ['insurance', 'premium', 'policy'],
      'Personal Care': ['salon', 'spa', 'beauty', 'cosmetic', 'haircut']
    };

    const lowerText = text.toLowerCase();
    
    for (const [categoryName, categoryKeywords] of Object.entries(keywords)) {
      for (const keyword of categoryKeywords) {
        if (lowerText.includes(keyword)) {
          const matchedCategory = userCategories.find(cat => cat.name === categoryName);
          if (matchedCategory) {
            return matchedCategory;
          }
        }
      }
    }

    // Default to first expense category if no match found
    return userCategories.find(cat => cat.type === 'Expense') || null;
  } catch (error) {
    console.error('Error suggesting category:', error);
    return null;
  }
}

/**
 * Initialize database with sample data for testing
 */
export async function initializeSampleData() {
  try {
    await connectDB();
    console.log('Database initialized with sample data structure');
  } catch (error) {
    console.error('Error initializing sample data:', error);
    throw error;
  }
}