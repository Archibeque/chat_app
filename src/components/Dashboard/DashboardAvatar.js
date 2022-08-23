import { Avatar } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import ImageUploading from 'react-images-uploading'
import { useSelector } from 'react-redux'
import axios from '../../components/axios'


function DashboardAvatar() {
  const { user } = useSelector((state) => state.auth)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [images, setImages] = useState([])
  const maxNumber = 1

  const onChange = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex)

    setImages(imageList)
  }
  console.log(images)

  

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('photo', images[0].file);
    axios.post(`/upload/${user.id}`, formData)
    .then(res => console.log(res))
    .catch(console.log)
  }
 

  useEffect(()=> {
    if(images.length !== 0 ){
      handleUpload()
    }
    
  },[images])
  

  return (
    <>
      
      <ImageUploading
        
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        acceptType={["jpg","jpeg","png"]}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (
          
          <Avatar src={
            user.photo
              ? PF + "/" + user.photo
              : PF + ""
          } alt=""  onClick={onImageUpload}
          { ...dragProps}
          />
        )}
      </ImageUploading>
    </>
  )
}

export default DashboardAvatar