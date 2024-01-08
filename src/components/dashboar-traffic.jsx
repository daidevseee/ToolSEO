import React, { useState, useEffect } from 'react';
import { db } from '../Service/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import TrafficChart from './TrafficChart';
import Navbar from '../page/navbar';
import Modal from './Modal';
const Dashboard = () => {
    const [trafficData, setTrafficData] = useState([]);
    const [editingData, setEditingData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, 'trafficData'));
        const now = new Date();
        const updatedData = querySnapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          const startDate = data.startDate?.toDate ? data.startDate.toDate() : new Date(data.startDate); 
          const endDate = data.endDate?.toDate ? data.endDate.toDate() : new Date(data.endDate);
          const isRunning = endDate ? now <= endDate : true;
          const trafficToday = simulateTraffic(data.trafficPerDay, startDate, data.trafficToday || 0);
  
          // Cập nhật traffic hôm nay trong Firestore (nếu cần)
          if (trafficToday !== data.trafficToday) {
            updateDoc(doc(db, 'trafficData', docSnapshot.id), { trafficToday });
          }
  
          return { id: docSnapshot.id, ...data, startDate, endDate, isRunning, trafficToday };
        });
        setTrafficData(updatedData);
      };
  
      fetchData();
    }, []);
  
    // Hàm giả lập tăng traffic hàng giờ
    const simulateTraffic = (trafficPerDay, startDate, existingTrafficToday, isActive) => {
        if (!isActive) return existingTrafficToday;
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const hoursSinceStartOfToday = (now - startOfToday) / (1000 * 60 * 60);
        const totalHoursSinceStart = (now - startDate) / (1000 * 60 * 60);

        let trafficToday = Math.min(trafficPerDay, (hoursSinceStartOfToday * trafficPerDay) / 24);

        // Nếu đang ở ngày mới và không phải là ngày đầu tiên của chiến dịch, reset trafficToday
        if (totalHoursSinceStart > 24 && startOfToday > startDate) {
          trafficToday += existingTrafficToday;
        }
      
        return Math.floor(trafficToday);
      };
       const startEdit = (data) => {
        setEditingData(data);
        setIsModalOpen(true);
    };

      const handleEditChange = (e) => {
        setEditingData({ ...editingData, [e.target.name]: e.target.value });
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        const docRef = doc(db, 'trafficData', editingData.id);
        await updateDoc(docRef, {
            ...editingData,
            // Đảm bảo các trường dữ liệu cần thiết được cập nhật
            url: editingData.url,
            numberOfDays: editingData.numberOfDays,
            trafficPerDay: editingData.trafficPerDay,
            googleKeyword: editingData.googleKeyword
        });

        // Cập nhật state và đóng form chỉnh sửa
        setIsModalOpen(false);
        setEditingData(null);
        // Refetch hoặc cập nhật state nếu cần
    };
    const toggleActive = async (data, isActive) => {
      const docRef = doc(db, 'trafficData', data.id);
      await updateDoc(docRef, { isActive });
  
      // Cập nhật state để phản ánh thay đổi
      setTrafficData(trafficData.map(td => 
        td.id === data.id ? { ...td, isActive } : td
      ));
  };
  return (
    <>
    <Navbar></Navbar>
    <div style={{marginTop:"80px"}} className="max-w-7xl mx-auto my-10 p-8 border border-gray-300 rounded-md shadow-lg">
  <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Dashboard Traffic</h2>
  <Modal  isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
                {editingData && (
               <form onSubmit={submitEdit} className="space-y-4">
               <h2 className="text-lg font-semibold text-gray-800">Chỉnh Sửa Traffic Data</h2>
               
               <div>
                   <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL</label>
                   <input
                       type="text"
                       name="url"
                       id="url"
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                       value={editingData.url}
                       onChange={handleEditChange}
                       required
                   />
               </div>
               
               <div>
                   <label htmlFor="numberOfDays" className="block text-sm font-medium text-gray-700">Số Ngày Chạy</label>
                   <input
                       type="number"
                       name="numberOfDays"
                       id="numberOfDays"
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                       value={editingData.numberOfDays}
                       onChange={handleEditChange}
                       required
                   />
               </div>
       
               <div>
                   <label htmlFor="trafficPerDay" className="block text-sm font-medium text-gray-700">Traffic Mỗi Ngày</label>
                   <input
                       type="number"
                       name="trafficPerDay"
                       id="trafficPerDay"
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                       value={editingData.trafficPerDay}
                       onChange={handleEditChange}
                       required
                   />
               </div>
       
               <div>
                   <label htmlFor="googleKeyword" className="block text-sm font-medium text-gray-700">Google Keyword</label>
                   <input
                       type="text"
                       name="googleKeyword"
                       id="googleKeyword"
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                       value={editingData.googleKeyword || ''}
                       onChange={handleEditChange}
                   />
               </div>
       
               <div className="flex justify-end">
                   <button
                       type="submit"
                       className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                   >
                       Lưu Thay Đổi
                   </button>
               </div>
           </form>
          )}
            </Modal>
  {trafficData.map((data) => (
    <div key={data.id} className="mb-6 p-4 border rounded-lg bg-white shadow">
      <button onClick={() => startEdit(data)}>Chỉnh sửa</button>
      <p className="text-lg font-semibold">
        URL: <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">{data.url}</a>
      </p>
      <p>Ngày bắt đầu: {data.startDate?.toLocaleDateString()}</p>
      <p>Ngày kết thúc: {data.endDate?.toLocaleDateString()}</p>
      <p>Số ngày chạy: {data.numberOfDays} ngày</p>
      <p>Số traffic trên ngày: {data.trafficPerDay}</p>
      <p>Số traffic hôm nay: {data.trafficToday}</p>
      <p>Người tạo: {data.createdBy}</p>
      <label className="flex items-center cursor-pointer">
                <div className="relative">
                    <input type="checkbox" checked={data.isActive} className="sr-only" onChange={() => toggleActive(data, !data.isActive)} />
                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${data.isActive ? 'transform translate-x-full bg-blue-500' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">
                    {data.isActive ? 'Active' : 'Inactive'}
                </div>
            </label>
            <p>
            Trạng thái: 
            {data.isActive ? 
                (data.isRunning ? 
                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Đang chạy
                    </span> : 
                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Hoàn thành
                    </span>) : 
                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Inactive
                </span>
            }
        </p>
      <TrafficChart trafficData={[data]} />
    </div>
  ))}
  
</div>
    </>

  );
};

export default Dashboard;
