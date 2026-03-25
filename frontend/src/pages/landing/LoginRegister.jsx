import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
      <div className="max-w-md w-full space-y-8 p-8 bg-primary dark:bg-secondary-dark rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-txt-primary dark:text-txt-primary-dark">
            Study Planner
          </h2>
          <p className="mt-2 text-center text-sm text-txt-primary dark:text-txt-primary-dark">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-icon dark:text-icon-dark">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-brd-primary dark:border-brd-primary-dark rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-txt-primary dark:text-txt-primary-dark"
                placeholder ="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-icon dark:text-icon-dark">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-brd-primary dark:border-brd-primary-dark rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-txt-primary dark:text-txt-primary-dark"
                placeholder="dev123"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>Demo credentials:</p>
          <p>Email: admin@example.com</p>
          <p>Password: dev123</p>
        </div>
      </div>
  );
}

