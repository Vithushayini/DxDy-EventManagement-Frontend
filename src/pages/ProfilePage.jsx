import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCurrentUser, updateProfile } from '../Redux/Features/authSlice';

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, user]);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    if (!form.name.trim()) {
      setErrors({ name: 'Name is required.' });
      return;
    }

    if (!form.email.trim()) {
      setErrors({ email: 'Email is required.' });
      return;
    }

    if (!validateEmail(form.email.trim())) {
      setErrors({ email: 'Please enter a valid email address.' });
      return;
    }

    if (form.name.trim() === user?.name && form.email.trim() === user?.email) {
      toast.info('No changes were made.');
      return;
    }

    try {
      await dispatch(
        updateProfile({ name: form.name.trim(), email: form.email.trim() })
      ).unwrap();
      toast.success('Profile updated successfully.');
    } catch (err) {
      toast.error(err || 'Failed to update profile. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-100">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Update Profile</h1>
        <p className="mt-2 text-sm text-slate-400">
          Change your display name and email address from this page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            className={`w-full rounded-2xl border px-4 py-3 text-slate-100 bg-slate-950/80 outline-none transition focus:border-brand-400 ${
              errors.name ? 'border-red-500' : 'border-white/10'
            }`}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            className={`w-full rounded-2xl border px-4 py-3 text-slate-100 bg-slate-950/80 outline-none transition focus:border-brand-400 ${
              errors.email ? 'border-red-500' : 'border-white/10'
            }`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? 'Saving...' : 'Save changes'}
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

export default ProfilePage;
