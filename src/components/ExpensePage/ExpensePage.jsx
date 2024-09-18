import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import './ExpensePage.scss';
import Navbar from '../Navbar/Navbar';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [teams, setTeams] = useState([]); // State for storing team options
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);  // Текущая страница
  const [totalPages, setTotalPages] = useState(1);  // Общее количество страниц
  const itemsPerPage = 10;  // Количество записей на страницу
  const [sortBy, setSortBy] = useState('created_at');  // Поле для сортировки
  const [sortOrder, setSortOrder] = useState('asc');  // Порядок сортировки
  

  // State для временных значений фильтров
  const [tempWebmasterFilter, setTempWebmasterFilter] = useState('');  
  const [tempAmountFilter, setTempAmountFilter] = useState('');
  const [tempTeamFilter, setTempTeamFilter] = useState('');
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  

  // State для примененных фильтров
  const [appliedFilters, setAppliedFilters] = useState({
    webmasterFilter: '',
    amountFilter: '',
    teamFilter: '',
    startDate: '',
    endDate: '',
  });

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
            webmaster: appliedFilters.webmasterFilter || null,  // Используем примененные фильтры
            amount: appliedFilters.amountFilter || null,
            team: appliedFilters.teamFilter || null,
            startDate: appliedFilters.startDate || null,
            endDate: appliedFilters.endDate || null,
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
  }, [currentPage, sortBy, sortOrder, appliedFilters]);  // Добавляем зависимости от примененных фильтров

  // Fetch the list of teams when component mounts
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('/api/teams');
        setTeams(response.data.teams);  // Assuming API returns an array of team objects
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      }
    };

    fetchTeams();
  }, []);

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

  const handleFilterSubmit = () => {
    // Применяем фильтры
    setAppliedFilters({
      webmasterFilter: tempWebmasterFilter,
      amountFilter: tempAmountFilter,
      teamFilter: tempTeamFilter,
      startDate: tempStartDate,
      endDate: tempEndDate,
    });
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
          value={tempWebmasterFilter}
          onChange={(e) => setTempWebmasterFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount"
          value={tempAmountFilter}
          onChange={(e) => setTempAmountFilter(e.target.value)}
        />

        <select value={tempTeamFilter} onChange={(e) => setTempTeamFilter(e.target.value)}>
          <option value="">All Teams</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        {/* Фильтры по датам */}
        <input
          type="date"
          value={tempStartDate}
          onChange={(e) => setTempStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={tempEndDate}
          onChange={(e) => setTempEndDate(e.target.value)}
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
