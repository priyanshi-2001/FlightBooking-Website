import React from 'react';
import { useState,useEffect } from 'react';
import Button from '@material-ui/core/Button'
const url='http://localhost:8000/';
const ViewMyProfile = () => {
  
  const[details,setDetails]=useState([]);
  const[bookings,setBookings]=useState([]);
  useEffect(()=>{
    (async()=>{
      await fetchProfileDetails();

    })()



  },[])
  
  const fetchProfileDetails=async()=>{
    try{
      const userId=localStorage.getItem("userId");
      const res=await fetch(url+`fetchProfileDetails/${userId}`,{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem("token")}`
        }
      });
      const resp=await res.json();
      if(resp.error=='Invalid token' || resp.error=='Authentication required'){
        window.location='/login';
       }
      if(resp.Error=='NA'){
        setDetails(resp.userData);

      }


    }
    catch(err){
      console.log("err",err);
    }
  }

  return (
    <div> Your Profile
      {
       details ?
        (
          <div>
            <div>{details._id}</div>
            <div>{details.Name}</div>
            <div>{details.email}</div>
            <div>{details.date}</div>
            <div>{details.phNum}</div>
            <div>{details.gender}</div>
          </div>
        ):(null)
       }

   
            </div>
        )}

          


export default ViewMyProfile
