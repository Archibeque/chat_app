import React, { useState } from 'react'
import './ChatHeader.css'
import EditLocationRoundedIcon from '@material-ui/icons/EditLocationRounded'
import NotificationsIcon from '@material-ui/icons/Notifications'
import SendRoundedIcon from '@material-ui/icons/SendRounded'
import SearchRoundedIcon from '@material-ui/icons/SearchRounded'
import HelpRoundedIcon from '@material-ui/icons/HelpRounded'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { reset, setChannelInfo } from '../../features/counter/appSlice'
import AddChanel from '../Dashboard/AddChanel'
import {
  selectChannelId,
  selectChannelName,
  selectContactId, 
  selectContactName
} from "../../features/counter/appSlice";





function Header() {
  const dispatch = useDispatch()
  
  const [ title , setTitle] = useState("")
  // const appStateChannelId = useSelector(selectChannelId)
  const appStateChannelName = useSelector(selectChannelName)
  // const appStateContactId = useSelector(selectContactId)
  const appStateContactName = useSelector(selectContactName)
  const appstate = useSelector((state) =>  state.app)
  
  console.log(appstate)
  
  


  const setInfos = () => {

    // if(appStateChannelName && appStateContactName == null){
      if(appStateChannelName !== null){
        setTitle(appStateChannelName)

      }
      // else{
      //   setTitle(appStateContactName)
    
      // }
      
      else if(appStateContactName !== null){
      setTitle(appStateContactName)

      }
      else{
      setTitle("select Chat")

      }
    } 



  useEffect(() => {
    setInfos()
    
  }, [appStateChannelName, appStateContactName])
  
  console.log(appstate)



  return (
    <>
      <div className="chatHeader">
        <div className="chatHeader__left">
        <h3>
          <span className="chatHeader__Hash">
            #
          </span>
          { title }
        </h3>
        </div>
        

        <div className="chatHeader__right">
          <NotificationsIcon color="primary" />
          <EditLocationRoundedIcon color="primary" />
          <AddChanel />
          


          <div className="chatHeader__search">
          <input placeholder='No search functionality now' />
          <SearchRoundedIcon color="primary" />
        </div>

        <SendRoundedIcon color="primary" />
        <HelpRoundedIcon color="primary" />
        </div>      
      </div>

     
  </>
  )
}

export default Header
