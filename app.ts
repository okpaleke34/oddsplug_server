import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import requestIp from 'request-ip';
import busboyBodyParser  from 'busboy-body-parser';
// import cron from 'node-cron';
import moment from 'moment';
import db from './app/infrastructure/';
import userRoutes from './app/routes/user.route';
import adminRoutes from './app/routes/admin.route';
import betRoutes from './app/routes/bet.route';
import authRoutes from './app/routes/auth.route';
import botRoutes from './app/routes/bot.route';
import { Server as SocketIOServer} from 'socket.io';
import http from 'http';
import 'dotenv/config';
import ArbitrageService from './app/services/arbitrage.service';
import logger from './app/utils/logger';

(async () => {
    await db.connect(); 
})();
// db.connect()
const port = process.env.PORT || 3400
const app = express()
const server = http.createServer(app);
const origin = "*";
app.use(express.json());
// Middleware to get client's IP address
app.use(requestIp.mw());
// app.use(cors()); 
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3400','http://localhost:3000','https://oddsplug.com','https://admin.oddsplug.com'] // or an array of allowed origins
}));
// Use busboy-body-parser to handle multipart/form-data requests
// app.use(busboyBodyParser({ limit: '50mb' }));
// app.use(busboyBodyParser());
app.use(busboyBodyParser({ multi: true }));
// parser requests of content-type - application/json
app.use(bodyParser.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

// Socket Initialization
const io = new SocketIOServer(server, {
    cors: {
      origin,
    },
  });
app.use((req,res,next)=>{
    app.locals.url = req.url;
    // Store the io object in res.locals
    res.locals.socket_io = io
    next();
})


// Update Arbitrage Status for arbitrage that has their last updated status 10 minutes ago
function updateArbitrageStatus(){
    try{
        const lagosTimestamp = moment.tz('Africa/Lagos').format();
        const timeLimit = moment(lagosTimestamp).subtract(10,"minutes").unix()
        const filter = {
            status: 1,
            lastUpdateAt: { $lt: timeLimit }
        };    
        // Define the update operation
        const update = {
            $set: { status: 0} 
        };
        const arbitrageService = new ArbitrageService();
        arbitrageService.updateArbitrage(filter,update)
    }
    catch(error){
        logger.error(`Error in bot removing arbitrage: ${error}`)
    }
}

// updateArbitrageStatus()
// Cron job running every 5 minutes
// cron.schedule('*/5 * * * *', () => {
//     // console.log('running a task every 5 minutes');
//     updateArbitrageStatus()
// })
  

app.use('/v1/users/', userRoutes);
app.use('/v1/admin/', adminRoutes);
app.use('/v1/bet/', betRoutes);
app.use('/v1/auth/', authRoutes);
app.use('/v1/bot/', botRoutes);

// Serve static files from the /app/data directory
// This allows the client to access the files in the /app/data directory eg http://localhost:4001/data/countries.json
app.use('/data', express.static(path.join(__dirname, 'app/data')));

// 404 Error Handler
app.use((req, res, next) => {
    res.status(404).json({status:"error", message:"Not found"});
});

// app.listen(port, (err) => {
//     if(err){
//         console.log(`Error: ${err.message}`);
//     }
//     else{
//         console.log(`listening to port ${port}`);
//     }
// })


// app.listen(port, () => {
server.listen(port,()=>{
    console.log(`listening to port ${port}`);
})

export default app;