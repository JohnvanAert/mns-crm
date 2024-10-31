import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const EditUserModal = ({ isOpen, onClose, user, teams, onUserUpdated }) => {
  const [selectedTeam, setSelectedTeam] = useState(user?.team_id || '');
  const [selectedRole, setSelectedRole] = useState(user?.role || 'user');

  const uniqueTeams = Array.from(new Set(teams.map(team => team.team_name))).map(team_name => {
    return teams.find(team => team.team_name === team_name);
  });

  const handleSave = async () => {
    try {
      const response = await api.put(`/users/${user.id}`, {
        team_id: selectedTeam,
        role: selectedRole,
      });

      if (response.status === 200) {
        console.log('User updated successfully:', response.data);
        
        // Вызываем функцию обновления пользователя в родительском компоненте
        onUserUpdated({
          ...user, 
          team_id: selectedTeam, 
          role: selectedRole
        });

        // Закрываем модальное окно только после успешного обновления
        onClose();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <h2>Edit User</h2>
          <label>
            Team:
            <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
              {uniqueTeams.map((team) => (
                <option key={team.team_id} value={team.team_id}>
                  {team.team_name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Role:
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="user">User</option>
              <option value="team_leader">Team Leader</option>
            </select>
          </label>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    )
  );
};

export default EditUserModal;
