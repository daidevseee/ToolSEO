import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const URLTable = ({ urls, onRefresh, filter}) => {
   

    const handleDelete = async (id) => {
        try {
          await axios.delete(`http://localhost:8000/delete-cache/${id}`);
          onRefresh();
          toast.success("URL đã được xóa thành công!");
        } catch (error) {
          toast.error("Có lỗi xảy ra khi xóa URL!");
        }
      };
      const getFilteredUrls = () => {
        switch (filter) {
          case 'cached':
            return urls.filter(url => url.status === 1);
          case 'not-cached':
            return urls.filter(url => url.status === 0);
          default:
            return urls;
        }
      };
    
      const filteredUrls = getFilteredUrls();
    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleString(); // Định dạng theo định dạng địa phương
    };
    return (
        <>
<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    URL
                </th>
                <th scope="col" className="px-6 py-3">
                    Status
                </th>
                <th scope="col" className="px-6 py-3">
                    Time
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            {filteredUrls.map(url => (

            <tr key={url.id_cache} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {url.url}
                </th>
                <td className="px-6 py-4">
                {url.status === 1 ? 'Đã cache ✅' : 'Chưa cache ❌'}
                </td>
                
                <td className="px-6 py-4">
                {formatDateTime(url.time)}
                </td>
                <td className="px-6 py-4">
                <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 " onClick={() => handleDelete(url.id_cache)}>Xóa</button>
                </td>
            </tr>
            ))}
           
        </tbody>
    </table>
</div>
        </>
    );
};

export default URLTable;
