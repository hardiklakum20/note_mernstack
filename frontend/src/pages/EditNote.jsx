import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const EditNote = () => {
    const { state } = useLocation();

    const [title, setTitle] = useState(state.title);
    const [description, setDescription] = useState(state.description);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = `${import.meta.env.VITE_API_URL}/update-note/${state._id}`;

            const response = await axios.put(url, { title, description });
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
            <div className='d-flex justify-content-between align-items-center'>
                <h1 className="note-form-title">Edit Note</h1>
                <button type="button" className="btn btn-primary note-form-submit" onClick={() => { navigate(-1) }}>Back</button>
            </div>

            <hr className="note-form-hr" />
            <form className="note-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    className="note-form-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Editor
                    apiKey='nfm5hrfbtjxz9lg4yeqzzocqwsuk8r6bbuzeszhszmkn472n'
                    init={{
                        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                    }}
                    value={description}
                    onEditorChange={(content) => setDescription(content)}
                />
                <button type="submit" className="btn btn-primary note-form-submit">Save Changes</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EditNote; 