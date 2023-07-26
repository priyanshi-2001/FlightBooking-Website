import React from 'react'
import { useState,useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@mui/material';
const url='http://localhost:8000/';
const ViewMyFlights = () => {
const [flightsData,setFlightsData] = useState([]);//show only upcoming flights
const[isSnackbar,setIsSnackBar]=useState(false);
const[isSnackbarMsg,setIsSnackbarMsg]=useState('');
const[bookings,setBookings]=useState([]);//show all bookings
const[showAllBookings,setShowAllBookings]=useState(false);
  useEffect(()=>{
    (async()=>{
      await fetchMyFlights()

    })()

  },[])

  useEffect(()=>{
    (async()=>{
      await fetchAllBookings();

    })()



  },[])

  const fetchAllBookings=async()=>{
    try{
      const userId=localStorage.getItem("userId");
      const res=await fetch(url+`fetchAllBookings/${userId}`,{
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
        const groupedData = resp.data.reduce((acc, flight) => {
          const bookedOnDate = flight.bookedOn.split('T')[0]; // Extract date from timestamp
          if (!acc[bookedOnDate]) {
            acc[bookedOnDate] = [];
          }
          acc[bookedOnDate].push(flight);
          return acc;
        }, {});
        console.log("groupedData is",groupedData)
        setBookings(groupedData);

      }
    }
    catch(err){
      console.log("err",err);

    }
}

  const fetchMyFlights=async()=>{
    try{
      const res=await fetch(url+`fetchMyFlight/${localStorage.getItem("userId")}`,{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem("token")}`
        }
      })
      const resp=await res.json();
      if(resp.error=='Invalid token' || resp.error=='Authentication required'){
        window.location='/login';
       }
      if(resp.Error=='NA'){
        setFlightsData(resp.flightsData);
      }

    }
    catch(err){
      console.log("err",err);
    }
  }

  const handleWebCheckIN=async(cfdId)=>{
    try{
      const resp=await fetch(url+"webCheckIn",{
        method:'POST',
        body:JSON.stringify({
          cfdId,
          userId:localStorage.getItem("userId")
        }),
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem("token")}`
        }
      })

      const res=await resp.json();
      if(res.error=='Invalid token' || res.error=='Authentication required'){
        window.location='/login';
       }
      if(res.Error=='NA'){
        setIsSnackBar(true);
        setIsSnackbarMsg('Please Check Email to get boarding Pass');
      }
    


    }
    catch(err){
      console.log("err",err);
    }
  }
  const fareCategoryMap = new Map([
    ["D", "Doctors"],
    ["S", "Student"],
    ["A", "Army"],
    ["E","Extra Seat"],
    ["R","Regular"],
    ["SC","Senior Citizen"]
  ]);
const mapOfSeatClass=new Map([
    ["B","Business"],
    ["E","Economy"],
    ["EP","Economy Premium"],
])
const flightCardStyles = {
  backgroundColor: '#f0f5ff', // Light blue background
  border: '1px solid #00a1e6', // Darker blue border
  borderRadius: '8px', // Rounded corners
  padding: '15px',
  marginBottom: '15px',
};

const webCheckInButtonStyles = {
  display: 'inline-block',
  backgroundColor: '#00a1e6', // Dark blue button background
  color: 'white',
  padding: '8px 12px',
  borderRadius: '5px',
  cursor: 'pointer',
marginRight: '10px',
border: 'none',
};

const headingStyles = {
fontSize: '18px',
fontWeight: 'bold',
marginBottom: '5px',
};

const subheadingStyles = {
fontSize: '14px',
marginBottom: '8px',
};

const contentStyles = {
fontSize: '14px',
marginBottom: '5px',
};

return(
  <div>
    <h2>Upcoming Flights</h2> <Button onClick={()=>{setShowAllBookings(true)}}>See All FLights</Button>
    <Snackbar
    style={{vertical: 'top',
    horizontal: 'center'}}
      open={isSnackbar}
      autoHideDuration={6000}
      onClose={()=>{setIsSnackBar(false);setIsSnackbarMsg('')}}
    >
    <Alert
    elevation={6}
    variant="filled"
    onClose={()=>{setIsSnackBar(false);setIsSnackbarMsg('')}}
    severity="success"
  >
    {isSnackbarMsg}
  </Alert>

  </Snackbar>
   {console.log("kk",showAllBookings)}
  {!showAllBookings && flightsData &&
    flightsData.map((o) => {
      return (
        <div key={o._id} style={flightCardStyles}>
          {
          // o.showWebCheckIn &&
           (
            <Button
              style={webCheckInButtonStyles}
              onClick={() => handleWebCheckIN(o._id)}
            >
              Web Check In
            </Button>
          )}
          <div style={headingStyles}>
            {o.flightId && `${o.flightId.fromCity} to ${o.flightId.toCity}`}
          </div>
          <div style={subheadingStyles}>
            {o.flightId &&
              new Date(o.flightId.departureTime).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
              })}{' '}
            -{' '}
            {o.flightId &&
              new Date(o.flightId.arrivalTime).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
              })}
          </div>
          <div style={contentStyles}><h4>Seat Number:  {o.seatNumber}</h4></div>
          <div style={contentStyles}>Name: {o.name} </div>
          <div style={contentStyles}>Email: {o.email} </div>
          <div style={contentStyles}>Phone Number: {o.phNum} </div>
          <div style={contentStyles}>Address: {o.address} </div>
          <div style={contentStyles}>Gender : {o.gender}</div>
          <div style={contentStyles}>Booked On: {new Date(o.bookedOn).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
          <div style={contentStyles}>Seat Class : {mapOfSeatClass.get(o.seatClass)}</div>
          <div style={contentStyles}>Category: {fareCategoryMap.get(o.categoryOfBooking)}</div>
          <div style={contentStyles}>Extra Baggage Booked: {o.extraBaggageBooked=='N'?'No':'Yes'}</div>
          <div style={contentStyles}>Food Booked: {o.foodBooked}</div>
          
        </div>
      );
    })}


   
  {showAllBookings &&
        bookings && Object.keys(bookings).map((date)=>{
          return(
            <div style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
              <h2>
              {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
              }</h2>
            {bookings[date].map((flight)=>{
              return(
                <div style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>


            {flight.flightId && (
              <div>
                <p>From City: {flight.flightId.fromCity}</p>
                <p>To City: {flight.flightId.toCity}</p>
              </div>
            )}
            
            <p>Seat Class: {flight.seatClass}</p>
            <p>Category Of Booking: {flight.categoryOfBooking}</p>
            <p>Address: {flight.address}</p>
             <p>Gender: {flight.gender}</p>
             <p>Age: {flight.age}</p>
             <p>Phone Number: {flight.phNum}</p>
             <p>Name: {flight.name}</p>
             <p>Email: {flight.email}</p>
             <p>Booking Time: {new Date(flight.bookedOn).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", timeStyle: "short" })}</p>
            <p>Food Booked: {flight.foodBooked}</p>
            <p>Food Price: {flight.foodPrice}</p>
            {flight.extraBaggageBooked === 'Y' && flight.checkedInBaggageId && (
              <div>
                <p>Checked-in Baggage Weight: {flight.checkedInBaggageId.weight}</p>
                <p>Extra Price For Baggage: {flight.checkedInBaggageId.extraPriceForBaggage}</p>
              </div>
            )}
           </div>
            
          )
        })
       }

                </div>
                
              )
            })}
</div>
)
}

export default ViewMyFlights