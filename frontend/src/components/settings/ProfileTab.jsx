import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../api.js';

export default function ProfileTab() {
  const { user, updateUser } = useAuth();

  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleSaveProfile = async () => {
    setProfileLoading(true);
    setProfileMessage({ text: '', type: '' });
    try {
      const data = await api.updateProfile(userData.name, userData.email);
      updateUser(data.user);
      setProfileMessage({ text: 'Profile updated successfully', type: 'success' });
    } catch (error) {
      setProfileMessage({ text: error.message, type: 'error' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordLoading(true);
    setPasswordMessage({ text: '', type: '' });
    try {
      await api.updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword,
      );
      setPasswordMessage({ text: 'Password updated successfully', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordMessage({ text: error.message, type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const inputClass = "w-full px-2 py-1.5 text-xs border border-brd-primary dark:border-brd-primary-dark rounded-md bg-secondary dark:bg-secondary-dark text-txt-primary dark:text-txt-primary-dark focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelClass = "block text-xs font-medium text-icon dark:text-icon-dark mb-1";

  return (
    <div className="space-y-6 text-left">
      {/* Profile Section */}
      <div>
        <h3 className="text-lg font-semibold text-txt-primary dark:text-txt-primary-dark mb-3 pb-2 border-b border-brd-primary dark:border-brd-primary-dark">
          Profile
        </h3>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className={inputClass}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className={inputClass}
              placeholder="Enter your email"
            />
          </div>
          {profileMessage.text && (
            <div className={`px-3 py-2 rounded-md text-xs ${
              profileMessage.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
              {profileMessage.text}
            </div>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={profileLoading}
            className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md cursor-pointer transition-colors"
          >
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Password Change Section */}
      <div>
        <h3 className="text-lg font-semibold text-txt-primary dark:text-txt-primary-dark mb-3 pb-2 border-b border-brd-primary dark:border-brd-primary-dark">
          Change Password
        </h3>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className={`${inputClass} pr-8`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-icon dark:text-icon-dark hover:text-txt-primary dark:hover:text-txt-primary-dark transition-colors"
              >
                {showPasswords.current ? <FaEyeSlash className="w-3 h-3" /> : <FaEye className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className={`${inputClass} pr-8`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-icon dark:text-icon-dark hover:text-txt-primary dark:hover:text-txt-primary-dark transition-colors"
              >
                {showPasswords.new ? <FaEyeSlash className="w-3 h-3" /> : <FaEye className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className={`${inputClass} pr-8`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-icon dark:text-icon-dark hover:text-txt-primary dark:hover:text-txt-primary-dark transition-colors"
              >
                {showPasswords.confirm ? <FaEyeSlash className="w-3 h-3" /> : <FaEye className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {passwordMessage.text && (
            <div className={`px-3 py-2 rounded-md text-xs ${
              passwordMessage.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
              {passwordMessage.text}
            </div>
          )}

          <button
            onClick={handleChangePassword}
            disabled={passwordLoading}
            className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md cursor-pointer transition-colors"
          >
            {passwordLoading ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
