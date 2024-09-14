import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import './ExpensePage.scss'
import Navbar from '../Navbar/Navbar';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);  // Текущая страница
  const [totalPages, setTotalPages] = useState(1);  // Общее количество страниц
  const itemsPerPage = 10;  // Количество записей на страницу

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/expenses', {
          params: {
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
          },
        });

        setExpenses(response.data.expenses);
        setTotalPages(Math.ceil(response.data.totalItems / itemsPerPage));  // Рассчитываем общее количество страниц
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch expenses');
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [currentPage]);  // Зависимость от currentPage для перезагрузки данных при изменении страницы

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
        <Navbar />
      <h2>Expenses</h2>

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
                <th>Дата создания</th>
                <th>Имя пользователя</th>
                {expenses[0]?.team_name && <th>Team Name</th>}
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
