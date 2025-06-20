"use client"

import React, { useState,useCallback, useContext, useEffect } from 'react';
import  {io, Socket} from "socket.io-client"
interface SocketProviderProps{
    children?: React.ReactNode;

}

interface ISocketContext {
    sendMessage: (msg: string) => any;
    messages: string[]
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({
    children
}) =>{
const [messages, setMessages] = useState<string[]>([]);
    const [socket,setSocket] = useState<Socket>()
    const sendMessage: ISocketContext['sendMessage'] = useCallback(
        (msg)=>{
console.log('Send Message',msg)
if(socket){
    socket.emit('event:message',{message:msg})
}
    },[socket])

    const onMessageRecive = useCallback((msg: string)=>{
        console.log('FROM SERVER Msg Rec',msg)
        const message = JSON.parse(msg) as {message:string}
        setMessages(prev => [...prev,message.message]);
    },[])
    useEffect(()=>{
const _socket = io("http://localhost:8000")
_socket.on('message',onMessageRecive)
setSocket(_socket)
return ()=>{
    _socket.disconnect();
    _socket.off('message',onMessageRecive)
    setSocket(undefined)
}
    },[])

    return(
        <SocketContext.Provider value={{sendMessage,messages}}>
            {children}
        </SocketContext.Provider>
    )   
}