import { NextResponse } from "next/server"
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from "next/headers";

export async function POST(req, res) {

    noStore();

    const data = await req.json()
    console.log(data)
    const fun = "SendMessages";
    try {
        const response = await fetch('https://tupea9a965.execute-api.ap-south-1.amazonaws.com/sendwhatsappmsg/', {
            method: 'POST',
            body: JSON.stringify({ data , fun }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            return NextResponse.json({
                data: data.body
            })
        } else {
            throw new Error('Failed to send greeting messages');
        }
    } catch (error) {
        console.error(error);
        return NextResponse.status(200).json(error);
    }
}
