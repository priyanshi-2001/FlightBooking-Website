import React from 'react'
import{ useState,useEffect} from "react";
import { useLocation } from 'react-router-dom';
// import { MenuItem, Select } from '@mui/material';
import Select from 'react-select'
import { Button ,TextField} from '@mui/material';
import {Card,CardHeader,CardContent} from '@mui/material';
const url='http://localhost:8000/';
const FoodAddOn = () => {
  const params=window.location.search;
  const urlParams=new URLSearchParams(params);
  const listOfIds=urlParams.get("listOfIds");//these are CFDIds coming from baggageAdOn
  console.log("listOfIds in food page",listOfIds)
  window.history.replaceState({}, document.title, "/" + "foodDetails");
  const data=JSON.parse(localStorage.getItem('filledInfoForPassDetails'));
  const[details,setDetails]=useState(data);
  const foodData=JSON.parse(localStorage.getItem('food'));
  const[quantity,setQuantity]=useState();
  useEffect(()=>{
    if(localStorage.getItem("token")==undefined){
      window.location='/login';
     }
     var tempObjFood=[];
     for(let y=0;y<foodData.length;y++){
     tempObjFood.push({key:foodData[y].name,value:'',category:foodData[y].category})
     }
     setQuantity(tempObjFood);
     console.log("quntity in useEff",tempObjFood);
  },[])
  const foodOptions = [
    {
      key: 'Burger',
      category:'V',
      image:'https://shorturl.at/oACEJ'
    },
    {
      key: 'Burger',
      category:'N',
      image:'https://shorturl.at/fjGW5'
    },
    {
      key: 'Pizza',
      category:'N',
      image:'https://shorturl.at/hENPS'
     
    },
    {
      key: 'Pizza',
      category:'V',
      image:'https://shorturl.at/aoZ36'
    },
    {
      key: 'Fried Rice',
      category:'V',
      image:'https://shorturl.at/gnvK0'
     
    },
    {
      key: 'Fried Rice',
      category:'N',
      image:'https://shorturl.at/CEIUW'
    },
  ]
  
  const handleSelection=(e,i)=>{
    console.log("e",e,"pp",e.key);
    var tempDetails=[...details];
    tempDetails[i]['foodBooked']=e.key;
    tempDetails[i]['foodPrice']=foodData.find(o=>o.name==e.key).price;
    console.log("i",i,"details is",tempDetails);
    setDetails(tempDetails);
  }

  // const handleChangePrice=(e,i)=>{
  //   console.log("e",e,"i",i,"target",e.target);
  //   var tempDetails=[...details];
  //   tempDetails[i][e.target.name]=e.target.value;
  //   setDetails(tempDetails);
  // }
 
  const handleSaveFoodPrices=async(e)=>{
    localStorage.setItem('filledInfoForPassDetails',JSON.stringify(details));
    const resp=await fetch(url+"saveFoodData",{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${localStorage.getItem("token")}`
      },
      body:JSON.stringify({
        data:details
      })
    })
    const response=await resp.json();
    console.log("ppp",resp);
    if(response.error=='Invalid token' || response.error=='Authentication required'){
      window.location='/login';
     }

    
  }

  const handleProceedToSeatPage=()=>{

    window.location.href='/seatSelectionPage'
  }

  return (
    <div>
      Select Food Options:-
        {details && details.map((obj,i)=>{
          return(
            <div>
              <Card>
                 <div>{obj.fname} &nbsp; {obj.lname}</div>
              <CardContent>
              <div>
                    <div style={{width:'200px'}}>
                    <Select
                      // value={passenger.nationality}
                      name="foodBooked"
                      menuPlacement="auto"
                      menuPosition="fixed"
                      options={foodOptions}
                      isClearable
                      formatOptionLabel={obj => (
                        <div className="country-option">
                          <img src={obj.image}  height={120} width={120} />
                          <div>{obj.key}     {obj.category=='N'?'Non - Veg' :'Veg'}</div>
                          <div>Price:- ₹ {foodData.find(o=>o.name==obj.key).price}</div>
                        </div>
                      )}
                      onChange={(e)=>{handleSelection(e,i)}}
                    />  
                    </div>
                    <div>

                    {/* <TextField id="outlined-basic" type='number' size='small' value={details[i].} variant="outlined" name="foodPrice" onChange={(e)=>{handleChangePrice(e,i)}}/> */}
                    </div>

              </div>
                </CardContent>

             </Card>
            </div>
  )
})} 

      {/* {console.log("food options in return ",foodOptions)}
      <div style={{display:'flex', flexWrap: 'wrap'}}> 
      {
        foodOptions.map((obj,i)=>{
          return(
          <div style={{width: '33%',gap:'5px'}}>
            <div>
              <img src={obj.image} height={300} width={350}/>
             
            </div>
            <div style={{display:'flex',flexDirection:'row'}}>
           <div style={{marginLeft:'45px'}}> {obj.category=='N'?'Non - Veg' :'Veg'} {obj.key} </div>
            <div style={{marginLeft:'10px'}}>Price:- ₹ {foodData.find(o=>o.name==obj.key).price}</div>
            </div>
            <div>
              <Button onClick={(e)=>{handleIncrement(e)}}>+</Button>{} <Button onClick={(e)=>{handleDecrement(e)}}>-</Button>
            </div>
          </div>
          )

        })
      }
      </div> */}

      <Button onClick={(e)=>{handleSaveFoodPrices(e)}}>Save Details</Button>
      <Button onClick={()=>{handleProceedToSeatPage()}}>Proceed</Button>

    </div>
  )
}

export default FoodAddOn
