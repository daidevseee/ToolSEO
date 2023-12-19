import React from 'react';
import { useParams } from 'react-router-dom';
import UploadForm from './upload';
import FileList from './file-list';
import Navbar from '../page/navbar';
import Breadcrumb from './breadcrumb';

function UploadPage() {
  const { folderId } = useParams();

  return (
    <>
    <Navbar></Navbar>
    <div style={{display:"flex", justifyContent:"center", marginTop:"110px"}}>

    <Breadcrumb ></Breadcrumb>
    </div>
    <div style={{marginTop:"20px"}}>
      <UploadForm currentFolder={folderId} />
      <FileList currentFolder={folderId} />
    </div>
    </>
  );
}

export default UploadPage;
