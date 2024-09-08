import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import TeamLeaderDashboard from './components/TeamLeaderDashboard';
import UserDashboard from './components/UserDashboard';
import LoginPage from './components/login/LoginPage';
import ProtectedRoute from './components/ProtectedRoute'; // Компонент для защиты маршрутов

function App() {
  const token = localStorage.getItem('token'); // Получаем токен из localStorage

  return (
    <Router>
      <Routes>
        {/* Страница логина */}
        <Route path="/login" element={<LoginPage />} />

        {/* Защищенные маршруты, доступны только при наличии токена */}
        <Route
          path="/admin"
          element={token ? <ProtectedRoute component={AdminDashboard} /> : <Navigate to="/login" />}
        />
        <Route
          path="/team-leader"
          element={token ? <ProtectedRoute component={TeamLeaderDashboard} /> : <Navigate to="/login" />}
        />
        <Route
          path="/user"
          element={token ? <ProtectedRoute component={UserDashboard} /> : <Navigate to="/login" />}
        />

        {/* Любой другой маршрут перенаправляется на страницу логина */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
