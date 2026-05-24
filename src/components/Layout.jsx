import { useEffect, useState, useRef } from 'react';
import { Link, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getCurrentUser, logout } from '../Redux/Features/authSlice';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

function Layout() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopProfileBtnRef = useRef(null);
  const mobileProfileBtnRef = useRef(null);
  const desktopProfileDropdownRef = useRef(null);
  const mobileProfileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (err) { }

    toast.success('Logged out successfully.');
    navigate('/');
  };

  useEffect(() => {
    function handleClickOutside(e) {
      const target = e.target;

      // Close profile popup when clicking outside (desktop or mobile)
      if (profileOpen) {
        const clickedInsideDropdown = (desktopProfileDropdownRef.current && desktopProfileDropdownRef.current.contains(target)) || (mobileProfileDropdownRef.current && mobileProfileDropdownRef.current.contains(target));
        const clickedDesktopBtn = desktopProfileBtnRef.current && desktopProfileBtnRef.current.contains(target);
        const clickedMobileBtn = mobileProfileBtnRef.current && mobileProfileBtnRef.current.contains(target);

        if (!clickedInsideDropdown && !clickedDesktopBtn && !clickedMobileBtn) {
          setProfileOpen(false);
        }
      }

      // Close mobile nav when clicking outside the mobile menu and not the menu button
      if (mobileOpen) {
        const clickedInsideMobile = mobileMenuRef.current && mobileMenuRef.current.contains(target);
        const clickedMobileMenuBtn = mobileMenuBtnRef.current && mobileMenuBtnRef.current.contains(target);

        if (!clickedInsideMobile && !clickedMobileMenuBtn) {
          setMobileOpen(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [profileOpen, mobileOpen]);

  const navItems = (
    <>
      <NavLink to="/"
        // className="hover:text-white"
        className={({ isActive }) =>
          isActive
            ? "text-brand-400 font-semibold"
            : "hover:text-white text-slate-300"
        }
        onClick={() => {
          setMobileOpen(false);
          setProfileOpen(false);
        }}
      >
        Events
      </NavLink>

      {token ? (
        <>
          <NavLink to="/bookmarks" className={({ isActive }) =>
            isActive
              ? "text-brand-400 font-semibold"
              : "hover:text-white text-slate-300"
          }
            onClick={() => {
              setMobileOpen(false);
              setProfileOpen(false);
            }}
          >
            Bookmarks
          </NavLink>
          <NavLink to="/events/new" className={({ isActive }) =>
            isActive
              ? "text-brand-400 font-semibold"
              : "hover:text-white text-slate-300"
          }
            onClick={() => {
              setMobileOpen(false);
              setProfileOpen(false);
            }}
          >
            Create Event
          </NavLink>
          <NavLink to="/manage" className={({ isActive }) =>
            isActive
              ? "text-brand-400 font-semibold"
              : "hover:text-white text-slate-300"
          }
            onClick={() => {
              setMobileOpen(false);
              setProfileOpen(false);
            }}
          >
            Manage Events
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/login" className={({ isActive }) =>
            isActive
              ? "text-brand-400 font-semibold"
              : "hover:text-white text-slate-300"
          }
            onClick={() => {
              setMobileOpen(false);
              setProfileOpen(false);
            }}
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="rounded-full bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-400"
            onClick={() => {
              setMobileOpen(false);
              setProfileOpen(false);
            }}
          >
            Register
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          {/* Logo */}
          {/* <Link to="/" className="text-lg font-semibold text-white">
            SmartEventX
          </Link> */}
          <Link
            to="/"
            className="text-xl font-extrabold tracking-wide text-transparent bg-gradient-to-r from-brand-400 via-cyan-400 to-brand-500 bg-clip-text drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          >
            SmartEventX
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-4 text-sm text-slate-300 md:flex">
            {navItems}

            {token && (
              <>
                {/* Profile button */}
                {/* <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white"
                >
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                </button> */}
                <div className="relative">
                  <button
                    ref={desktopProfileBtnRef}
                    onClick={() => setProfileOpen((p) => !p)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white"
                  >
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                  </button>

                  {profileOpen && token && (
                    <div ref={desktopProfileDropdownRef} className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-xl">

                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-white">
                          {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{user?.name}</p>
                          <p className="text-xs text-slate-400">{user?.email}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/profile');
                        }}
                        className="mb-2 w-full rounded-xl bg-white/5 px-3 py-2 text-left text-sm hover:bg-white/10"
                      >
                        Change email
                      </button>

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/change-password');
                        }}
                        className="w-full rounded-xl bg-white/5 px-3 py-2 text-left text-sm hover:bg-white/10"
                      >
                        Change password
                      </button>
                    </div>
                  )}
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-white/15 px-4 py-2 text-white hover:border-brand-400"
                >
                  Logout
                </button>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {token && (
              <button
                ref={mobileProfileBtnRef}
                onClick={() => setProfileOpen((p) => !p)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white md:hidden"
              >
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              ref={mobileMenuBtnRef}
              className="text-2xl text-white md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div ref={mobileMenuRef} className="border-t border-white/10 bg-slate-950 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-4 text-slate-300">
              {navItems}

              {token && (
                <>
                  {/* <button
                    onClick={() => {
                      setProfileOpen(true);
                      setMobileOpen(false);
                      navigate('/profile');
                    }}
                    className="text-left hover:text-white"
                  >
                    Profile
                  </button> */}

                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="text-left text-red-400"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}

        {/* Profile dropdown (desktop only) */}
        {profileOpen && token && (
          <div ref={mobileProfileDropdownRef} className="absolute right-4 top-16 z-20 w-72 rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-xl md:hidden">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-white">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setProfileOpen(false);
                navigate('/profile');
              }}
              className="mb-2 w-full rounded-xl bg-white/5 px-3 py-2 text-left text-sm hover:bg-white/10"
            >
              Change email
            </button>

            <button
              onClick={() => {
                setProfileOpen(false);
                navigate('/change-password');
              }}
              className="w-full rounded-xl bg-white/5 px-3 py-2 text-left text-sm hover:bg-white/10"
            >
              Change password
            </button>
          </div>
        )}
      </header>

      <main className="mx-auto flex-1 max-w-7xl px-4 py-8 pt-20 lg:pt-28 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 bg-slate-950 z-50 bottom-0 right-0 left-0 w-full text-slate-400 md:fixed">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* Brand */}
            <div className="gap-2 hidden md:flex">
              <h2 className="text-lg font-bold text-transparent bg-gradient-to-r from-brand-400 via-cyan-400 to-brand-500 bg-clip-text">
                SmartEventX
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Modern event planning made simple.
              </p>
            </div>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} SmartEventX. All rights reserved.
            </p>
            <p className="text-xs text-slate-500 hidden md:inline">
              Built with React + Node + MongoDB 🚀
            </p>

          </div>



        </div>
      </footer>
    </div>
  );
}

export default Layout;