import React, { useEffect } from 'react'
import { useAlert } from 'react-alert'
// import { withAlert } from 'react-alert'


function Alert() {

    const alert = useAlert()


    
    return (
        <div>            
        
         {alert.error("check am na")}
           
        </div>
    )
}

export default Alert
