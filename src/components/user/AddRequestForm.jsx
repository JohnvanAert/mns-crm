import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import './AddRequestForm.scss'; // Подключаем стили

const AddRequestForm = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/requests/add', { amount, link, quantity });
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose(); // Закрыть модальное окно через несколько секунд
      }, 3000); // Сообщение будет отображаться 3 секунды
    } catch (error) {
      console.error('Ошибка при отправке заявки:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Добавить заявку</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            placeholder="Сумма" 
            required 
          />
          <input 
            type="text" 
            value={link} 
            onChange={e => setLink(e.target.value)} 
            placeholder="Ссылка" 
            required 
          />
          <input 
            type="number" 
            value={quantity} 
            onChange={e => setQuantity(e.target.value)} 
            placeholder="Количество" 
            required 
          />
          <button type="submit">Отправить заявку</button>
        </form>
        {successMessage && <p className="success-message">Заявка успешно отправлена!</p>}
      </div>
    </div>
  );
};

export default AddRequestForm;
