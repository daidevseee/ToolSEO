import React, { useEffect, useState } from 'react';
import { db } from '../Service/firebase';
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

function FolderList({ onSelectFolder }) {
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "folders"), (snapshot) => {
      const folderData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFolders(folderData);
    });

    return () => unsubscribe();
  }, []);

  const handleFolderClick = (folderId) => {
    navigate(`/schema/folder/${folderId}`);
  };

  const handleDeleteFolder = async (folderId, event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên phần tử cha
    try {
      await deleteDoc(doc(db, "folders", folderId));
      setFolders(prevFolders => prevFolders.filter(folder => folder.id !== folderId));
    } catch (error) {
      console.error("Error deleting folder:", error);
      // Thông báo lỗi cho người dùng, có thể dùng một thông báo toast hoặc modal
    }
  };

  return (
    <div>
      <div style={{marginTop:"20px", cursor: "pointer"}} className="flex justify-center space-x-4">
        {folders.map((folder, index) => (
          <div 
            style={{width:"200px", position: 'relative'}} 
            key={folder.id} 
            className="folder-item bg-white p-6 max-w-sm rounded-lg border border-gray-200 shadow-md"
            onClick={() => handleFolderClick(folder.id)}
          >
            <div className="flex justify-center mb-4">
              <img width={"75px"} src="https://cdn-icons-png.flaticon.com/512/3767/3767084.png" alt="icon folder" />
            </div>
            <h5 style={{textAlign:"center"}} className="text-xl font-medium text-gray-900 mb-2">{folder.name}</h5>
            <button 
              style={{position: 'absolute', top: '0', right: '0'}} 
              className="delete-button text-red-600 hover:text-red-700"
              onClick={(e) => handleDeleteFolder(folder.id, e)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderList;
