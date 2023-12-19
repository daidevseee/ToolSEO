import React from "react";
import {Routes, Route} from 'react-router-dom'
import Home from "./page/home";
import Checkdmca from "./components/checkdmca";
import Adddmca from "./components/add-dmca";
import Cache from "./components/cache"
import Schema from "./components/schema";
import UploadPage from "./components/UploadPage";
import RequireAuth from "./Private/RequireAuth";
import WithAuthProtection from "./Private/WithAuthProtection";
import Login from "./Private/Login";
function App() {
  const ProtectedCheckdmca = WithAuthProtection(Checkdmca);
  return (
   <>
    <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
              <Route path="/check-dmca" element={<RequireAuth><ProtectedCheckdmca /></RequireAuth>} />
              <Route path="/add-dmca" element={<RequireAuth><Adddmca /></RequireAuth>} />
              <Route path="/cache" element={<RequireAuth><Cache /></RequireAuth>} />
              <Route path="/schema" element={<Schema />} />
              <Route path="/schema/folder/:folderId" element={<UploadPage />} />
    </Routes>
   </>
  );
}

export default App;
