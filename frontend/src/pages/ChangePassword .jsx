import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = () => {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = async (e) => {
        e.preventDefault();

        try {
            const url = `${import.meta.env.VITE_API_URL}/change-password`
            const token = localStorage.getItem("token");

            const response = await axios.post(url, { oldPassword, newPassword, confirmPassword },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            if (response.status === 200) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 1500)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
        }
    }

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleChange}>
                <h2>Change Password</h2>
                <div className="password-input-wrapper">
                    <input
                        type={showOldPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        style={{ paddingRight: '2.5rem' }}
                    />
                    <span
                        onClick={() => setShowOldPassword((prev) => !prev)}
                        className="password-eye-icon"
                    >
                        {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <div className="password-input-wrapper">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ paddingRight: '2.5rem' }}
                    />
                    <span
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="password-eye-icon"
                    >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <div className="password-input-wrapper">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ paddingRight: '2.5rem' }}
                    />
                    <span
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="password-eye-icon"
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <button type="submit" className="btn btn-primary">Change Password</button>
                <div className="form-links justify-content-end">
                    <Link to="/login">Back to Login</Link>
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}

export default ChangePassword