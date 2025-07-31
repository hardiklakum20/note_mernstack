import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { token } = useParams();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${import.meta.env.VITE_API_URL}/reset-password/${token}`;

            const response = await axios.post(url, { newPassword, confirmPassword });

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
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Reset Password</h2>
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
                <button type="submit" className="btn btn-primary">Reset Password</button>
                <div className="form-links justify-content-end">
                    <Link to="/login">Back to Login</Link>
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}

export default ResetPassword