import { NextResponse } from "next/server"
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from "next/headers";

export async function POST(req, res) {

    noStore();
    const UserID = cookies(); 
    const User_Name = UserID.get('UserID').value;
    console.log(User_Name)

    const data = await req.json()
    const SendingData = data["SendingData"]
    const ArrayOfNumbers = data["ArrayOfNumbers"]

    try {
        const response = await fetch('https://tupea9a965.execute-api.ap-south-1.amazonaws.com/sendwhatsappmsg/', {
            method: 'POST',
            body: JSON.stringify({ SendingData , ArrayOfNumbers , User_Name }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response.body)
        if (response.ok) {
            return NextResponse.json({
                data: "zip"
            })
        } else {
            throw new Error('Failed to send greeting messages');
        }
    } catch (error) {
        console.error(error);
        return NextResponse.status(200).json(error);
    }
}
