import React, { useEffect, useState, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import profileImg from '../assets/profile.jpg';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState({
        name: localStorage.getItem('name'),
        email: '',
        createdAt: ''
    });
    const [imagePreview, setImagePreview] = useState(profileImg);
    const fileInputRef = useRef(null);

    const token = localStorage.getItem('token');

    const handleData = async () => {
        try {
            const url = `${import.meta.env.VITE_API_URL}/profile`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: token,
                }
            });
            if (response.status === 200) {
                const { user, profile } = response.data;
                setUser(user);
                if (profile?.image) {
                    setImagePreview(profile.image);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.error);
        }
    }

    useEffect(() => {
        handleData();
    }, [])

    const handleDelete = async () => {
        try {
            const url = `${import.meta.env.VITE_API_URL}/delete`;
            const response = await axios.delete(url, {
                headers: {
                    Authorization: token,
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                setImagePreview(profileImg); // Reset to default image
            }
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error(error.response?.data?.error || 'Failed to delete image');
        }
    };

    // Image upload logic
    const handleImageClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const url = `${import.meta.env.VITE_API_URL}/upload`;
            const response = await axios.post(url, formData, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200 || response.status === 201) {
                toast.success(response.data.message);

                // Preview uploaded image (optional)
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error(error.response?.data?.error || 'Failed to upload image');
        }
    };

    return (
        <div className="dashboard-main profile-main">
            <div className="profile-card pop-in">
                <div className="profile-img-wrapper">
                    <img
                        src={imagePreview}
                        alt="Profile"
                        className="profile-img profile-img-clickable"
                        onClick={handleImageClick}
                        style={{ cursor: 'pointer' }}
                        title="Click to change profile image"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </div>
                <header className="dashboard-header profile-header">
                    <h1 className="profile-title">Profile</h1>
                </header>
                <div className="profile-details">
                    <h4 className="profile-name">{user.name}</h4>
                    <p className="profile-email">{user.email}</p>
                    <div className="profile-role">Role: User</div>
                </div>
                <div className="profile-actions">
                    {/* <button className="btn btn-accent profile-btn" onClick={handleEdit}>
                        <FaEdit /> Edit
                    </button> */}
                    <button className="btn btn-outline-primary profile-btn" onClick={handleDelete}>
                        <FaTrash /> Delete
                    </button>
                </div>
                <div className="profile-meta">
                    <span>Member since: {new Date(user.createdAt).getFullYear()}</span>
                </div>
                <ToastContainer position="top-center" autoClose={1800} />
            </div>
        </div>
    );
};

export default Profile; 