import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';

const AdminDeviceListing:React.FC = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        console.log("button clicked");
        navigate("/admin/addNewDevice");
      };


  return (
    <div>
      <h1>This is divcie listing page </h1>
     <Button variant='contained' onClick={handleClick}> Add Devices </Button>
    </div>
  )
}

export default AdminDeviceListing
