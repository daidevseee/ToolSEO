import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const URLTable = ({ urls, onRefresh, filters}) => {
    const [localUrls, setLocalUrls] = useState(urls);

    const handleDelete = async (id) => {
        try {
          await axios.delete(`http://14.225.198.206:8000/delete-cache/${id}`);
          onRefresh();
          toast.success("URL đã được xóa thành công!");
        } catch (error) {
          toast.error("Có lỗi xảy ra khi xóa URL!");
        }
      };
      const getFilteredUrls = () => {
        return urls.filter(url => {
            let matchesCacheFilter = true;
            let matchesTypeFilter = true;
    
            if (filters.cached && url.status !== 1) {
                matchesCacheFilter = false;
            }
    
            if (filters.notCached && url.status !== 0) {
                matchesCacheFilter = false;
            }
    
            if (filters.page && url.url_type !== 'page') {
                matchesTypeFilter = false;
            }
    
            if (filters.post && url.url_type !== 'post') {
                matchesTypeFilter = false;
            }
    
            return matchesCacheFilter && matchesTypeFilter;
        });
    };
    
      
    
    // const filteredUrls = getFilteredUrls();
    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleString(); // Định dạng theo định dạng địa phương
    };
    useEffect(() => {
        setLocalUrls(urls); // Cập nhật localUrls mỗi khi urls từ props thay đổi
    }, [urls]);

    const handleTypeChange = async (id, newType) => {
        try {
            // Cập nhật trạng thái cục bộ trước khi gọi API
            const updatedUrls = localUrls.map(url => {
                if (url.id_cache === id) {
                    return { ...url, urlType: newType };
                }
                return url;
            });
            setLocalUrls(updatedUrls);

            // Gọi API để cập nhật trên server
            await axios.post('http://localhost:8000/update-cache-type', {
                urlIds: [id],
                urlType: newType
            });
            toast.success("Loại URL đã được cập nhật!");
            onRefresh();
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật loại URL!");
        }
    };

    // Sử dụng localUrls cho việc hiển thị và lọc dữ liệu
    const filteredUrls = getFilteredUrls(localUrls);
    const urlcache = 'cache:'
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
                    Type
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
                    <a target='_blank' href={urlcache+url.url}>{url.url}</a>
                </th>
                <td className="px-6 py-4">
                {url.status === 1 ? 'Đã cache ✅' : 'Chưa cache ❌'}
                </td>
                <td className='px-6 py-4'>
                <select 
                  defaultValue={url.url_type} 
                  onChange={(e) => handleTypeChange(url.id_cache, e.target.value)}
                >
                    <option value="page">Page</option>
                    <option value="post">Post</option>
                </select>
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
