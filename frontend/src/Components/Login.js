import React, {useState ,useEffect} from 'react';
import $ from 'jquery';
import Snackbar from '@mui/material/Snackbar';
import  {useCookies}  from "react-cookie";

function Login(){
   const baseUrl='http://localhost:8000/';
   const fronUrl='http://localhost:3000/';
  
  
  
  const [login,setLoginState]=useState({
    name:"",
    email:"",
    password:"",
    loginResponse:"",
  });
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [isSnackbarMsg,setIsSnackbarMsg]=useState('');
  const[isSnackbar,setIsSnackBar]=useState(false);
  const[isForgotPwd,setIsForgotPwd]=useState(false);
const[isPwdMailSent,setIsPwdMailSent]=useState(false);
  useEffect(() => {
    if (isSnackbar) {
      const timeout = setTimeout(() =>  setIsSnackBar(false),30000);//means after 5s disappers
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isSnackbar]);
  const[authenticated,setAuthentication]=useState(localStorage.getItem(localStorage.getItem('authenticated')||false));
  useEffect(()=>{
    landToTasksPage();
  },[authenticated])
  // const[errors,setErrors]=useState({
  //   nameError:"",
  //   emailError:"",
  //   passError:""
  // })
  const landToTasksPage=()=>{
    console.log("url is>>",window.location.href,"condn",localStorage.getItem('authenticated'));
    if(localStorage.getItem('authenticated')==true){window.location=fronUrl+'landing'}
      
  }
  const sendForgotPasswordMail=async()=>{
 const resp=await fetch(baseUrl+'forgot-password',{
  method:'POST',
      body:JSON.stringify({
        "email":login.email,
      }),
      headers:{
        'Content-Type':'application/json',
      },
    })
    const response=await resp.json()
    console.log({response},"sendForgotPasswordMail")
    if(response.Error=='NA'){
      setIsSnackBar(true);
      setIsSnackbarMsg("Please Check your Inbox to reset password. ")
    }
    else{
      setIsSnackBar(true);
      setIsSnackbarMsg("Some error occurred. Please contact our support Team at 911111111");
    }
    setIsForgotPwd(true);
    setIsPwdMailSent(true);
  }
  const handleLogin=async()=>{
    try{
    console.log("inside login handlelogin");
      var url=baseUrl+'login';
      const loginData={email:login.email,password:login.password}
      const resp= await fetch(url,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(loginData),
      })
      const response=await resp.json();
      
      console.log("error is>>",response,"condn ",response.error=='NA');
      response.error=='NA'?setAuthentication(true):setAuthentication(false);
      response.error=='NA'?localStorage.setItem("authenticated",true):localStorage.setItem("authenticated",false);
      if(response.error=='NA'){
        setCookie("token",response.token)
        localStorage.setItem("token",response.token);
        localStorage.setItem("userId",response.userId);
      }
      console.log("value in localStroage is>>>",localStorage.getItem("authenticated"));
    console.log("res is",response);
    console.log("NA!",response.error==='NA',response.error==='signup')
        if(response.error==='NA'){
          setIsSnackBar(false);
          window.location=fronUrl+'landing'
        }
        if(  response.message==='signup'){
          setIsSnackBar(false);
          window.location=fronUrl+'signup'
        }
        if(response.message=='invalid credentials'){
         
          setIsSnackBar(true);
          setIsSnackbarMsg('Invalid Credentials!!');
          
        }
     
    }
    catch(e){
      console.log("e is>>",e);
    }
   
  }

  //name meth
  const forgotPassword=()=>{
    setIsForgotPwd(true);
  }
  const validateName=()=>{
    console.log("name==''  isl>>",login.name==="")
   
if(login.name===""){
  // setErrors((prev)=>({...prev,nameError:"Name cannot be empty"}));
  $('#div-name').find('#helptext').text("Please enter name");
}
else{
  // setErrors((prev)=>({...prev,nameError:""}));
  $('#div-name').find('#helptext').text("");
}
}

//email meth
  const validateEmail=()=>{
if(login.email==null || login.email==""){
  $('#div-email').find('#helptext').text("Please enter email");
  // setErrors((prev)=>({...prev,emailError:"Email can't be empty"}));
}
else{
const emailRegex=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

console.log("emailvalidation is>>",emailRegex.test(String(login.email).toLowerCase()));
if(emailRegex.test(String(login.email).toLowerCase())){
  // setErrors((prev)=>({...prev,emailError:""}));
  $('#div-email').find('#helptext').text("");
}
else{
  $('#div-email').find('#helptext').text("Please enter correct email");
  // setErrors((prev)=>({...prev,emailError:"Email validation failed!"}));
}
}

  }
  //password meth
  const validatePassword=()=>{
    
  if(login.password==""){
    $('#div-password').find('#helptext').text("Please enter password");
    // setErrors((prev)=>({...prev,passError:"Password can't be empty"}))
  }
  else{
  // const validatePass=new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');
  const validatePass=new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

//console.log("pass validation is>>",validatePass.test(login.password))
if (!validatePass.test(login.password)){
  $('#div-password').find('#helptext').text("Please enter valid password");
  // setErrors((prev)=>({...prev,passError:"Password validation failed!"}))
}
else{
  // setErrors((prev)=>({...prev,passError:""}));
  $('#div-password').find('#helptext').text("");
}
  }

  }
  const validate=()=>{
    
    validateName();
    validateEmail();
    validatePassword();
    
  }
  const onSubmit=(e)=>{
    e.preventDefault();//to avoid from refershing it
    validate();
    if($('#div-name span').text()==""&& $('#div-password span').text()=="" &&$('#div-email span').text()==""  ){
    handleLogin();
    }
   
    console.log("AFTER LOGIN API CALLED",login);
    console.log("login.loginResponse",login.loginResponse)
   
  }
  const handleChange=(e)=>{
   

  setLoginState((prev)=>({...prev,[e.target.name]:e.target.value}))
console.log("updated state is>>",e.target.name,"value is>>",e.target.value);
  
  }
  return (
    <div>
      {!isForgotPwd?(
        <div>
      This is login page
      <form>
      <div id='div-email'>
        <div>Email</div>
        <div>
          <input type="email" name="email" value={login.email} onChange={(e)=>{handleChange(e)}} ></input>
          <div >
          {/* {errors.emailError!=""?(<p style={{color:'red'}}>{errors.emailError}</p>):(null)} */}
          <span id='helptext' style={{color:'red'}}></span>
          </div>
        </div>
      </div>
      <div id='div-password'>
        <div>Password</div>
        <div>
          <input type="password"  name="password" value={login.password} onChange={(e)=>{handleChange(e)}} ></input>
        </div>
        <div>
        <span  id='helptext' style={{color:'red'}}></span>
        {/* {errors.passError!=""?(<p style={{color:'red'}}>{errors.passError}</p>):(null)} */}
        </div>
      </div>
      <div>
        <button input type="Submit" onClick={(e)=>{onSubmit(e)}}>
        Login
        </button>
      </div>
      <Snackbar
  open={isSnackbar}
  message={isSnackbarMsg}
/>
<button onClick={forgotPassword}>Forgot Password?</button>
      </form>
      </div>):(
          <div>
          Forgot Password? Don't Worry. 
          <form>
            <div id='div-email'>
              <div>Email</div>
              <div>
                <input type="email" name="email" value={login.email} onChange={(e)=>{handleChange(e)}} ></input>
                <div >
                {/* {errors.emailError!=""?(<p style={{color:'red'}}>{errors.emailError}</p>):(null)} */}
                <span id='helptext' style={{color:'red'}}></span>
                </div>
              </div>
            </div>
            
            <div>
              <button input type="Submit" onClick={(e)=>{sendForgotPasswordMail(e)}}>
              Send Link on Mail
              </button>
            </div>
            <Snackbar
        open={isSnackbar}
        message={isSnackbarMsg}
      />
            </form>
         </div>
        )}
    </div>
  )
}


export default Login