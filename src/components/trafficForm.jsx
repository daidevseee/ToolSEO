import React, { useState, useEffect } from 'react';
import { db, auth } from '../Service/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Navbar from '../page/navbar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { onAuthStateChanged } from "firebase/auth";

const TrafficForm = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    url: '',
    trafficPerDay: 100,
    country: 'Viet Nam',
    numberOfDays: 1,
    trafficSource: {
      direct: false,
      google: false,
      facebook: false
    },
    deviceRatio: 50
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      trafficSource: {
        ...formData.trafficSource,
        [name]: checked
      },
      // Reset googleKeyword khi checkbox Google không được chọn
      ...(name === 'google' && !checked && { googleKeyword: '' })
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startDate = new Date(); // Ngày bắt đầu là ngày hiện tại
    const endDate = new Date(startDate.getTime() + formData.numberOfDays * 24 * 60 * 60 * 1000);
    const dataToSave = {
      ...formData,
      startDate: startDate, // Thêm ngày bắt đầu vào dữ liệu để lưu
      endDate: endDate, 
      createdBy: currentUser ? currentUser.name : 'Unknown',
      googleKeyword: formData.trafficSource.google ? formData.googleKeyword : undefined
    };
    try {
      await addDoc(collection(db, 'trafficData'), dataToSave);
      toast.success('Dữ liệu đã được lưu và chạy thành công!', {
        position: "top-center",
        onClose: () => navigate('/dashboard-traffic') // Chuyển hướng sau khi toast đóng
      });
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };
  const handleRangeChange = (e) => {
    setFormData({ ...formData, deviceRatio: parseInt(e.target.value, 10) });
  };

  

  return (
    <>
    <Navbar></Navbar>
    <ToastContainer />
    <div style={{marginTop:"110px"}} className="max-w-3xl mx-auto my-10 p-8 border border-gray-300 rounded-md">
        <div style={{display:"flex", justifyContent:"flex-end"}}>

    <Link className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' to={'/dashboard-traffic'} >Dashboard</Link>
        </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            URL (đường dẫn 1 trang bạn muốn tăng traffic)
          </label>
          <input
            type="text"
            name="url"
            id="url"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formData.url}
            onChange={handleChange}
            required
          />
        </div>

        {/* Mô tả */}
        {/* Traffic mỗi ngày */}
        <div>
          <label htmlFor="trafficPerDay" className="block text-sm font-medium text-gray-700">
            Traffic mỗi ngày (Giới hạn từ 10 - 2.000)
          </label>
          <input
            type="number"
            name="trafficPerDay"
            id="trafficPerDay"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            min="10"
            max="2000"
            value={formData.trafficPerDay}
            onChange={handleChange}
            required
          />
        </div>

        {/* Quốc gia */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Quốc gia
          </label>
          <select
            name="country"
            id="country"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="Viet Nam">Việt Nam</option>
            <option value="Japan">Jav</option>
            <option value="China">CA</option>
            <option value="USA">USA</option>
            {/* Thêm các option khác tại đây */}
          </select>
        </div>

        {/* Số ngày sẽ chạy */}
        <div>
          <label htmlFor="numberOfDays" className="block text-sm font-medium text-gray-700">
            Số ngày sẽ chạy
          </label>
          <input
            type="number"
            name="numberOfDays"
            id="numberOfDays"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formData.numberOfDays}
            onChange={handleChange}
            required
          />
        </div>

        {/* Nguồn truy cập */}
        <div className="flex items-center">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="direct"
              className="form-checkbox h-5 w-5 text-gray-600"
              checked={formData.trafficSource.direct}
              onChange={handleCheckboxChange}
            />
            <span className="ml-2">Trực tiếp</span>
          </label>
          <label className="flex items-center ml-6 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="google"
              className="form-checkbox h-5 w-5 text-gray-600"
              checked={formData.trafficSource.google}
              onChange={handleCheckboxChange}
            />
            <span className="ml-2">Google(*)</span>
          </label>
          
          <label className="flex items-center ml-6 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="facebook"
              className="form-checkbox h-5 w-5 text-gray-600"
              checked={formData.trafficSource.facebook}
              onChange={handleCheckboxChange}
            />
            <span className="ml-2">Facebook</span>
          </label>
        </div>
        {formData.trafficSource.google && (
          <div>
            <label htmlFor="googleKeyword" className="block text-sm font-medium text-gray-700">
              Keyword (dành cho Google)
            </label>
            <input
              type="text"
              name="googleKeyword"
              id="googleKeyword"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.googleKeyword}
              onChange={handleChange}
              placeholder="Nhập keyword"
            />
          </div>
        )}
        {/* Tỉ lệ mobile/pc */}
        <div className="my-4">
      <label htmlFor="deviceRatio" className="block text-sm font-medium text-gray-700">
        Tỉ lệ mobile/pc ({formData.deviceRatio}%)
      </label>
      <div className="flex items-center">
        <input
          type="range"
          name="deviceRatio"
          id="deviceRatio"
          className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          min="0"
          max="100"
          value={formData.deviceRatio}
          onChange={handleRangeChange}
        />
        <span className="ml-2 text-sm font-medium text-gray-700">{formData.deviceRatio}%</span>
      </div>
    </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Chạy
        </button>
      </form>
    </div>
    </>
    
  );
};

export default TrafficForm;
