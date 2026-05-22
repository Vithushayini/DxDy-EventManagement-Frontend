import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { changePassword, logout } from '../Redux/Features/authSlice';

function ChangePasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    if (!currentPassword.trim()) {
      setErrors({ currentPassword: 'Current password is required.' });
      return;
    }

    if (!newPassword.trim()) {
      setErrors({ newPassword: 'New password is required.' });
      return;
    }

    if (newPassword.length < 8) {
      setErrors({ newPassword: 'New password must be at least 8 characters.' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrors({ confirmNewPassword: 'Passwords do not match.' });
      return;
    }

    try {
      await dispatch(
        changePassword({ currentPassword, newPassword })
      ).unwrap();

      toast.success('Password changed successfully. Please log in again.');
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (err) {
      toast.error(err || 'Failed to update password. Please try again.');
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Change Password</h1>
        <p className="mt-2 text-sm text-slate-400">
          Update your password and sign in again with your new credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300 mb-2">
            Current password
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              disabled={loading}
              className={`w-full rounded-2xl border px-4 py-3 text-slate-100 bg-slate-950/80 outline-none transition focus:border-brand-400 ${
                errors.currentPassword ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none"
            >
              <span className="text-xl">{showCurrentPassword ? '👁️' : '🙈'}</span>
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-2 text-sm text-red-400">{errors.currentPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-2">
            New password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              disabled={loading}
              className={`w-full rounded-2xl border px-4 py-3 text-slate-100 bg-slate-950/80 outline-none transition focus:border-brand-400 ${
                errors.newPassword ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none"
            >
              <span className="text-xl">{showNewPassword ? '👁️' : '🙈'}</span>
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-2 text-sm text-red-400">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-slate-300 mb-2">
            Confirm new password
          </label>
          <div className="relative">
            <input
              id="confirmNewPassword"
              type={showConfirmNewPassword ? 'text' : 'password'}
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              disabled={loading}
              className={`w-full rounded-2xl border px-4 py-3 text-slate-100 bg-slate-950/80 outline-none transition focus:border-brand-400 ${
                errors.confirmNewPassword ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="Re-enter new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmNewPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none"
            >
              <span className="text-xl">{showConfirmNewPassword ? '👁️' : '🙈'}</span>
            </button>
          </div>
          {errors.confirmNewPassword && (
            <p className="mt-2 text-sm text-red-400">{errors.confirmNewPassword}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? 'Updating...' : 'Change password'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-brand-400 sm:w-auto"
          >
            Back to events
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePasswordPage;
