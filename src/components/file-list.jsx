import React, { useState, useEffect } from "react";
import { db, storage } from "../Service/firebase";
import { FileIcon } from "react-file-icon";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc, serverTimestamp
} from "firebase/firestore";
import { ref, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage"; // Thêm dòng này
function FileItem({ file,onDelete,currentFolder, onUpdate}) {
  const [newFile, setNewFile] = useState(null);
  const handleFileChange = (event) => {
    setNewFile(event.target.files[0]);
    handleUpdate(event.target.files[0]);
  };

  const handleUpdate = async (newFile) => {
    // Chỉ tiến hành nếu có file mới được chọn
    if (newFile) {
      // Xóa file cũ khỏi Firebase Storage
      const oldFileRef = ref(storage, `${currentFolder}/${file.name}`);
      try {
        await deleteObject(oldFileRef);
      } catch (error) {
        console.error("Error deleting old file:", error);
        return;
      }

      // Tải lên file mới
      const newFileRef = ref(storage, `${currentFolder}/${newFile.name}`);
      try {
        await uploadBytes(newFileRef, newFile);
        const newUrl = await getDownloadURL(newFileRef);

        // Cập nhật thông tin file mới trong Firestore
        const fileDocRef = doc(db, "files", file.id);
        await updateDoc(fileDocRef, {
          name: newFile.name,
          url: newUrl,
          size: newFile.size,
          createdAt: serverTimestamp(), // Cập nhật thời gian tạo nếu cần
        });

        // Cập nhật UI sau khi file mới được tải lên và thông tin được cập nhật
        onUpdate(file.id, {
          name: newFile.name,
          url: newUrl,
          size: newFile.size,
        });
      } catch (error) {
        console.error("Error updating new file:", error);
      }
    }
  };
  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  const fileExtension = getFileExtension(file.name);
  // Định dạng ngày từ timestamp của Firestore
  const formattedDate = file.createdAt?.toDate().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const truncateFileName = (name, maxLength) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...'; // Cắt chuỗi và thêm '...'
    }
    return name; // Nếu không quá giới hạn thì trả về tên gốc
  };
  return (
    
    <div style={{ flex: '1 0 30%', margin: '20px 10px', height: '100%', boxSizing: 'border-box' }}>

    <div style={{ flex: '1 0 30%', margin: '0 10px 0 10px', height: '100%', boxSizing: 'border-box' }}>
      <img
        className="w-8 h-8 rounded-full"
        src={file.uploaderAvatar}
        alt="avatar img"
      />
      <div style={{width:"400px"}} className="flex flex-col gap-1">
        <div className="flex flex-col w-full max-w-[326px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {file.uploaderName || 'Unknow'}
            </span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {file.uploader} {formattedDate}
            </span>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", height:"75px"}} className="flex items-start my-2.5 bg-gray-50 dark:bg-gray-600 rounded-xl p-2">
            <div className="me-2">
              <span style={{cursor:"pointer"}} title={file.name} className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white pb-2">
                <svg
                  fill="none"
                  aria-hidden="true"
                  className="w-10 h-10 flex-shrink-0"
                  viewBox="0 0 20 21"
                >
                  <FileIcon extension={file.name.split(".").pop()} />
                </svg>
                {truncateFileName(file.name, 22)}
              </span>
              <span className="flex text-xs font-normal text-gray-500 dark:text-gray-400 gap-2">
                {(file.size / 1024).toFixed(2)} KB
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="self-center"
                  width={3}
                  height={4}
                  viewBox="0 0 3 4"
                  fill="none"
                >
                  <circle cx="1.5" cy={2} r="1.5" fill="#6B7280" />
                </svg>
                {fileExtension.toUpperCase()}
              </span>
            </div>
            <div className="inline-flex self-center items-center">
              <a 
              href={file.url}
              download={file.name}
              target="_blank" rel="noopener noreferrer"
                className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                
              >
                <svg
                  className="w-4 h-4 text-gray-900 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                  <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                </svg>
              </a>
              <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id={`update-file-${file.id}`}
                  />
                    <label htmlFor={`file-input-${file.id}`}>

                <button
                onClick={() => document.getElementById(`update-file-${file.id}`).click()}
                  className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                  type="button"
                >
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 22 21"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-width="2"
                      d="M7.24 7.194a24.16 24.16 0 0 1 3.72-3.062m0 0c3.443-2.277 6.732-2.969 8.24-1.46 2.054 2.053.03 7.407-4.522 11.959-4.552 4.551-9.906 6.576-11.96 4.522C1.223 17.658 1.89 14.412 4.121 11m6.838-6.868c-3.443-2.277-6.732-2.969-8.24-1.46-2.054 2.053-.03 7.407 4.522 11.959m3.718-10.499a24.16 24.16 0 0 1 3.719 3.062M17.798 11c2.23 3.412 2.898 6.658 1.402 8.153-1.502 1.503-4.771.822-8.2-1.433m1-6.808a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                    />
                  </svg>
                </button>
              </label>
              <button onClick={() => onDelete(file.id)}
                className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                type="button"
              >
                <svg
                  className="w-4 h-4 text-gray-900 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <g>
                    {" "}
                    <path fill="none" d="M0 0h24v24H0z" />{" "}
                    <path d="M17 4h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5V2h10v2zM9 9v8h2V9H9zm4 0v8h2V9h-2z" />{" "}
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          <a href={file.url} target="_blank" rel="noopener noreferrer">View File</a>
          </span>
        </div>
      </div>
    </div>
    </div>
   
  );
}
function FileList({ currentFolder }) {
  const [files, setFiles] = useState([]);
  const handleUpdate = async (fileId, updatedData) => {
    try {
      const fileDocRef = doc(db, "files", fileId);
      await updateDoc(fileDocRef, updatedData);
      // Cập nhật UI nếu cần
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };
  useEffect(() => {
    if (currentFolder) {
      const q = query(
        collection(db, "files"),
        where("folder", "==", currentFolder),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const filesData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(filesData); // Log để kiểm tra
        setFiles(filesData);
      });

      return () => unsubscribe();
    }
  }, [currentFolder]);
  const handleDelete = async (fileId) => {
    try {
      // Xóa file khỏi Firestore
      await deleteDoc(doc(db, "files", fileId));

      // Xóa file khỏi Firebase Storage nếu cần
      const fileRef = ref(storage, `đường_dẫn_đến_file`);
      await deleteObject(fileRef);

      // Cập nhật UI
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  const renderPlaceholderItems = (count) => {
    return [...Array(count)].map((_, index) => (
      <div key={`placeholder-${index}`} style={{ flex: '1 0 30%', margin: '0 10px', visibility: 'hidden' }}>
        {/* Placeholder item */}
      </div>
    ));
  };
  return (
    <>
       <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start", marginLeft: "40px" }}>
       {files.length > 0 ? (
          files.map((file) => (
            <FileItem key={file.id} file={file} currentFolder={currentFolder} onDelete={handleDelete} onUpdate={handleUpdate} />
          ))
        ) : (
          <div style={{ width: '100%', textAlign: 'center' }}><div class="terminal-loader">
          <div class="terminal-header">
            <div class="terminal-title">Status</div>
            <div class="terminal-controls">
              <div class="control close"></div>
              <div class="control minimize"></div>
              <div class="control maximize"></div>
            </div>
          </div>
          <div class="text">File chưa được upload...</div>
        </div>
        </div>
        )}
        {files.length % 3 !== 0 && renderPlaceholderItems(3 - files.length % 3)}
      </div>
    </>
  );
}

export default FileList;
