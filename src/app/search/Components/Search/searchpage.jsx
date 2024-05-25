"use client"
import Styles from "./page.module.css";
import Link from "next/link";
import { useEffect, useState, useRef, use } from "react";
import Swal from "sweetalert2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Popper from "@mui/material/Popper";
import { searchFun } from "@/app/crm/Components/Home/DownloadCSV";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sendsms from "./sendsms";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import { set_is_super_admin } from "@/app/Provider/redux/Login";
import imageCompression from "browser-image-compression";
import { Line } from "rc-progress";
import { FetchUploadedData } from "./get_uploadeds";
import Loader from "@/app/loader/page";
import { Dialog,DialogContent } from '@mui/material';

import { folder } from "jszip";



import Storefolder from "./storeFolder";
import { store } from "@/app/Provider/redux/sotre";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DownloadExcel from "./DownloadExcel";
import { useRouter } from 'next/navigation'
import StoreKey from "./storeSecretkey";

export default function Search({ AllEventData, SuperAdmin }) {
  let form = useRef(null);
  const state = useSelector((state) => state.Login.Is_SuperAdmin);
  const dispatch = useDispatch();
  const [inputbox, inputboxvalue] = useState(false);
  const [month, monthvalue] = useState("");
  const [Events, EventsValue] = useState(AllEventData);
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, searchvalue] = useState(AllEventData);
  const [open, setOpen] = useState(false);
  const [upload, uploadvalue] = useState([]);
  const [uploadstatus, uploadstatusvideo] = useState(false);
  const [percentage, percentagevalue] = useState(0);
  const [tottaluploaded, totaluploadedvalue] = useState(0);
  const [sendmessage, SetSendMessageTexr] = useState("Send Messages");
  const [LoaderStatus, LoaderStatsValue] = useState(false);

  // rewriter
  const [searchValue, setSearchValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [eveName, seteveName] = useState("");
  const [eveDate, seteveDate] = useState("");
  const [eveLoc, seteveLoc] = useState("");
  const [groomName, setgroomName] = useState("");
  const [brideName, setbrideName] = useState("");
  const [openDrawer, setopenDrawer] = useState(false);
  const [searchPage,setsearchPage] = useState(true);
  const [CreateNew,setCreateNew] = useState(false);
  const [allFolders , setAllfolders] = useState([]);
  const [allFoldersPage , setAllfoldersPage] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [loadeer, loadderevalue] = useState(false);
  const [videoupload,setvideoUpload] = useState(false);

  const [loc_,setloc_] = useState("");
  const router = useRouter();
  const [secretDiv,setsecretDiv] = useState(false);
  const [secretKey, setSecretKey] = useState('');
 
  const buttons = [
    { id: "uploadFolder", label: "Upload Images" },
    { id: "uploadVideos", label: "Upload Videos"},
    { id: "dashboard", label: "Dashboard" },
    { id: "digitalInvite", label: "Digital Invite" },
    { id: "report", label: "Report" },
    { id: "qrcode", label: "QR Code" },
    { id: "generatesecret", label: "Secret Key"}
  ];

  const handleOptionSelect = (item) => {
    console.log(item);
    monthvalue(item.EventName);
    // console.log(item.EventDate)
    setSelectedOption(item.EventName.split("-")[1]);
    setSearchValue(item.EventName.split("-")[1].split("_").join(" "));
    seteveDate(item.EventDate);
    setAllfolders(item.Folders);
    seteveLoc(item.Location);
    setgroomName(item.DigitalInvite[0]["groomname"])
    setbrideName(item.DigitalInvite[0]["bridename"])
    setloc_(item.DigitalInvite[0]["location_"])
    setOpen(false);
  };

  const handleSearchInputChange = (e) => {
    searchvalue(searchFun(e.target.value, AllEventData));
    setSearchValue(e.target.value);
  };

  const [details, setDetails] = useState(false);
  const handleSearch = () => {
    setDetails(true);
  };

  const handleClick = async (id) => {
    console.log("Clicked button:", id);
    console.log(selectedOption,"Sel")
    if (selectedOption) {
      if (id === "uploadFolder") {
        if ( allFolders.length <= 0 ) {
          setsearchPage(false);
          setCreateNew(true);
        }
        else {
          setsearchPage(false);
          setAllfoldersPage(true);
        }
      } 
      else if ( id === "uploadVideos" ) {
        setvideoUpload(true);
      }
      else if ( id === "digitalInvite") {
        const eventData = {
          eventDate: eveDate || " ",
          groomName : groomName || " ",
          brideName : brideName || " ",
          loc_: loc_ || " "
        };

        const jsonData = JSON.stringify(eventData);
        const encodedData = encodeURIComponent(jsonData);
        router.push(`/digitalinvite/${eveDate}_${groomName}_${brideName}_${loc_.split(" ").join(".")}_${month.split("_").join(".")}`);
        // window.location = `/digitalinvite?data=${encodedData}`;
      }
      else if ( id === "qrcode" ){
        console.log(month)
        router.push(`/qrcode/${month}`);
        // window.location = `/qrcode/${month}`;
      }
      else if ( id === "report"){
        let excel = await DownloadExcel(month);
        console.log(excel); 
      }
      else if (id === "generatesecret") {
        console.log("Gen")
        setsecretDiv(true)
      }
      else if (id === "dashboard") {
        router.push(`/dashboard/${month}`)
      }
    }
    else {
      toast.warning("Select a event first");
    }
  };

  const handleNewFolderClick = () => {
    setIsDialogOpen(true);
  };

  const handleCancelClick = () => {
    setIsDialogOpen(false);
  };

  const handleCreateClick = async() => {
    loadderevalue(true)
    console.log('Creating folder with name:', folderName);
    console.log(folderName,searchValue);
    let storeData = await Storefolder(folderName,searchValue.split(" ").join("_"))
    loadderevalue(false);

    if (storeData === "Folder Already Exists") {
      toast.warning("Folder Aldready Exists Pls Provide Unique Name!");
    }

    else {
      setAllfolders(storeData.data[0]["Folders"])
      setIsDialogOpen(false);
      setFolderName('');
      setCreateNew(false);
      setAllfoldersPage(true);
    }
};

  const GetAllEvent = async () => {
    dispatch(set_is_super_admin(SuperAdmin));
  };
  useEffect(() => {
    GetAllEvent();
  }, []);

  const handleFolderDoubleClick = (value) => {
    setSelectedFolder(value);
    console.log(value);
    inputboxvalue(true);
  };

  const UploadImages = async (e) => {
    LoaderStatsValue(true)
    e.preventDefault();
    uploadstatusvideo(true);
    var UploadedArray = await FetchUploadedData(month);
    const s3Client = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
      },
    });

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    for (let i = 0; i < upload.length; i++) {
      if (UploadedArray.includes(upload[i].name)) {
        const per = ((i + 1) / upload.length) * 100;
        totaluploadedvalue(i + 1);
        percentagevalue(Math.ceil(per));
        continue; // Skip already uploaded images
      }

      let retries = 0;
      let success = false;
      while (!success && retries < 3) {
        // Retry at most 3 times
        try {
          const startTime = Date.now();
          var Compresedimage = upload[i];
          if (upload[i].size / (1024 * 1024) > 1) {
            Compresedimage = await imageCompression(upload[i], options);
          }
          const uniqueFileName = new Date()
            .toISOString()
            .replace(/[-:.]/g, "")
            .replace("T", "_");
          const uploadCommand = new PutObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: `${month}/COMPRESS_IMAGES/${selectedFolder}/${month + uniqueFileName}.jpg`,
            Body: Compresedimage,
            ACL: "public-read",
          });
          const respo = await s3Client.send(uploadCommand);
          if (respo.$metadata.httpStatusCode == 200) {
            const uploadd = new PutObjectCommand({
              Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
              Key: `${month}/photographers_images/${selectedFolder}/${
                month + uniqueFileName
              }.jpg`,
              Body: upload[i],
              ACL: "public-read",
            });
            const response = await s3Client.send(uploadd);
            if (response.$metadata.httpStatusCode == 200) {
              UploadedArray.push(upload[i].name);
              const uploadJaonPar = {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
                Key: `${month}/Uploaded_Images.json`,
                Body: JSON.stringify(UploadedArray),
                ContentType: "application/json",
                ACL: "public-read",
              };
              await s3Client.send(new PutObjectCommand(uploadJaonPar));
              const per = ((i + 1) / upload.length) * 100;
              totaluploadedvalue(i + 1);
              percentagevalue(Math.ceil(per));
              success = true; // Mark success if the upload is successful
            }
          }
        } catch (error) {
          console.error("Error occurred during upload:", error);
          // Retry after 1 minute
          await new Promise((resolve) => setTimeout(resolve, 180000));
          retries++;
        }
      }

      if (!success) {
        console.error(
          "Upload failed after retrying multiple times:",
          upload[i].name
        );
        // Handle failed upload here
        // You might want to log or handle failed uploads differently
      }
    }
    // setIsLoading(false);
    inputboxvalue(false);
    uploadvalue(null);
    totaluploadedvalue(0);
    percentagevalue(0);
    // Toast.fire({ icon: "success", title: "Upload Success ..." });
    toast.success("Upload Success ...");
    uploadstatusvideo(false);
    LoaderStatsValue(false)
  };

  const SendSMSFunction = async () => {
    console.log("Sending...")
    LoaderStatsValue(true);
    // const response = await sendsms(month);
    const monthValue = month;
    try {
      const response = await fetch('api/sendmsg', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({monthValue})
      });
      if (response.ok) {
          let data = await response.json()
          console.log('Messages sent successfully!');
          toast.success(`Messages sent successfully ${data.data}!`);
      } else {
          console.error('Failed to send messages');
      }
    } catch (error) {
        console.error('Error:', error);
    }

    // if (response) {
    //   toast.success("Message Send Successfully");
    // } 
    // else {
    //   toast.warning(response);
    // }
    // console.log(response)
    LoaderStatsValue(false);
  };

  const truncateString = (str, maxLength) => {
    if (str.length <= maxLength) {
      return str;
    } else {
      return str.substring(0, maxLength - 3) + "...";
    }
  }

  const handleSetKey = async() => {
    setSecretKey(document.getElementById('secretKeyInput').value);
    console.log(document.getElementById('secretKeyInput').value,"SecretKey");

    if ( document.getElementById('secretKeyInput').value != "" ) {
      const saveKey = await StoreKey(document.getElementById('secretKeyInput').value,searchValue.split(" ").join("_"));
      console.log(saveKey)
      
      if (saveKey == "Success") {
        toast.success("Secret Key Saved!");
      }
      else{
        toast.error("Error While Saving Secret Key or Secret Key is Already Saved ")
      } 
    }
    else {
      toast.warning("Secret Key is not Valid !!!")
    }

    document.getElementById('secretKeyInput').value = "";
    setSecretKey("") ;
    setsecretDiv(false);
  };


  const UploadVideos = async (e) => {
    LoaderStatsValue(true)
    e.preventDefault();
    uploadstatusvideo(true);

    const s3Client = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
      },
    });
  
    console.log(upload.length)
    for (let i = 0; i < upload.length; i++) {
      let retries = 0;
      let success = false;
      while (!success && retries < 3) {
        try {
          const uniqueFileName = new Date()
            .toISOString()
            .replace(/[-:.]/g, "")
            .replace("T", "_");
          
          const uploadCommand = new PutObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: `${month}/photographers_videos/${month + uniqueFileName}.mp4`,
            Body: upload[i],
            ACL: "public-read",
          });
  
          const response = await s3Client.send(uploadCommand);
          console.log(`Upload successful! ${response.key}`);
          const per = ((i + 1) / upload.length) * 100;
          totaluploadedvalue(i + 1);
          percentagevalue(Math.ceil(per));
          success = true;
        } catch (error) {
          console.error("Error occurred during upload:", error);
          await new Promise((resolve) => setTimeout(resolve, 180000)); 
          retries++;
        }
      }
  
      if (!success) {
        console.error(
          "Upload failed after retrying multiple times:",
          upload[i].name
        );
      }
    }
    setvideoUpload(false);
    uploadvalue(null);
    totaluploadedvalue(0);
    percentagevalue(0);
    toast.success("Upload Success ...");
    uploadstatusvideo(false);
    LoaderStatsValue(false)
  };
  
  return (
    <>

      {loadeer ? <Loader /> : ""}
      {/* rewrite */}
      <div className={Styles.Container}>
        <ToastContainer className={Styles.toastDiv}/>
        <div className={Styles.subCon}>
            {searchPage ? (
                <>
                <div className={Styles.searchPage}>
                    <div className={Styles.SearchDiv}>
                      <div className={Styles.inpDiv}>
                          <input
                          id={Styles.input}
                          type="text"
                          value={searchValue}
                          onChange={handleSearchInputChange}
                          onFocus={(e) => {
                              setAnchorEl(e.currentTarget);
                              setOpen(true);
                          }}
                          onBlur={() => {
                              setOpen(false);
                          }}
                          placeholder="Search Event"
                          />
                          <div>
                          <button
                              className={Styles.searchbtn}
                              onClick={handleSearch}
                          >
                              Search
                          </button>
                          </div>
                      </div>
                      <div
                          className={Styles.hamburger}
                          onClick={() => setopenDrawer(true)}
                      >
                          <img
                          src="/svg/hamburgerVector.png"
                          alt="Example"
                          className={Styles.hamburgerimg}
                          />
                      </div>
                    </div>
                    <Popper
                    sx={{ zIndex: 1200 }}
                    open={open}
                    anchorEl={anchorEl}
                    placement="bottom-start"
                    transition
                    style={{"background":"none"}}
                    >
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                        <Paper className={Styles.popperDiv}>
                            {search.map((item, index) => {
                            if (index <= 4) {
                                return (
                                <div
                                    className={Styles.searchresult}
                                    key={index + 1}
                                >
                                    <div onClick={() => handleOptionSelect(item)}>
                                    {index + 1}.{" "}
                                    {state
                                        ? item.EventName
                                        : item.EventName.split(`${item.UserID}-`)[1]
                                            .split("_")
                                            .join(" ")}
                                    </div>
                                </div>
                                );
                            }
                            })}
                        </Paper>
                        </Fade>
                    )}
                    </Popper>
                    {details ? (
                    <>
                        <div className={Styles.eveDetails}>
                        <div className={Styles.evename}>{month.split("-")[1].split("_").join(" ")}</div>
                        <div className={Styles.detail}> 
                            <div className={Styles.div1}>
                              <div>Date : {eveDate}</div>
                              <div>Location : {eveLoc}</div>
                            </div>
                            <div className={Styles.div2}>
                              <div>Bride Name : {brideName}</div>
                              <div>Groom Name : {groomName}</div>
                            </div>
                        </div>
                        <div className={Styles.mobOptions}> 
                          {buttons.map((button) => (
                            <button
                                key={button.id}
                                className={Styles.btns}
                                onClick={() => handleClick(button.id)}
                            >
                                {button.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                    ) : (
                    ""
                    )}
                    {/* Drawer */}
                    {openDrawer ? (
                    <>
                        <div className={`${Styles.drawer}`} openDrawer={openDrawer}>
                        <div
                            className={Styles.close}
                            onClick={() => setopenDrawer(false)}
                        >
                            <img
                            src="/svg/close.svg"
                            alt="X"
                            className={Styles.clsbtn}
                            />
                        </div>
                        <div className={Styles.options}>
                            {buttons.map((button) => (
                            <button
                                key={button.id}
                                className={Styles.btns}
                                onClick={() => handleClick(button.id)}
                            >
                                {button.label}
                            </button>
                            ))}
                            {SuperAdmin?<button className={Styles.btns} onClick={()=>{if(month === ''){Toast.fire({icon: 'warning',title: 'No Event Selected ...'})}else{SendSMSFunction()}}}>{sendmessage}</button>:<></>}
                        </div>
                        </div>
                    </>
                    ) : (
                    ""
                    )}
                </div>
                </>
            ) : (
                ""
            )}
            {
                CreateNew ? 
                <>
                    <div className={Styles.backfromcrt} onClick={() => {setCreateNew(false); setsearchPage(true); setopenDrawer(false)}}><img style={{ width: "8px" }} src="/svg/back.svg"></img> Back</div>
                    <div className={Styles.newfolderDiv} >
                        <img  src="/svg/createnewfolder.svg" alt="Create New Folder" className={Styles.crtnewImg} onClick={handleNewFolderClick}/>
                    </div>
                    {   
                        isDialogOpen && (
                        <div className={Styles.dialogBackdrop}>
                            <div className={Styles.maincrtDiv}>
                                <div className={Styles.createnewDiv}>
                                  <div>New Folder</div>
                                  <div>
                                      <input
                                      id={Styles.crtnew}
                                      type="text"
                                      placeholder="Untitled Folder"
                                      value={folderName}
                                      onChange={(e) => setFolderName(e.target.value)}
                                      />
                                  </div>
                                  <div className={Styles.crtcan}>
                                      <div className={Styles.can} onClick={handleCancelClick}>Cancel</div>
                                      <div className={Styles.crt} onClick={handleCreateClick}>Create</div>
                                  </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                </>: ""
            }
            {
              allFoldersPage ?
              <>
                    <div className={Styles.backfromcrt} onClick={() => {setCreateNew(false); setsearchPage(true); setopenDrawer(false); setAllfoldersPage(false)}}><img style={{ width: "8px" }} src="/svg/back.svg"></img> Back</div>
                    {/* <div className={Styles.backfromcrt}>Back</div> */}
                    <div className={Styles.allFolderstit}>All Folders</div>
                    <div className={Styles.FoldersCon}>
                      {allFolders.map((value, index) => (
                        <div key={index} className={Styles.folder} onDoubleClick={() => handleFolderDoubleClick(value)}>
                          <img src="/svg/folder.svg" alt={`${index}`} className={Styles.folderImg}/>
                          <div className={Styles.folName}>{truncateString(value, 11)}</div>
                        </div>
                      ))}
                      <div className={Styles.folder} onClick={() => {setAllfoldersPage(false);setCreateNew(true);}}> 
                        <img src="/svg/newfolder.svg" alt="newfolder" className={Styles.folderImg} />
                        <div className={Styles.folName}>New Folder</div>
                      </div>
                    </div>
              </> : ""
            }
            {inputbox?
              <div className={Styles.dialogBackdrop}>
                <div className={Styles.maincrtDiv}>
                  <div className={Styles.FilesInputBox}>
                    <div>
                        <form onSubmit={UploadImages} ref={form} enctype="multipart/form-data">
                            <div>
                                <div>Select To Upload</div>
                                <div onClick={()=>{inputboxvalue(false)}}>&#x2716;</div>
                            </div>
                            <input type="file" name="Image_Files" accept=".jpg, .jpeg, .png" multiple required onChange={(e)=>{uploadvalue(e.target.files)}}/>
                            <button type="submit" disabled={uploadstatus}>{uploadstatus?"Please wait ...":"Upload"}</button>
                            {uploadstatus?<>
                                <div className={Styles.UploadPercentage}>
                                    <div className={Styles.UploadPercentagetext}>{percentage}% Uploaded ...</div>
                                    <div>
                                        <div className={Styles.lineclass}><Line percent={percentage} strokeWidth={3} strokeColor="#725aff" trailColor="#fbfcfd67"/></div>
                                        <div className={Styles.UploadPercentagetext}>{`${tottaluploaded} /  ${upload.length}`}</div>
                                    </div>
                                </div>
                            </>:<></>}
                        </form>
                    </div>
                  </div>
                </div>
              </div>
              :<></>
            }

            {
              videoupload ? 
              <>
                <div className={Styles.dialogBackdrop}>
                  <div className={Styles.maincrtDiv}>
                    <div className={Styles.FilesInputBox}>
                      <div>
                        <form onSubmit={UploadVideos} ref={form} encType="multipart/form-data">
                          <div>
                            <div>Select Videos to Upload</div>
                            <div onClick={() => { setvideoUpload(false) }}>&#x2716;</div>
                          </div>
                          <input type="file" name="Video_Files" accept=".mp4" multiple required onChange={(e) => { uploadvalue(e.target.files) }} />
                          <button type="submit" disabled={uploadstatus}>{uploadstatus ? "Please wait ..." : "Upload"}</button>
                          {uploadstatus ? <>
                            <div className={Styles.UploadPercentage}>
                              <div className={Styles.UploadPercentagetext}>{percentage}% Uploaded ...</div>
                              <div>
                                <div className={Styles.lineclass}><Line percent={percentage} strokeWidth={3} strokeColor="#725aff" trailColor="#fbfcfd67" /></div>
                                <div className={Styles.UploadPercentagetext}>{`${tottaluploaded} /  ${upload.length}`}</div>
                              </div>
                            </div>
                          </> : <></>}
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </> : <></>
            }
            {
              secretDiv ?

              <div className={Styles.dialogBackdrop}>
                <div className={Styles.maincrtDiv}>
                  <div className={Styles.secretmainDiv}>
                    <div >
                      <input
                      id="secretKeyInput"
                      type="text"
                      placeholder="Secret Key"
                      className={Styles.secretInp}
                      />
                    </div>
                    <div className={Styles.secretopt}>  
                      <button  className={Styles.btnsec} style={{"color":"red"}} onClick={() => setsecretDiv(false)}>Close</button>
                      <button className={Styles.btnsec} onClick={handleSetKey}>Set Key</button>
                    </div>
                  </div>
                </div>
              </div>
            :<></>
            }
        </div>
      </div>
    </>
  );
}

