// Schema.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FolderCreationForm from './FolderCreationForm';
import FolderList from './FolderList';
import Navbar from '../page/navbar';


function Schema() {
    const navigate = useNavigate();

    const handleSelectFolder = (folderId) => {
        navigate(`/schema/folder/${folderId}`);
    };

    return (
        <>
            <Navbar />
            <div>
            </div>
            <div style={{marginTop:"110px"}}>
           
                <FolderCreationForm />
                <FolderList onSelectFolder={handleSelectFolder} />
            </div>
        </>
    );
}

export default Schema;
