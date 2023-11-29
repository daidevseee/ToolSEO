import React from "react";
import {Routes, Route} from 'react-router-dom'
import Home from "./page/home";
import Checkdmca from "./components/checkdmca";
import Adddmca from "./components/add-dmca";
import Cache from "./components/cache"
import RequirePassword from "./page/RequirePassword";
import WithAuthProtection from "./Private/WithAuthProtection";
function App() {
  const ProtectedCheckdmca = WithAuthProtection(Checkdmca);
  return (
   <>
    <Routes>
              <Route path="/" element={<RequirePassword><Home /></RequirePassword>} />
              <Route path="/check-dmca" element={<RequirePassword><ProtectedCheckdmca /></RequirePassword>} />
              <Route path="/add-dmca" element={<RequirePassword><Adddmca /></RequirePassword>} />
              <Route path="/cache" element={<RequirePassword><Cache /></RequirePassword>} />
    </Routes>
   </>
  );
}

export default App;
