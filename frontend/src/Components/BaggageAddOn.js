import React from 'react'
import { useLocation } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { CardContent, CardHeader ,Card, Typography,Button} from '@mui/material';
const url='http://localhost:8000/';
const BaggageAddOn = (props) => {
    const stateParams=useLocation().search;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const flightId=urlParams.get('flightId');
    const listOfIds=urlParams.get('listOfIds');
    const data=JSON.parse(localStorage.getItem('filledInfoForPassDetails'));
    console.log("baggage",flightId,"yyyy",listOfIds,"data",data);
    window.history.replaceState({}, document.title, "/" + "baggageDetails");
    const[valuesForSeatClass,setValuesForSeatClass]=useState();
    const[weightRate,setWeightRate]=useState();
    // const valuesForSeatClass=[{'name':'E','value': 'Economy','cost':'0','weight':'15'},{ 'name':'EP','value': 'Economy Premium','cost':'1500','weight':'18'},{ 'name':'B','value': 'Business','cost':'30000','weight':'25'}];
    // const weightRate=[{'5':'800'},{'10':'950'},{'25':'1500'}]
    const[details,setDetails]=useState(data);
    const [listOfCFDIds,setListOfCFDIds]=useState();
    const[priceVal,setPrice]=useState([]);
    // const[errMessages,setErrMessages]=useState();
   
    useEffect(()=>{
        (async()=>{
            console.log("here22")
          await fetchPrices()
        })()

    },[])

    const fetchPrices=async()=>{
        try{
            const res=await fetch(url +"foodFetch",{
                method:'POST',
                body:JSON.stringify({
                    airlineId:localStorage.getItem('airlineId')
                }),
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${localStorage.getItem("token")}`
                }
            })
            const response=await res.json();
            if(response.error=='Invalid token' || response.error=='Authentication required'){
                window.location='/login';
               }
            setValuesForSeatClass(response.discounts);
            console.log("response.",response.costOfBaggage,response.discounts)
            setWeightRate(response.costOfBaggage);
            var filledInfoForPassDetails=JSON.parse(localStorage.getItem("filledInfoForPassDetails"));
            console.log("filledInfoForPassDetails",filledInfoForPassDetails)
            let tempPrices=[];
            for(var g=0;g<filledInfoForPassDetails.length;g++){
                tempPrices.push(0);
            }
            console.log("yyyyy",tempPrices);
            setPrice(tempPrices);
            localStorage.setItem("food",JSON.stringify(response.food));
            localStorage.setItem("discounts",JSON.stringify(response.discounts));
            localStorage.setItem("costOfBaggage",JSON.stringify(response.costOfBaggage));
            localStorage.setItem("numOfSeats",JSON.stringify(response.numOfSeats));

        }
        catch(err){
            console.log("err in fetchPrices",err)
        }
    }

   const handleChange=(e,i)=>{
    const{name,value}=e.target;
    console.log("value",e.target.value);
    const tempObj=[...details];
    value!==""? (tempObj[i][name]=value):(tempObj[i][name]=0);
    // value!==''? (tempObj[i]['extraWeightPrice']=(value * 500) ):(tempObj[i]['extraWeightPrice']=0);
    setDetails(tempObj);
    console.log(details,"details",tempObj);
    if(name=='weight'){
    getCostOfLuggage(e.target.value,i);
    }
    }

    const foodPage=()=>{
      
        window.location.href=`/foodDetails?listOfIds=${listOfCFDIds}}`
    
    }
    
    const saveBaggageDetails=async(val)=>{
        localStorage.removeItem("filledInfoForPassDetails",val);
        localStorage.setItem("filledInfoForPassDetails",JSON.stringify(val));
        console.log("val kkk",val);
        const res=await fetch(url+'saveBaggageData',{
            method:'POST',
            body:JSON.stringify(details),
            headers:{
                "Content-Type":"application/json",
                'Authorization':`Bearer ${localStorage.getItem("token")}`
            }

        })
        const response=await res.json();
        if(response.error=='Invalid token' || response.error=='Authentication required'){
            window.location='/login';
        }
        if(response.Error=="NA"){
            var tempObj=details;
            const mapOfIds=new Map(Object.entries(response.listOfIds));
            console.log("tempObj here44 is",tempObj,"res is",mapOfIds,"type is",typeof(mapOfIds));
            for(let j=0;j<tempObj.length;j++){
                console.log("pp",mapOfIds.has(tempObj[j]['cfdId']))
                if(mapOfIds.has(tempObj[j]['cfdId'])){
                tempObj[j]['baggageId']=mapOfIds.get(tempObj[j]['cfdId']);
                }
               }
               console.log("updated tempObj",tempObj);
            setDetails(tempObj);
            localStorage.removeItem('filledInfoForPassDetails');
            localStorage.setItem('filledInfoForPassDetails',JSON.stringify(details));
            // setListOfCFDIds(response.listOfIds);
        }
       

        console.log("respos",response);
    }

    const getCostOfLuggage=(val,i)=>{
        const tempObj=[...details];
        const tempData=data;
        console.log("tempData[i].seatClass",tempData[i].seatClass,"i",i);
        var w=weightRate.find(n=>n.category==tempData[i].seatClass).values;
        // console.log("oo",w);
        var lim=weightRate.find(n=>n.category==tempData[i].seatClass).limit;
        // console.log("kkk",lim);
        var s=[];
        for(let i=0;i<w.length;i++){
            s.push(w[i].weight);
        }
        s.sort(function(m,n){return m-n});
        var p=val;
        var price=0;
        var h=0;
        if(parseInt(p,10)>parseInt(lim,10)){
            console.log("Our limit is ",lim,"we can't allow extra ",p-lim,"Kg");
            // var tempObjForErr=[...errMessages];
            // tempObjForErr.push("Our limit is ",lim,"we can't allow extra ",p-lim,"Kg");
            // setErrMessages(tempObjForErr);
            p=parseInt(lim,10);
        }

        console.log("s",s,w,"p",p);
        if(s.length>0){
            console.log("inside",typeof(s[0])," ",typeof(p),parseInt(p,10)<= parseInt(s[0],10));
            
            console.log("parseInt(p,10)",parseInt(p,10),"parseInt(s[0],10) ",parseInt(s[2],10) );
        if(  parseInt(p,10)<=parseInt(s[0],10)  ){
            console.log("here11",price);
            price=  parseInt(p,10)* parseInt((w.find(m=>m.weight==s[0]).cost),10) ;
            console.log("11",price);
        }
        
        else if(parseInt(p,10)<=parseInt(s[1],10) ){
            console.log("here22",price);
            price= ((s[0]) * (w.find(m=>m.weight==s[0]).cost)) 
            +( (p-s[0])* (w.find(m=>m.weight==s[1]).cost) );
            console.log("22",price);
        }
        
        else if(parseInt(p,10)<=parseInt(s[2],10)){
            console.log("here33",price);
            if(parseInt(s[2])==parseInt(p)){
                console.log("heta55");
                price= (s[0])* (w.find(m=>m.weight==s[0]).cost) + (s[1]-s[0]) * (w.find(m=>m.weight==s[1]).cost) +  (s[2]-s[1]) * (w.find(m=>m.weight==s[2]).cost);
            }
            else{
                 console.log("heta66");
      price= (s[0])* (w.find(m=>m.weight==s[0]).cost) + (s[1]-s[0]) * (w.find(m=>m.weight==s[1]).cost) +  (s[2]-p) * (w.find(m=>m.weight==s[2]).cost);
      }
    }

      
        console.log("tempObj in cost cal fxn",tempObj)
        tempObj[i]['extraWeightPrice']=price;
        setDetails(tempObj);
        var tempPricesValues=priceVal;
        console.log("tempPricesValues 4444",priceVal,"ppp",tempPricesValues);
        tempPricesValues.map((ind,index)=>{
            if(index==i){
                tempPricesValues[index]=price;
            }
        })
        setPrice(tempPricesValues);
        

        }
        
console.log("finalCost",price);
    }

  return (
    <div>
    <div>
        Please Enter Baggage Data
        {data?(
            <div>
                  {data.map((o,i)=>{
        //   {console.log(o.seatClass,"hhll",valuesForSeatClass.find(m=>m.name==o.seatClass))}
        return(
          
         <div key={i}>
         <Card>
            <CardHeader> {o.fname + o.lname} </CardHeader>
            <CardContent>
                <Typography>
                    <div>
                <div>Passenger Name : {o.fname +"  "+ o.lname}</div>
                <div> Class :
                    {o.seatClass}
                    {/* {valuesForSeatClass.find(m=>m.name==o.seatClass)['value']} */}
                    </div>
                {/* <div>Cost:- */}

                    {/* {valuesForSeatClass.find(m=>m.name==o.seatClass)['cost']} */}
                    {/* </div> */}
                <div> Airline Name:-{o.airlineName}  </div>
                {console.log("here",weightRate)}
                <div>Allowed Weight:{weightRate?(weightRate.find(m=>m.category==o.seatClass).limit + "Kg *"):(null)}

                    {/* {valuesForSeatClass.find(m=>m.name==o.seatClass)['weight']} Kg */}
                    </div>
                <div>
                <label> Enter Extra Weight in Kg:-
                <input type="text" name="weight" value={details[i].weight} onChange={(e)=>{handleChange(e,i)}}></input>
             
                </label>
               
                </div>
                <div>
                <span>
                {weightRate ? (
             parseInt(weightRate.find(m=>m.category==o.seatClass).limit) <= parseInt(details[i].weight) ? "We allow only "+weightRate.find(m=>m.category==o.seatClass).limit+"Kg":(null) 
              ):(null) } 
              </span>
                </div>
              
                {console.log("inside retun",priceVal[i],"index",i)}
                <div> <p>Extra Weight Rate - {priceVal[i]} </p></div>
                </div>
                </Typography>
            </CardContent>
         </Card>
         </div>
        )

     })}

            </div>
        ):(null)}
   
   
 

    </div>
    <div>
    <Button onClick={()=>{saveBaggageDetails(details)}}>Save Details</Button>
    <Button onClick={()=>{foodPage()}}> Proceed </Button>
    </div>

    </div>
  )
}

export default BaggageAddOn
