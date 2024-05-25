"use client";
import { sendgreatingmessages } from '../../SendSMS';
import 'react-toastify/dist/ReactToastify.css';

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function GreetingSendBtn({SendingData,ArrayOfNumbers}) {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const  handleClick = async() => {
      // const res =  await sendgreatingmessages(SendingData,ArrayOfNumbers);
      // console.log(JSON.stringify({ SendingData , ArrayOfNumbers  }))
      // console.log(SendingData,ArrayOfNumbers,"Client")
        try {
          const response = await fetch('api/sendsms', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({SendingData,ArrayOfNumbers})
          });

          if (response.ok) {
              console.log('Greeting messages sent successfully!');
          } else {
              console.error('Failed to send greeting messages');
          }
      } catch (error) {
          console.error('Error:', error);
      }

      // console.log(res,"Response")
      // if (res) {
      // toast.success("Message Send Successfully")
      // console.log(res);
      // } else {
      // console.log("Error :",res)
      // toast.warning("Something Went wrong!")
      // }
      // alert('Message Sent ...')
    }
    
  return (
    <div>
        <button onClick={handleClickOpen} style={{border:'none',borderRadius:'5px',fontSize:'13px',width:'150px',padding:'10px 15px', margin:'15px',cursor:'pointer',backgroundColor:'#A240E5',color:'#fff'}}>Send</button>
        <Dialog open={open} TransitionComponent={Transition} transitionDuration={{ appear: 600, enter: 600, exit: 600 }} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
            <div style={{backgroundColor:'#1e2742',padding:'30px 50px',borderRadius:'0'}}>
                <div style={{color:'white', fontSize:'20px'}}>Do You Want to Send Update</div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'30px'}}>
                <button onClick={()=>{handleClick()}} style={{border:'none',borderRadius:'5px',fontSize:'13px',width:'50px',padding:'10px 15px',cursor:'pointer',backgroundColor:'#13192f',color:'#fff'}}>Yes</button>
                <button onClick={()=>{handleClose()}} style={{border:'none',borderRadius:'5px',fontSize:'13px',width:'50px',padding:'10px 15px',cursor:'pointer',backgroundColor:'#13192f',color:'#fff'}}>No</button>
            </div>
            </div>
        </Dialog>
    </div>
  )
}

export default GreetingSendBtn;
