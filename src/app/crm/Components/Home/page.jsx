'use client'
import React, { useEffect, useState } from 'react'
import Styles from "./homestyle.module.css"
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import TemporaryDrawer from './RightDrawer';
import { FetchUserInFo, GetAllEventsDate } from './AllFunctions';
import Link from 'next/link';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import EditLeftDrawer from './EditDrawer';
import GreatingsLeftDrawer from './GreatingsDrawer';
import ReportLeftDrawer from './Report';
import AddPayment from './AddPayment';
export default function HomePage({UserID}) {
    const [Array,ArrayValue] = useState([]);
    const [TodayDate,TodayDateValue] = useState(0);
    const [AddOpen,AddOpenValue] = useState(false);
    const [NotToShow,NotToShowValue] = useState([]);
    const [AddInfom,AddInfoValue] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const DaysArray = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const [UsereInfo,SetUserInfo] = useState({});
    function getDaysOfCurrentMonth() {
        const today = new Date();
        const numDays = new Date(currentYear, currentMonth + 1, 0).getDate(); // corrected to get days of current month
        const daysOfMonth = [];
        const currentDate = today.getDate();
        for (let day = 1; day <= numDays; day++) {
            const DATE = new Date(currentYear, currentMonth, day);
            const FindDate = DATE.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            daysOfMonth.push([FindDate.split(", ")[0], FindDate.split(", ")[1].split(" ")[1]]);
        }
        const arrayOfUndefined = [];
        for (let a = 0; a < DaysArray.indexOf(daysOfMonth[0][0]); a++) {
            arrayOfUndefined.push(a);
        }
        NotToShowValue(arrayOfUndefined);
        TodayDateValue(currentDate);
        ArrayValue(daysOfMonth);
    }
    const GetAllEvents = async()=>{
        const response = await GetAllEventsDate(currentMonth,currentYear);
        AddInfoValue(response);
        
    }
    const fetchuserInfofun = async()=>{
        const res = await FetchUserInFo();
        console.log(res);
        SetUserInfo(res);
    }
    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => (prevMonth === 11 ? 0 : prevMonth + 1));
    };

    const handlePreviousMonth = () => {
        setCurrentMonth(prevMonth => (prevMonth === 0 ? 11 : prevMonth - 1));
    };

    const handleMonthChange = (event) => {
        setCurrentMonth(parseInt(event.target.value));
    };

    const handleYearChange = (event) => {
        setCurrentYear(parseInt(event.target.value));
    };
    useEffect(()=>{
        getDaysOfCurrentMonth();
        GetAllEvents();
    },[currentMonth,currentYear])
    useEffect(()=>{
        fetchuserInfofun();
    },[])
  return (
    <>
        <div className={Styles.NavSearchModel}>
            <div><img src={UsereInfo?.Logo||''} style={{width:'100px',borderRadius:'5px'}}/></div>
            <div className={Styles.SearchModel}>
                    <div onClick={handlePreviousMonth}><ArrowLeftIcon color="primary" style={{fontSize:"50px",color:'white',cursor:'pointer'}}/></div>
                    <select
                    style={{backgroundColor:"#2d3a63",color:'white',border:'none',fontSize:'20px',marginRight:'30px',marginLeft:'30px',cursor:'pointer',outline:'none'}}
                    value={currentMonth}
                    onChange={handleMonthChange} 
                    >
                    {[0,1,2,3,4,5,6,7,8,9,10,11].map(i =>{
                            return <option key={i} value={i}>
                               {new Date(0, i).toLocaleString('default', { month: 'short' })}
                            </option>
                    })}
                    </select>
                    <select
                    style={{backgroundColor:"#2d3a63",color:'white',marginRight:'30px',border:'none',fontSize:'20px'}}
                    value={currentYear}
                    onChange={handleYearChange} 
                    >
                    {[0,1,2,3,4,5,6,7,8,9,10,11].map(i =>{
                            return <option key={i} value={new Date().getFullYear() - 1 + i}>
                                {new Date().getFullYear() - 1 + i}
                            </option>
                    })}
                    </select>
                    <div onClick={handleNextMonth}><ArrowRightIcon color="primary" style={{fontSize:"50px",color:'white',cursor:'pointer'}}/></div>
            </div>
            <div><TemporaryDrawer UserID={UserID}/></div>
        </div>
        <div className={Styles.MainContent}>
            <div>
                <div className={Styles.JustForFUN}><img style={{width: '60px',height:'auto'}} src={!AddOpen?'/svg/AddCrm.svg':'/svg/CrossCrm.svg'} alt="search" onClick={()=>{!AddOpen?AddOpenValue(true):AddOpenValue(false)}}/></div>
                {AddOpen?<div className={Styles.JustForFUN} style={{marginTop:'20px',height:'60svh',justifyContent:'space-around'}}>
                    <EditLeftDrawer/>
                    <Link href="/"><img src='/svg/AICrm.svg' alt="search" style={{width: '60px',height:'auto'}}/></Link>
                    <GreatingsLeftDrawer/>
                    <ReportLeftDrawer/>
                </div>:<></>}
            </div>
            <div className={Styles.MainContentCalender}>
                {NotToShow.map((item,index)=>{
                    return <div className={Styles.calenderboxNone} key={index}></div>
                })}
                {Array.map((item)=>{
                    return <div className={`${Styles.calenderbox} ${Styles.boxes}`} style={item[1] == `${TodayDate}`?{backgroundColor:"#a240e5"}:{}}>
                        <div className={Styles.calenderboxDate} style={item[1] == `${TodayDate}`?{color:"#fff"}:{}}>{item[1]}</div>
                        {AddInfom.map((it,ind)=>{
                            if(it[0] == item[1]){
                                return <><div className={Styles.EventNameBox} style={ColorAndBGcolor(it[2])} key={ind}><AddPayment uuid={it[3]} name={it[4]}/></div></>
                            }
                        })}
                    </div>
                })}
            </div>
        </div>
    </>
  )
}


export function ColorAndBGcolor(status){
    if(status==''|| !status){
        return {
            backgroundColor:"#1e2742",
            color:"white"
        }
    }else if(status=='Lead'){
        return {
            backgroundColor:"white",
            color:"black"
        }
    }else if(status=='Advance paid'){
        return {
            backgroundColor:"#ff1493",
            color:"white"
        }
    }else if(status=='Editing'){
        return {
            backgroundColor:"#f7b02f",
            color:"white"
        }
    }else if(status=='Event completed'){
        return {
            backgroundColor:"#ff6347",
            color:"white"
        }
    }else if(status=='Balance settled'){
        return {
            backgroundColor:"#148158",
            color:"white"
        }
    }else if(status=='Delivered'){
        return {
            backgroundColor:"#1677a3",
            color:"white"
        }
    }
}
export function DatePickerIcon({setValue}){
    return <div style={{border:'1px solid #898d9c',padding:'10px 20px 10px 10px',borderRadius:'5px'}}><div className={Styles.datePicker}><LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
    onChange={(newValue) => {
        let date = newValue["$D"];
        let month = newValue["$M"]+1;
        let year = newValue["$y"];
      setValue(`${year}-${month<10?`0${month}`:month}-${date<10?`0${date}`:date}`);
    }}/></LocalizationProvider></div></div>
}