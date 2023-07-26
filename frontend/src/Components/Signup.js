import React from 'react'
import { useState ,useEffect} from 'react'
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import  MenuItem  from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Snackbar from '@mui/material/Snackbar';
const SignUp = () => {
  const baseUrl='http://localhost:8000';
  const fronUrl='http://localhost:3000/';
  const mystyle={
    
      border:'16px solid #f3f3f3',
      borderRadius: '50%',
      borderTop: '16px solid blue',
      borderBottom: '16px solid blue',
      width: '120px',
      height: '120px',
  
  }
  const[data,setData]=useState({
    email:"",
    name:"",
    phNum:"",
    gender:"",
    password:"",
    confirmPassword:"",
    isConfirmPassword:false,
  })
  const[loading,setLoading]=useState(false);
  const [isSnackbarMsg,setIsSnackbarMsg]=useState('');
  const[isSnackbar,setIsSnackBar]=useState(false);
  const[errors,setErrors]=useState({
    emailError:"",
    nameError:"",
    phNumError:"",
    genderError:"",  
    passErr:"",
    confirmPasswordErr:"",
    isConfirmPasswordErr:"",
  })
  useEffect(() => {
    if (isSnackbar) {
      const timeout = setTimeout(() =>  setIsSnackBar(false), 5000);//means after 5s disappers
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isSnackbar]);

  
  useEffect(()=>{
    const timeout = setTimeout(() =>  setLoading(false), 5000);//means after 5s disappers
    return () => {
      clearTimeout(timeout);
    };
  },[loading])

  const validateEmail=()=>{
    if(data.email==null || data.email==""){
      setErrors((prev)=>({...prev,emailError:"Email can't be empty"}));
    }
    else{
    const emailRegex=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    console.log("emailvalidation is>>",emailRegex.test(String(data.email).toLowerCase()));
    if(emailRegex.test(String(data.email).toLowerCase())){
      setErrors((prev)=>({...prev,emailError:""}));
    }
    else{
      setErrors((prev)=>({...prev,emailError:"Email validation failed!"}));
    }
    }
    
      }

  const validateName=()=>{
    console.log("name==''  isl>>",data.name=="")
   
if(data.name==""){
  setErrors((prev)=>({...prev,nameError:"Name cannot be empty"}));
}
else{
  setErrors((prev)=>({...prev,nameError:""}));
}
}

const validatePassword=()=>{
  console.log("bool is>>",data.confirmPassword==="" || data.password==="")
  if(data.confirmPassword==="" || data.password===""){
    setErrors((prev)=>({...prev,confirmPasswordErr:"This can't be empty"}))
    setErrors((prev)=>({...prev,passErr:"Password can't be empty",}))
    
  }
  
  else{
    if(data.confirmPassword!==data.password){
        setErrors((prev)=>({...prev,passErr:"Password not matching"}))
        setErrors((prev)=>({...prev,confirmPasswordErr:"This not matching"}))
        
      }
  else{
  // const validatePass=new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');
  const validatePass=new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

//console.log("pass validation is>>",validatePass.test(login.password))
if (!validatePass.test(data.password)){
  setErrors((prev)=>({...prev,passErr:"Password validation failed!"}))
}
else{
  setErrors((prev)=>({...prev,passErr:""}));
  setErrors((prev)=>({...prev,confirmPasswordErr:""}))
}
  }
}
console.log("passError",errors.passErr,"confirmpassErr>>",errors.confirmPasswordErr)

  }
  const validatePhoneNum=()=>{
 if(data.phNum==""){
  setErrors((prev)=>({...prev,phNumError:"This can't be empty"}))
 }
 else{
  if(data.phNum.length!=10){
    setErrors((prev)=>({...prev,phNumError:"Invalid Number"}))
  }
  else{
    setErrors((prev)=>({...prev,phNumError:""}))
  }
 }
  }
  const onSubmit=(e)=>{
    e.preventDefault();
   
    validateName();
    validateEmail();
    validatePassword();
    validatePhoneNum();
    if(data.gender==""){
      setErrors((prev)=>({...prev,genderError:"This can't be empty"}))
    }
    else{
      setErrors((prev)=>({...prev,genderError:""}))
    }
    console.log("ppppp",errors);
   if(errors.confirmPasswordErr==""&&errors.emailError==""&&errors.genderError==""&&errors.nameError==""){
    console.log("iside this")
    handleSignup();
  }
}

  const handleSignup=async()=>{
  try{
    
    var url=baseUrl+'/signup';
    console.log({url});
    const signUpData={
      Name:data.name,
      email:data.email,
      password:data.password,
      gender:data.gender,
      phNum:data.phNum
    }
    const resp=await fetch(url,{
      method:'POST',
      headers:{
        'Content-type':'application/json',
      },
      body:JSON.stringify(signUpData),
    })
    const response=await resp.json();
    console.log("reposneis>>",response);
    if(response.status=='success'){
      setIsSnackBar(true);
      setIsSnackbarMsg("Signup Successfull!!. Please Login!")
    }
    // if(response.status=='login'||response.status=='success'){
    //   window.location.href = fronUrl +'login';
    // }
    if(response.status=='error'){
      setIsSnackBar(true);
      setIsSnackbarMsg("Some error occurred! Please refresh Page and retry");
    }

  
  }
    catch(e){
      console.log("error in signup api",e)
    }
  }
  const handleChange=(e)=>{
setData((prev)=>({...prev,[e.target.name]:e.target.value}))
if(e.target.name==="gender"){
  console.log("gendr is>",e.target.value,"'pppp",e.target.name);
}
  }
  return (
    <div>
      <div>
      <TextField
      id="standard-basic" 
      label="Name" 
      name="name"
      value={data.name}
      variant="standard"
      onChange={(e)=>{handleChange(e)}}
      />
      {errors.nameError!==""?(<p style={{color:'red'}}>{errors.nameError}</p>):(null)}
      </div>
      <div>
      <InputLabel id="demo-simple-select-label">Gender</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={data.gender}
    label="Gender"
    name="gender"
    onChange={(e)=>{handleChange(e)}}
  >
    <MenuItem value={"Male"}>Male</MenuItem>
    <MenuItem value={"Female"}>Female</MenuItem>
    <MenuItem value={"Others"}>Others</MenuItem>
  </Select>
  {errors.genderError!==""?(<p style={{color:'red'}}>{errors.genderError}</p>):(null)}

</div>


     
      <div>
      <TextField
      id="standard-basic" 
      label="Email Id" 
      name="email"
      value={data.email}
      variant="standard"
      onChange={(e)=>{handleChange(e)}}
      />
      {errors.emailError!==""?(<p style={{color:'red'}}>{errors.emailError}</p>):(null)}
      </div>
      <div>
      <TextField
      id="standard-basic" 
      label="Phone Number" 
      name="phNum"
      value={data.phNum}
      variant="standard"
      onChange={(e)=>{handleChange(e)}}
      />
      {errors.phNumError!==""?(<p style={{color:'red'}}>{errors.phNumError}</p>):(null)}
      </div>
      <div>
        <div>
        <TextField
        id="standard-basic"
        label="password"
        name="password"
        value={data.password}
        variant="standard"
       
        onChange={(e)=>{handleChange(e)}}
        />
        </div>
      <div>
        {errors.passErr!==""?(<p style={{color:'red'}}>{errors.passErr}</p>):(null)}
        </div>
      </div>
      <div>
        <div>
        <TextField
        id="standard-basic"
        label="Confirm Password"
        name="confirmPassword"
        value={data.confirmPassword}
        variant="standard"
       
        onChange={(e)=>{handleChange(e)}}
        />
        </div>
      <div>{errors.confirmPasswordErr!==""?(<p style={{color:'red'}}>{errors.confirmPasswordErr}</p>):(null)}</div>
      </div>
<Button onClick={(e)=>{onSubmit(e)}}>Submit</Button>
{console.log("data is>>",data,"erroros>>",errors)}
<Snackbar
 sx={{ vertical: 'bottom',
 horizontal: 'left'}}
  open={isSnackbar}
  message={isSnackbarMsg}
/>
    </div>
  )
}

export default SignUp