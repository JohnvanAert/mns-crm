import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import './ExpensePage.scss';
import Navbar from '../Navbar/Navbar';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);  // Текущая страница
  const [totalPages, setTotalPages] = useState(1);  // Общее количество страниц
  const itemsPerPage = 10;  // Количество записей на страницу
  const [sortBy, setSortBy] = useState('created_at');  // Поле для сортировки
  const [sortOrder, setSortOrder] = useState('asc');  // Порядок сортировки

  const [webmasterFilter, setWebmasterFilter] = useState('');  // Фильтр по вебмастеру
  const [amountFilter, setAmountFilter] = useState('');  // Фильтр по сумме

  // Новые состояния для выбора даты
  const [startDate, setStartDate] = useState('');  // Начальная дата
  const [endDate, setEndDate] = useState('');  // Конечная дата

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/expenses', {
          params: {
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
            sortBy: sortBy,
            sortOrder: sortOrder,
            webmaster: webmasterFilter || null,  // Фильтрация по вебмастеру
            amount: amountFilter || null,  // Фильтрация по сумме
            startDate: startDate || null,  // Фильтрация по начальной дате
            endDate: endDate || null,  // Фильтрация по конечной дате
          },
        });

        setExpenses(response.data.expenses);
        setTotalPages(Math.ceil(response.data.totalItems / itemsPerPage));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch expenses');
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [currentPage, sortBy, sortOrder, webmasterFilter, amountFilter, startDate, endDate]);  // Добавляем зависимости от фильтров

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(prevSortOrder => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleWebmasterFilterChange = (e) => {
    setWebmasterFilter(e.target.value);
  };

  const handleAmountFilterChange = (e) => {
    setAmountFilter(e.target.value);
  };

  // Обработчики для выбора диапазона дат
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleFilterSubmit = () => {
    setCurrentPage(1);  // Сбрасываем на первую страницу при фильтрации
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Navbar />
      <h2>Расходы</h2>

      {/* Фильтры */}
      <div className="filters">
        <input
          type="text"
          placeholder="Webmaster ID"
          value={webmasterFilter}
          onChange={handleWebmasterFilterChange}
        />
        <input
          type="text"
          placeholder="Amount"
          value={amountFilter}
          onChange={handleAmountFilterChange}
        />

        {/* Фильтры по датам */}
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          placeholder="End Date"
        />

        <button onClick={handleFilterSubmit}>Применить фильтры</button>
      </div>

      {expenses.length === 0 ? (
        <p>Не найдено расходов.</p>
      ) : (
        <div>
          <table className='custom-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Webmaster</th>
                <th>ID заявки</th>
                <th>Количество</th>
                <th>Статус</th>
                <th>Ссылка</th>
                <th onClick={() => handleSortChange('created_at')}>
                  Дата создания {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSortChange('username')}>
                  Имя пользователя {sortBy === 'username' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                {expenses[0]?.team_name && (
                  <th onClick={() => handleSortChange('team_name')}>
                    Имя команды {sortBy === 'team_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.id}</td>
                  <td>{expense.user_id}</td>
                  <td>{expense.request_id}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.status}</td>
                  <td><a href={expense.link} target="_blank" rel="noopener noreferrer">Link</a></td>
                  <td>{new Date(expense.created_at).toLocaleDateString()}</td>
                  <td>{expense.username}</td>
                  {expense.team_name && <td>{expense.team_name}</td>}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Пагинация */}
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={index + 1 === currentPage ? 'active' : ''}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
