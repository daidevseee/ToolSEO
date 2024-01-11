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
    <div className="container">
      {folders.map((folder, index) => (
        <div 
          key={folder.id} 
          className="folder-item"
          onClick={() => handleFolderClick(folder.id)}
        >
          <div className="flex justify-center mb-4">
            <img width={"75px"} src="https://cdn-icons-png.flaticon.com/512/3767/3767084.png" alt="icon folder" />
          </div>
          <h5 style={{textAlign:"center"}} className="text-xl font-medium text-gray-900 mb-2">{folder.name}</h5>
          <button 
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation(); // Stop the click event from bubbling up to the parent
                handleDeleteFolder(folder.id, e);
              }}
            >
              Xóa
            </button>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default FolderList;
