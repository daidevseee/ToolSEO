import React from "react";
import { Routes, Route } from 'react-router-dom';
import Home from "./page/home";
import Checkdmca from "./components/checkdmca";
import Adddmca from "./components/add-dmca";
import Cache from "./components/cache";
import Schema from "./components/schema";
import UploadPage from "./components/UploadPage";
import RequireAuth from "./Private/RequireAuth";
import Login from "./Private/Login";
import Flowdiagram from "./components/Flowdiagram";
import RequireRole from "./Private/WithAuthProtection";
import SchemaGenerator from "./components/schema-generator ";

function App() {
  return (
    <>
       <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/check-dmca" element={<RequireRole allowedRoles={['admin']}><Checkdmca /></RequireRole>} />
        <Route path="/schema-generator" element={<RequireRole allowedRoles={['admin']}><SchemaGenerator /></RequireRole>} />
        <Route path="/add-dmca" element={<RequireRole allowedRoles={['admin']}><Adddmca /></RequireRole>} />
        <Route path="/cache" element={<RequireRole allowedRoles={['manager', 'admin']}><Cache /></RequireRole>} />
        <Route path="/schema" element={<RequireRole allowedRoles={['manager', 'admin']}><Schema /></RequireRole>} />
        <Route path="/schema-diagram" element={<RequireRole allowedRoles={['manager', 'admin']}><Flowdiagram /></RequireRole>} />
        <Route path="/schema/folder/:folderId" element={<RequireRole allowedRoles={['admin', 'manager']}><UploadPage /></RequireRole>} />
      </Routes>
    </>
  );
}

export default App;
