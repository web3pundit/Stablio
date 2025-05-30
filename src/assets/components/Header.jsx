import { Link, NavLink } from 'react-router-dom';
import { useSession } from '../../contexts/useSession';
import { supabase } from '../../contexts/lib/SupabaseClient';
import { useEffect, useState, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from './logo.svg';

// ... all imports remain unchanged

export default function Header() {
  const { session } = useSession();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => setLoading(false), [session]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    const handleEsc = (e) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    const handleEsc = (e) => e.key === 'Escape' && setDropdownOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const linkClasses = ({ isActive }) =>
    isActive
      ? 'text-blue-600 font-semibold block px-4 py-2'
      : 'text-gray-600 hover:text-blue-500 block px-4 py-2';

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const navLinks = (
    <>
      <NavLink to="/resources" className={linkClasses} onClick={() => setDropdownOpen(false)}>Resources</NavLink>
      <NavLink to="/stablecoins" className={linkClasses} onClick={() => setDropdownOpen(false)}>Stablecoins</NavLink>
      <NavLink to="/experts" className={linkClasses} onClick={() => setDropdownOpen(false)}>Experts</NavLink>
      <NavLink to="/regulatory" className={linkClasses} onClick={() => setDropdownOpen(false)}>Regulatory Clarity</NavLink>
      <NavLink to="/jobs" className={linkClasses} onClick={() => setDropdownOpen(false)}>Jobs</NavLink>
      <NavLink to="/events" className={linkClasses} onClick={() => setDropdownOpen(false)}>Events</NavLink>
      <NavLink to="/submit" className={linkClasses} onClick={() => setDropdownOpen(false)}>Submit</NavLink>
      {session && <NavLink to="/bookmarks" className={linkClasses} onClick={() => setDropdownOpen(false)}>My Bookmarks</NavLink>}
    </>
  );

  return (
    <header className="relative bg-gray-100 shadow-md h-20 flex items-center" role="banner">
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 shrink-0" aria-label="Home">
          <img
            src={logo}
            alt="Stablio"
            className="h-[5rem] w-auto object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center px-4 py-2 bg-white text-gray-700 border rounded hover:bg-gray-100 focus:outline-none"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              aria-label="Open navigation menu"
              type="button"
            >
              Menu
              <ChevronDown className="ml-2 w-4 h-4" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-50 min-w-max py-2">
                {navLinks}
                <div className="border-t my-2" />
                {loading ? (
                  <span className="text-gray-400 block px-4 py-2">Loading...</span>
                ) : session ? (
                  <>
                    <span className="text-gray-600 block px-4 py-2 truncate">{session?.user?.email}</span>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded mx-4 mb-2 w-full"
                      aria-label="Logout"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/auth"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mx-4 mb-2 block text-center"
                    aria-label="Login or Signup"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Login / Signup
                  </NavLink>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div
        id="mobile-menu"
        ref={menuRef}
        className="absolute top-full left-1/2 transform -translate-x-1/2 md:hidden w-[90%] max-w-sm px-4 py-2 flex flex-col gap-1 text-sm bg-white shadow-lg z-50 max-h-[80vh] overflow-y-auto rounded"
        aria-hidden={!isOpen}
        >

          {navLinks}
          <div className="border-t my-2" />
          {loading ? (
            <span className="text-gray-400 block px-4 py-2">Loading...</span>
          ) : session ? (
            <>
              <span className="text-gray-600 block px-4 py-2 truncate">{session?.user?.email}</span>
              <button
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded mx-2 mb-2"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/auth"
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mx-2 mb-2 block text-center"
              onClick={toggleMenu}
              aria-label="Login or Signup"
            >
              Login / Signup
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}
