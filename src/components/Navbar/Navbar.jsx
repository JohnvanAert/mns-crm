import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useDispatch } from 'react-redux';
import './Navbar.scss';
import logo from '../../img/logo.png'; // Логотип
import profilePic from '../../img/profile.webp'; // Иконка профиля

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false); // Состояние для управления видимостью меню профиля
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
      dispatch({ type: 'LOGOUT' });
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Обработка переключения видимости выпадающего списка
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} style={{width: "100px;"}} alt="Logo" />
      </div>
      <div className="navbar-links">
        {/* links */}
      </div>
      <div className="navbar-profile">
        <button>
          Profile
        </button>
        {dropdownVisible && (
          <div className="dropdown-menu">
            <Link to="/profile">Профиль</Link>
            <button onClick={handleLogout}>Выйти</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
