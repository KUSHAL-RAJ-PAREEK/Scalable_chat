import {Server} from 'socket.io'
import Redis from 'ioredis'

const pub = new Redis({
    host:'',
    port: 1,
    username:'',
    password:''
});
const sub = new Redis({
       host:'',
    port: 1,
    username:'',
    password:''
});
class SocketService{
    private _io: Server
    constructor(){
        console.log("init Socket Service...")
        this._io = new Server({
            cors:{
                allowedHeaders:['*'],
                origin: '*'
            }
        })
          sub.subscribe('MESSAGES') 
    }
    public initListeners(){
        const io = this.io;
        console.log('Init Socket Listners...')
        io.on('connect',(socket) =>{
            console.log('New Socket Connected',socket.id)
        socket.on('event:message',async ({message} :{message: string}) =>{
            console.log('New Message Rec.',message)
            await pub.publish('MESSAGES',JSON.stringify({message}))
        })
        }
        )  
      sub.on('message',(channel,message)=>{
        if(channel === "MESSAGES"){
            console.log('new message from redis',message);
            io.emit("message",message)
        }
      })
        
    }
    
        get io(){
        return this._io;
    }
}

export default SocketService;