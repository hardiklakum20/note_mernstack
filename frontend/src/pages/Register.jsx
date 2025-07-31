import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = `${import.meta.env.VITE_API_URL}/register`;

            const response = await axios.post(url, { name, email, password });

            if (response.status === 201) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 1500)
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    }

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <input type="text" className="form-control" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
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
                <button type="submit" className="btn btn-primary custom-btn">Register</button>
                <div className="form-links justify-content-end">
                    <Link to="/login">Already have an account?</Link>
                </div>
            </form>
            <ToastContainer />
        </div>

    )
}

export default Register