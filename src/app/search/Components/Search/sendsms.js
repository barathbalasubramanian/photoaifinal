'use server';
import React from 'react';
import { createClient } from "@supabase/supabase-js";
import { S3Client, ListObjectsV2Command,PutObjectCommand } from '@aws-sdk/client-s3';
import { unstable_noStore as noStore } from 'next/cache';
import axios from 'axios';
export default async function sendsms(event) {
    try {
        noStore();
        
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
        const Whatsapp_URL = await supabase.from('UserEvents').select('UserID').eq('EventName', event);
        const BaseUrl = Whatsapp_URL.data[0].UserID;
        const Whatsapp_ = await supabase.from('Studio-Admin').select('WhatsApp_API,Is_Whatsapp_Verified').eq('UserID', BaseUrl);
        const WhatUrl = Whatsapp_.data[0].WhatsApp_API;
        const s3Client = new S3Client({
            region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
            credentials: {
              accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
              secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY
            }
        });
        const listParams = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Prefix: `${event}/selfie/`
        };
        const response = await s3Client.send(new ListObjectsV2Command(listParams));
        const numbers = [];
        if (response.Contents.length !== 0) {
            const jpgPngFiles = response.Contents.filter(obj => obj.Key.endsWith('.json')).map(obj => obj.Key);
            for (let a = 0; a < jpgPngFiles.length; a++) {
                const data = await axios.get(`https://selife-bucket.s3.ap-south-1.amazonaws.com/${jpgPngFiles[a]}`);
                const num = data.data.phno;
                    if(Whatsapp_.data[0].Is_Whatsapp_Verified){
                        // console.log(event.split('-')[1])phone=8307056141&text=account_message_ma&priority=wa&stype=normal&Params=Farzin,TeamHeadshot,https://photo-ai-ai.vercel.app/user/admin-Final_testing/Farzin,Headshot
                        const Text = `${WhatUrl}&phone=${num}&text=account_message_ma&priority=wa&stype=normal&Params=${jpgPngFiles[a].split('/')[2]},${event.split('-')[0]},${process.env.NEXT_PUBLIC_WEB_APP_BASE_URL}/user/${event}/${jpgPngFiles[a].split('/')[2]},${event.split('-')[0]}`
                        console.log(Text);
                        numbers.push([Text,num]);
                    }else{
                        const Text = `${WhatUrl}&number=91${num}&type=text&message=Hey ${jpgPngFiles[a].split('/')[2]},%0A%0A%0A✨ ${event.split('-')[0]} magic has begun!%0A%0AClick now for your exclusive wedding event photos! 📸 %0A%0A✨ 👉 ${process.env.NEXT_PUBLIC_WEB_APP_BASE_URL}/user/${event}/${jpgPngFiles[a].split('/')[2]}%0A%0ACheers to the moments! 🎉✨ ${event.split('-')[0]} Magic InstantMemories`
                        console.log(Text,"hasdbfeffbhvjhsbjhdsbv")
                        numbers.push([Text,num]);
                    }
            }
        }
        console.log(numbers,event);
        const res = await hitAPI(numbers,event);
        return res
    } catch (error) {
        return false;
    }
}

async function hitAPI(numbersList,event) {
    noStore();
    const s3Client = new S3Client({
        region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY
        }
    });
    let hits = 0;
    for (let i = 0;i<numbersList.length; i++) {
        const number = numbersList[i][0];
            const sendNumber = await axios.get(`https://selife-bucket.s3.ap-south-1.amazonaws.com/${event}/WhatsApp_Send_Messages.json`);
            if (!sendNumber.data.includes(numbersList[i][1])) {
                const response = await fetch(`${number.split(' ').join('%20')}`);
                if (response.ok) {
                    hits++;
                    const uploadJaonPara = {
                        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
                        Key: `${event}/WhatsApp_Send_Messages.json`,
                        Body: JSON.stringify([...sendNumber.data,numbersList[i][1]]),
                        ContentType: 'application/json',
                        ACL: 'public-read'
                    };
                    if (hits % 5 === 0) {
                        console.log("Reached 5 hits. Waiting for 5 Seconds...");
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }
                    const respons = await s3Client.send(new PutObjectCommand(uploadJaonPara));
                } else {
                    console.log(`API hit failed for number: ${number}`);
                    return `API hit failed for number: ${number}`
                }
            }else{
                console.log("Already in the list");
                return "Already in the list";
            }
    }
    return true;
}