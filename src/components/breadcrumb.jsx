import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { db } from '../Service/firebase';
import { doc, getDoc } from "firebase/firestore";

const Breadcrumb = () => {
  const [folderName, setFolderName] = useState('');
  const { folderId } = useParams(); // Lấy ID của folder từ URL.
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  useEffect(() => {
    // Hàm này sẽ truy vấn Firestore để lấy tên folder dựa trên ID.
    const fetchFolderName = async (folderId) => {
      if (folderId) {
        const docRef = doc(db, "folders", folderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFolderName(docSnap.data().name); // Giả sử trường lưu tên folder là 'name'.
        } else {
          // Doc không tồn tại.
          console.log("No such document!");
        }
      }
    };

    fetchFolderName(folderId);
  }, [folderId]);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {/* Home Link */}
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            {/* Home icon and label */}
            Home
          </Link>
        </li>
        {/* Other Links */}
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          let breadcrumbName = name;

          // Nếu là ID của folder và tên đã được lấy, sử dụng tên thay vì ID.
          if (name === folderId && folderName) {
            breadcrumbName = folderName;
          }

          return (
            <li key={name} className="inline-flex items-center">
                <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              {isLast ? (
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{breadcrumbName}</span>
              ) : (
                <Link to={routeTo} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  {breadcrumbName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
