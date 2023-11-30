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
    const [filters, setFilters] = useState({
      cached: false,
      notCached: false,
      page: false,
      post: false
  });
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
      <div>
      <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
  <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
    <div className="flex items-center ps-3">
      <input
        id="vue-checkbox-list"
        type="checkbox"
        defaultValue=""
        checked={filters.cached}
      onChange={() => setFilters({...filters, cached: !filters.cached})}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
      />
      <label
        htmlFor="vue-checkbox-list"
        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        Đã cache
      </label>
    </div>
  </li>
  <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
    <div className="flex items-center ps-3">
      <input
        id="react-checkbox-list"
        type="checkbox"
        defaultValue=""
        checked={filters.notCached}
        onChange={() => setFilters({...filters, notCached: !filters.notCached})}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
      />
      <label
        htmlFor="react-checkbox-list"
        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        Chưa cache
      </label>
    </div>
  </li>
  <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
    <div className="flex items-center ps-3">
      <input
        id="angular-checkbox-list"
        type="checkbox"
        defaultValue=""
        checked={filters.page}
        onChange={() => setFilters({...filters, page: !filters.page})}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
      />
      <label
        htmlFor="angular-checkbox-list"
        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        Page
      </label>
    </div>
  </li>
  <li className="w-full dark:border-gray-600">
    <div className="flex items-center ps-3">
      <input
        id="laravel-checkbox-list"
        type="checkbox"
        defaultValue=""
        checked={filters.post}
        onChange={() => setFilters({...filters, post: !filters.post})}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
      />
      <label
        htmlFor="laravel-checkbox-list"
        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        Post
      </label>
    </div>
  </li>
</ul>
</div>

      </div>
      <URLTable filters={filters} key={refresh} urls={urls} onRefresh={fetchUrls}/>
    </div>
    </>
  );
}

export default App;
