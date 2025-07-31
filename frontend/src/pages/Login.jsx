import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${import.meta.env.VITE_API_URL}/login`;

            const response = await axios.post(url, { email, password });
            console.log(response);

            if (response.data.status === true) {
                toast.success(response.data.message);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('name', response.data.name);
                setTimeout(() => {
                    navigate('/');
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
                <h2>Login</h2>
                <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <div className="password-input-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingRight: '2.5rem' }}
                    />
                    <span
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="password-eye-icon"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                <div className="form-links">
                    <Link to="/register">Register</Link>
                    <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Login