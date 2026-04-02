import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginRegister() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const isLogin = mode === 'login';

  const handleSwitch = (next) => {
    setMode(next);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = isLogin
      ? await login(email, password)
      : await register(name, email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-brd-primary dark:border-brd-primary-dark rounded-md bg-primary dark:bg-primary-dark text-txt-primary dark:text-txt-primary-dark focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelClass = "block text-xs font-medium text-txt-primary dark:text-txt-primary-dark mb-1";

  return (
    <div className="w-full space-y-5 p-8 bg-secondary dark:bg-secondary-dark border border-brd-primary dark:border-brd-primary-dark rounded-lg">

      {/* Toggle */}
      <div className="flex rounded-md overflow-hidden border border-brd-primary dark:border-brd-primary-dark">
        <button
          type="button"
          onClick={() => handleSwitch('login')}
          className={`flex-1 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
            isLogin
              ? 'bg-primary dark:bg-primary-dark text-txt-primary dark:text-txt-primary-dark'
              : 'text-icon dark:text-icon-dark hover:text-txt-primary dark:hover:text-txt-primary-dark'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => handleSwitch('register')}
          className={`flex-1 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
            !isLogin
              ? 'bg-primary dark:bg-primary-dark text-txt-primary dark:text-txt-primary-dark'
              : 'text-icon dark:text-icon-dark hover:text-txt-primary dark:hover:text-txt-primary-dark'
          }`}
        >
          Register
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-txt-primary dark:text-txt-primary-dark">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="mt-1 text-sm text-icon dark:text-icon-dark">
          {isLogin ? 'Sign in to your account' : 'Get started with Study Planner'}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 rounded-md text-xs">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {!isLogin && (
            <div>
              <label htmlFor="name" className={labelClass}>Name</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
        >
          {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign in' : 'Create account')}
        </button>
      </form>

      {isLogin && (
        <div className="text-center text-xs text-icon dark:text-icon-dark space-y-0.5">
          <p>Demo credentials:</p>
          <p>Email: admin@example.com</p>
          <p>Password: dev123</p>
        </div>
      )}
    </div>
  );
}
