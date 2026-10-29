import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import '../styles/components/header.css';
import { clearSession } from '../Shared/session';

const publicLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
];

const exploreLinks = [
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
];

const supplierLinks = [
  { to: '/orders', label: 'Orders' },
  { to: '/products', label: 'Products' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/promotions', label: 'Promotions' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/support', label: 'Support Tickets' },
];

const customerLinks = [
  { to: '/customer/orders', label: 'Order history' },
  { to: '/customer/cart', label: 'Cart' },
];

const signInLinks = [
  { to: '/customer/login', label: 'Customer sign in' },
  { to: '/customer/register', label: 'Customer registration' },
  { to: '/login', label: 'Supplier sign in' },
  { to: '/register', label: 'Supplier registration' },
  { to: '/admin/login', label: 'Admin sign in' },
];

const Dropdown = ({ label, links }) => (
  <details className="header-dropdown">
    <summary className="header-link">{label}</summary>
    <ul className="header-dropdown-menu">
      {links.map((link) => (
        <li key={link.to}>
          <NavLink to={link.to} className="header-dropdown-link">
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </details>
);

const Header = () => {
  const [session, setSession] = useState(
    () => ({
      isAuthenticated: Boolean(localStorage.getItem('authToken')),
      role: localStorage.getItem('authRole') || 'supplier',
    })
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const syncSession = () => setSession({
    isAuthenticated: Boolean(localStorage.getItem('authToken')),
    role: localStorage.getItem('authRole') || 'supplier',
  });

  const closeDropdowns = (except) => {
    headerRef.current?.querySelectorAll('details[open]').forEach((d) => {
      if (!except || !d.contains(except)) d.removeAttribute('open');
    });
  };

  // On every route change: close menus and re-sync login state
  useEffect(() => {
    setMenuOpen(false);
    closeDropdowns();
    syncSession();
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('storage', syncSession);
    return () => window.removeEventListener('storage', syncSession);
  }, []);

  // Outside click closes dropdowns, Escape closes everything
  useEffect(() => {
    const onPointerDown = (e) => closeDropdowns(e.target);
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeDropdowns();
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleLogout = () => {
    clearSession();
    if (session.role === 'customer') {
      localStorage.removeItem('customerCart');
    }
    setSession({ isAuthenticated: false, role: 'supplier' });
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header" ref={headerRef}>
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Tasty and Fresh home">
          <span className="brand-mark" aria-hidden="true">🥗</span>
          <span className="brand-text">Tasty<span>&amp;</span>Fresh</span>
        </Link>

        <nav
          id="main-nav"
          className={`header-nav${menuOpen ? ' is-open' : ''}`}
          aria-label="Main navigation"
        >
          <ul className="header-list">
            {publicLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `header-link${isActive ? ' is-active' : ''}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li><Dropdown label="Explore" links={exploreLinks} /></li>
            {!session.isAuthenticated && (
              <li><Dropdown label="Sign in" links={signInLinks} /></li>
            )}
            <li>
              <NavLink to="/shop" className={({ isActive }) => `header-link${isActive ? ' is-active' : ''}`}>
                Shop
              </NavLink>
            </li>
            {session.isAuthenticated && session.role === 'supplier' && (
              <li><Dropdown label="Supplier tools" links={supplierLinks} /></li>
            )}
            {session.isAuthenticated && session.role === 'customer' && (
              <li><Dropdown label="My account" links={customerLinks} /></li>
            )}
            {session.isAuthenticated && session.role === 'admin' && (
              <li>
                <NavLink to="/admin" className={({ isActive }) => `header-link${isActive ? ' is-active' : ''}`}>
                  Admin dashboard
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="header-actions">
          {session.isAuthenticated ? (
            <button type="button" className="header-cta" onClick={handleLogout}>Log out</button>
          ) : (
            <Link to="/customer/login" className="header-cta">Customer login</Link>
          )}
          <button
            type="button"
            className="header-burger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;