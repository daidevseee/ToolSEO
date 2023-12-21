import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../Service/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Modal from './Modal';

function UploadForm({ currentFolder }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpload = async () => {
    if (file && currentFolder && currentUser) {
      const fileRef = ref(storage, `${currentFolder}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, "files"), {
        name: file.name,
        folder: currentFolder,
        url,
        createdAt: serverTimestamp(),
        size: file.size,
        uploaderId: currentUser.uid,  // ID của người dùng
        uploaderName: currentUser.name,  // Tên người dùng
        uploaderAvatar: currentUser.avatar,  // Avatar người dùng
      });

      setIsModalOpen(false); // Đóng modal sau khi tải lên
    }
  };


  return (
    <div style={{display:"flex", width:"1393px", justifyContent:"flex-end"}}>
      <button className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => setIsModalOpen(true)}>Upload File</button>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
      <>
  <input onChange={(e) => setFile(e.target.files[0])}
    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
    aria-describedby="file_input_help"
    id="file_input"
    type="file"
  />
  <p
    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
    id="file_input_help"
  >
    Đủ loại file
  </p>
</>

        {/* <input type="file" onChange={(e) => setFile(e.target.files[0])} /> */}
        <button className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handleUpload}>Upload to "{currentFolder}"</button>
      </Modal>
    </div>
  );
}

export default UploadForm;
