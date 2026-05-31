import connectDB from './mongodb';
import ActivityLog from '../models/ActivityLog';

/**
 * Log a user activity. Fire-and-forget — does not throw on failure.
 *
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {string} params.action - Action type (see ActivityLog schema enum)
 * @param {string} params.entityType - Entity type (Transaction, Budget, etc.)
 * @param {string} [params.entityId] - Related document ID
 * @param {string} params.description - Human-readable description
 * @param {Object} [params.metadata] - Extra data (stored as-is)
 * @param {number} [params.amount] - Monetary amount if relevant
 * @param {string} [params.currency] - Currency code if relevant
 * @param {string} [params.category] - Category name if relevant
 * @param {string} [params.ip] - Request IP
 */
export async function logActivity({
  userId,
  action,
  entityType,
  entityId = null,
  description,
  metadata = {},
  amount = null,
  currency = null,
  category = null,
  ip = null
}) {
  try {
    await connectDB();
    await ActivityLog.create({
      userId,
      action,
      entityType,
      entityId,
      description,
      metadata,
      amount,
      currency,
      category,
      ip
    });
  } catch (error) {
    // Never let logging failures break the main flow
    console.error('[ActivityLog] Failed to log activity:', error.message);
  }
}

/**
 * Convenience: log a transaction creation
 */
export async function logTransactionCreated(userId, transaction, currency) {
  const typeLabel = transaction.type === 'Income' ? 'income' : 'expense';
  return logActivity({
    userId,
    action: 'transaction_created',
    entityType: 'Transaction',
    entityId: transaction._id,
    description: `Added ${typeLabel}: ${transaction.description} — ${currency || ''} ${transaction.amount}`,
    amount: transaction.amount,
    currency,
    category: transaction.categoryId?.name || transaction.category || null,
    metadata: { type: transaction.type, merchant: transaction.merchant }
  });
}

/**
 * Convenience: log a transaction update
 */
export async function logTransactionUpdated(userId, transaction, changes) {
  return logActivity({
    userId,
    action: 'transaction_updated',
    entityType: 'Transaction',
    entityId: transaction._id,
    description: `Updated transaction: ${transaction.description}`,
    amount: transaction.amount,
    metadata: { changes }
  });
}

/**
 * Convenience: log a transaction deletion
 */
export async function logTransactionDeleted(userId, transaction) {
  return logActivity({
    userId,
    action: 'transaction_deleted',
    entityType: 'Transaction',
    entityId: transaction._id,
    description: `Deleted ${transaction.type?.toLowerCase() || 'transaction'}: ${transaction.description}`,
    amount: transaction.amount
  });
}

/**
 * Convenience: log budget creation/update
 */
export async function logBudgetSaved(userId, budget, isNew = false) {
  return logActivity({
    userId,
    action: isNew ? 'budget_created' : 'budget_updated',
    entityType: 'Budget',
    entityId: budget._id,
    description: isNew
      ? `Created budget for ${budget.budgetMonth}/${budget.budgetYear} — income ${budget.currency} ${budget.monthlyIncome}`
      : `Updated budget for ${budget.budgetMonth}/${budget.budgetYear}`,
    amount: budget.monthlyIncome,
    currency: budget.currency,
    metadata: {
      spendingLimit: budget.spendingLimit,
      savingGoal: budget.savingGoal,
      month: budget.budgetMonth,
      year: budget.budgetYear
    }
  });
}

/**
 * Convenience: log category changes
 */
export async function logCategoryChange(userId, category, action = 'category_created') {
  return logActivity({
    userId,
    action,
    entityType: 'Category',
    entityId: category._id,
    description: `${action === 'category_created' ? 'Created' : action === 'category_deleted' ? 'Removed' : 'Updated'} category: ${category.name} (${category.type})`,
    category: category.name,
    metadata: { type: category.type, color: category.color }
  });
}

/**
 * Convenience: log OCR upload
 */
export async function logOcrUpload(userId, scan) {
  return logActivity({
    userId,
    action: 'ocr_uploaded',
    entityType: 'OCRScan',
    entityId: scan._id,
    description: `Uploaded receipt: ${scan.originalFile?.originalName || 'receipt'}`,
    metadata: { filename: scan.originalFile?.originalName, size: scan.originalFile?.size }
  });
}

/**
 * Convenience: log expense created from OCR
 */
export async function logOcrExpenseCreated(userId, transaction, scan) {
  return logActivity({
    userId,
    action: 'ocr_expense_created',
    entityType: 'Transaction',
    entityId: transaction._id,
    description: `Created expense from receipt scan: ${transaction.description} — ${transaction.amount}`,
    amount: transaction.amount,
    metadata: { scanId: scan._id, merchant: transaction.merchant }
  });
}
