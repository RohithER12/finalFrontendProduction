import  express  from "express";
import cors from 'cors'
import path from 'path'
import {createProxyMiddleware} from 'http-proxy-middleware'
import dotenv from "dotenv";

const app = express();

dotenv.config()

app.use(cors())


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.use( 
    "/api", 
    createProxyMiddleware({ 
        target:`https://localhost:${process.env.API_PORT}`,
        changeOrigin: true, 
         
    }) 
);
app.use( 
    "/chat", 
    createProxyMiddleware({ 
        target:`http://localhost:${process.env.CHAT_PORT}`,
        changeOrigin: true, 
         
    }) 
);
app.use(
    'wss://70off.online/ws',
    createProxyMiddleware({
        target:'ws://localhost:5053/ws',
        ws:true
    })
)

app.get('*', (req, res) =>
res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
);



const port =  process.env.PORT

app.listen(port, () =>
  console.log(`Server listening on https://localhost:${port}`)
);