import React, { useState,useEffect } from 'react';
import Navbar from '../page/navbar';
import './loader.css'
import Logo_Dmca from './dmca-logo.png'
import * as XLSX from 'xlsx';


function calculateTimeRemaining() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    return diff;
}

export default function CheckDMCA() {
    const [urls, setUrls] = useState([]);
    const [difference, setDifference] = useState([]);
    const [errors404, setErrors404] = useState([]);
    const [activeButton, setActiveButton] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
 // Thêm biến trạng thái isLoading
  
    const getAllUrls = async () => {
      try {
        setIsLoading(true); // Bắt đầu tải
        const response = await fetch('http://14.225.198.206:8000/get-all-urls');
        const data = await response.json();
        setUrls(data);
        setActiveButton('get-all-urls');
      } catch (error) {
        console.error('Error fetching URLs:', error);
      } finally {
        setIsLoading(false); // Kết thúc tải
      }
    };
  
    
useEffect(() => {
    const timerId = setInterval(() => {
        const timeLeft = calculateTimeRemaining();
        setTimeRemaining(timeLeft);
        if (timeLeft <= 0) {
            // Reset or do something when countdown is over
            clearInterval(timerId);
        }
    }, 1000);

    return () => clearInterval(timerId); // Clear the interval when component is unmounted
}, []);


const compare = async () => {
      try {
        setIsLoading(true); // Bắt đầu tải
        const response = await fetch('http://14.225.198.206:8000/compare');
        const data = await response.json();
        setDifference(data);
        setActiveButton('compare');
      } catch (error) {
        console.error('Error comparing URLs:', error);
      } finally {
        setIsLoading(false); // Kết thúc tải
      }
    };
  
    const check404 = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://14.225.198.206:8000/check404');
        const data = await response.json();
    
        // Check if data is an array, if not, set it to an empty array
        if (Array.isArray(data)) {
          setErrors404(data);
        } else {
          setErrors404([]);
          console.warn('Received non-array data from check404 endpoint:', data);
        }
    
        setActiveButton('check404');
      } catch (error) {
        console.error('Error checking 404:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const deleteUrl = async (urlToDelete) => {
      try {
          const response = await fetch('http://14.225.198.206:8000/delete-url', {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ url: urlToDelete })
          });   
          if (response.ok) {
              // Remove the deleted URL from the state
              setUrls(prevUrls => prevUrls.filter(url => url !== urlToDelete));
          } else {
              const data = await response.json();
              console.error("Error deleting URL:", data.error);
          }
      } catch (error) {
          console.error("Error calling delete API:", error);
      }
  };
  
  
    const exportToExcel = (data, fileName) => {
      const formattedData = data.map(url => ({ url }));
      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
  };
  const handleExportSelect = (event) => {
    const selectedValue = event.target.value;
    switch (selectedValue) {
        case "Urls":
            exportToExcel(urls, "Urls");
            break;
        case "Difference":
            exportToExcel(difference, "Difference");
            break;
        case "Errors404":
            exportToExcel(errors404, "Errors404");
            break;
        default:
            break;
    }
};

  const link_dmca ='https://www.dmca.com/Protection/Status.aspx?ID=ce976549-01f7-44cf-803b-8a883b40460d&refurl='

  return (
    <>
      <Navbar></Navbar>
      <div className='button'>
      <button className='btn btn-info' onClick={compare}>Compare</button>
      <button className='btn btn-success' onClick={getAllUrls}>Get All URLs DMCA</button>
      <button className='btn btn-error' onClick={check404}>Check 404</button>
    

      <div className='button-exp'>
          <select className='btn btn-success' onChange={handleExportSelect}>
              <option disabled selected>Chọn để xuất Excel</option>
              <option value="Urls">Xuất URLs ra Excel</option>
              <option value="Difference">Xuất Difference ra Excel</option>
              <option value="Errors404">Xuất Errors404 ra Excel</option>
          </select>
      </div>

      
      </div>
      {isLoading && (
        <div className="overlay">
          <p className="loading-text"><span className="loading loading-bars loading-lg"></span>
</p>
        </div>
      )}
        
      {activeButton === 'get-all-urls' && (
        <div>
          <div className='overflow-x-auto'>
            <table className='table'>
              <thead>
                <tr>
                    <th>Count</th>
                    <th>URL đã được Add DMCA</th>
                    <th>Protected</th>
                    <td>Thao tác</td>
                </tr>
              </thead>
              <tbody>
                {urls.map((url,id, index) => (
                  <tr key={url}>
                    <td>{id +1}</td>
                    <td key={url}><a target='_blank' href={link_dmca+url}>{url}</a></td>
                    <td><a target='_blank' href={link_dmca+url} ><img width={75} height={35} src={Logo_Dmca} alt={Logo_Dmca} /></a></td>
                    <td>
                        <button className="btn btn-danger" onClick={() => deleteUrl(url)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeButton === 'compare' && (
        <div>
          <div className='overflow-x-auto'>
            <table className='table'>
              <thead>
                <tr>
                  <th>URLs chưa được Add DMCA</th>
                  <th>Count</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {difference.map((url,id, index) => (
                  <tr key={index}>
                    <td>{id+1}</td>
                    <td key={url}><a target='_blank' href={link_dmca+url}>{url}</a></td>
                    <td>DMCA sẽ được ADD sau: <span style={{color:'red', fontWeight:'bold'}}>{new Date(timeRemaining).toISOString().substr(11, 8)}</span> <span className="loading loading-spinner text-warning"></span>

 </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeButton === 'check404' && (
        <div>
          <div className='overflow-x-auto'>
            <table className='table'>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {errors404.map((url,id, index) => (
                  <tr key={index}>
                    <td>{id}</td>
                    <td>{url}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

