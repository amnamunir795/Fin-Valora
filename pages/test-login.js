import { useState } from 'react';

export default function TestLogin() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const createTestUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/create-test-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        }),
      });
      const data = await response.json();
      setResult({ loginTest: data, status: response.status });
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/test-auth', {
        credentials: 'include' // Include cookies
      });
      const data = await response.json();
      setResult({ authTest: data, status: response.status });
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testMe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // Include cookies
      });
      const data = await response.json();
      setResult({ meTest: data, status: response.status });
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const listBudgets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/list-budgets', {
        credentials: 'include' // Include cookies
      });
      const data = await response.json();
      setResult({ budgetsList: data, status: response.status });
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testCurrentBudget = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/budget/current', {
        credentials: 'include' // Include cookies
      });
      const data = await response.json();
      setResult({ currentBudgetTest: data, status: response.status });
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const checkUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/test-login');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Login Debug Test</h1>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={createTestUser}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Create Test User'}
          </button>
          
          <button
            onClick={checkUsers}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-2"
          >
            {loading ? 'Loading...' : 'Check Users'}
          </button>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 ml-2"
          >
            {loading ? 'Loading...' : 'Test Login'}
          </button>
          
          <button
            onClick={testAuth}
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50 ml-2"
          >
            {loading ? 'Loading...' : 'Test Auth'}
          </button>
          
          <button
            onClick={testMe}
            disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 ml-2"
          >
            {loading ? 'Loading...' : 'Test /api/auth/me'}
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <button
            onClick={listBudgets}
            disabled={loading}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'List All Budgets'}
          </button>
          
          <button
            onClick={testCurrentBudget}
            disabled={loading}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50 ml-2"
          >
            {loading ? 'Loading...' : 'Test Current Budget'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-2">Result:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-100 rounded">
          <h3 className="font-bold">Test Instructions:</h3>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Click "Create Test User" to create a test user</li>
            <li>Click "Check Users" to see all users in database</li>
            <li>Click "Test Login" to test login with test@example.com / password123</li>
            <li>Click "Test Auth" to test authentication middleware</li>
            <li>Click "Test /api/auth/me" to test the me endpoint</li>
            <li>Click "List All Budgets" to see all budgets for the user</li>
            <li>Click "Test Current Budget" to test the current budget endpoint</li>
            <li>Then try the regular login page with these credentials</li>
          </ol>
        </div>
      </div>
    </div>
  );
}