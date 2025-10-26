import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const MyName = "Amna";
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for success messages
    if (router.query.signup === "success") {
      setShowSuccess(true);
      setSuccessMessage('Account created successfully! Welcome to FinValora.');
      // Remove the query parameter from URL
      router.replace("/", undefined, { shallow: true });
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } else if (router.query.login === "success") {
      setShowSuccess(true);
      setSuccessMessage('Welcome back! You have successfully logged in.');
      // Remove the query parameter from URL
      router.replace("/", undefined, { shallow: true });
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }

    // Check for logged in user
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      {showSuccess && (
        <div className="max-w-md mx-auto mb-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Navigation Bar */}
        <nav className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-amber-950">FinValora</h1>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">
                    Welcome, {user.firstName}! ({user.currency})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-x-2">
                  <a
                    href="/login"
                    className="text-amber-600 hover:text-amber-700 font-medium px-3 py-2"
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition duration-200"
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="text-amber-950 p-6 bg-amber-300 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">
            Home {MyName + "red"}
          </h2>
          {user ? (
            <div className="mt-4 p-4 bg-white rounded-md">
              <h3 className="font-medium text-gray-800 mb-2">Your Profile:</h3>
              <p><strong>Name:</strong> {user.fullName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Currency:</strong> {user.currency}</p>
              <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="text-amber-900">
              Please login or create an account to access your financial dashboard.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
