import React , { useEffect, useRef, useState } from "react";
import './App.css';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import Video from "./Video";
import { produce } from 'immer';
// import { Slide, SlideItem } from "./Slide";

function App() {
  const [dataSource, setDataSource] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef();
  const videoRef = useRef({});
  
  const requestApi = async () => {
    const res = await fetch("https://api-qa-sams.walmartmobile.cn/api/v1/sams/channel/portal/shortContent/queryListByPage", {
      "headers": {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "auth-token": "",
        "content-type": "application/json",
        "device-type": "h5",
        "h5-key": "d41d8cd98f00b204e9800998ecf8427e",
        "pagechanneltype": "unknown",
        "rcs": "4",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "system-language": "",
        "treq-id": "a05d537d20524997b9a43c274a25ef2a.302.16955360434680000",
        "tversion": "0829-short-content"
      },
      "referrer": "https://decoration-qa-sams.walmartmobile.cn/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"pageNum\":1,\"pageSize\":10,\"addressVO\":{\"latitude\":\"0\",\"longitude\":\"0\"},\"shortContentId\":\"\",\"excludeShortContentIds\":[],\"appVersion\":\"\",\"appIO\":\"\"}",
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    });
    const response = await res.json();
    // response.map(item=>)
    return response.data.shortContentList.map(item=> {
      return {
        src: item.contentVideoJson.originalVideo.videoUrl,
        realSrc: ''
      }
    })
  };

  const playCurrentVideo = () => {
    const currentSwiper = document.querySelector(".swiper-slide-active");
    console.log(currentSwiper,'currentSwiper');
    const video = currentSwiper?.querySelector("video");
    video?.play().catch(err=>{console.error(err)});
    console.log('play video', video?.dataset?.index);
  }

  const preload = (index) => {
    setDataSource(
      produce((draft)=>{
        if(draft?.[index]){
          draft[index].realSrc = draft?.[index].src || '';
        }
      })
    )
  };

  const pauseLastNextVideo = () => {
    const swipers = document.querySelectorAll(".swiper-slide");
    const lastSwiper = swipers?.[0];
    const nextSwiper = swipers?.[2];
    const lastVideo = lastSwiper?.querySelector("video");
    const nextVideo = nextSwiper?.querySelector("video");
    nextVideo?.pause();
    if(lastVideo){
      console.log('stop lastvideo',lastVideo?.dataset?.index)
      lastVideo?.pause();
      lastVideo.currentTime = 0;
    }
    if(nextVideo){
      console.log('stop nextvideo',nextVideo?.dataset?.index)
      nextVideo?.pause();
      nextVideo.currentTime = 0;
    }
  };

  useEffect(()=> {
    requestApi().then(res=>{
      setDataSource(res);
    })
  },[]);

  useEffect(()=>{
    if(!dataSource?.[0]?.realSrc){
      preload(0);
      preload(1);
      setTimeout(() => {
        playCurrentVideo();
      }, 0);
    }
  },[dataSource])

  useEffect(()=>{
    const video = videoRef.current[activeIndex];
    video?.play().catch(console.error);
  },[activeIndex]);

  const stopVideo = (index) => {
    videoRef.current?.[index].pause();
  };

  return (
    <Swiper
      slidesPerView={1}
      style={{height: "100%"}}
      direction='vertical'
      onSwiper={swiper => {swiperRef.current = swiper}}
      onSlideChange={(swiper) => {
        console.log('当前index:',swiper.activeIndex);
        stopVideo(activeIndex);
        setActiveIndex(swiper.activeIndex);}}
    >
      {dataSource.map((slider, index) => {
        const { src } = slider
        return <SwiperSlide className='swiper-container' key={index}>
          <div className='tips'>{index}</div>
          <Video 
            src={src} 
            controls 
            style={{width: '100%' , height: '100%'}} 
            autoPlay={true}
            preload="auto" 
            onPlay={(e)=>{
              if(index === swiperRef.current?.activeIndex){
                
              }else{
                e.target.pause();
              }
            }}
            // onError={e=>{console.error(e)}}
            data-index={index} 
            ref={ref=>{
              if(!ref) return;
              videoRef.current[index] = ref;
            }}
          />
        </SwiperSlide>
      })}
    </Swiper>
  );
}

export default React.memo(App);
