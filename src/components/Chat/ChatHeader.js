import React from 'react'
import './ChatHeader.css'
import EditLocationRoundedIcon from '@material-ui/icons/EditLocationRounded'
import NotificationsIcon from '@material-ui/icons/Notifications'
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded'
import SendRoundedIcon from '@material-ui/icons/SendRounded'
import SearchRoundedIcon from '@material-ui/icons/SearchRounded'
import HelpRoundedIcon from '@material-ui/icons/HelpRounded'




function Header({ channelName }) {
  return (
    <div className="chatHeader">
      <div className="chatHeader__left">
      <h3>
        <span className="chatHeader__Hash">
          #
        </span>
        { channelName }
      </h3>
      </div>
      

      <div className="chatHeader__right">
        <NotificationsIcon color="primary" />
        <EditLocationRoundedIcon color="primary" />
        <PeopleAltRoundedIcon color="primary" />


        <div className="chatHeader__search">
        <input placeholder='No search functionality now' />
        <SearchRoundedIcon color="primary" />
      </div>

      <SendRoundedIcon color="primary" />
      <HelpRoundedIcon color="primary" />
      </div>      
    </div>
  )
}

export default Header
