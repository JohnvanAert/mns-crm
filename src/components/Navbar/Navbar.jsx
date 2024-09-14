import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useDispatch } from 'react-redux';
import './Navbar.scss';
import logo from '../../img/logo.png';

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="navbar-links">
        {/* Ссылки */}
      </div>
      <div className="navbar-profile">
        <img src="" alt="" />
        <input type="button" onClick={toggleDropdown} value="Menu" />
        {dropdownVisible && (
          <div className="dropdown-menu">
            <Link to="/profile">Профиль</Link>
            <Link to="/expenses">Расходы</Link>
            <button onClick={handleLogout}>Выйти</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
