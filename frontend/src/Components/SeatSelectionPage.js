import React from 'react'
import { useState,useEffect ,useRef} from 'react'
import { Button, Typography,Tooltip ,Snackbar} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import io from 'socket.io-client';
var j=0;
const url="http://localhost:8000/"

const SeatSelectionPage = () => {

  const data=JSON.parse(localStorage.getItem("filledInfoForPassDetails"));
  const[details,setDetails]=useState(data);
  console.log("data is jj",data);
  const socket=io.connect('http://localhost:8000');
  const airlineId=localStorage.getItem("airlineId");
  const[seatData,setSeatData]=useState();
  const seatDataRef = useRef(seatData);
  const[val,setVal]=useState(0);
  const[seatSelectId,setSeatSelectId]=useState('');
  const[showSnackbar,setShowSnackbar]=useState(false);
  const[showSnackbarMessage,setShowSnackbarMessage]=useState(false);
    
  useEffect(() => {
    seatDataRef.current = seatData;
  }, [seatData]);


  useEffect(() => {
    socket.on("newSeatBooked", (data) => {
      console.log("data we got in seatSelectionChange is",data);
      setSeatData((prevSeatData) =>
      prevSeatData.map((seat) =>
        seat.seatNumber === data ? { ...seat, isBooked: true } : seat
      )
    );

    });
   
  
  }, []);

  

    useEffect(()=>{
      console.log("socket is",socket,"socket.id is",socket,"id is",socket.id);
     
      (async()=>{
        await  socket.emit('flight', {
          id: socket.id,
          flightId:data[0].flightId
        });
       

      })()
    },[])

    useEffect(()=>{
      (async()=>{
      await getSeatsData(details)

      })()

    },[])
   
    const getSeatsData=async(details)=>{
      try{
        const resp=await fetch(url +"fetchSeatsData?cfdId="+data[0].flightId,{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem("token")}`
          },

        })

        const response=await resp.json();
        if(response.error=='Invalid token' || response.error=='Authentication required'){
          window.location='/login';
         }
        if(response.Error=='NA'){
          setSeatData(response.Status[0]['seats']
          );
        }
        if(response.Error!='NA'){
          console.log("error",response.Error)
        }

      }
      catch(err){
        console.log("err",err);
      }
    }
    const numOfSeats=localStorage.getItem("numOfSeats");
    const callPaymentPage=()=>{
        window.location.href='/ReviewDetails';
    }
    let arr = [];
    let rows = 4;
    let columns = 3;

    // creating two-dimensional array
    for (let i = 0; i < rows; i++) {
      arr[i] = [];
      for (let j = 0; j < columns; j++) {
        arr[i][j] = j;
      }
    }

    console.log(arr);
    const arrayOfSeats=[];

   

    const handleSelectSeat=async(seatNumber)=>{
      if(seatSelectId==''){
       setShowSnackbar(true);
       setShowSnackbarMessage('Please Select a User first and then make seat selection!!');
      }
      else{
          const res=await fetch(url+"selectSeat",{
            method:'POST',
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${localStorage.getItem("token")}`
            },
            body:JSON.stringify({
              flightId:data[0].flightId,
              seatNumber,
              userId:localStorage.getItem("userId"),
              cfdId:seatSelectId
            })

          })
          const resp=await res.json();
          if(resp.error=='Invalid token' || resp.error=='Authentication required'){
            window.location='/login';
           }
          if(resp.Error=='NA'){
            await socket.emit('seatBooking', {
              id: socket.id,
              flightId:data[0].flightId,
              seatNumber
            });
           
            var tempCFD=details;
            console.log("details are ",details,"tempCFD11",tempCFD);
            var toUpdate=tempCFD.map((o)=>o.cfdId==seatSelectId?(o['seatNumber']=seatNumber, o['seatPrice']=resp.price):(o));
           
            console.log("tempCFD is",toUpdate,"tempCFD",tempCFD);
            setDetails(tempCFD);
            localStorage.setItem("filledInfoForPassDetails",JSON.stringify(tempCFD))
            setSeatData(resp.Status.seats);
          }
        }
    }

    const handleSelection=(i,j,val)=>{
      
      let m=closestMultiple(i,6);
      if(m==0){
        //means 1st seat
        m=1;
      }
      else{
        //means user selected (m/6) +1 th seat row
        m=Math.ceil(m/6) +1;
        // console.log("m kk",m);
        
      }
      {m+=i%6==0?'A':i%6==1?'B': i%6==2?'C':i%6==3?'D':i%6==4?'E':(i+1)%6==0?'F':''}
      console.log("m",m);
      console.log("j",j,"val",val);
        var element= document.getElementById(i);
        element.style.backgroundColor='#ff80aa';
    }

    const handleVar=(i)=>{
      console.log("i iside handlevar",i);
      setVal(i==0?1:i+1);
    }

    const closestMultiple=(n, x)=>
    {
      return n-(n%x);
    }
      
  
  return (
    <div style={{marginRight:'100px',marginLeft:'450px'}}>
        <Snackbar open={showSnackbar} autoHideDuration='5000' onClose={()=>{setShowSnackbar(false);setShowSnackbarMessage('')}}>
      <MuiAlert elevation={6} variant="filled" onClose={()=>{setShowSnackbar(false);setShowSnackbarMessage('')}} severity="info">
        {showSnackbarMessage}
      </MuiAlert>
    </Snackbar>

      {/* <Snackbar
      open={showSnackbar}
      onClose={()=>{setShowSnackbar(false);setShowSnackbarMessage('')}}
      message={showSnackbarMessage}
      /> */}

       <div style={{backgroundColor:'yellow',width:'29%',marginLeft:'-29%',position:'fixed'}}>
        Select user and choose a seat
            {details.map((o,index)=>{
              return(
                <div key={index} style={{backgroundColor:seatSelectId==o.cfdId?'pink':''}}>
                  
                  <Button  onClick={()=>{setSeatSelectId(o.cfdId)}}>{o.fname}&nbsp;{o.lname}</Button>
                  {o.seatNumber?(<div>Seat Number:&nbsp;{o.seatNumber}</div>):(null)}
                  {o.seatPrice?(<div>Seat Price:&nbsp;{o.seatPrice}</div>):(null)}
                 
                </div>
              )
            })}

          </div>
      
      
        <div style={{
           borderColor: 'transparent transparent #cce6ff transparent',
           borderStyle: 'solid',
           borderWidth: '0px 250px 250px 250px',
           height: '0px',
           width: '0px'
        }}>
          </div>
         
          {/* <div style={{marginTop:'80px',marginBottom:'2300px',marginLeft:'30px'}}>
            
          {seatData?(
        <div style={{display:'flex',flexWrap:'wrap',gap:'5px',height:'800px',width:'450px'}}>
         
          
        {[...new Array(parseInt(numOfSeats))].map((e,i)=>( 
        <div style={{flex:'1 1',backgroundColor:'#cce6ff'}}> 


            <Button style=
            {{
              backgroundColor:
              seatData.find(o=>(           
              (Object.keys(o[0])[0]==(j==0?1:j+1 )+  (i%6==0?'A':i%6==1?'B': i%6==2?'C':i%6==3?'D':i%6==4?'E':(i+1)%6==0?'F':'')) &&
              o[Object.keys(o)[0]][Object.keys(o[0])[0]].status=='E'

              )
              )?'pink':'lightblue'
             
      }}
          
          id={i} onClick={()=>{handleSelection(i,j,i%6==0?'A':i%6==1?'B': i%6==2?'C':i%6==3?'D':i%6==4?'E':(i+1)%6==0?'F':'')}}>{j==0?1:j+1}&nbsp;&nbsp;{i%6==0?' A':i%6==1?' B': i%6==2?' C':i%6==3?' D':i%6==4?' E':(i+1)%6==0?' F':''}</Button>
            
            <div> 
              <span style={{fontSize:'10px',marginTop:'0px'}}>
                  {i==0 || i%6==0 || (i+1)%6==0 ?(250):('')}
                  &nbsp; &nbsp; &nbsp; &nbsp;{i}
              </span>

              <span style={{visibility:'hidden'}}>
                {(i+1)%6==0?(j+=1):''} 
              </span> 

            </div>
        
        </div>
        ))
        }
        </div>):(null)}

          </div>    */}
          {/* <div style={{marginTop:'80px'}}>
          {seatData && seatData.map((o)=>{
          return(
            <div style={{display:'flex',flexWrap:'wrap',gap:'5px',backgroundColor:'pink'}}>
              {o.seatNumber}

            </div>

          )
          }
          
          )}
          </div> */}
      
     

         
          <div style={{ marginTop: '80px', width: '450px', marginLeft: '30px' }}>
              {seatData &&
                seatData.map((o, index) => {
                  const seatStyle = {
                    display: 'inline-block',
                    width: '14%',
                    boxSizing: 'border-box',
                    padding: '10px',
                    marginBottom: '10px',
                    marginRight: '10px',
                    textAlign: 'center',
                    backgroundColor: o.isBooked ? o.passenger==localStorage.getItem("userId")?'purple':'pink' : '#5FBBED'
                  }
                  return (
                   
                    <Button 
                    // disabled={o.isBooked}
                     key={index} style={seatStyle} onClick={()=>{handleSelectSeat(o.seatNumber)}}>
                      {o.seatNumber}
                      <span style={{ position: 'absolute',color:'#0F2862',bottom: '1px',left: 0,right: 0, fontSize: '0.7em'}}>
                        Rs.{o.seatPrice}
                      </span>
                     
                    </Button>
                  )
                })}
          </div>
       
        <div>
        <div style={{
        width: 0, 
        height: 0, 
        borderLeft: '260px solid transparent',
        borderRight: '260px solid transparent',
        borderTop: '260px solid #cce6ff',
       
       }}>
          
       </div>
       </div>
     


    <Button onClick={(e)=>{callPaymentPage()}}>Proceed</Button>

    </div>

  )
}

export default SeatSelectionPage
