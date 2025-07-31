import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${import.meta.env.VITE_API_URL}/forgot-password`;

            const response = await axios.post(url, { email });

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
                <h2>Forgot Password</h2>
                <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit" className="btn btn-primary custom-btn">Send Reset Link</button>
                <div className="form-links justify-content-end">
                    <Link to="/login">Back to Login</Link>
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}

export default ForgotPassword