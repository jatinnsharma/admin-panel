import React, { useEffect, useState } from 'react'

const Message = ({chat,currentUser}) => {
    // console.log("chat",chat.member.find((m) => m !== currentUser._id))
    
    console.log(currentUser._id)
    const [user,setUser] = useState(null);
    useEffect(() => {
        const friendId = chat.members.find((m) => m !== currentUser._id);
        
        const getUser
        const res = await axios.get()
    }, [chat, currentUser]);
    
    console.log("chat",chat.members.find((m)=>m!==currentUser._id))
  return (
    <div>Message</div>
  )
}

export default Message