import React, {useState, useEffect} from 'react';
import URLTable from './cache-tb';
import URLForm from './cache-form';
import Navbar from '../page/navbar';
import CheckCacheButton from './check-cache';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [refresh, setRefresh] = useState(false);
    const [urls, setUrls] = useState([]);
    const [filter, setFilter] = useState('all');
    const fetchUrls = async () => {
      const result = await axios('http://localhost:8000/get-cache');
      setUrls(result.data);
    };
  
    useEffect(() => {
      fetchUrls();
    }, []);
    const handleCheckComplete = () => {
        fetchUrls(); // Làm mới danh sách URL sau khi kiểm tra
      };
  return (
    <>
    <div>
    <Navbar></Navbar>
    <ToastContainer />
    </div>
    
    <div className='cache'>
        
      <URLForm onAddUrl={fetchUrls} />
      <div>
      <CheckCacheButton onCheckComplete={handleCheckComplete} />
      <select 
        onChange={(e) => setFilter(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="all">Tất cả</option>
        <option value="cached">Đã cache</option>
        <option value="not-cached">Chưa cache</option>
      </select>
      </div>
      <URLTable filter={filter} key={refresh} urls={urls} onRefresh={fetchUrls}/>
    </div>
    </>
  );
}

export default App;
