import JSZip from 'jszip';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

export async function GET(request) {
    const s3Client = new S3Client({
        region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
        credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY
        }
    });

    
    const listParams = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Prefix: `farzin-Ashwathi_and_Harish_wedding/photographers_images/1`
        // Prefix: `AnthillNetworks-fre/photographers_images/1`
    };

    const fetchedImages = await s3Client.send(new ListObjectsV2Command(listParams));
    const imageKeys = fetchedImages.Contents.map(obj => obj.Key);

    const zip = new JSZip();

    for (const key of imageKeys) {
        const getObjectParams = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: key
        };
        const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));
        const imageBuffer = await streamToBuffer(Body);
        zip.file(key, imageBuffer);
    }

    const archive = await zip.generateAsync({ type: "blob" });

    return new Response(archive, {
        status: 200,
        headers: {
            'Content-Type': 'application/zip'
        }
    });
}

async function streamToBuffer(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}





// import { NextResponse  } from "next/server";
// import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
// import JSZip from 'jszip';

// export async function GET(req) {

//   const { SearchParams } = new URL(req.url)
//   const images = JSON.parse(SearchParams.get('images'));

//   const Downloads = await Promise.all(images.map( async image => {
//      const response = await fetch(image.url);
//      const data = await response.arrayBuffer();
//      return { 
//       ...image,
//       data
//     }
//   }))

//   const s3Client = new S3Client({
//     region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
//     credentials: {
//       accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
//       secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY
//     }
//   });

//   const listParams = {
//     Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
//     Prefix: `farzin-Ashwathi_and_Harish_wedding/photographers_images/test`
//   };

//   const FetchedImages = await s3Client.send(new ListObjectsV2Command(listParams));
//   const fetchedImages = FetchedImages.Contents.map(obj => obj.Key);

//   // Ziping Context
//   const zip = new JSZip();

//   Downloads.forEach((download) => {
//     zip.file(download.name,download.data);
//   })

  
//   const arc = await  zip.generateAsync({type:"blob"});

//   return new Response(arc, {
//     status: 200,
//     headers: {
//       "Content-Type" : 'application/zip'
//     }
//   })
// }



// // export default async function handler(req, res) {

// //   try {
// //     const FetchedImages = await s3Client.send(new ListObjectsV2Command(listParams));
// //     const fetchedImageKeys = FetchedImages.Contents.map((obj) => obj.Key);

//     // fetchedImageKeys.forEach((key) => {
//     //   zip.file(key, s3Client.getObject({ Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME, Key: key }));
//     // });

//     // const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
//     // console.log(zipContent);

//     // res.setHeader('Content-Disposition', 'attachment; filename=images.zip');
//     // res.setHeader('Content-Type', 'application/zip');
//     // res.status(200).send(zipContent);

//     // return NextResponse.json({
//     //   data: "zip"
//     // })
    

// //   } catch (error) {
// //     console.error('Error fetching images:', error);
// //     res.status(500).json({ error: 'Error fetching images' });
// //   }
// // }
