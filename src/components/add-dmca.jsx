import React, { useState } from 'react';
import Navbar from '../page/navbar';

export default function Adddmca() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState(null);

  const addUrl = async () => {
    try {
      const response = await fetch('http://14.225.198.206:8000/add-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.status >= 400) {
        setMessage(data.error);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Failed to add URL. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <input className="input input-bordered w-full max-w-xs" placeholder='URL'
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className='btn' onClick={addUrl}>Add</button>
        {message && <p>{message}</p>}
      </div>
    </>
  );
}
