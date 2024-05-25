'use client'
import { useState,useRef, useEffect } from "react"
import Styles from "./Components/page.module.css"
import MapData from "./Components/MapData/page"
import Swal from "sweetalert2"
import SearchModel from "./Components/Search/page"
import ExploreComp from "./Components/explore"
import Loader from "@/app/loader/page";
import imageCompression from 'browser-image-compression';
import { S3Client, ListObjectsV2Command, PutObjectCommand,GetObjectCommand } from '@aws-sdk/client-s3';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import Paper from '@mui/material/Paper';
import axios from "axios"
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { createClient } from '@supabase/supabase-js'
import { useDispatch, useSelector } from "react-redux"
import { FetchExploreSelfieData } from "./eventfetchdata"
import ConfirmDelete from "./confirm"
import Link from "next/link"
import { FetchUserInFo } from "@/app/crm/Components/Home/AllFunctions"
import Skeleton from '@mui/material/Skeleton';
export default function Dashboard({ event}){
  const SuperValue = useSelector((state)=>state.Login.Is_SuperAdmin);
    const sliderRef = useRef(null);
    const [nexttoken,tokenvalue] = useState(null);
    const [AllSupaFavourite,AllSupaFavouritevalue] = useState([]);
    const [scrollamount,scrollvalue] = useState();
    const [loadeer,loadderevalue] = useState(false);
    const [DobeMaped,DobeMappedData] = useState([]);
    const [pagetext,pagetextvalue] = useState('All Photos');
    const [dropdown,dropdownvalue] = useState(false);
    const [WhichPhoto,WhichPhotoValue] = useState(0);
    const [stackone,stackonevalue] = useState([]);
    const [stacktwo,stacktwovalue] = useState([]);
    const [stackthree,stackthreevalue] = useState([]);
    const [stackfour,stackfourvalue] = useState([]);
    const [screenframe,screenframevalue] = useState();
    const [ExploreSlfies,ExploreSelfiesvalue] = useState([]);
    const [ConstData,SetConstData] = useState([])
    const [ExploreSlfieData,ExploreSelfieDatavalue] = useState([]);
    const [Slider,SliderValue] = useState(false)
    const [isituser,uservalue] = useState(false);
    const [upload,uploadvalue] = useState([]);
    const [i_user,i_uservalue] = useState('');
    const [AllFolders,SetAllFolders] = useState([]);
    const [userInfo,SetuserInfo] = useState({});
    const [KeyState,KeyStateValue] = useState(-1);
    const [folderSelect,setfolderSelect] = useState("");
    const [videos, setVideos] = useState([]);
    const [photos,setPhotos] = useState(true)
    const Toast = Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 2000, timerProgressBar: true, didOpen: (toast) => { toast.onmouseenter = Swal.stopTimer; toast.onmouseleave = Swal.resumeTimer;}});
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const s3Client = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY
      }
    });
    const PushToStacks = (ArrayData)=>{
      if(window.innerWidth >= 1000){
        const stacks = [[], [], [], []];
        ArrayData.forEach((item, index) => {
          const stackIndex = index % 4;
          stacks[stackIndex].push(item);
        });
        stackonevalue(prevData => [...new Set([...prevData, ...stacks[0]])]);
        stacktwovalue(prevData => [...new Set([...prevData, ...stacks[1]])]);
        stackthreevalue(prevData => [...new Set([...prevData, ...stacks[2]])]);
        stackfourvalue(prevData => [...new Set([...prevData, ...stacks[3]])]);
        screenframevalue(4);
      }else if(window.innerWidth >= 550){
        const stacks = [[], [], []];
        ArrayData.forEach((item, index) => {
          const stackIndex = index % 3;
          stacks[stackIndex].push(item);
        });
        stackonevalue(prevData => [...new Set([...prevData, ...stacks[0]])]);
        stacktwovalue(prevData => [...new Set([...prevData, ...stacks[1]])]);
        stackthreevalue(prevData => [...new Set([...prevData, ...stacks[2]])]);
        screenframevalue(3);
      }else{
        const stacks = [[], []];
        ArrayData.forEach((item, index) => {
          const stackIndex = index % 2;
          stacks[stackIndex].push(item);
        });
        stackonevalue(prevData => [...new Set([...prevData, ...stacks[0]])]);
        stacktwovalue(prevData => [...new Set([...prevData, ...stacks[1]])]);
        screenframevalue(2);
      }
    }
    const Fetchuserinfo = async()=>{
      const res = await FetchUserInFo();
      SetuserInfo(res);
    }
    const FetchDashboard = async(continuationtoken)=>{
      const listParams = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        MaxKeys: 30,
        ContinuationToken: continuationtoken,
        Prefix: `${event}/photographers_images`
      };
      try {
        const FetchedImages = await s3Client.send(new ListObjectsV2Command(listParams));
        const fetchedImages = FetchedImages.Contents.map(obj => obj.Key).filter((key)=>{if(key != `${event}/photographers_images/`){ return key}});
        DobeMappedData([...new Set([...DobeMaped,...fetchedImages])]);
        tokenvalue(FetchedImages.NextContinuationToken);
        PushToStacks(fetchedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }

    const FetchImagesByFolderName = async(continuationtoken,key,firsttime)=>{
      console.log(continuationtoken,key,firsttime,key)
      const listParams = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        MaxKeys: 10,
        ContinuationToken: continuationtoken,
        Prefix: `${event}/photographers_images/${key}`
      };
      try {
        const FetchedImages = await s3Client.send(new ListObjectsV2Command(listParams));
        const fetchedImages = FetchedImages.Contents.map(obj => obj.Key);
        tokenvalue(FetchedImages.NextContinuationToken);
        if (firsttime){ 
          stackonevalue([]);
          stacktwovalue([]);
          stackthreevalue([]);
          stackfourvalue([]);
          DobeMappedData([]);
          DobeMappedData(fetchedImages);
        }
        else {
          DobeMappedData([...new Set([...DobeMaped,...fetchedImages])]);
        }
        PushToStacks(fetchedImages);
        setfolderSelect(key)
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }

    const GetAllFavourite = async()=>{
      const result = await supabase.from('UserEvents').select('Favourite_Images').eq("EventName",`${event}`);
      AllSupaFavouritevalue(result.data[0].Favourite_Images);
    }
    const UpdateSupaData = async(Array)=>{
        const selfieData = {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          Key: `${event}/Favorites.json`,
          Body: JSON.stringify(Array),
          ContentType: 'application/json',
          ACL: 'public-read'
        };
        const resonse = await s3Client.send(new PutObjectCommand(selfieData));
        const data = await supabase.from('UserEvents').update({ 'Favourite_Images': Array }).eq('EventName', `${event}`).select('Favourite_Images');
        return data.data[0].Favourite_Images;
    }
    const getAllFolders = async(prefix = `${event}/photographers_images/`) => {
      let folders = [];
      let continuationToken = null;
      do {
          const command = new ListObjectsV2Command({
              Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
              Delimiter: '/',
              Prefix: prefix,
              ContinuationToken: continuationToken
          });
          try {
              const response = await s3Client.send(command);
              folders = folders.concat(response.CommonPrefixes.map(prefix => prefix.Prefix));
              continuationToken = response.NextContinuationToken;
          } catch (error) {
              console.error('Error listing objects:', error);
              throw error;
          }
      } while (continuationToken);
      SetAllFolders(folders)
  };
    useEffect(()=>{
      FetchDashboard(null);
      GetAllFavourite();
      Fetchuserinfo();
      getAllFolders();
    },[])
    useEffect(() => {
      if (upload.length > 0) {
        UploadImages();
      }
    }, [upload]);
    useEffect(() => {
      if (pagetext == "All Videos") {
        setPhotos(false);
      }
      else { setPhotos(true) }
    },[pagetext])
    const OnExploreClickFun = (async()=>{
      window.scrollTo(0, 0);
      loadderevalue(true)
      uservalue(false)
      stackonevalue([]);
      stacktwovalue([]);
      stackthreevalue([]);
      stackfourvalue([]);
      DobeMappedData([]);
      AllSupaFavouritevalue([]);
      const listParams = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Prefix: `${event}/selfie/`
      };
      const response = await s3Client.send(new ListObjectsV2Command(listParams));
      if(response.KeyCount != 0){const jpgPngFiles = response.Contents.filter(obj => obj.Key.endsWith('.jpeg') || obj.Key.endsWith('.png')).map(obj => obj.Key);
      ExploreSelfiesvalue(jpgPngFiles);SetConstData(jpgPngFiles);}
      ExploreSelfieDatavalue([])
      FetchDashboard(null);
      GetAllFavourite();
      pagetextvalue('Explore')
      loadderevalue(false)
    })
    const OnHomeClickFun = (async()=>{

      window.scrollTo(0, 0);
      loadderevalue(true)
      uservalue(false)
      stackonevalue([]);
      stacktwovalue([]);
      stackthreevalue([]);
      stackfourvalue([]);
      DobeMappedData([]);
      AllSupaFavouritevalue([]);
      FetchDashboard(null);
      GetAllFavourite();
      pagetextvalue('All Photos')
      ExploreSelfieDatavalue([])
      loadderevalue(false)
    })
    const OnFavouriteClickFun = (async()=>{
      window.scrollTo(0, 0);
      loadderevalue(true)
      stackonevalue([]);
      stacktwovalue([]);
      stackthreevalue([]);
      stackfourvalue([]);
      DobeMappedData([...new Set(AllSupaFavourite)]);
      PushToStacks([...new Set(AllSupaFavourite)]);
      ExploreSelfieDatavalue([])
      pagetextvalue('Favorites')
      loadderevalue(false)
    })
    const OnExploreClickProfile = (async(name)=>{
      loadderevalue(true)
      uservalue(true)
      var fetchedImages = await FetchExploreSelfieData(event,name);
      stackonevalue([]);
      stacktwovalue([]);
      stackthreevalue([]);
      stackfourvalue([]);
      DobeMappedData([...new Set(fetchedImages)]);
      PushToStacks([...new Set(fetchedImages)]);
      i_uservalue(name)
      SliderValue(false)
      ExploreSelfieDatavalue([...new Set(fetchedImages)])
      loadderevalue(false)
    })
    useEffect(()=>{
      if (sliderRef.current) {
        const container = sliderRef.current;
        container.scrollLeft += window.innerWidth*scrollamount;
      }
    },[Slider])
    const scrollToPosition = (path) => {
      SliderValue(true);
      scrollvalue(DobeMaped.indexOf(path))
    };
    window.onscroll = function(ev) {
      if ((window.innerHeight + window.scrollY + 200) >= document.body.offsetHeight && pagetext !== 'Favorites' && !isituser) {
        if (folderSelect == "") {
          console.log("Querying ...",folderSelect)
          FetchDashboard(nexttoken);
        }
        else {
          FetchImagesByFolderName(nexttoken,folderSelect,false);
        }
      }
    };
    const DeleteFunction = async(item)=>{
      loadderevalue(true)
      var attt = [];
      const fetchedImages = DobeMaped.map(key => {
        if (key !== item) {
            const parts = key.split('/');
            attt.push(parts[2]+"/"+parts[3]);
        }
      });
      const selfieData = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key: `${event}/Output/${i_user}/Data.json`,
        Body: JSON.stringify(attt),
        ContentType: 'application/json',
        ACL: 'public-read'
      };
      const response = await s3Client.send(new PutObjectCommand(selfieData));
      if(response.$metadata.httpStatusCode === 200 ){
        Toast.fire({icon: 'success',title: `Image in ${i_user} is Deleted ...`})
        OnExploreClickProfile(i_user)
      }else{
        Toast.fire({icon: 'error',title: `Something went wrong ...`})
      }
      loadderevalue(false)
    }
    const UploadImages = async () => {
          loadderevalue(true)
          const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1000,
              useWebWorker: true,
          }
          var Compresedimage = upload[0];
          if(upload[0].size/(1024 * 1024) > 1){
              Compresedimage = await imageCompression(upload[0], options);
          }
          const uniqueFileName = new Date().toISOString().replace(/[-:.]/g, "").replace("T", "_");
          const uploadCommand = new PutObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          Key: `${event}/COMPRESS_IMAGES/Others/${event+uniqueFileName}.jpg`,
          Body: Compresedimage,
          ACL: 'public-read'
          });
          const respo = await s3Client.send(uploadCommand);
          if(respo.$metadata.httpStatusCode == 200){
          const uploadd = new PutObjectCommand({
              Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
              Key: `${event}/photographers_images/Others/${event+uniqueFileName}.jpg`,
              Body: upload[0],
              ACL: 'public-read'
          });
          const response = await s3Client.send(uploadd);
          var attt = [`Others/${event+uniqueFileName}.jpg`];
          const fetchedImages = DobeMaped.map(key => {
                const parts = key.split('/');
                attt.push(parts[2]+"/"+parts[3]);
                console.log(parts[2]+"/"+parts[3],parts)
          });
          const selfieData = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: `${event}/Output/${i_user}/Data.json`,
            Body: JSON.stringify(attt),
            ContentType: 'application/json',
            ACL: 'public-read'
          };
          const resonse = await s3Client.send(new PutObjectCommand(selfieData));
          if(resonse.$metadata.httpStatusCode === 200 ){
            Toast.fire({ icon: 'success', title: 'Upload Success ...' });
            OnExploreClickProfile(i_user)
            uploadvalue([])
          }else{
            Toast.fire({icon: 'error',title: `Something went wrong ...`})
          }
        }
          loadderevalue(false)
  };
  // const FetchImagesByFolderName = async(key)=>{
  //   const listParams = {
  //     Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
  //     Prefix: `${event}/photographers_images/${key.split('/')[2]}`
  //   };
  //   try {
  //     const FetchedImages = await s3Client.send(new ListObjectsV2Command(listParams));
  //     const fetchedImages = FetchedImages.Contents.map(obj => obj.Key);
  //     stackonevalue([]);
  //     stacktwovalue([]);
  //     stackthreevalue([]);
  //     stackfourvalue([]);
  //     DobeMappedData([]);
  //     DobeMappedData(fetchedImages);
  //     PushToStacks(fetchedImages);
  //     setfolderSelect(key.split('/')[2])
  //   } catch (error) {
  //     console.error('Error fetching images:', error);
  //   }
  // }

  const QueryVideos = async() => {
    console.log("Querying Videos...")
    pagetextvalue("All Videos");
    loadderevalue(true)
    stackonevalue([]);
    stacktwovalue([]);
    stackthreevalue([]);
    stackfourvalue([]);
    setPhotos(false);
    
    // Querying Videos
    const command = new ListObjectsV2Command({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Delimiter: '/',
      Prefix: `${event}/photographers_videos/`
      });
      try {
          const response = await s3Client.send(command);
          console.log(response)
          const videoKeys = response.Contents.map((content) => content.Key);
          console.log(videoKeys);
          setVideos(videoKeys);
      } catch (error) {
          console.error('Error listing Videos:', error);
          throw error;
      }
    loadderevalue(false);
  }

  return(
        <>
        {loadeer?<Loader/>:""}
        <div className={Styles.Dashboard}>
            <div>
                <div className={Styles.Logo}><img src={userInfo?.Logo||''} style={{width:'100px',borderRadius:'5px'}}/></div>
                <div className={Styles.LeftNavIcons}>
                    <div onClick={OnHomeClickFun} style={pagetext === 'All Photos'?{color:'#725AFF'}:{color:'#ffffff'}}><img src={pagetext === 'All Photos'?'/svg/SelectedPhoto.svg':'/svg/Photo.svg'}/><div>Photos</div></div>
                    <div onClick={QueryVideos} style={pagetext === 'All Videos'?{color:'#725AFF'}:{color:'#ffffff'}}><img src={pagetext === 'All Videos'?'/svg/SelectedPhoto.svg':'/svg/Photo.svg'}/><div>Videos</div></div>
                    <div onClick={OnExploreClickFun} style={pagetext === 'Explore'?{color:'#725AFF'}:{color:'#ffffff'}}><img src={pagetext === 'Explore'?'/svg/expSelected.svg':'/svg/exploreSearch.svg'}/><div>Explore</div></div>
                    <div onClick={OnFavouriteClickFun} style={pagetext === 'Favorites'?{color:'#725AFF'}:{color:'#ffffff'}}><img src={pagetext === 'Favorites'?'/svg/FavSelected.svg':'/svg/Fav.svg'}/><div>Favorites</div></div>
                </div>
                <button className={Styles.DashboardMenuBtn} onClick={()=>{if(dropdown){dropdownvalue(false)}else{dropdownvalue(true)}}}>Attendees</button>
            </div>
            <div>
                <div className={Styles.MakeNavFixed}>
                    <div className={Styles.NavOneForSearch}>
                        <div>{pagetext === 'Explore'?<SearchModel constData={ExploreSlfies} SetConstData={SetConstData}/>:<>{pagetext == 'Favorites'?<Link href={`/dashboard/${event}/favorites/download`} className={Styles.NavBtn}>Download</Link>:<></>}</>}</div>
                        <div>Welcome!</div>
                    </div>
                    <div className={Styles.NavOneForMenu}>
                        <div>{pagetext}</div>
                        <div>
                            <div><img src="/svg/menu.svg"/></div>
                            <div><img className={Styles.UserIcon} src="https://mui.com/static/images/avatar/1.jpg"/></div>
                        </div>
                    </div>
                    <div className={Styles.FoldersCss}>
                      {pagetext === 'All Photos'?<>
                      {AllFolders.map((item,index)=>{
                            return <div onClick={()=>{FetchImagesByFolderName(null,item.split('/')[2],true);KeyStateValue(index)}} style={KeyState == index?{borderBottom:'2px solid #725aff'}:{}}>{item.split('/')[2]}</div>
                          })}
                      </>:<></>}
                    </div>
                </div>
                <div>
      {pagetext === 'Explore'?<div className={Styles.MainContaine}><ExploreComp Data={ConstData} EpxFun={OnExploreClickProfile}/></div>:<div  className={Styles.MainContaine}><span></span></div>}
      
      {
        photos ? 
        <>
            {screenframe === 4?<>
            <div className={Styles.MainContainer}>
              <div><MapData Data={stackone} ScrollBtn={scrollToPosition}/></div>
              <div><MapData Data={stacktwo} ScrollBtn={scrollToPosition}/></div>
              <div><MapData Data={stackthree} ScrollBtn={scrollToPosition}/></div>
              <div><MapData Data={stackfour} ScrollBtn={scrollToPosition}/></div>
            </div>
          </>:<></>}
          {screenframe === 3?<>
            <div className={Styles.MainContainer}>
              <div><MapData Data={stackone} ScrollBtn={scrollToPosition}/></div>
              <div><MapData Data={stacktwo} ScrollBtn={scrollToPosition}/></div>
              <div><MapData Data={stackthree} ScrollBtn={scrollToPosition}/></div>
            </div>
          </>:<></>}
          {screenframe === 2?<>
            <div className={Styles.MainContainer}>
              <div><MapData Data={stackone} ScrollBtn={scrollToPosition}/></div>
              <div><MapData Data={stacktwo} ScrollBtn={scrollToPosition}/></div>
            </div>
          </>:<></>}
        </> : 
        <>
          <div>
          {videos.length > 0 ? (
              <div className={Styles.videoCon}>
                {videos.map((videoKey) => (
                  <video key={videoKey} controls style={{maxHeight:"20em",maxWidth:"20em",objectFit:"contain"}}> 
                    <source src={`https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.amazonaws.com/${videoKey}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )) }
              </div>
            ) : (
              <div className={Styles.empty}>No Videos Found !</div>
            )}
          </div>  
        </>
      }
              </div>
          </div>
        </div>
        {Slider?<div className={Styles.OverflowScrollAnimation} ref={sliderRef}>
        {DobeMaped.map((item,index)=>{
          return <div key={index} className={Styles.FullscreenImage}>
            <span onClick={()=>{SliderValue(false)}}>&#x2716;</span>
            <span className={Styles.FullscrennnnImage}>
              <div><img src={AllSupaFavourite.includes(item)?'/svg/FavTrue.svg':'/svg/FavSelected.svg'} onClick={async()=>{if(AllSupaFavourite.includes(item)){const newArray = AllSupaFavourite.filter((element) => `${element}` !== item);const respos = await UpdateSupaData(newArray);AllSupaFavouritevalue(respos)}else{const respos = await UpdateSupaData([...AllSupaFavourite,`${item}`]);AllSupaFavouritevalue(respos)}}} className={Styles.CheckBox}/></div>
              <div>
                {SuperValue && pagetext === 'Explore'&& ExploreSlfieData.length!=0?<div style={{marginBottom:'10px'}}>
                  {/* <button style={{padding:'10px 30px',paddingLeft:'20px',borderRadius:'5px',border:'none',marginLeft:'10px',cursor:'pointer'}}>Upload</button> */}
                  <input type="file" name="Image_Files" multiple onChange={(e)=>{uploadvalue(e.target.files)}}/>
                  <ConfirmDelete DeleteFunction={DeleteFunction} item={item} />
                </div>:<></>}
                <a className={Styles.DownloadBtnOnSlider} href={`https://selife-bucket.s3.ap-south-1.amazonaws.com/${item}`} target="_blank" download>Download</a>
              </div>
            </span>
            <div>
              <img src={`https://selife-bucket.s3.ap-south-1.amazonaws.com/${item.split('photographers_images')[0]}COMPRESS_IMAGES${item.split('photographers_images')[1]}`} alt="Fullscreen Image" className={Styles.FullscrenImage}/>
            </div>
          </div>
        })}
        </div>:<></>}
        {window.innerWidth <= 800?<>
          <Box sx={{ width: 500 }}>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation showLabels style={{backgroundColor:'#171a25',borderRadius:'5px'}}>
                <BottomNavigationAction onClick={OnHomeClickFun} style={pagetext === 'All Photos'?{color:'#725AFF'}:{color:'#ffffff'}} label="All Photos" icon={<img src={pagetext === 'All Photos'?'/svg/SelectedPhoto.svg':'/svg/Photo.svg'} className={Styles.BottomImage}/>} />
                <BottomNavigationAction onClick={OnExploreClickFun} style={pagetext === 'Explore'?{color:'#725AFF'}:{color:'#ffffff'}} label="Explore" icon={<img src={pagetext === 'Explore'?'/svg/expSelected.svg':'/svg/exploreSearch.svg'} className={Styles.BottomImage}/>} />
                <BottomNavigationAction onClick={OnFavouriteClickFun} style={pagetext === 'Favorites'?{color:'#725AFF'}:{color:'#ffffff'}} label="Favorites" icon={<img src={pagetext === 'Favorites'?'/svg/FavSelected.svg':'/svg/Fav.svg'} className={Styles.BottomImage}/>} />
              </BottomNavigation>
            </Paper>
          </Box>
        </>:<></>}
        </>
    )
}