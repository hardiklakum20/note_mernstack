import axios from 'axios';
import React, { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete, MdLock } from "react-icons/md";
import { CiMenuFries } from "react-icons/ci";
import { toast, ToastContainer } from 'react-toastify';
import { ImUnlocked } from "react-icons/im";
import { FaLock } from "react-icons/fa6";
import { Modal } from 'bootstrap';


const Dashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const token = localStorage.getItem('token');

    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [noteId, setNoteId] = useState();
    const [unlockPassword, setUnlockPassword] = useState();
    const [actionType, setActionType] = useState("");

    const modalRef = useRef(null);


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        navigate('/login');
    }

    const handleViewNote = async () => {
        try {
            const url = `${import.meta.env.VITE_API_URL}/show-notes`;


            const response = await axios.get(url, {
                headers: {
                    Authorization: token
                }
            });
            console.log(response, 'view note');


            if (response.status === 200) {
                setData(response.data.notes);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleViewNote();
    }, [])

    const handleDelete = async (id) => {
        try {
            const url = `${import.meta.env.VITE_API_URL}/delete-note/${id}`;

            const response = await axios.delete(url)

            if (response.status === 200) {
                toast.success(response.data.message);
                handleViewNote();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleProtection = async () => {
        try {
            const url = `${import.meta.env.VITE_API_URL}/protection`;

            const response = await axios.post(url, { password, confirmPassword, noteId }, {
                headers: {
                    Authorization: token
                }
            });

            console.log("noteId:", noteId);


            console.log(response, 'protection');


            if (response.status === 201) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate('/');
                }, 1500);
                await handleViewNote();
                setPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
        }
    }
    const handleUnlock = async () => {
        try {
            if (!noteId) {
                toast.error("Note ID is missing!");
                return;
            }
            const url = `${import.meta.env.VITE_API_URL}/unprotection`;

            const response = await axios.post(url, { unlockPassword, noteId }, {
                headers: {
                    Authorization: token,
                }
            });
            console.log(response, 'unlock note');

            if (response.status === 200) {
                toast.success(response.data.message);

                setTimeout(() => {
                    if (actionType === "view") {
                        navigate(`/view-note/${response.data.note._id}`, { state: response.data.note });                        
                    } else if (actionType === "edit") {
                        navigate(`/edit-note/${response.data.note._id}`, { state: response.data.note });                        
                    }
                }, 1500);




            }
        } catch (error) {
            toast.error(error.response.data.error);
            console.log(error);
        }
    }

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar d-none d-md-block">
                <h2>NotesApp</h2>
                <nav>
                    <Link to="/" className="nav-link">Dashboard</Link>
                    <Link to="/profile" className="nav-link">Profile</Link>
                    <Link to="/login" className="nav-link" onClick={handleLogout}>Logout</Link>
                    <Link to="/change-password" className="nav-link">Change Password</Link>
                </nav>
            </aside>

            <nav class="navbar navbar-expand-lg sidebar d-md-none">
                <div class="container-fluid">
                    <h2 class="navbar-brand" href="#">NotesApp</h2>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent2" aria-controls="navbarSupportedContent2" aria-expanded="false" aria-label="Toggle navigation">
                        <CiMenuFries className='text-white' />
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent2">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <Link to={"/"} className='text-decoration-none'><a class="nav-link active" aria-current="page">Dashboard</a></Link>
                            </li>
                            <li class="nav-item">
                                <Link to={"/profile"} className='text-decoration-none'> <a class="nav-link">Profile</a></Link>
                            </li>
                            <li class="nav-item">
                                <Link to={"/login"} className='text-decoration-none' onClick={handleLogout}> <a class="nav-link">Logout</a></Link>
                            </li>
                            <li class="nav-item">
                                <Link to={"/change-password"} className='text-decoration-none'><a class="nav-link">Change Password</a></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Your Notes</h1>
                    <button className="btn btn-accent" onClick={() => navigate('/add-note')}>+ New Note</button>
                </header>
                <section className="notes-grid">
                    {
                        data.length === 0 &&
                        <div className="no-notes">
                            <p>No notes found.</p>
                            <button className="btn btn-primary" onClick={() => navigate('/add-note')}>+ New Note</button>
                        </div>
                    }
                    {data.map(note => (
                        <div key={note.id} className="note-card">
                            <div className='d-flex align-items-center justify-content-between'>
                                <h3>{note.title}</h3>
                                <div className='d-flex align-items-center gap-2'>

                                    {note.protect === true ? (
                                        <FaLock className="fs-4" title="Protected" />
                                    ) : (
                                        <ImUnlocked
                                            className="fs-4"
                                            title="Click to protect"
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModal"
                                            onClick={() => setNoteId(note._id)}
                                        />
                                    )}

                                    <MdDelete className='fs-4' onClick={() => handleDelete(note._id)} />
                                </div>
                            </div>
                            {
                                note.protect === false ? (
                                    note.description.replace(/<[^>]+>/g, '').length > 19
                                        ? note.description.replace(/<[^>]+>/g, '').slice(0, 19) + '...'
                                        : note.description.replace(/<[^>]+>/g, '')
                                ) : ""

                            }
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                <button className="btn btn-outline-primary" onClick={() => {
                                    if (note.protect === false) {
                                        navigate(`/view-note/${note._id}`, { state: note })
                                    } else {
                                        setNoteId(note._id);
                                        setActionType("view");
                                        const modalElement = document.getElementById("exampleModal2");
                                        const modal = new Modal(modalElement);
                                        modal.show();
                                    }
                                }}>View</button>
                                <button className="btn btn-outline-secondary" onClick={() => {
                                    if (note.protect === false) {
                                        navigate(`/edit-note/${note._id}`, { state: note })
                                    } else {
                                        setNoteId(note._id);
                                        setActionType("edit");
                                        const modalElement = document.getElementById("exampleModal2");
                                        const modal = new Modal(modalElement);
                                        modal.show();
                                    }
                                }}>Edit</button>
                            </div>
                        </div>
                    ))}
                </section>

                {/* view modal */}
                <div class="modal" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Encryption</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">Enter Password</label>
                                    <input type="password" class="form-control" placeholder='Enter Password' id="exampleInputEmail1" aria-describedby="emailHelp" value={unlockPassword} onChange={(e) => setUnlockPassword(e.target.value)} />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary" onClick={handleUnlock}>Open</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* create password modal */}
                <div class="modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Encryption</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">Set New Password</label>
                                    <input type="password" class="form-control" placeholder='Set New Password' id="exampleInputEmail1" aria-describedby="emailHelp" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div class="mb-3">
                                    <label for="exampleInputEmail2" class="form-label">Confirm New Password</label>
                                    <input type="password" class="form-control" placeholder='Confirm New Password' id="exampleInputEmail2" aria-describedby="emailHelp" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary" onClick={handleProtection}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <ToastContainer />
        </div >
    )
}

export default Dashboard