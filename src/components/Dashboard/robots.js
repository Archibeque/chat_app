import React, { useState } from "react";
import Robot from "./robot.gif";
import {
  selectChannelId,
  selectContactId,
} from "../../features/counter/appSlice";
import { useSelector } from "react-redux";
import "./robots.css"

export default function Robots() {
  const { user } = useSelector((state) => state.auth);
  

  return (
    <> 
        <div className="container">
          <img src={Robot} alt="" />
          <h1>
            Welcome, <span>{user.name}!</span>
          </h1>
          <h3>Please create a chat to Start messaging.</h3>
        </div>
      
    </>
  );
}




// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: white;
//   flex-direction: column;
//   img {
//     height: 20rem;
//   }
//   span {
//     color: #4e0eff;
//   }
//   @media only screen and (max-width: 767px) {
//     img {
//       height: 11rem;
//     }
//   }

// `;
