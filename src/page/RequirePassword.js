import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';


const passwordPermissions = {
    "1234": ["/", "/check-dmca", "/add-dmca", "/cache"], // Đường dẫn chính xác
    "1111": ["/","/cache"] // Mật khẩu này chỉ có quyền truy cập component /cache
  };
  
  const RequirePassword = ({ children }) => {
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [accessGranted, setAccessGranted] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Sử dụng useLocation để lấy đường dẫn hiện tại
  
    useEffect(() => {
      const authData = JSON.parse(localStorage.getItem('authData'));
      if (authData) {
        const { authTimestamp, permissions } = authData;
        if ((new Date().getTime() - authTimestamp) < 3600000 && permissions.includes(location.pathname)) {
          setAccessGranted(true);
        }
      }
    }, [location]);
  
    const handleChange = (element, index) => {
      if (isNaN(element.value)) return false;
      let newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);
  
      // Focus next input
      if (element.nextSibling) {
        element.nextSibling.focus();
      }
    };
  
    const handleSubmit = (e) => {
        e.preventDefault();
        const enteredOtp = otp.join("");
        const permissions = passwordPermissions[enteredOtp];
        if (permissions && permissions.includes(location.pathname)) {
            localStorage.setItem('authData', JSON.stringify({ authTimestamp: new Date().getTime(), permissions }));
            setAccessGranted(true);
        } else {
            alert("Mật khẩu không đúng hoặc bạn không có quyền truy cập trang này!");
            navigate('/'); // Chuyển hướng về trang chủ
        }
    };
    if (!accessGranted) {
        return (
            <form className="form" onSubmit={handleSubmit}>
                <div className="content">
                    <p align="center">Enter Password</p>
                    <div className="inp">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                className="input"
                                type="text"
                                maxLength={1}
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onFocus={e => e.target.select()}
                            />
                        ))}
                    </div>
                    <button className='verifyButton' type="submit">Verify</button>
                </div>
            </form>
        );
    }

    return children;
};

export default RequirePassword;
