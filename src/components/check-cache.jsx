import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const CheckCacheButton = ({ onCheckComplete }) => {

    const checkCache = async () => {
        try {
          await axios.get('http://localhost:8000/cache');
          onCheckComplete();
          toast.info("Cache đã được kiểm tra thành công!");
        } catch (error) {
          toast.error("Có lỗi xảy ra khi kiểm tra cache!");
        }
      };
    return (
        <div className='btn-check-cache'>

            <button onClick={checkCache} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Kiểm tra</button>
        </div>
    );
};

export default CheckCacheButton;
