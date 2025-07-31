import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios';

const AddNote = () => {

    const [title, setTtile] = useState();
    const [description, setDescription] = useState();
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = `${import.meta.env.VITE_API_URL}/add-note`;

            const response = await axios.post(url, { title, description }, {
                headers: {
                    Authorization: token,
                }
            });
            if (response.status === 201) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate('/');
                }, 1500)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.error);
        }
    }

    return (
        <div className="note-form-container">
            <div className='d-flex justify-content-between align-items-center'>
                <h1 className="note-form-title">Add New Note</h1>
                <button type="button" className="btn btn-primary note-form-submit" onClick={() => { navigate(-1) }}>Back</button>
            </div>
            <hr className="note-form-hr" />
            <form className="note-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    className="note-form-input"
                    defaultValue=""
                    value={title || ''}
                    onChange={(e) => setTtile(e.target.value)}
                />

                <Editor
                    apiKey='nfm5hrfbtjxz9lg4yeqzzocqwsuk8r6bbuzeszhszmkn472n'
                    init={{
                        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                    }}
                    initialValue="Welcome to TinyMCE!"
                    value={description || ''}
                    onEditorChange={(content, editor) => setDescription(content)}
                />
                <button type="submit" className="btn btn-primary note-form-submit">Add Note</button>
            </form>

            <ToastContainer />
        </div>
    );
};

export default AddNote; 