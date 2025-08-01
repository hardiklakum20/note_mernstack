import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const ViewNote = () => {

    const { state } = useLocation();

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const [password, setPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confirmNewPassword, setConfirmNewPassword] = useState();

    // hide show passowrd
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const DeleteProtection = async (id) => {
        try {
            const url = `${import.meta.env.VITE_API_URL}/deleteprotection/${id}`;

            const response = await axios.delete(url, {
                headers: {
                    Authorization: token,
                }
            })
            console.log(response, 'delete protection');


            if (response.status === 200) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate('/');
                }, 1500)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
        }
    }

    const UpdateProtection = async (id) => {
        try {
            const url = `${import.meta.env.VITE_API_URL}/updateprotection/${id}`;

            const response = await axios.post(url, { password, newPassword, confirmNewPassword }, {
                headers: {
                    Authorization: token,
                }
            })
            console.log(response, 'update protection');

            if (response.status === 200) {
                toast.success(response.data.message);
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
        <div className="note-form-container">
            <div className='d-flex justify-content-between align-items-center flex-wrap'>
                <h1 className="note-form-title">View Note</h1>
                <div className='d-flex align-items-center gap-3 flex-wrap'>
                    {
                        state.protect === true && (
                            <>
                                <button type="button" className="btn btn-danger" onClick={() => { DeleteProtection(state._id) }}>Delete Password</button>
                                <button type="button" className="btn btn-warning" data-bs-toggle="modal"
                                    data-bs-target="#exampleModal">Change Password</button>
                            </>
                        )
                    }
                    <button type="button" className="btn btn-primary note-form-submit" onClick={() => { navigate(-1) }}>Back</button>
                </div>
            </div>
            <hr className="note-form-hr" />
            <input
                type="text"
                value={state.title}
                disabled
                className="note-form-input"
            />

            <Editor
                apiKey='nfm5hrfbtjxz9lg4yeqzzocqwsuk8r6bbuzeszhszmkn472n'
                init={{
                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                }}
                disabled
                value={state.description}
            />

            <div class="modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Encryption</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3 position-relative">
                                <label for="exampleInputEmail1" class="form-label">Old Password</label>
                                <input type={showPassword ? "text" : "password"} class="form-control" placeholder='Old Password' id="exampleInputEmail1" aria-describedby="emailHelp" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                                <span
                                    className="position-absolute top-70 end-0 translate-middle-y me-3"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <div class="mb-3 position-relative">
                                <label for="exampleInputEmail1" class="form-label">Set New Password</label>
                                <input type={showNewPassword ? "text" : "password"} class="form-control" placeholder='Set New Password' id="exampleInputEmail1" aria-describedby="emailHelp" value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} />
                                <span
                                    className="position-absolute top-70 end-0 translate-middle-y me-3"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <div class="mb-3 position-relative">
                                <label for="exampleInputEmail2" class="form-label">Confirm New Password</label>
                                <input type={showConfirmPassword ? "text" : "password"} class="form-control" placeholder='Confirm New Password' id="exampleInputEmail2" aria-describedby="emailHelp" value={confirmNewPassword} onChange={(e) => { setConfirmNewPassword(e.target.value) }} />
                                <span
                                    className="position-absolute top-70 end-0 translate-middle-y me-3"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" onClick={() => { UpdateProtection(state._id) }}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );

};

export default ViewNote; 