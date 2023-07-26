import React from 'react'
import { useState,useEffect } from 'react'
import { Button } from '@mui/material';
const url='http://localhost:8000/';

const PaymentPage = () => {
    const details=JSON.parse(localStorage.getItem("filledInfoForPassDetails"));
    const discounts=JSON.parse(localStorage.getItem("discounts"));

    const [data,seData]=useState(details);
    const[priceVal,setPrice]=useState('');

    useEffect(()=>{
        let price=0;
       for(let i=0;i<data.length;i++){
            let amount=0;
            var d=(+localStorage.getItem("fare") +  4);
           
            amount=(Number(details[i].extraWeightPrice)+Number(details[i].foodPrice) + (Number(localStorage.getItem("fare")) ) );
            var tempDiscount=discounts.find(o=>o.category==details[i].fareCategory);
            if(tempDiscount!==undefined){
              amount=amount- (amount*(tempDiscount.discount))/100;
            }
           
            price+=parseInt(amount);
       }
       setPrice(price);
    },[])
    const callPaymentPage=()=>{
        // window.location.href='/paymentSuccess';
    }

    const checkouthandler=async(amount)=>{
        try{
          
            const result=await fetch(url+'checkout',{
            method:'POST',
            body:JSON.stringify({
              amount:10
            }),
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${localStorage.getItem("token")}`
            }
            })
            const res=await result.json()
           console.log({res});
            if(res.error==='NA'){
            const options = {
            key:'rzp_test_i18RlDcY6Gh9tr' , // Enter the Key ID generated from the Dashboard
            amount: res.message.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "Test Name",
            description: "Test Transaction",
            image: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fassets.editorial.aetnd.com%2Fuploads%2F2019%2F03%2Ftopic-london-gettyimages-760251843-feature.jpg&tbnid=LKEsA2tjK2pBqM&vet=12ahUKEwju2bTY9b3-AhXh5nMBHVNmDBIQMygDegUIARDkAQ..i&imgrefurl=https%3A%2F%2Fwww.history.com%2Ftopics%2Fbritish-history%2Flondon-england&docid=5o6EWoJUwWIg4M&w=4096&h=1862&q=london%20image%20pic&ved=2ahUKEwju2bTY9b3-AhXh5nMBHVNmDBIQMygDegUIARDkAQ",
            order_id: res.message.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            callback_url: "http://localhost:8000/paymentConfirmation",
            prefill: {
                name: "test11",
                email: "tes11@gmail.com",
                contact: "1111111111"
                    },
            notes: {
                address: "dummy adrees"
                    },
            theme: {
                color: "#3399cc"
                    }
          };
          
          const razorInstance=new window.Razorpay(options)
          razorInstance.open()
          }
          if(res.error==='You have exceeded the 2 requests in 24 hrs limit!'){
            // console.log("too many requests in this api")
          }
          }
          catch(e){
            // console.log("in frontend",{e});
          }
      }
  return (
    <div>PaymentPage

        <Button onClick={()=>{checkouthandler(priceVal)}}>Pay Now {priceVal}</Button>
    </div>
  )
}

export default PaymentPage

