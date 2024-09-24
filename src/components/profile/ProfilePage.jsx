import React, { useState, useEffect, useRef } from 'react';
import axios from '../../api/axiosConfig';
import './ProfilePage.scss';
import Navbar from '../Navbar/Navbar';

const ProfilePage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        image: '', // Поле для аватарки
    });
    const [isEditable, setIsEditable] = useState({
        username: false,
        email: false,
        password: false,
    });

    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedFile, setSelectedFile] = useState(null); // Для хранения выбранного файла
    const fileInputRef = useRef(null); // Ref для скрытого инпута

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/api/profile');
                const { username, email, image } = response.data;
                setFormData({ username, email, image });
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]); // Сохраняем выбранный файл
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, image: reader.result }); // Предварительный просмотр
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click(); // Открываем скрытый input при клике на аватар
    };

    const handleEditClick = (field) => {
        setIsEditable((prevState) => ({
            ...prevState,
            [field]: !prevState[field], // Включаем или выключаем редактирование для конкретного поля
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = new FormData(); // Используем FormData для отправки файла
    
        // Добавляем текстовые данные
        updatedData.append('username', formData.username);
        updatedData.append('email', formData.email);
    
        // Если выбран файл, добавляем его
        if (selectedFile) {
            updatedData.append('image', selectedFile);
        }
    
        try {
            const response = await axios.post('/api/profile/update', updatedData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.data.success) {
                alert('Profile updated successfully!');
    
                // Обновляем изображение аватарки сразу после успешного обновления
                if (selectedFile) {
                    // Обновляем URL изображения на основе ответа сервера
                    const imageUrl = `${axios.defaults.baseURL}${response.data.imageUrl}`;
                    setFormData((prevState) => ({
                        ...prevState,
                        image: imageUrl, // Обновляем поле изображения
                    }));
                }
    
                setIsEditable({
                    username: false,
                    email: false,
                    password: false,
                });
                setSelectedFile(null); // Сбрасываем выбранный файл после успешного обновления
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating the profile.');
        }
    };
    
    const handlePasswordChangeClick = async () => {
        try {
            await axios.post('/api/forgot-password', { email: formData.email });
            alert('Password reset code sent to your email.');
        } catch (error) {
            console.error('Error sending reset code:', error);
            alert('Failed to send reset code.');
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('/api/reset-password', {
                email: formData.email,
                resetCode,
                newPassword,
            });

            if (response.data.success) {
                alert('Password reset successfully!');
                setResetCode('');
                setNewPassword('');
                setConfirmPassword('');
                setIsEditable({ ...isEditable, password: false });
            } else {
                alert('Invalid reset code or error resetting password.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('An error occurred while resetting the password.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="profile-page">
                <h2>Edit your Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="profile-info">
                        <div className="form-group">
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                disabled={!isEditable.username}
                            />
                            <button type="button" onClick={() => handleEditClick('username')}>
                                {isEditable.username ? 'Save' : 'Edit'}
                            </button>
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditable.email}
                            />
                            <button type="button" onClick={() => handleEditClick('email')}>
                                {isEditable.email ? 'Save' : 'Edit'}
                            </button>
                        </div>
                        <div className="form-group">
                            <label>Avatar:</label>
                            <div className="avatar-container" onClick={handleAvatarClick}>
                            <img
    src={formData.image && formData.image.startsWith('http') 
        ? formData.image 
        : `${axios.defaults.baseURL}${formData.image || '/uploads/images/profile.png'}`}  // добавляем fallback на случай, если image == null
    alt="User Avatar"
    className="avatar"
/>


                                <span className="edit-label">Edit</span>
                            </div>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                style={{ display: 'none' }} // Скрываем input
                            />
                        </div>
                    </div>

                    <button type="submit">Save Changes</button> {/* Кнопка сабмита изменений */}
                </form>

                <div className="password-change">
                    <div className="form-group">
                        <label>Password:</label>
                        <button type="button" onClick={() => handleEditClick('password')}>
                            {isEditable.password ? 'Cancel' : 'Edit Password'}
                        </button>
                    </div>

                    {isEditable.password && (
                        <>
                            <div className="form-group">
                                <label>Reset Code:</label>
                                <input
                                    type="text"
                                    name="resetCode"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password:</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <button type="button" onClick={handlePasswordChangeClick}>
                                Send Reset Code
                            </button>
                            <button type="button" onClick={handleResetPassword}>
                                Reset Password
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
