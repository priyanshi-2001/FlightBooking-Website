import React from 'react'
import {useState,useEffect} from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { FormControl,FormLabel,FormControlLabel,RadioGroup,Radio, TextField } from '@mui/material';
import 'react-loading-skeleton/dist/skeleton.css'
import { useLocation } from 'react-router-dom';
const url='http://localhost:8000/';
const DetailsFillingForm = (props) => {
    console.log("props",props);
    const[fromLocal,setFromLocal]=useState(false);
    const airlineName=useLocation().state.airlineName;
    const[details,setDetails]=useState([{
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
        flightId:props.stateParams,
        // occupation:props.travellerAndClass,
        fareCategory:'',
        airlineName:airlineName,
        weight:0,
        foodBooked:'',
        foodPrice:'',
        extraWeightPrice:'',
        ticketPrice:'',
        cpdId:'',
        food:'',
        foodCost:'',
        userId:localStorage.getItem("userId")
       }])

       useEffect(()=>{
       if(localStorage.getItem("filledInfoForPassDetails")!==null && localStorage.getItem("filledInfoForPassDetails")!==undefined){
        setDetails(JSON.parse(localStorage.getItem("filledInfoForPassDetails")));
        setFromLocal(true);
       }
       },[])
      // const[fareCategory,setFareCategory]=useState(props.fareCategory);

    // const[finalDetails,setFinalDetails]=useState([]);
    // const handleFinalDetails=()=>{
    //     let g=[];
    //     // {finalDetails!==[] ? (g.push(finalDetails)) :(null)};
    //     // console.log("finalDetails",finalDetails)
    //     // if(finalDetails!==[]){g.push(finalDetails);}
    //     // console.log("details".details)
    //     // g.push(details);
    //     // console.log({g});
    //     console.log({details})
    //     let tempObj=[];
    //     if(finalDetails!==[]){
    //         console.log("here11");
    //     tempObj.push(finalDetails);
    //     }
    //     tempObj.push(details);
    //     setFinalDetails((prev)=>[...prev,{details}]);
    //     console.log({finalDetails},"finaldetails",{tempObj});
    //     props.details(finalDetails);
        
    // }
    const handleFinalDetails=()=>{
        console.log("props33",props);
        // localStorage.setItem("filledInfoForPassDetails",JSON.stringify(details));
        props.details(details);
       
    }

    const handleChange=(e,i)=>{
        const{name,value}=e.target;
        const tempObj=[...details];
        tempObj[i][name]=value;
        setDetails(tempObj);
        console.log(details,"details");
       
    }

    const removePassenger=(i)=>{
       
        const tempObj=[...details];
       
        tempObj.splice(i,1);
        
        setDetails(tempObj);
        console.log(details,"deletion")
    }

    const handleAddPassenger=()=>{
        setDetails([...details,
           {fname:'',address:'',age:'',country:'',email:'',flightId:props.stateParams,gender:'',
           lname:'',mobileNo:'',occupation:'',airlineName:airlineName,weight:0,foodBooked:'',
           foodPrice:'',
           extraWeightPrice:'',
           ticketPrice:'',
           cpdId:'', food:'',
           foodCost:'',userId:localStorage.getItem("userId")}
        ]);
        console.log("addition in detailsfillingform comp",details);
    }

  return (
    <div>
      {console.log("details inside ff",details)}
        {details.map((x,i)=>{
            return(
           <div>
              <Card key={i}>
                    <CardHeader> &#xf3e0; Adult {i} </CardHeader>
                    <CardContent>
                      <Typography>
                     
                        <div>
                        <label>Adult Name
                       
                          <input type="text" placeholder='First and Middle Name' name='fname' value={details[i].fname} onChange={(e)=>handleChange(e,i)}/>
                          <input type="text" placeholder='Last Name'  name='lname' value={details[i].lname} onChange={(e)=>handleChange(e,i)}/>
  
                        </label>
                        </div>
                        <div>
                        <label> Enter your age:
                        <input type="number" name='age'  value={details[i].age} onChange={(e)=>handleChange(e,i)} />
                        </label>
                        </div>
                        <div>
                        <label> Enter your Mobile Number:
                        <input type="number" name='mobileNo'value={details[i].mobileNo}  onChange={(e)=>handleChange(e,i)} />
                        </label>
                        </div>
                        <div>
                        <label> Enter your Email Id:
                        <input type="email"  name='email' value={details[i].email} onChange={(e)=>handleChange(e,i)}/>
                        </label>
                        </div>
                        <div> 
                          
                           <FormControl>

                      <FormLabel id="demo-controlled-radio-buttons-group"> Select Gender</FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="gender"
                        // value={value}
                        row
                        onChange={(e)=>{handleChange(e,i)}}
                      >
                        <FormControlLabel value="male" checked={details[i].gender=="male"} control={<Radio />} label="Male" />
                        <FormControlLabel value="female" checked={details[i].gender=="female"} control={<Radio />} label="Female" />
                      
                      </RadioGroup>
                      </FormControl> 
                      {/* <label for='Male'>Male</label>
                      <input type="radio" id="Male" name="gender" value="male" checked={details[i].gender=="male"} onChange={(e)=>handleChange(e,i)}/>
                      <label for='Female'>Female</label>
                      <input type="radio" id="Female" name="gender" value="female" checked={details[i].gender=="female"} onChange={(e)=>handleChange(e,i)}/><br/>  
                         */}
                        </div>
                        {/* <div>
                        <label> Enter your Occupation:
                        <input type="text" name='occupation' onChange={(e)=>handleChange(e,i)} />
                        </label>
                        </div> */}
                        <div>
                        <label> Enter your Address:
                        <input type="text" name='address' value={details[i].address} onChange={(e)=>handleChange(e,i)}/>
                        </label>
                        </div>
                        <div>
                          <FormControl>

                          <FormLabel id="demo-controlled-radio-buttons-group">Fare Category</FormLabel>
                          <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="fareCategory"
                            // value={value}
                            row
                            onChange={(e)=>{handleChange(e,i)}}
                          >
                            <FormControlLabel value="S" checked={details[i].fareCategory=="S"} control={<Radio />} label="Student" />
                            <FormControlLabel value="A" checked={details[i].fareCategory=="A"} control={<Radio />} label="Armed Forces" />
                            <FormControlLabel value="SC" checked={details[i].fareCategory=="SC"} control={<Radio />} label="Senior Citizen" />
                            <FormControlLabel value="R" checked={details[i].fareCategory=="R"} control={<Radio />} label="Regular" />
                            <FormControlLabel value="D" checked={details[i].fareCategory=="D"} control={<Radio />} label="Doctors" />
                            <FormControlLabel value="E" checked={details[i].fareCategory=="E"} control={<Radio />} label="Extra Seat" />
                          </RadioGroup>
                        </FormControl> 
                        </div>
                        <div>
                          <FormControl>

                          <FormLabel id="demo-controlled-radio-buttons-group">Seat Class</FormLabel>
                          <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="seatClass"
                            // value={value}
                            row
                            onChange={(e)=>{handleChange(e,i)}}
                          >
                            <FormControlLabel value="B"  checked={details[i].seatClass=="B"} control={<Radio />} label="Business" />
                            <FormControlLabel value="E" checked={details[i].seatClass=="E"} control={<Radio />} label="Economy" />
                            <FormControlLabel value="EP" checked={details[i].seatClass=="EP"} control={<Radio />} label="Economy Premium" />
                           
                          </RadioGroup>
                        </FormControl> 
                        </div>
                        <div>
                          <FormControl>

                          <FormLabel id="demo-controlled-radio-buttons-group">Occupation Category</FormLabel>
                          <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="occupation"
                            // value={value}
                            row
                            onChange={(e)=>{handleChange(e,i)}}
                          >
                            <FormControlLabel value="Medical" checked={details[i].occupation=="Medical"} control={<Radio />} label="Medical" />
                            <FormControlLabel value="Pilot" checked={details[i].occupation=="Pilot"} control={<Radio />} label="Pilot" />
                            <FormControlLabel value="Teacher" checked={details[i].occupation=="Teacher"} control={<Radio />} label="Teacher" />
                            <FormControlLabel value="Finances" checked={details[i].occupation=="Finances"} control={<Radio />} label="Finances" />
                            <FormControlLabel value="Banking" checked={details[i].occupation=="Banking"} control={<Radio />} label="Banking" />
                            <FormControlLabel value="Civil Engineer" checked={details[i].occupation=="Civil Engineer"} control={<Radio />} label="Civil Engineer" />
                            <FormControlLabel value="Software Engineer" checked={details[i].occupation=="Software Engineer"} control={<Radio />} label="Software Engineer" />
                            <FormControlLabel value="Business Owner" checked={details[i].occupation=="Business Owner"} control={<Radio />} label="Business Owner" />
                            <FormControlLabel value="Freelancer" checked={details[i].occupation=="Freelancer"} control={<Radio />} label="Freelancer" />
                            <FormControlLabel value="Sports" checked={details[i].occupation=="Sports"} control={<Radio />} label="Sports" />
                           
                          </RadioGroup>
                        </FormControl> 
                        </div>
                        <div>
                        {props.countries.length>0?(
                        <label> Nationality:
                        <select>
                         
                          
                              {props.countries.map((obj)=>{
                           
                            <option value={obj}>{obj}</option>
                            
                          })}
                          
                        
                          
                        </select>
                        </label>  ):(null)}


                        {details.length!==1 &&
                            <Button onClick={()=>removePassenger(i)}>Remove</Button>
                        }
                        {
                            details.length-1===i &&
                            <Button onClick={()=>{handleAddPassenger()}}>Add Passenger</Button>
                            
                        }
                        </div>
                        
                     
                    

                      </Typography>
                    </CardContent>

                 
              </Card>

           </div>
            )
            })}
   
   
    <Button onClick={()=>{handleFinalDetails()}}>Confirm</Button>


    </div>
  )
}

export default DetailsFillingForm
