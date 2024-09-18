import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useDispatch } from 'react-redux';
import './Navbar.scss';
import logo from '../../img/logo.png';

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [role, setRole] = useState(null); // Добавляем состояние для роли
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Получаем данные пользователя, включая роль
    const fetchUserRole = async () => {
      try {
        const response = await api.get('/api/user');
        setRole(response.data.role); // Сохраняем роль пользователя
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      }
    };

    fetchUserRole();
  }, []);

    // Функция для перенаправления на нужный дашборд
    const handleDashboardRedirect = () => {
      if (role === 'admin') {
        navigate('/admin');  // Редирект на админский дашборд
      } else if (role === 'team_leader') {
        navigate('/teamleader');   // Редирект на дашборд тимлида
      } else {
        navigate('/user');   // Редирект на дашборд обычного пользователя
      }
    };

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
      <button onClick={handleDashboardRedirect} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src={logo} alt="Logo" />
        </button>

      </div>
      <div className="navbar-links">
        {/* Ссылки */}
      </div>
      <div className="navbar-profile">
        <img src="" alt="" />
        <input type="button" onClick={toggleDropdown} value="Menu" />
        {dropdownVisible && (
          <div className="dropdown-menu">
            {role === 'admin' && <Link to="/products">Продукты</Link>}
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
