import React, { useEffect,useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Modal from '@mui/material/Modal';
import Input from '@material-ui/core/Input';
// import Slider from 'react-rangeslider'
// import 'react-rangeslider/lib/index.css'
import BookingPage from './BookingPage';
import { CardActionArea, Checkbox, MenuItem, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';

import Slider from '@mui/material/Slider';
import Select from "react-select"
import { data } from 'jquery';

const url='http://localhost:8000/';

const Landing = () => {
  const flightStatusOption=[
    {
      label:'On Time',
      value:'OT'
    },
    {
      label:'Delayed',
      value:'D'
    },
    {
      value:'OWC',
      label:'Open for web check in'
     
    },
    {
      value:'CWC',
      label:'Closed for web check in'
    },
    {
      value:'OFC',
      label:'Open for Flight Check in'
     
    },
    {
      value:'CFC',
      label:'Closing for flight check in'
    },
    {
      label:'Landing Success',
      value:'LS'
    }
  ]

  const [selectedStatus,setSelectedStatus]=useState();
  const[optionsList,setOptionsList]=useState([]);
  const[showpopup,setShowpopup]=useState(false);
  const[newDateForFLight,setNewDateForFlight]=useState({arrival:'',departure:''});
  const [cities,setCities]=useState({to:'',from:''});
  const [dateData,setDateData]=useState({toDate:'',fromDate:''});
  // const[fareType,setFareType]=useState('regular');
  const[statusesId,setStatusesId]=useState('');
  const [showTraveller,setShowTraveller]=useState(false);
  const[openBookingPage,setOpenBookingPage]=useState(false);
  const[flightsDetails,setFlightDetails]=useState({});
  const[searchedFlights,setSearchedFlights]=useState();
  const[airlinesNames,setAirlinesNames]=useState();
  const[faresList,setFaresList]=useState();
  const[pricesValues,setPricesValues]=useState(undefined);
  const[filteredFLights,setFilteredFlights]=useState();
  const[selectedFilter,setSelectedFilter]=useState(false);
  const[valueChanged,setValueChanged]=useState(false);
  const[travellerAndClass,setTravellerAndClass]=useState({

     adults:0,
     children:0,
     infants:0,
     seatClass:'economy'
    //  economy:true,
    //  premiumEconomy:false,
    //  business:false,
    //  firstClass:false
     
  })

useEffect(()=>{
if(localStorage.getItem("toCity")!=null && localStorage.getItem("toCity")!=undefined &&
localStorage.getItem("fromCity")!=null && localStorage.getItem("fromCity")!=undefined &&
localStorage.getItem("date")!=null && localStorage.getItem("date")!=undefined
){
  setCities((prev)=>({...prev,to:localStorage.getItem("toCity")}))
  setCities((prev)=>({...prev,from:localStorage.getItem("fromCity")}))
  setDateData((prev)=>({...prev,toDate:localStorage.getItem("date")}))
  setValueChanged(true);
console.log("isnide ff toCity is->",localStorage.getItem("toCity"),"fromcity->",localStorage.getItem("fromCity"),
"date-->",localStorage.getItem("date"));
 
}
},[])

useEffect(()=>{
  if(valueChanged==true){
  (async()=>{
    await searchFLights();}
    )()

  }
},[valueChanged])

const handleToCityChange=(e)=>{
  console.log("optionsList",e.value,flightsDetails,"pp11",flightsDetails[e.value])
  e? setCities((prev)=>({...prev,to:flightsDetails[e.value]})) : setCities((prev)=>({...prev,to:''}))
 localStorage.setItem("toCity",flightsDetails[e.value]);
  console.log(cities,"in tocitychnge",flightsDetails[e.value])
}

const swapCities=()=>{
  var fromCity=cities.from;
  var toCity=cities.to;
  console.log(fromCity,toCity)
  setCities((prev)=>({ ...prev, from: toCity, to: fromCity }));
  console.log(cities);
}

const handleFromCityChange=(e)=>{
 e? setCities((prev)=>({...prev,from:flightsDetails[e.value]})) : setCities((prev)=>({...prev,from:''}))
 localStorage.setItem("fromCity",flightsDetails[e.value]);
 console.log(cities,e.value,flightsDetails,"in fromcitychnge",flightsDetails[e.value])
}

const openTraveller=()=>{
setShowTraveller(!showTraveller);
console.log(showTraveller,"showtraveller")
}

const cancel=()=>{

  setTravellerAndClass((prev)=>({
    ...prev,  adults:0, children:0,infants:0,seatClass:'economy'
  }))


}

const changeFlightStatus=async()=>{
  try{
    const res=await fetch(url+"changeFlightStatus",{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${localStorage.getItem("token")}`
      },
      body:JSON.stringify({
        id:statusesId,
        status:selectedStatus,
        date:newDateForFLight,
        userId:localStorage.getItem("userId")


      })
    })

    const resp=await res.json();
    if(resp.error=='Invalid token' || resp.error=='Authentication required'){
      window.location='/login';
     }
    if(resp.Error=='NA'){
console.log("success flight status change");

    }

  }
  catch(err){
    console.log("err",err);
  }
}

const handlePriceSliderChange=(e)=>{
// console.log(e,e.target.value,"handlePriceSliderChange");
let b=searchedFlights.filter((item)=>
 item.fare<=e.target.value
)
setSelectedFilter(true);
setFilteredFlights(b);
// console.log({b});

}
const resetFilter=()=>{
  setSelectedFilter(false);
  setFilteredFlights();
}

const searchFLights=async()=>{
  console.log({dateData},{cities});
  try{
  const response=await fetch(url+"fetchFlights",{
    method:"POST",
    headers:{
      'Content-Type':'application/json',
      'Authorization':`Bearer ${localStorage.getItem("token")}`
    },
    body:JSON.stringify({
      date:dateData.toDate,
      toCity:cities.to,
      fromCity:cities.from,
  })
  })

 

  const resp=await response.json();
  if(resp.error=='Invalid token' || resp.error=='Authentication required'){
    window.location='/login';
   }
  console.log("searchedFlights",resp.Status);
  setSearchedFlights(resp.Status);

  }
  catch(err){
    console.log({err},"searchFlights");
  }
}

const selectClass=(obj)=>{

if(obj=='economy'){
  setTravellerAndClass((prev)=>({...prev,seatClass:'economy'}))
}
if(obj=="premiumEconomy"){
  setTravellerAndClass((prev)=>({...prev,seatClass:'premiumEconomy'}))
}
if(obj=="business"){
  setTravellerAndClass((prev)=>({...prev,seatClass:'business'}))
}
if(obj=="firstClass"){
  setTravellerAndClass((prev)=>({...prev,seatClass:'firstClass'}))
}
console.log(travellerAndClass,"travellerandclass in selectClass")
localStorage.setItem("travellerClass",JSON.stringify(travellerAndClass));
}

const increment=(obj)=>{
  if(obj=='adults'){
    setTravellerAndClass((prev)=>({...prev,adults:prev.adults+1}))
    localStorage.setItem("adults",localStorage.getItem("adults")+1);
  }
  if(obj=='infants'){
    setTravellerAndClass((prev)=>({...prev,infants:prev.infants+1}))
    localStorage.setItem("infants",localStorage.getItem("infants")+1);
  }
  if(obj=='children'){
    setTravellerAndClass((prev)=>({...prev,children:prev.children+1}))
    localStorage.setItem("children",localStorage.getItem("children")+1);
  }
  console.log(travellerAndClass,"travellerandclass in increment")

}

const decrement=(obj)=>{
  if(obj=='adults'){
    setTravellerAndClass((prev)=>({...prev,adults:prev.adults-1}))
    localStorage.setItem("adults",localStorage.getItem("adults")-1);
  }
  if(obj=='infants'){
    setTravellerAndClass((prev)=>({...prev,infants:prev.infants-1}))
    localStorage.setItem("infants",localStorage.getItem("infants")-1);
  }
  if(obj=='children'){
    setTravellerAndClass((prev)=>({...prev,children:prev.children-1}))
    localStorage.setItem("children",localStorage.getItem("children")-1);
  }
  console.log(travellerAndClass,"travellerandclass in decrement")

}

const showBookingPage=()=>{
  setOpenBookingPage(true);
}

const handleChange=(obj,param,e)=>{
  // setFareType(e.target.value);
  // if (obj==="fareType"){
  //   setFareType((prev)=>({regular:!prev.regular,student:!prev.student}));
  //     console.log(fareType,"22");
  //   // if(param=='regular'){
  //   //     setFareType((prev)=>({...prev,regular:!fareType.regular,student:!fareType.student}));
  //   //     console.log(fareType,"11");
  //   // }

  //   // else{
  //   //   setFareType((prev)=>({...prev,regular:!fareType.regular,student:fareType.student}));
  //   //   console.log(fareType,"22");
  //   // }
  // }
  if (obj==="airlinesNames"){

    console.log(param,"param",airlinesNames)
    let m=airlinesNames.map((obj)=>{
    return(
     obj[0]===param ? obj[1]=(!obj[1]) : obj)
   })
  console.log("newState",airlinesNames)
  // setAirlinesNames(airlinesNames);
  //  setAirlinesNames(ns);
  }

}

const handleToDateChange=(e)=>{
  console.log("e",e.target.value)
 e? setDateData((prev)=>({...prev,toDate:e.target.value}))  : setDateData((prev)=>({...prev,toDate:''}));
 localStorage.setItem("date",e.target.value);
 console.log("todate is",dateData.toDate)
}

const handleFromDateChange=(e)=>{
  e? setDateData((prev)=>({...prev,fromDate:e.target.value}))  : setDateData((prev)=>({...prev,fromDate:''}));
  console.log("fromdate is",dateData.fromDate)
}

const customStyles = {
  container: provided => ({
    ...provided,
    width: 280
  })
};

const fetchCitiesData=async()=>{
  try{
    const response=await fetch(url+"fetchCities",{
    headers:{
      'Content-Type':'application/json',
      'Authorization':`Bearer ${localStorage.getItem("token")}`
      
    },
    method:'GET'
    })
    const res=await response.json();
    if(res.error=='Invalid token' || res.error=='Authentication required'){
      window.location='/login';
     }
    var f=res;
    if (res.Error=='No Error'){
      var tempArr=[]
      var obj=res.Status
       var flightData={}
      for(var i=0;i<obj.length;i++){
        var temp={}
        
          temp['label']=obj[i].city;
          var x=[];
          var o={};
          o['label']=obj[i].name
          o['value']=obj[i].name;
          flightData[(obj[i].name).toString()]=obj[i].city;
          // flightData.push(objForFlight);
        //  o['image']='https://www.nseindia.com/market-data/live-equity-market?symbol=NIFTY%2050'
          x.push(o);
          temp['options']=x;
          tempArr.push(temp);
      }
      // console.log(tempArr)
      console.log("flightData",flightData)
      setFlightDetails(flightData);
      setOptionsList(tempArr)
      // console.log("suuccess case")
    }
  }
  catch(e){
    // console.log({e},"inside fetchCities api call")
  }
}



  useEffect(()=>{
    fetchCitiesData()
  },[])


  
  return (
   
    <div>

      <Modal style={{
        left:'30%',right:'30%',height:'60%',
      border:'1px solid blue',backgroundColor:'yellow'}} 
      open={showpopup} >
        <Box>
        <Select
        options={flightStatusOption}
        value={selectedStatus!==''?flightStatusOption.filter((o)=>o.value==selectedStatus).label
        :''}
        onChange={(e)=>{setSelectedStatus(e.value);console.log("kkk",selectedStatus)}}/>
        <TextField
        type="datetime-local"
        placeholder='Enter New Arrival Time'
        value={newDateForFLight.arrival!=''?newDateForFLight.arrival:''}
        onChange={(e)=>{
          setNewDateForFlight((prev)=>({...prev,arrival:e.target.value}));
          // setNewDateForFlight(e.target.value);
          console.log("date is",e.target.value)}}
        disabled={selectedStatus!=='D'}
        />New Arrival Time*

        <TextField
        placeholder='Enter New Departure Time'
        type="datetime-local"
        value={newDateForFLight.departure!=''?newDateForFLight.departure:''}
        onChange={(e)=>{setNewDateForFlight((prev)=>({...prev,departure:e.target.value}));
        console.log("date is",e.target.value)}}
        disabled={selectedStatus!=='D'}
        /> New Departure Time*

        <Button disabled={selectedStatus===''} onClick={()=>{changeFlightStatus()}}>Save</Button>
      <Button disabled={selectedStatus===''} onClick={()=>{setSelectedStatus('');setNewDateForFlight((prev)=>({...prev,departure:'',arrival:''}))}}> Cancel </Button>
      <Button onClick={()=>{setShowpopup(false);setSelectedStatus('');setNewDateForFlight('')}}>Close without saving changes</Button>
        * Mandatory Fields
        </Box>
      </Modal>

       <Box>
      <AppBar position="static">
        <Toolbar sx={{display:'flex', gap:'2rem'}}>
          <Typography variant="h6" component="div" noWrap>
            <Button style={{backgroundColor:'white'}} onClick={()=>{window.location='/viewMyFlights'}}>
              View My Flights
            </Button>
          </Typography>
          <Typography variant="h6" component="div" noWrap>
            <Button style={{backgroundColor:'white'}} onClick={()=>{window.location='/ViewMyProfile'}}> 
            View My Profile
              </Button>
           
          </Typography>
         
          <Typography>
            {localStorage.getItem("userId")!=undefined && localStorage.getItem("token")!=undefined?(
            <Button style={{backgroundColor:'white'}} onClick={()=>{localStorage.removeItem("userId");localStorage.removeItem("token");localStorage.removeItem("authenticated");localStorage.removeItem("canChangeFlightStatus");window.location='/login'}}>  Logout </Button>

            ):(
              <Button style={{backgroundColor:'white'}} onClick={()=>{window.location='/login'}}>Login</Button>
           
            )}
         
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
    
     
    <Typography style={{marginLeft:'12px',marginRight:'12px'}}>

            <Typography>
       
              <Typography style={{display:'flex',flexDirection:'row',columnGap:'45px',marginLeft:'70px'}}>
              <Select
                    options={optionsList}
                    isClearable
                    isSearchable
                    styles={customStyles}
                    // value={cities.from}
                    // inputValue={cities.from}
                    onChange={(e)=>handleFromCityChange(e)}
                />     
               
                <input type="date"
                  value={dateData.toDate}
                  dateFormat={"y-MM-dd"}
                  style={{width:'200px'}}
                  onChange={(e)=>{{handleToDateChange(e)} }}
                  
                  />
                <div>
                  <Button onClick={()=>swapCities()}>
                  &#8644;
                  </Button>
                </div>  
                <Select
                    options={optionsList}
                    isClearable
                    isSearchable
                    styles={customStyles}
                    // value={cities.to}
                    // inputValue={cities.to}
                    onChange={(e)=>handleToCityChange(e)}
                />   
                
                  {/* <input type="date"
                  value={dateData.fromDate}
                  dateFormat={"y-MM-dd"}
                  style={{width:'200px'}}
                  onChange={(e)=>{{handleFromDateChange(e)} }}
                  
                  /> */}
              
                Select a Fare Type: 
                {/* Regular
                <div style={{display:'flex',flexDirection:'row'}}>
                <Checkbox
              
                checked={fareType.regular}
                style={{borderRadius:'5px'}}
                onClick={(e)=>{handleChange("fareType","regular",e)}}
                />
                Student
                <Checkbox
              
                checked={fareType.student}
                style={{borderRadius:'5px'}}
                onClick={(e)=>{handleChange("fareType","student",e)}}
                /> */}
                {/* </div> */}
                {/* <FormControl> */}

                {/* <FormLabel id="demo-controlled-radio-buttons-group">Fare Category</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={value}
                  onChange={()=>{handleChange(e)}}
                >
                  <FormControlLabel value="Student" control={<Radio />} label="Student" />
                  <FormControlLabel value="Armed Forces" control={<Radio />} label="Armed Forces" />
                  <FormControlLabel value="Senior Citizen" control={<Radio />} label="Senior Citizen" />
                  <FormControlLabel value="Regular" control={<Radio />} label="Regular" />
                  <FormControlLabel value="Doctors" control={<Radio />} label="Doctors" />
                  <FormControlLabel value="Extra Seat" control={<Radio />} label="Extra Seat" />
                </RadioGroup>
              </FormControl> */}

                </Typography>
            
              
                <div style={{marginRight:'90px'}}>
              
                </div>
                <div onClick={()=>{openTraveller()}} style={{border:'1px solid blue',width:'580px',marginLeft:'460px'}}>
                  <div 
                  // style={{width:'518px'}}
                  >
                        Traveller and Class
                        {travellerAndClass.adults>0?(" "+travellerAndClass.adults+" Adults "):(null)}
                        {travellerAndClass.infants>0?(", "+travellerAndClass.infants +" Infants "):(null)}
                        {travellerAndClass.children>0?(", "+travellerAndClass.children +" Children "):(null)}
                        <div style={{fontSize:'13px',fontWeight:'bold',color:'#3D83DC'}}>
                        {travellerAndClass.business?("Business"):(null)}
                        {travellerAndClass.economy?("Economy"):(null)}
                        {travellerAndClass.firstClass?("First Class"):(null)}
                        {travellerAndClass.premiumEconomy?("Premium Economy"):(null)}
                        </div>
                  </div>
                </div>
                {showTraveller?(
                  <div>

                  <div style={{display:'flex',flexDirection:'row',marginLeft:'550px'}}>
                  
                          <div>
                              <div style={{backgroundColor:'#BDC8E3',borderRadius:'10px',display:'flex',alignItems:'center',flexDirection:'column'}}>
                              Adults
                              <div >
                              <Button onClick={()=>increment('adults')} style={{borderRadius:'10px'}}>+</Button>
                              <Button onClick={()=>decrement('adults')} disabled={travellerAndClass.adults===0} style={{borderRadius:'10px'}}>-</Button>
                              </div>
                              </div>
                          </div>
                          <div>
                              <div  style={{backgroundColor:'pink',borderRadius:'10px',display:'flex',alignItems:'center',flexDirection:'column'}}>
                              Infants
                              <div >
                              <Button onClick={()=>increment('infants')} style={{borderRadius:'10px'}}>+</Button>
                              <Button onClick={()=>decrement('infants')} disabled={travellerAndClass.infants===0} style={{borderRadius:'10px'}}>-</Button>
                              </div>
                              </div>
                          </div>
                          <div>
                              <div  style={{backgroundColor:'#BDC8E3',borderRadius:'10px',display:'flex',alignItems:'center',flexDirection:'column'}}>
                              Children 
                              <div >
                              <Button onClick={()=>increment('children')} style={{borderRadius:'10px'}}>+</Button>
                              <Button onClick={()=>decrement('children')} disabled={travellerAndClass.children===0} style={{borderRadius:'10px'}}>-</Button>
                              </div>
                              </div>
                          </div>
                  </div>
                <div style={{display:'flex',flexDirection:'row',marginLeft:'465px'}}>
                    <div style={{display:'flex',alignItems:'center',flexDirection:'column'}}>
                      Travel Class
                            <div style={{display:'flex',alignItems:'center',flexDirection:'row'}}>
                                  <div onClick={()=>{selectClass('economy')}} style={{border:'5px solid purple',width:'120px',borderRadius:'13px',height:'28px',display:'flex',justifyContent:'center',backgroundColor:travellerAndClass.economy?'skyblue':'white'}}> Economy </div>
                                  <div onClick={()=>{selectClass('premiumEconomy')}} style={{border:'5px solid purple',width:'180px',borderRadius:'13px',height:'28px',display:'flex',justifyContent:'center',backgroundColor:travellerAndClass.premiumEconomy?'skyblue':'white'}}> Premium Economy </div>
                                  <div onClick={()=>{selectClass('firstClass')}} style={{border:'5px solid purple',width:'120px',borderRadius:'13px',height:'28px',display:'flex',justifyContent:'center',backgroundColor:travellerAndClass.firstClass?'skyblue':'white'}}> First Class </div>
                                  <div onClick={()=>{selectClass('business')}} style={{border:'5px solid purple',width:'120px',borderRadius:'13px',height:'28px',display:'flex',justifyContent:'center',backgroundColor:travellerAndClass.business?'skyblue':'white'}}> Business </div>
                            </div>
                      </div>
                  </div>

                  {/* <div style={{display:'flex',flexDirection:'row'}}>
                      <Button onClick={()=>{cancel()}}> Cancel </Button>
                  </div>
      */}



                  </div>
                ):(null)}
              
            </Typography>

       </Typography>
    
    <Typography style={{display:'flex',flexDirection:'row',marginLeft:'680px'}}>
      <Button style={{backgroundColor:'lightblue'}} onClick={()=>{searchFLights()}}>
      Search Flights
      </Button>
    </Typography>

      <Typography style={{backgroundColor:'white',marginRight:'55px',marginLeft:'10px',display:'flex',gap:'60px'}}>
        <div 
        style={{flexGrow:1}}
        // style={{width:'60px'}}
        >
          <img src='https://gos3.ibcdn.com/goSSafe-1644905405.png' alt="image" style={{height:'100px',width:'100%'}}></img>
        </div>
        <div 
          style={{flexGrow:8}}
        // style={{width:'750px'}}
        >

       <h2><strong>International Guidelines</strong></h2> 
       <span style={{fontSize:'15px'}}>COVID safety measures adopted by various countries including VISA restrictions, quarantine rules, etc.</span>
        </div>
        
      </Typography>

      {searchedFlights?(
      <Typography style={{display:'flex',marginTop:'20px'}}>
            <Typography style={{marginRight:'50px',marginLeft:'12px',width:'400px',backgroundColor:'white'}}>
              Filters All
              <p style={{fontSize:'12px'}}>showing {searchedFlights.length}</p>
                <Card style={{backgroundColor:'white',marginBottom:'20px',margin:0}}>
                <div>Departure</div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'400px',marginLeft:'12px'}}>
                <div style={{backgroundColor:'#C8CACF',marginRight:'8px'}}> Before 6AM </div>
                <div style={{backgroundColor:'#C8CACF',marginRight:'8px'}}> 6AM-12PM </div>
                </div>
                <div style={{display:'flex',marginTop:'5px',alignItems:'center',justifyContent:'center',width:'400px',marginLeft:'2.5px'}}>
                <div style={{backgroundColor:'#C8CACF',marginRight:'8px'}}> 12PM-6PM </div>
                <div style={{backgroundColor:'#C8CACF',marginRight:'8px'}}> After 6PM </div>
                </div>
                </Card>
                <Card style={{marginTop:'65px'}}>
                  Price
                  {console.log("pricesValues222",pricesValues)}
                  {/* {console.log("p[0]",pricesValues,pricesValues[0],"pp",pricesValues[pricesValues.length-1])} */}
                <Slider min={pricesValues!=undefined && Number(pricesValues[pricesValues.length-1])}  max={pricesValues!=undefined && Number(pricesValues[0])}  valueLabelDisplay="auto"
   onChange={(e)=>{handlePriceSliderChange(e)}}  /> 
                  <Button onClick={()=>{resetFilter()}}>Clear</Button>

                </Card>
                <Card style={{marginTop:'65px'}}>
                  Onward Duration
                  <Slider  min={pricesValues!=undefined && Number(pricesValues[pricesValues.length-1])} max={pricesValues!=undefined && Number(pricesValues[0])} valueLabelDisplay="auto" />
                </Card>
              <Typography style={{marginRight:'35px'}}>
                Preferred Airlines
                {console.log("airlinesNames88",airlinesNames)}
                  {airlinesNames!=undefined  && airlinesNames.map((item)=>{
                    return(
                    <div>
                       <Checkbox
              
                        checked={item[1]}
                        style={{borderRadius:'5px'}}
                        onClick={(e)=>{handleChange("airlinesNames",item[0],e)}}
                        />
                       {item}

                    </div>)
                  })}
              </Typography>
              
              <Typography>

              </Typography>
            </Typography>


            <Typography>
          {console.log("rrr",searchedFlights)}
          {searchedFlights && !selectedFilter ?(

            <div>
              {searchedFlights && searchedFlights.map((obj)=>{
                return(
                  <div key={obj._id} >
                        {console.log("obj",obj)}
                        <Card style={{width:'1000px',height:'110px',display:'flex',alignItems:'center',justifyContent:'center',marginTop:'5px',backgroundColor:'#D8DAE1'}}>
                          <CardContent style={{display:'flex',flexDirection:'row',width:'100%',gap:'20px',marginLeft:'60px'}}>
                         
                            <Typography style={{backgroundColor:'pink'}}>
                              <div>
                              <span style={{fontSize:'10px',marginLeft:'80px'}}>{obj.airportId.code} {obj.fromCity}</span>
                              </div>
                              <div>
                            {new Date(obj.departureTime).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})}
                            </div>
                            </Typography>
                           
                            <Typography style={{backgroundColor:'red'}}>
                            <div>
                              <span style={{fontSize:'10px',marginLeft:'80px'}}>{obj.toCity}</span>
                              </div>
                              <div>
                                {console.log("obj is",obj)}
                              {new Date(obj.arrivalTime).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})}
                              </div>
                            </Typography>
                            <Typography style={{backgroundColor:'purple'}}>
                            <div>
                              <span style={{fontSize:'10px',marginLeft:'80px'}}>{obj.fromCity} - {obj.toCity}</span>
                              </div>
                              <div>
                              {new Date(obj.arrivalTime)-new Date(obj.departureTime).getHours()} Hours
                              {new Date(obj.arrivalTime)-new Date(obj.departureTime).getMinutes()} Minutes
                              {new Date(obj.arrivalTime)-new Date(obj.departureTime).getSeconds()} Seconds
                              </div>
                            </Typography>
                            <Typography style={{}}>
                            <div>
                              <span style={{fontSize:'10px',marginLeft:'50px'}}></span>
                              </div>
                              <div style={{marginLeft:'15px',backgroundColor:'lightseagreen'}}>
                              <strong>₹{obj.fare}</strong>
                             </div>
                            </Typography>
                            <Typography style={{}}>
                              <div style={{marginTop:'16px'}}>
                                {localStorage.getItem("canChangeFlightStatus")==="true"?(
                                  
                                    <Button onClick={()=>{setStatusesId(obj._id);setShowpopup(true)}}> Change Status</Button>                                                                
                                

                                  
                                ):(
                                  <Button style={{backgroundColor:'lightcoral'}}>
                                  <Link to={"/bookingStart"}state={{ id: obj._id,travellerAndClass:travellerAndClass,airlineName:obj.airlineId.name,airlineId:obj.airlineId._id,fare:obj.fare }}>Book Now</Link>
                                
                               
                                  </Button>
                                )}

                             
                              </div>
                          
                            </Typography>
                          </CardContent>
                    
                        </Card>
                  </div>
                )
              })}
            </div>

          ):selectedFilter?(
            <div>
              {filteredFLights.map((obj)=>{
                return(
                  <div key={obj._id}>
                  {console.log("obj",obj)}
                  <Card style={{width:'1000px',height:'110px',display:'flex',alignItems:'center',justifyContent:'center',marginTop:'5px',backgroundColor:'#D8DAE1'}}>
                    <CardContent style={{display:'flex',flexDirection:'row',width:'100%',gap:'20px'}}>
                   
                      <Typography style={{backgroundColor:'pink'}}>
                        <div>
                        <span style={{fontSize:'10px',marginLeft:'80px'}}>{obj.code} {obj.fromCity}</span>
                        </div>
                        <div>
                      {obj.arrivalTime}
                      </div>
                      </Typography>
                     
                      <Typography style={{backgroundColor:'red'}}>
                      <div>
                        <span style={{fontSize:'10px',marginLeft:'80px'}}>{obj.toCity}</span>
                        </div>
                        <div>
                        {new Date(obj.departureTime).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})}
                        </div>
                      </Typography>
                      <Typography style={{backgroundColor:'aquamarine'}}>
                      <div>
                        <span style={{fontSize:'10px',marginLeft:'80px'}}>{obj.fromCity} - {obj.toCity}</span>
                        </div>
                        <div>
                        {new Date(new Date(obj.arrivalTime)-new Date(obj.departureTime)).getHours()} Hours
                        {new Date(new Date(obj.arrivalTime)-new Date(obj.departureTime)).getMinutes()} Minutes
                        {new Date(new Date(obj.arrivalTime)-new Date(obj.departureTime)).getSeconds()} Seconds
                        </div>
                      </Typography>
                      <Typography style={{backgroundColor:'red'}}>
                      <div>
                        <span style={{fontSize:'10px',marginLeft:'80px'}}></span>
                        </div>
                        <div style={{marginLeft:'15px'}}>
                        <strong>₹{obj.fare}</strong>
                       </div>
                      </Typography>
                      <Typography style={{}}>
                        <div style={{marginTop:'16px'}}>
                        <Button style={{backgroundColor:'lightcoral'}}>Book</Button> 
                        </div>
                      </Typography>

                    </CardContent>
                   
                    
                  </Card>
            </div>
                  // <div key={obj._id}>
                  //       {console.log("obj",obj)}
                  //       {/* <Typography> Airline Name: {obj.airlineName}</Typography>
                  //       <Typography> arrivalTime: {obj.arrivalTime}</Typography>
                  //       <Typography>  city: {obj.city}</Typography>
                  //       <Typography> departureTime: {obj.departureTime}</Typography>
                  //       <Typography>   fromCity: {obj.fromCity}</Typography>
                  //       <Typography> name: {obj.name}</Typography>
                  //       <Typography> numberOfSeats: {obj.numberOfSeats}</Typography>
                  //       <Typography>  state: {obj.state}</Typography>
                  //       <Typography>toCity: {obj.toCity} </Typography> */}

                  //       <Card style={{width:'500px',display:'flex',alignItems:'center',justifyContent:'center',marginTop:'5px',backgroundColor:'#5A8DEC'}}>
                  //         <CardContent>
                  //           <Typography>
                  //           {obj.arrivalTime}
                  //           </Typography>
                  //           {obj.code}
                  //           <Typography>
                  //             {obj.departureTime}
                  //             {/* {obj.departureTime.getHours()-obj.arrivalTime.getHours()} */}
                  //           </Typography>
                  //           <Typography>
                  //             {new Date(new Date(obj.arrivalTime)-new Date(obj.departureTime)).getHours()} Hours
                  //             {new Date(new Date(obj.arrivalTime)-new Date(obj.departureTime)).getMinutes()} Minutes
                  //             {new Date(new Date(obj.arrivalTime)-new Date(obj.departureTime)).getSeconds()} Seconds
                  //           </Typography>

                  //         </CardContent>
                  //       </Card>
                  // </div>
                )
              })}
            </div>
          ):('Sorry No flights Found! Please search for other time')}
            </Typography>
    
      </Typography>):(null)}
    </div>
    
  )
}

export default Landing

