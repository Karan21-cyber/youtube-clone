import React,{useState, useEffect} from 'react'
import {Link, useParams} from "react-router-dom"
import ReactPlayer from 'react-player'
import {Typography, Box, Stack} from "@mui/material"
import {CheckCircle} from "@mui/icons-material"

import {Videos,Loading} from "./"
import {fetchFromAPI} from "../utils/fetchFromAPI"

function VideoDetail() {

  const [videoDetail, setVideoDetail] = useState(null);
  const [videos , setVideos] = useState([])

  const {id} = useParams();

  useEffect(()=>{
    // fetching the clicked video to play
    fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
    .then((data) => setVideoDetail(data.items[0]))

    //fetching the related videos
    fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`)
    .then((data) => setVideos(data.items))

  },[id])

  // Destructing means extracting the data from an object
  if(!videoDetail?.snippet)
    return <Loading />
  
  const {snippet:{title,channelId,channelTitle},statistics:{viewCount,likeCount}} = videoDetail;
  
  


  return (
    <Box minHeight="95vh">
      <Stack direction={{xs:'colum',md:'row'}}>
        {/* Playing the clicked videos */}
        <Box flex={1}>
          <Box sx={{width:"100%",position:'sticky',top:'100px'}}>
            <ReactPlayer url={`https://www.youtube.com/watch?v=${id}`} 
              className='react-player' controls
            />
            <Typography color='#fff' variant ="h5" fontWeight="bold" p={2} >
              {title}
            </Typography>
            <Stack direction="row" justifyContent='space-between'
                  sx={{color:"#fff"}} py={1} px={2}
            >
              <Link to={`/channel/${channelId}`}>
                <Typography variant={{sm:'subtitle1',md:'h6'}} color="#fff">
                  {channelTitle}
                  <CheckCircle  sx={{fontSize:'12px', ml:'5px', color:'gray'}}/>
                </Typography>
              </Link>
              <Stack direction='row' gap="20px" alignItems="center" >

                <Typography variant="body1" sx={{opacity:0.7}}>
                  {parseInt(likeCount).toLocaleString()} likes
                </Typography>

                <Typography variant="body1" sx={{opacity:0.7}}>
                  {parseInt(viewCount).toLocaleString()} Views
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>

        {/* Related videos */}
       <Box px={2} py={{md:1,xs:5}} justifyContent="center" alignItems="center">
          <Videos videos={videos} direction="column" />
        </Box>
      </Stack> 
    </Box>
  )
}

export default VideoDetail