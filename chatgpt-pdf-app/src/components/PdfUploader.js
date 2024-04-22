import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { useFileContext } from './FileContext';

function PdfUploader({ setSessionId, onUploadSuccess, isUploading }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
const {updateFileUrl} = useFileContext();
const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            const fileUrl = URL.createObjectURL(file)
            console.log(fileUrl)
            updateFileUrl(fileUrl)
            try {
                const response = await axios.post('http://localhost:5000/upload_pdf', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setSessionId(response.data.session_id);
                alert('PDF uploaded successfully!');
                onUploadSuccess(file);
            } catch (error) {
                console.error('Error uploading PDF:', error);
                alert('Failed to upload PDF');
            }
        } else {
            alert('Please select a PDF file to upload.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".pdf" />
        <button type="submit" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload PDF'}
            {isUploading && <CircularProgress size={24} />}
        </button>
    </form>
    );
}

export default PdfUploader;
