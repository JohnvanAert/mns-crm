import React, { useState } from 'react';

const AddTeamModal = ({ isOpen, onClose, onAddTeam }) => {
  const [name, setTeamName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTeam(name);
    setTeamName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Team</h2>
        <form onSubmit={handleSubmit}>
          <label>Team Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
          <button type="submit">Add</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AddTeamModal;
