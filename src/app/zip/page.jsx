import React from 'react';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const DownloadImages = async () => {

    const downloadImages = async () => {
        try {
        const response = await fetch('/api/'); 
            if (response.ok) {
                const data = await response.json()
                const baseURL = 'https://selife-bucket.s3.ap-south-1.amazonaws.com/';
                for (const [key, value] of Object.entries(data['hello'])) {
                    console.log(value)
                    const parts = value.split('/');
                    const modifiedURL = baseURL + parts.slice(0, -2).join('/') + '/COMPRESS_IMAGES/' + parts.slice(-2).join('/');
                    console.log(modifiedURL);
                }
            } else {
                console.error('Error downloading file:', response.status);
            }
        } catch (error) {
        console.error('Error downloading images:', error);
        }
    };

  return (
    <div>
        {/* <a href={`/api/archive?images=${encodeURIComponent(JSON.stringify(images))}`} target="_blank" className="inline-block rounded py-2.5 px-6 text-sm text-white font-bold uppercasetext-white bg-slate-600 hover:bg-slate-500 dark:bg-slate-500 dark:hover:bg-slate-400">
          Download
        </a> */}
        <a href={`/api/archive`} target="_blank" className="inline-block rounded py-2.5 px-6 text-sm text-white font-bold uppercasetext-white bg-slate-600 hover:bg-slate-500 dark:bg-slate-500 dark:hover:bg-slate-400">
          Download
        </a>
    </div>
  );
};

export default DownloadImages;


// "use client"
// import { useState } from 'react';

// export default function Download() {
//     const [downloading, setDownloading] = useState(false);

//     const handleDownload = async () => {
//         setDownloading(true);

//         try {
//             const response = await fetch('/api/archive');
//             const blob = await response.blob();

//             // Create a temporary link and trigger download
//             const url = window.URL.createObjectURL(new Blob([blob]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', 'images.zip');
//             document.body.appendChild(link);
//             link.click();

//             // Cleanup
//             window.URL.revokeObjectURL(url);
//             document.body.removeChild(link);
//         } catch (error) {
//             console.error('Error downloading images:', error);
//         } finally {
//             setDownloading(false);
//         }
//     };

//     return (
//         <div>
//             <h1>Download Images as Zip</h1>
//             <button onClick={handleDownload} disabled={downloading}>
//                 {downloading ? 'Downloading...' : 'Download Zip'}
//             </button>
//         </div>
//     );
// }




