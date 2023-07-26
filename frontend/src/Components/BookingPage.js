import React from 'react'
import {useState,useEffect} from 'react';
import {Link,useParams,useLocation,NavLink} from "react-router-dom"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
// import Slider from 'react-rangeslider'
// import 'react-rangeslider/lib/index.css'
import { CardActionArea, Checkbox, MenuItem } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextField from '@material-ui/core/TextField';
import Slider from '@mui/material/Slider';
import Select from "react-select"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import DetailsFillingForm from './DetailsFillingForm';
const url='http://localhost:8000/';


const BookingPage = (props) => {
   console.log(props,"props")
   const stateParams=useLocation().state.id;
   const travellerData=useLocation().state.travellerAndClass.seatClass;
   const travellerClass= travellerData!=null && travellerData!=undefined ? travellerData : 'E';
   const airlineName=useLocation().state.airlineName;
   const airlineId=useLocation().state.airlineId;
   localStorage.setItem("airlineId",airlineId);
   localStorage.setItem("fare",useLocation().state.fare);
  //  const fareCategory=useLocation().state.fareType;
  //  const countOfTravellers=JSON.parse(useLocation().state.travellerAndClass);
  //  const countPassengers=countOfTravellers.adults+countOfTravellers.children+countOfTravellers.infants;
  //  console.log("type",useParams(),"stateparams",useLocation(),{stateParams},{countOfTravellers},{countPassengers})
   const[flightsData,setFlightsData]=useState([]);
   const[countries,setCountries]=useState([]);
   const[occupations,setOccupations]=useState([]);
   const[finalDetails,setFinalDetails]=useState();
   const[proceed,setProceed]=useState(false);
   const[updateState,setUpdateState]=useState(false);
   const[details,setDetails]=useState({
    fname:"",
    lname:"",
    age:"",
    // dob:"",
    occupation:"",
    email:"",
    mobileNo:"",
    address:"",
    country:"",
    gender:"",
    flightId:"",
    travellerAndClass:travellerClass,
    cpdId:'',
    userId:localStorage.getItem("userId")
    
   })
    
   const handleFinalDetails=(val)=>{
    console.log("val",val);
   setUpdateState(true);
   console.log("val88",val);
   localStorage.setItem("filledInfoForPassDetails",JSON.stringify(val));
    setFinalDetails(val);
    console.log("final",finalDetails);
   }

   useEffect(()=>{
    
    console.log("isnide useEff in bookingPage",stateParams);
    (async () => {
      await fetchData(stateParams) 
    })()

    

    
     console.log(flightsData,"flightsData")

   },[])

   useEffect(()=>{
    (async()=>{
      await fetchOccupations()
       })()
   },[])

   useEffect(()=>{
    (async()=>{
      await fetchCountries()
    })()

   },[])

  
   const fetchData=async(val)=>{
    try{
      const resp=await fetch(url+"fetchSingleFlightData",{
          headers:{
              "Content-Type":"application/json",
              'Authorization':`Bearer ${localStorage.getItem("token")}`
          },
          method:"post",
          body:JSON.stringify({
              id:val
          })
       })
       console.log("resp",resp);
      const response=await resp.json();
      if(response.error=='Invalid token' || response.error=='Authentication required'){
        window.location='/login';
       }
      console.log("response",response.Status);
      setDetails((prev)=>({...prev,flightId:response.Status._id}));
      setFlightsData(response.Status);
      
    }
    catch(err){
      console.log("err in frontend",err);
    }
     }

     const fetchCountries=async()=>{
      try{
        const response=await fetch(url+"fetchCountries",{
          headers:{
            "Content-Type":"application/json",
            'Authorization':`Bearer ${localStorage.getItem("token")}`
          },
          method:"get"
        })
        const resp=await response.json();
        if(resp.error=='Invalid token' || resp.error=='Authentication required'){
          window.location='/login';
         }
        console.log(resp.Status,"pppps");
        let temp=[];
        for (let i=0;i<resp.Status.length;i++){
          var obj={};
          obj['key']=resp.Status[i];
          obj['value']=resp.Status[i];
          temp.push(obj);
        }
        console.log({temp});
        setCountries(temp);
      }
      catch(err){
        console.log(err,"in fetchCountries")
      }
     }

     const  fetchOccupations=async()=>{
      try{
        const response=await fetch(url+"fetchOccupations",{
          headers:{
            "Content-Type":"application/json",
            'Authorization':`Bearer ${localStorage.getItem("token")}`
          },
          method:"get"
        })
        const resp=await response.json();
        if(resp.error=='Invalid token' || resp.error=='Authentication required'){
          window.location='/login';
         }
        console.log(resp.Status,"occupations");
        let temp=[];
        for (let i=0;i<resp.Status.length;i++){
          var obj={};
          obj['key']=resp.Status[i];
          obj['value']=resp.Status[i];
          temp.push(obj);
        }
        console.log({temp});
        setOccupations(temp);
      }
      catch(err){
        console.log(err);

      }
     }

     const handleChange=(e,obj)=>{
      if(obj==='gender'){
        // console.log(e.target.value,"gender",e.target);
        setDetails((prev)=>({...prev,[obj]:e.target.value}));
      }
      else{
      console.log("obj",obj,"e",e.target.value);
      setDetails((prev)=>({...prev,[obj]:e.target.value}));
     
      }
      console.log(details);
     }

     const addDataForBooking=async()=>{
      try{
        console.log(details,"addDataForBooking")
          const response=await fetch(url+"addDataForBooking",{
            headers:{
              "Content-Type":"application/json",
              'Authorization':`Bearer ${localStorage.getItem("token")}`
            },
            method:"POST",
            body:JSON.stringify(finalDetails)
          })
           console.log(response,"in addDataForBooking")
           const res=await response.json();
           if(res.error=='Invalid token' || res.error=='Authentication required'){
            window.location='/login';
           }
           var tempCFD=finalDetails;
           console.log("details are ",details,"tempCFD11",tempCFD);
           for(let j=0;j<tempCFD.length;j++){
            tempCFD[j]['cfdId']=res.listOfIds[j];
           }
           setFinalDetails(tempCFD);
           console.log("tempCFD updated rr",tempCFD);
           localStorage.removeItem("filledInfoForPassDetails");
           localStorage.setItem("filledInfoForPassDetails",JSON.stringify(tempCFD));
           console.log("localstorage val changed",tempCFD);
          localStorage.setItem("bookingId",res.bookingId)
           if(res.Error=="NA"){
            setProceed(true)
            //now open baggage details page
            // {<Link to={"/baggageDetails"} state={{ flightId: stateParams,listOfIds:JSON.stringify(res.listOfIds) }}></Link>}
            window.location.href=`/baggageDetails?flightId=${stateParams}&listOfIds=${JSON.stringify(res.listOfIds)}}`
           }
          

      }
      catch(err){
        console.log(err,"addDataForBooking");
      }
     }

     const submitTravellerDetails=async()=>{
      await addDataForBooking()
      // console.log(details,"addDataForBooking")
      //   if(details.fname=="" &&
      //   details.lname==""&&
      //   details.age==""&&
      //   // details.dob==""&&
      //   details.occupation==""&&
      //   details.email==""&&
      //   details.mobileNo==""&&
      //   details.address==""&&
      //   // details.country==""&&
      //   details.gender==""){

      //   }
      //   else{
      //      addDataForBooking()
      //   }
     }

  return (
    <div>

      <Typography>
        <p style={{fontStyle:'italic'}}><h2>You are almost done!!</h2></p>
            <Typography>
                {flightsData?(
                    <Typography>
                  <Typography>
                  <Card>
                    <CardHeader>TICKET DETAILS</CardHeader>
                    <CardContent>
                      <div>
                      <Typography>
                      &#9992;  {flightsData.fromCity}  -   {flightsData.toCity}
                      </Typography>
                    
                          <Typography>
                            {flightsData.fromCity}
                            {new Date(flightsData.departureTime).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})}
                          </Typography>
                          <Typography>&#183;</Typography>
                          <Typography>
                            {flightsData.toCity}
                            {new Date(flightsData.arrivalTime).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})}
                          </Typography>  
                          </div>                       
                    </CardContent>
                  
                  </Card>
                  </Typography>


                  <Typography>
                  <Card>
                    <CardHeader>
                    IMPORTANT INFORMATION
                    </CardHeader>
                    <CardContent>
                              &#9888; Please read information below carefully.
                              <Typography>
                              <dl>
                              <dt>Special Fare </dt>
                              <dd>As you are booking this flight at a special fare, your ticket will get generated within the next 24 hours after payment</dd>
                            
                              <dt>Trip related information </dt>                         
                              <dd>This itinerary was created by Goibibo by connecting separate flights. In case of delays, schedule change, cancellation or disruption in one flight, the customer will not be eligible for refund of the non-impacted flights.</dd>

                              <dt>Trip related information </dt>                         
                              <dd>You must check the airport terminal for your next flight, as it may be different from the one you landed at.</dd>

                              </dl>
                              </Typography>
                    </CardContent>
                  </Card>

                  </Typography>

                  <Typography>TRAVELLER DETAILS
                 
                 {/* {console.log("length",countOfTravellers.adults+countOfTravellers.children+countOfTravellers.infants)} */}
                    
                    
                    <DetailsFillingForm 
                    // keyVal={i}
                    countries={countries}
                    occupations={occupations}
                    details={handleFinalDetails}
                    stateParams={stateParams}
                    travellerAndClass={travellerClass}
                    airlineName={airlineName}
                    // fareCategory={fareCategory}
                    />

                  </Typography>

                  <div>
                      <button onClick={()=>{submitTravellerDetails()}}>Proceed</button>
                  </div>
                   {/* <Button onClick={<DetailsFillingForm />}>+</Button> */}
                
                      

                   </Typography> ):( <Skeleton count={5}>

                    <p>
                      <Skeleton count={3} />
                    </p>
                   </Skeleton>)}
            </Typography>
      </Typography>
      



    </div>
  )
}

export default BookingPage

