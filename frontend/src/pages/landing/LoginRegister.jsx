import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginRegister() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isRegister) {
        result = await register(name, username, email, password);
      } else {
        result = await login(email, password);
      }

      if (result?.success) {
        navigate('/dashboard');
      } else {
        setError(result?.error || 'Authentication failed');
      }
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-primary dark:bg-secondary-dark rounded-lg shadow-2xl shadow-secondary-dark dark:shadow-icon-dark">
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => setIsRegister(false)}
          className={`w-full flex justify-center py-2 px-4 border-transparent rounded-md shadow-sm text-sm font-medium text-txt-primary dark:text-txt-primary-dark ${
            !isRegister ? 'bg-blue-600 text-white' : 'bg-secondary dark:bg-primary-dark'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setIsRegister(true)}
          className={`w-full flex justify-center py-2 px-4 border-transparent rounded-md shadow-sm text-sm font-medium text-txt-primary dark:text-txt-primary-dark ${
            isRegister ? 'bg-blue-600 text-white' : 'bg-secondary dark:bg-primary-dark'
          }`}
        >
          Register
        </button>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {isRegister && (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-icon dark:text-icon-dark">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-brd-primary dark:border-brd-primary-dark rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-txt-primary dark:text-txt-primary-dark"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-icon dark:text-icon-dark">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-brd-primary dark:border-brd-primary-dark rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-txt-primary dark:text-txt-primary-dark"
              />
            </div>
          </>
        )}

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
            placeholder="admin@example.com"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (isRegister ? 'Registering...' : 'Signing in...') : isRegister ? 'Register' : 'Sign in'}
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
