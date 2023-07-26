import{ React,useState,useEffect} from 'react'
import { Card,CardHeader,CardContent,Button,FormControl,Radio,RadioGroup,FormLabel,FormControlLabel,Typography } from '@mui/material';
const url="http://localhost:8000/"
const ReviewDetails = () => {
    const data=JSON.parse(localStorage.getItem("filledInfoForPassDetails"));
    const[details,setDetails]=useState(data);
    // console.log("pp",localStorage.getItem("filledInfoForPassDetails"));
    const [edit,setEdit]=useState(true);
    const[valuesChanged,setValuesChanged]=useState([]);
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
        
        // localStorage.setItem("filledInfoForPassDetails",JSON.stringify(details));
       
       
    }

    const handleChange=(e,i)=>{
        let tempValueChanged=[...valuesChanged];
        tempValueChanged.push(e.target.name);

        setValuesChanged(Array.from(new Set(tempValueChanged)));
        console.log("tempValueChanged",valuesChanged,"name",e.target.name,"value",e.target.value);
        const tempDetails=[...details];
        tempDetails[i][e.target.name]=e.target.value;
        setDetails(tempDetails);
        console.log("tempDetails",tempDetails,"--------------")
        

       
       
    }

    const removePassenger=(i)=>{
       
       
    }

    const handleAddPassenger=()=>{
      
    }

    const handleEdit=()=>{
        setEdit(false);
    }

    const handleSave=async()=>{
        try{
        const response=await fetch(url+"saveEditedDetails",{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${localStorage.getItem("token")}`
            },
            body:JSON.stringify({
                data:details,
                valueEdited:valuesChanged
            })
        })

        const resp=await response.json();
        if(resp.error=='Invalid token' || resp.error=='Authentication required'){
          window.location='/login';
         }
        if(resp.Error=='NA'){
            setEdit(true);
        }
        else{
            
        }
    }
    catch(err){
        console.log("err",err);
    }
    }
   const handleNextPage=()=>{
    window.location.href='/paymentPage'
   }

  return (

    <div>
        Passenger Details
        {
            details.map((obj,i)=>{
                return(
                    <div>
                          <div>
              <Card key={i}>
                    <CardHeader> &#xf3e0; Adult {i} </CardHeader>
                    <CardContent>
                      <Typography>
                     
                        <div>
                        <label>Adult Name
                       
                          <input type="text" disabled={edit}  placeholder='First and Middle Name' name='fname' defaultValue={details[i].fname} onChange={(e)=>handleChange(e,i)}/>
                          <input type="text" disabled={edit}  placeholder='Last Name'  name='lname' defaultValue={details[i].lname} onChange={(e)=>handleChange(e,i)}/>
  
                        </label>
                        </div>
                        <div>
                        <label>  Age:
                        <input type="number" name='age' disabled={edit}  defaultValue={details[i].age} onChange={(e)=>handleChange(e,i)} />
                        </label>
                        </div>
                        <div>
                        <label>  Mobile Number:
                        <input type="number" name='mobileNo' disabled={edit}  defaultValue={details[i].mobileNo}  onChange={(e)=>handleChange(e,i)} />
                        </label>
                        </div>
                        <div>
                        <label>  Email Id:
                        <input type="email"  name='email' disabled={edit}  defaultValue={details[i].email} onChange={(e)=>handleChange(e,i)}/>
                        </label>
                        </div>
                        <div> 
                          
                           <FormControl>

                      <FormLabel id="demo-controlled-radio-buttons-group">  Gender</FormLabel> {details[i].gender}
                     {!edit? <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="gender"
                        disabled={edit} 
                        // value={value}
                        row
                        onChange={(e)=>{handleChange(e,i)}}
                      >
                        <FormControlLabel value="male" defaultChecked={details[i].gender=="male"} control={<Radio />} label="Male" />
                        <FormControlLabel value="female" defaultChecked={details[i].gender=="female"} control={<Radio />} label="Female" />
                      
                      </RadioGroup> :(null) }
                      </FormControl> 
                      {/* <label for='Male'>Male</label>
                      <input type="radio" id="Male" name="gender" value="male" checked={details[i].gender=="male"} onChange={(e)=>handleChange(e,i)}/>
                      <label for='Female'>Female</label>
                      <input type="radio" id="Female" name="gender" value="female" checked={details[i].gender=="female"} onChange={(e)=>handleChange(e,i)}/><br/>  
                         */}
                        </div>
                        {/* <div>
                        <label>  Occupation:
                        <input type="text" name='occupation' onChange={(e)=>handleChange(e,i)} />
                        </label>
                        </div> */}
                        <div>
                        <label>  Address:
                        <input type="text" name='address' disabled={edit}  defaultValue={details[i].address} onChange={(e)=>handleChange(e,i)}/>
                        </label>
                        </div>
                        <div>
                          <FormControl>

                          <FormLabel id="demo-controlled-radio-buttons-group">Fare Category</FormLabel> {fareCategoryMap.get(details[i].fareCategory)}
                          {!edit?<RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="fareCategory"
                            // value={value}
                            disabled={edit} 
                            row
                            onChange={(e)=>{handleChange(e,i)}}
                          >
                            <FormControlLabel value="S" checked={details[i].fareCategory=="S"} defaultChecked={details[i].fareCategory=="S"}  control={<Radio />} label="Student" />
                            <FormControlLabel value="A" checked={details[i].fareCategory=="A"} defaultChecked={details[i].fareCategory=="A"} control={<Radio />} label="Armed Forces" />
                            <FormControlLabel value="SC" checked={details[i].fareCategory=="SC"} defaultChecked={details[i].fareCategory=="SC"} control={<Radio />} label="Senior Citizen" />
                            <FormControlLabel value="R" checked={details[i].fareCategory=="R"} defaultChecked={details[i].fareCategory=="R"} control={<Radio />} label="Regular" />
                            <FormControlLabel value="D" checked={details[i].fareCategory=="D"} defaultChecked={details[i].fareCategory=="D"} control={<Radio />} label="Doctors" />
                            <FormControlLabel value="E" checked={details[i].fareCategory=="E"} defaultChecked={details[i].fareCategory=="E"} control={<Radio />} label="Extra Seat" />
                          </RadioGroup>:(null) }
                        </FormControl> 
                        </div>
                        <div>
                          <FormControl>
                          <FormLabel id="demo-controlled-radio-buttons-group">Seat Class</FormLabel> {mapOfSeatClass.get(details[i].seatClass)}
                          {!edit?<RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="seatClass"
                            // value={value}
                            disabled={edit} 
                            row
                            onChange={(e)=>{handleChange(e,i)}}
                          >
                            <FormControlLabel value="B"   checked={details[i].seatClass=="B"} defaultChecked={details[i].seatClass=="B"} control={<Radio />} label="Business" />
                            <FormControlLabel value="E"  checked={details[i].seatClass=="E"} defaultChecked={details[i].seatClass=="E"} control={<Radio />} label="Economy" />
                            <FormControlLabel value="EP"  checked={details[i].seatClass=="EP"} defaultChecked={details[i].seatClass=="EP"} control={<Radio />} label="Economy Premium" />
                           
                          </RadioGroup>:(null)}
                        </FormControl> 
                        </div>
                        <div>
                          <FormControl>

                          <FormLabel id="demo-controlled-radio-buttons-group">Occupation Category</FormLabel> {details[i].occupation}
                          {!edit?(<RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="occupation"
                            disabled={edit} 
                            // value={value}
                            row
                            onChange={(e)=>{handleChange(e,i)}}
                          >
                            <FormControlLabel value="Medical" checked={details[i].occupation=="Medical"} defaultChecked={details[i].occupation=="Medical"} control={<Radio />} label="Medical" />
                            <FormControlLabel value="Pilot" checked={details[i].occupation=="Pilot"} defaultChecked={details[i].occupation=="Pilot"} control={<Radio />} label="Pilot" />
                            <FormControlLabel value="Teacher" checked={details[i].occupation=="Teacher"} defaultChecked={details[i].occupation=="Teacher"} control={<Radio />} label="Teacher" />
                            <FormControlLabel value="Finances" checked={details[i].occupation=="Finances"} defaultChecked={details[i].occupation=="Finances"} control={<Radio />} label="Finances" />
                            <FormControlLabel value="Banking" checked={details[i].occupation=="Banking"} defaultChecked={details[i].occupation=="Banking"} control={<Radio />} label="Banking" />
                            <FormControlLabel value="Civil Engineer" checked={details[i].occupation=="Civil Engineer"} defaultChecked={details[i].occupation=="Civil Engineer"} control={<Radio />} label="Civil Engineer" />
                            <FormControlLabel value="Software Engineer" checked={details[i].occupation=="Software Engineer"} defaultChecked={details[i].occupation=="Software Engineer"} control={<Radio />} label="Software Engineer" />
                            <FormControlLabel value="Business Owner" checked={details[i].occupation=="Business Owner"} defaultChecked={details[i].occupation=="Business Owner"} control={<Radio />} label="Business Owner" />
                            <FormControlLabel value="Freelancer" checked={details[i].occupation=="Freelancer"} defaultChecked={details[i].occupation=="Freelancer"} control={<Radio />} label="Freelancer" />
                            <FormControlLabel value="Sports" checked={details[i].occupation=="Sports"} defaultChecked={details[i].occupation=="Sports"} control={<Radio />} label="Sports" />
                           
                          </RadioGroup>):(null)}
                        </FormControl> 
                        </div>
                        <div>
                        {/* {props.countries.length>0?(
                        <label> Nationality:
                        <select>
                         
                          
                              {props.countries.map((obj)=>{
                           
                            <option value={obj}>{obj}</option>
                            
                          })}
                          
                        
                          
                        </select>
                        </label>  ):(null)} */}


                        {details.length!==1 &&
                            <Button onClick={()=>removePassenger(i)}>Remove</Button>
                        }
                        {/* {
                            details.length-1===i &&
                            <Button onClick={()=>{handleAddPassenger()}}>Add Passenger</Button>
                            
                        } */}
                        </div>
                        
                     
                    

                      </Typography>
                    </CardContent>

                 
              </Card>

           </div>
                        
                    </div>
                )
            })
        }

        <Typography>
            <Button onClick={()=>{handleEdit()}}>Edit</Button>
            <Button onClick={()=>{handleSave()}}>Save Details</Button>
            <Button onClick={()=>{handleNextPage()}}>Proceed to Payment Page</Button>
        </Typography>


    </div>
  )
}

export default ReviewDetails

