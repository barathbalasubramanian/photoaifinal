'use client'
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Styles from "./page.module.css"
    const videoConstraints = {
        width: 4000,
        height: 4000,
        facingMode: "user"
    };
    // const constraints = {
    //   audio: false,
    //   video: { 
    //     facingMode: "user",
    //     width: { ideal: 640 }, 
    //     height: { ideal: 480 }
    //   },
    // };

    const TakeSelfi = ({setSelfie,captureselfivalue}) => {

        const videoRef = useRef(null);
        const canvasRef = useRef(null);
        const [stream, setStream] = useState(null);
        const webcamRef = useRef(null);
        const [Retake,retakevalue] = useState(false);
        const [image,imagevalue] = useState('');

        useEffect(() => {
            const constraints = {
              audio: false,
              video: { 
                facingMode: "user",
                width: { ideal: 4096 },
                height: { ideal: 2160 }
              },
            };
        
            navigator.mediaDevices
              .getUserMedia(constraints)
              .then((stream) => {
                setStream(stream);
                videoRef.current.srcObject = stream;
              })
              .catch((err) => {
                console.error(err);
              });
          }, [Retake]);

        const stopCamera=()=>{
           var stream = videoRef.current.srcObject;
           var tracks = stream.getTracks();
           for (var i = 0; i < tracks.length; i++) {
             tracks[i].stop();
           }
           setStream(null);
        }

    
    const downloadImage = (imageSrc, imageName) => {
        const a = document.createElement('a');
        a.href = imageSrc;
        a.download = imageName;
        a.click();
    };
    
    const capture = (async() => {

        const width = videoRef.current.videoWidth;
        const height = videoRef.current.videoHeight;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        canvasRef.current
          .getContext("2d")
          .drawImage(videoRef.current, 0, 0, width, height);
        const dataURL = canvasRef.current.toDataURL("image/png");

        const encodedData = dataURL.split(',')[1];
        const binaryData = atob(encodedData);
        const blob = new Blob([new Uint8Array(Array.from(binaryData).map(char => char.charCodeAt(0)))], { type: 'image/jpeg' });
        imagevalue(dataURL);
        setSelfie(blob);
        console.log("Blob :",blob)

        imagevalue(dataURL)
        // setSelfie(dataURL)
        downloadImage(dataURL, 'selfie.jpg');
        stopCamera();
      }

    );
    return (
      <>
        <div className={Styles.TakeSelfi}>
            <div>
                <div><h4>Capture Selfie</h4><strong>Keep Face in the Center</strong><div>and</div><div className={Styles.SecondStrong}>Press Capture</div><div className={Styles.CrossIcon} onClick={()=>{captureselfivalue(false)}}>&#x2716;</div></div>
                <div className={Styles.PositionRelative}>
                    {/* <div className={Styles.Overlay}><svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%"><defs><mask id="image-mask"><rect width="100%" height="100%" fill="#fff"></rect><rect width="79%" height="90%" x="10%" y="0" rx="120" ry="120" style={{transform: 'translate(0%, 10px)'}}></rect></mask></defs><rect className="webcam-mask" x="0" y="0" width="100%" height="100%" mask="url(#image-mask)" fillOpacity="1"></rect></svg></div> */}
                    {!Retake?<><div className={Styles.LottiePlayerDiv}>
                        <lottie-player src="/svg/facescan.json" className={Styles.LottiePlayer} background="transparent" speed="0.5" style={{width: '300px', height: '300px'}} direction="0" mode="normal" loop autoplay></lottie-player>
                    </div>
                    <div className={Styles.mwfhbwjhChED}>
                        <div className={Styles.mChED}>
                            <div>
                                {/* <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" screenshotQuality={1} videoConstraints={videoConstraints}/> */}
                                <video ref={videoRef} autoPlay controls allowsInlineMediaPlayback="true" style={{
                                    height:"300px",width:"300px",objectFit:"cover",borderRadius:"30%",transform: "scaleX(-1)"
                                }}/>
                                <canvas ref={canvasRef} style={{ display: "none" }}/>
                            </div>
                        </div>
                    </div></>:<><img src={image} alt="" style={{height:"300px",width:"300px",objectFit:"cover",borderRadius:"30%",transform: "scaleX(-1)"}}/></>}
                </div>
                <div className={Styles.capturebtn}>
                    {Retake?<div onClick={()=>{retakevalue(false);imagevalue(null);}}>Re-Take</div>:<></>}
                    <div onClick={()=>{if(Retake){captureselfivalue(false)}else{capture();retakevalue(true)}}}>{Retake?"Submit":"Capture"}</div>
                </div>
            </div>
        </div>
      </>
    );
  };
  export default TakeSelfi;
