'use client'
import React, { useRef } from 'react';
import Styles from "./page.module.css"
import QRCode from "react-qr-code";
export default function QrCodeGen({EventName}){
    const qrCodeRef = useRef(null);
    const downloadQRCode = () => {
      const svg = qrCodeRef.current.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qr-code.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
    return(
        <>
        <div className={Styles.QrCodeGen}>
            <div>
                <div>Scan Here</div>
                <div ref={qrCodeRef}><QRCode value={`${process.env.NEXT_PUBLIC_WEB_APP_BASE_URL}/upload/${EventName}`} /></div>
                <button className={Styles.downbtn} onClick={downloadQRCode}>Download QR Code</button>
            </div>
        </div>
        </>
    )
}
