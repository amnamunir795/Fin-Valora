// Helper functions for budget-related authentication flows

export const checkUserBudgetStatus = async () => {
  try {
    const budgetResponse = await fetch('/api/budget/current');
    return budgetResponse.ok;
  } catch (error) {
    console.error('Error checking budget status:', error);
    return false;
  }
};

export const redirectBasedOnBudgetStatus = async (router) => {
  const hasBudget = await checkUserBudgetStatus();
  
  if (hasBudget) {
    router.push('/dashboard');
  } else {
    router.push('/budget-setup');
  }
};