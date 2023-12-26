import React, { useState } from 'react';
import { db } from '../Service/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Modal from './Modal';
import { Link } from 'react-router-dom';

function FolderCreationForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [folderColor, setFolderColor] = useState('#FFFFFF');

    const handleCreateFolder = async () => {
        if (folderName !== '') {
            await addDoc(collection(db, "folders"), {
                name: folderName,
                color: folderColor,
                createdAt: serverTimestamp()
            });
            setFolderName('');
            setFolderColor('#FFFFFF');
            setIsModalOpen(false); // Đóng modal sau khi tạo folder
        }
    };

    return (
        <div style={{display:"flex", width:"1393px", justifyContent:"flex-end"}}>
            <Link to={'/schema-diagram'} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Schema Diagram </Link>
            <button className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => setIsModalOpen(true)}>Create Folder</button>
            <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
                <div>
                    <label htmlFor="folderName" className="text-lg">Folder Name:</label>
                    <input
                        id="folderName"
                        type="text"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        className="w-full border p-2 mt-2 rounded-md"
                    />
                    <label htmlFor="folderColor" className="text-lg">Folder Color:</label>
                    <input
                        id="folderColor"
                        type="color"
                        value={folderColor}
                        onChange={(e) => setFolderColor(e.target.value)}
                        className="w-full border p-2 mt-2 rounded-md"
                    />
                </div>
                    <button onClick={handleCreateFolder} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Create Folder</button>
            </Modal>
        </div>
    );
}

export default FolderCreationForm;
