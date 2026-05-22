import { useEffect, useState } from 'react';
import { Link, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getCurrentUser, logout } from '../Redux/Features/authSlice';

function Layout() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (err) {
      // ignore; state clears even if backend logout fails
    }
    toast.success('Logged out successfully.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-lg font-semibold tracking-tight text-white">
            SmartEventX
          </Link>
          <nav className="flex items-center gap-3 text-sm text-slate-300">
            <NavLink to="/" className="hover:text-white">
              Events
            </NavLink>
            {token ? (
              <>
                <NavLink to="/bookmarks" className="hover:text-white">
                  Bookmarks
                </NavLink>
                <NavLink to="/events/new" className="hover:text-white">
                  Create Event
                </NavLink>
                <NavLink to="/manage" className="hover:text-white">
                  Manage Events
                </NavLink>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white transition hover:bg-brand-400"
                  aria-label="Open profile menu"
                >
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-white/15 px-4 py-2 text-white transition hover:border-brand-400 hover:text-brand-300"
                >
                  Logout
                </button>
                <div className="relative">
                  {profileOpen && (
                    <div className="absolute right-0 top-12 z-20 w-72 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-xl">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-lg font-semibold text-white">
                          {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
                          <p className="text-xs text-slate-400">{user?.email || 'No email available'}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/profile');
                        }}
                        className="mb-2 w-full rounded-full border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                      >
                        Change email
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/change-password');
                        }}
                        className="mb-3 w-full rounded-full border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                      >
                        Change password
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-full bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-400"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className="hover:text-white">
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-full bg-brand-500 px-4 py-2 font-medium text-white transition hover:bg-brand-400"
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
export default Layout;
