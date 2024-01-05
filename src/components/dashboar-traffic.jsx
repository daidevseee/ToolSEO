import React, { useState, useEffect } from 'react';
import { db } from '../Service/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import TrafficChart from './TrafficChart';
import Navbar from '../page/navbar';
const Dashboard = () => {
    const [trafficData, setTrafficData] = useState([]);

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
    const simulateTraffic = (trafficPerDay, startDate, existingTrafficToday) => {
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
  return (
    <>
    <Navbar></Navbar>
    <div style={{marginTop:"80px"}} className="max-w-7xl mx-auto my-10 p-8 border border-gray-300 rounded-md shadow-lg">
  <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Dashboard Traffic</h2>
  {trafficData.map((data) => (
    <div key={data.id} className="mb-6 p-4 border rounded-lg bg-white shadow">
      <p className="text-lg font-semibold">
        URL: <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">{data.url}</a>
      </p>
      <p>Ngày bắt đầu: {data.startDate?.toLocaleDateString()}</p>
      <p>Ngày kết thúc: {data.endDate?.toLocaleDateString()}</p>
      <p>Số ngày chạy: {data.numberOfDays} ngày</p>
      <p>Số traffic trên ngày: {data.trafficPerDay}</p>
      <p>Số traffic hôm nay: {data.trafficToday}</p>
      <p>Người tạo: {data.createdBy}</p>
      <p>
        Trạng thái: 
        {data.isRunning ? 
          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Đang chạy
          </span> : 
          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Hoàn thành
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
