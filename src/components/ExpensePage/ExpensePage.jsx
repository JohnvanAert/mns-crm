import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import './ExpensePage.scss';
import Navbar from '../Navbar/Navbar';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);  // State для количества записей на страницу
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('asc');

  const [tempWebmasterFilter, setTempWebmasterFilter] = useState('');
  const [tempAmountFilter, setTempAmountFilter] = useState('');
  const [tempTeamFilter, setTempTeamFilter] = useState('');
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

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
            webmaster: appliedFilters.webmasterFilter || null,
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
  }, [currentPage, sortBy, sortOrder, appliedFilters, itemsPerPage]);  // Добавляем зависимость от itemsPerPage

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('/api/teams');
        setTeams(response.data.teams);
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
    setAppliedFilters({
      webmasterFilter: tempWebmasterFilter,
      amountFilter: tempAmountFilter,
      teamFilter: tempTeamFilter,
      startDate: tempStartDate,
      endDate: tempEndDate,
    });
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Сбросить на первую страницу
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

        {/* Количество записей на странице */}
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={75}>75</option>
          <option value={100}>100</option>
        </select>
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
