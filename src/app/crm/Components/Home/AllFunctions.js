'use server'
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from 'next/cache';
export async function CreateCustomerFuntion(CustomerName,MobileNumber,EmailID,Location){
    noStore();
    const UserID = cookies();
    const User_Name = UserID.get('UserID').value;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('CustomerName').insert([{"Customer_Name": CustomerName,"Mobile": MobileNumber,"User_Name": User_Name,"Email_ID": EmailID,"Location": Location}]);
    if(result.status === 201){
        return true;
    }else{
        return false;
    }
}
export async function UpdateCustomerFuntion(CustomerName,MobileNumber,EmailID,Location,Customer_ID){
    noStore();
    const UserID = cookies();
    const User_Name = UserID.get('UserID').value;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('CustomerName').update({"Customer_Name": CustomerName,"Mobile": MobileNumber,"User_Name": User_Name,"Email_ID": EmailID,"Location": Location}).eq('Customer_ID',Customer_ID);
    console.log(result)
    if(result.status === 204){
        return true;
    }else{
        return false;
    }
}
export async function GetCustomerFuntion() {
    noStore();
    try {
        const UserID = cookies();
        const User_Name = UserID.get('UserID').value;
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
        const result = await supabase.from('CustomerName').select('*').eq('User_Name', User_Name);
        const ArrayToReturn = await Promise.all(result.data.map(async (item) => {
            const res = await supabase.from('UserEvents').select('Full_Amount,Advance_Payment').eq('Customer_ID_UUID', item.Customer_ID);
            let Advance_Payment = 0;
            let Full_Amount = 0;
            res.data.forEach((i) => {
                Full_Amount = Full_Amount + i.Full_Amount;
                i.Advance_Payment.forEach((am) => {
                    Advance_Payment = Advance_Payment + am.Advance;
                });
            });
            return { ...item, Balance: Full_Amount-Advance_Payment,Full_Amount:Full_Amount };
        }));
        return ArrayToReturn;
    } catch (error) {
        return [];
    }
}
export async function GetCustomerByStartAndEndDate(StartDate,EndDate) {
    noStore();
    try {
        const UserID = cookies();
        const User_Name = UserID.get('UserID').value;
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
        const result = await supabase.from('CustomerName').select('*').eq('User_Name', User_Name);
        const ArrayToReturn = await Promise.all(result.data.map(async (item) => {
            const res = await supabase.from('UserEvents').select('Full_Amount,Advance_Payment').eq('Customer_ID_UUID', item.Customer_ID);
            let Advance_Payment = 0;
            let Full_Amount = 0;
            res.data.forEach((i) => {
                Full_Amount = Full_Amount + i.Full_Amount;
                i.Advance_Payment.forEach((am) => {
                    if (am.Date >= StartDate && am.Date <= EndDate) {
                        console.log(am.Date)
                        Advance_Payment = Advance_Payment + am.Advance;
                    }
                });
            });
            return { ...item, Balance: Full_Amount-Advance_Payment,Full_Amount:Full_Amount };
        }));
        return ArrayToReturn;
    } catch (error) {
        return [];
    }
}
export async function GetCustomerByStartAndEndAndNameDate(StartDate,EndDate,Name) {
    noStore();
    try {
        const UserID = cookies();
        const User_Name = UserID.get('UserID').value;
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
        const result = await supabase.from('CustomerName').select('*').eq('User_Name', User_Name).eq('Customer_Name',Name);
        const ArrayToReturn = await Promise.all(result.data.map(async (item) => {
            const res = await supabase.from('UserEvents').select('Full_Amount,Advance_Payment').eq('Customer_ID_UUID', item.Customer_ID);
            let Advance_Payment = 0;
            let Full_Amount = 0;
            res.data.forEach((i) => {
                Full_Amount = Full_Amount + i.Full_Amount;
                i.Advance_Payment.forEach((am) => {
                    // Advance_Payment = Advance_Payment + am.Advance;
                    if (am.Date >= StartDate && am.Date <= EndDate) {
                        console.log(am.Date)
                        Advance_Payment = Advance_Payment + am.Advance;
                    }
                });
            });
            return { ...item, Balance: Full_Amount-Advance_Payment,Full_Amount:Full_Amount };
        }));
        return ArrayToReturn;
    } catch (error) {
        return [];
    }
}
export async function GetCustomerByNameDate(Name) {
    noStore();
    try {
        const UserID = cookies();
        const User_Name = UserID.get('UserID').value;
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
        const result = await supabase.from('CustomerName').select('*').eq('User_Name', User_Name).eq('Customer_Name',Name);
        const ArrayToReturn = await Promise.all(result.data.map(async (item) => {
            const res = await supabase.from('UserEvents').select('Full_Amount,Advance_Payment').eq('Customer_ID_UUID', item.Customer_ID);
            let Advance_Payment = 0;
            let Full_Amount = 0;
            res.data.forEach((i) => {
                Full_Amount = Full_Amount + i.Full_Amount;
                i.Advance_Payment.forEach((am) => {
                    Advance_Payment = Advance_Payment + am.Advance;
                });
            });
            return { ...item, Balance: Full_Amount-Advance_Payment,Full_Amount:Full_Amount };
        }));
        return ArrayToReturn;
    } catch (error) {
        return [];
    }
}
export async function DeleteCustomerFuntion(Customer_ID) {
    noStore();
    try {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
        const result = await supabase.from('CustomerName').delete().eq('Customer_ID', Customer_ID);
        const res = await supabase.from('UserEvents').delete().eq('Customer_ID_UUID', Customer_ID);
        if(result.status == 204 && res.status == 204){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        return false;
    }
}
export async function DeleteCustomerEventFuntion(EventID) {
    noStore();
    try {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
        const res = await supabase.from('UserEvents').delete().eq('EventID', EventID);
        if(res.status == 204){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        return false;
    }
}
export async function GetCustomerGrettingsFuntion(){
    noStore();
    const UserID = cookies();
    const User_Name = UserID.get('UserID').value;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('GreetingName').select('*').eq('User_Name',User_Name);
    return result.data;
}
export async function CreateCustomerGrettingsFuntion(GreatingsCrm,GreatingsDes,PhotoURL){
    noStore();
    const UserID = cookies();
    const User_Name = UserID.get('UserID').value;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('GreetingName').insert([{"Desc":GreatingsDes,"User_Name":User_Name,"Photo":PhotoURL,"Greeting_Name":GreatingsCrm}]);
    if(result.status === 201){
        return true;
    }else{
        return false;
    }
}
export async function GetEventsByUUID(UUID){
    noStore();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('UserEvents').select('EventID,EventDate,EventName,Customer_ID_UUID,Full_Amount,Advance_Payment,Status').eq('Customer_ID_UUID',UUID);
    return result.data
}
export async function UpdateStatusByUUID(EventID,StatusValue){
    noStore();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);  
    const result = await supabase.from('UserEvents').update({ Status: StatusValue }).eq('EventID',EventID).select()
    return result.data
}
export async function GetEventsAmountByUUID(UUID,name){
    noStore();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('UserEvents').select('Advance_Payment').eq('Customer_ID_UUID',UUID).eq('EventName',name);
    return result.data
}
export async function GetEventsTotalAmountByUUID(UUID,name){
    noStore();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('UserEvents').select('Full_Amount').eq('Customer_ID_UUID',UUID).eq('EventName',name);
    return result.data
}
export async function UpdateEventsAmountByUUID(UUID,name,Advance_Payment){
    noStore();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('UserEvents').update({'Advance_Payment':Advance_Payment}).eq('Customer_ID_UUID',UUID).eq('EventName',name);
}
export async function CreateCustomerEvent(UUID,EventName,EventDate,PaymentMode,FullAmount,Advance){
    noStore();
    const UserID = cookies();
    const User_Name = UserID.get('UserID').value;
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('UserEvents').insert([{"UserID": User_Name,"EventDate":`${EventDate}`,"EventName":`${User_Name}-${EventName.split(' ').join('_')}`,"Favourite_Images":[],"Customer_ID_UUID":UUID,"Mode_Of_Payment":PaymentMode,"Full_Amount":FullAmount,"Advance_Payment":[{"Date":formattedDate,"Mode_Of_Payment":PaymentMode,"Advance":+Advance}]}]);
    if(result.status == 201){
        return true;
    }else{
        return false;
    }
}
export async function UpdateCustomerEvent(UUID,EventName,EventDate,PaymentMode,FullAmount){
    noStore();
    console.log(UUID,EventName,EventDate,PaymentMode)
    const UserID = cookies();
    const User_Name = UserID.get('UserID').value;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('UserEvents').update({"EventDate":`${EventDate}`,"EventName":`${User_Name}-${EventName.split(' ').join('_')}`,"Mode_Of_Payment":PaymentMode,"Full_Amount":FullAmount}).eq('EventID',UUID);
    if(result.status == 204){
        return true;
    }else{
        return false;
    }
}
export async function CreateAmountWithUUIDEvent(uuid,name,Date,Payment,Amount){
    noStore();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('UserEvents').select('Advance_Payment').eq('Customer_ID_UUID',uuid).eq('EventName',name);
    const Array = result.data[0].Advance_Payment;
    const Data = await supabase.from('UserEvents').update({ Advance_Payment: [{"Date":Date,"Mode_Of_Payment":Payment,"Advance":+Amount},...Array]}).eq('Customer_ID_UUID',uuid).eq('EventName',name).select('Advance_Payment');
    if(Data.status == 200){
        return true;
    }else{
        return false;
    }
}

export async function GetAllEventsDate(currentMonth,currentYear){
    noStore();
    const UserID = cookies();
    const User_Name = UserID.get('UserID').value;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const firstDayOfMonth = new Date(currentYear,currentMonth+1, -1);
    const lastDayOfMonth = new Date(currentYear,currentMonth + 1, 1);
    const result = await supabase.from('UserEvents')
        .select('EventDate,EventName,Status,Customer_ID_UUID')
        .eq('UserID', User_Name)
        .neq('Customer_ID_UUID',null)
        .gte('EventDate', `${currentYear}-${currentMonth+1}-01`)
        .lte('EventDate', lastDayOfMonth.toISOString().split('T')[0]);
    const resultData = result.data.map(item => {
        return [+item.EventDate.split('-')[2], item.EventName.split('-')[1].split('_').join(' '),item.Status,item.Customer_ID_UUID,item.EventName];
    });
    return resultData;
}
export async function GetEventNameByDate(StartDate,EndDate,UUID){
    noStore();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('UserEvents')
        .select('EventID,EventDate,EventName,Customer_ID_UUID,Full_Amount,Advance_Payment,Status')
        .eq('Customer_ID_UUID',UUID)
        .gte('EventDate', StartDate)
        .lte('EventDate', EndDate);
    return result.data;
}
export async function UpdatePassword(CurrentPassword,NewPassword){
    noStore();
    const UserID = cookies();
    const User_Name = UserID.get('UserID').value;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('Studio-Admin').select('Password').eq('UserID',User_Name).eq('Password',CurrentPassword);
    if(result.data.length == 0){
        return 'Current password is not valid ...'
    }else{
        if(result.data[0].Password == CurrentPassword){
            const resultUpdate = await supabase.from('Studio-Admin').update({"Password":NewPassword}).eq('UserID',User_Name);
            if(resultUpdate.status == 204){
                return 'Password Successfully Updated';
            }else{
                return 'Something went wrong';
            }
        }
    }
}
export async function FetchUserInFo(){
    noStore();
    const UserID = cookies();
    const User_Name = UserID.get('UserID').value;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('Studio-Admin').select('*').eq('UserID',User_Name);
    return result.data[0];
}
export async function UpdateUserInFo(Phone_No,Location,Website){
    noStore();
    const UserID = cookies();
    const User_Name = UserID.get('UserID').value;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('Studio-Admin').update({"Phone_No":Phone_No,"Location":Location,"Website":Website}).eq('UserID',User_Name);
}
export async function UpdateUserInfoLogo(URL){
    noStore();
    const UserID = cookies();
    const User_Name = UserID.get('UserID').value;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('Studio-Admin').update({"Logo":URL}).eq('UserID',User_Name);
    if(result.status == 204){
        return true
    }else{
        return false
    }
}
export async function Logout(){
    cookies().delete('Password');
    cookies().delete('UserID');
}