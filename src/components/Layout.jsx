import { useEffect } from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { loadCurrentUser, logout } from '../store/slices/authSlice.js';
import { getCurrentUser,logout } from '../Redux/Features/authSlice'

function Layout() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
console.log('tokennnnnnnnnnnnnnnnnnnnnnnnnnn', user);

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

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
                  // onClick={() => dispatch(logout())}
                  className="rounded-full border border-white/15 px-4 py-2 text-white transition hover:border-brand-400 hover:text-brand-300"
                >
                  {user?.name || 'Logout'}
                </button>
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
