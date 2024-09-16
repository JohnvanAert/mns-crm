import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.scss';
import Navbar from '../Navbar/Navbar';

const ProfilePage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    // Fetch user data when the component mounts
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/api/profile');
                const { username, email } = response.data;
                setFormData({ username, email, password: '' }); // Do not fill password field from response
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/profile/update', formData);
            if (response.data.success) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating the profile.');
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
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password (leave blank to keep unchanged):</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="profile-actions">
                    <button type="submit" className="save-btn">Save</button>
                    <button type="button" className="cancel-btn">Cancel</button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default ProfilePage;
