import axios from "axios";
import { checkLoggedInStatusUrl } from "../api";
import {headers} from "./Header"
import { useState } from "react";

export const checkLoggedInStatus =  async () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    try{
        const response = await axios.get(checkLoggedInStatusUrl,{headers})
        const status = response.data.status;
        console.log(status) 
        setIsLoggedIn(status)
}catch(error){
        console.log(error)
    }
  }

export const calculateTimeDifference = (timestamp) => {
    const lastUpdateTime = new Date(timestamp);
    const currentTime = new Date();
    const timeDifference = currentTime - lastUpdateTime;
  
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(minutesDifference / 60);
  
    if (hoursDifference >= 24) {
      const daysDifference = Math.floor(hoursDifference / 24);
      return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
    }
  
    return hoursDifference > 0
      ? `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''} ago`
      : `${minutesDifference} minute${minutesDifference > 1 ? 's' : ''} ago`;
};
  