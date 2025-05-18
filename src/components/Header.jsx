import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = () => {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const menuElement = document.getElementById('main-nav');
      const menuToggle = document.getElementById('menu-toggle');
      
      if (menuElement && !menuElement.contains(e.target) && 
          menuToggle && !menuToggle.contains(e.target) && 
          mobileMenuActive) {
        setMobileMenuActive(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [mobileMenuActive]);

  // Reset menu khi kích thước màn hình thay đổi
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileMenuActive(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuActive(!mobileMenuActive);
  };

  // Toggle dropdown trên mobile
  const toggleDropdown = (index, e) => {
    if (window.innerWidth <= 900) {
      e.preventDefault();
      setActiveDropdown(activeDropdown === index ? null : index);
    }
  };
  
  // Kiểm tra liên kết active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <div className="logo">
            <Link to="/">
              <h1 style={{ fontWeight: 700, color: '#f471a5' }}>DTKIEN</h1>
            </Link>
          </div>

          <button 
            id="menu-toggle" 
            className="mobile-menu-toggle" 
            onClick={toggleMobileMenu}
          >
            <FontAwesomeIcon icon={mobileMenuActive ? faTimes : faBars} />
          </button>

          <nav id="main-nav" className={`main-nav ${mobileMenuActive ? 'active' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                  Trang chủ
                </Link>
              </li>
              <li className={`nav-item has-dropdown ${activeDropdown === 0 ? 'active' : ''}`}>
                <a 
                  href="#" 
                  className="nav-link"
                  onClick={(e) => toggleDropdown(0, e)}
                >
                  Công cụ <FontAwesomeIcon icon={faChevronDown} style={{
                    marginLeft: '5px',
                    transform: activeDropdown === 0 ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease'
                  }} />
                </a>
                <ul className="nav-dropdown">
                  <li>
                    <Link to="/averageShopee" className="dropdown-item">
                      Tính điểm đánh giá
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="dropdown-item">
                      Quản lý sản phẩm
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link to="/blog" className={`nav-link ${isActive('/blog') ? 'active' : ''}`}>
                  Blog
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;