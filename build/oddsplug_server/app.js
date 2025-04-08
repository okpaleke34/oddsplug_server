"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const request_ip_1 = __importDefault(require("request-ip"));
const busboy_body_parser_1 = __importDefault(require("busboy-body-parser"));
// import cron from 'node-cron';
const moment_1 = __importDefault(require("moment"));
const infrastructure_1 = __importDefault(require("./app/infrastructure/"));
const user_route_1 = __importDefault(require("./app/routes/user.route"));
const admin_route_1 = __importDefault(require("./app/routes/admin.route"));
const bet_route_1 = __importDefault(require("./app/routes/bet.route"));
const auth_route_1 = __importDefault(require("./app/routes/auth.route"));
const bot_route_1 = __importDefault(require("./app/routes/bot.route"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
require("dotenv/config");
const arbitrage_service_1 = __importDefault(require("./app/services/arbitrage.service"));
const logger_1 = __importDefault(require("./app/utils/logger"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield infrastructure_1.default.connect();
}))();
// db.connect()
const port = process.env.PORT || 3400;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const origin = "*";
app.use(express_1.default.json());
// Middleware to get client's IP address
app.use(request_ip_1.default.mw());
// app.use(cors()); 
app.use((0, cors_1.default)({
    credentials: true,
    origin: ['http://localhost:3400', 'http://localhost:3000', 'https://oddsplug.com', 'https://admin.oddsplug.com'] // or an array of allowed origins
}));
// Use busboy-body-parser to handle multipart/form-data requests
// app.use(busboyBodyParser({ limit: '50mb' }));
// app.use(busboyBodyParser());
app.use((0, busboy_body_parser_1.default)({ multi: true }));
// parser requests of content-type - application/json
app.use(body_parser_1.default.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Socket Initialization
const io = new socket_io_1.Server(server, {
    cors: {
        origin,
    },
});
app.use((req, res, next) => {
    app.locals.url = req.url;
    // Store the io object in res.locals
    res.locals.socket_io = io;
    next();
});
// Update Arbitrage Status for arbitrage that has their last updated status 10 minutes ago
function updateArbitrageStatus() {
    try {
        const lagosTimestamp = moment_1.default.tz('Africa/Lagos').format();
        const timeLimit = (0, moment_1.default)(lagosTimestamp).subtract(10, "minutes").unix();
        const filter = {
            status: 1,
            lastUpdateAt: { $lt: timeLimit }
        };
        // Define the update operation
        const update = {
            $set: { status: 0 }
        };
        const arbitrageService = new arbitrage_service_1.default();
        arbitrageService.updateArbitrage(filter, update);
    }
    catch (error) {
        logger_1.default.error(`Error in bot removing arbitrage: ${error}`);
    }
}
// updateArbitrageStatus()
// Cron job running every 5 minutes
// cron.schedule('*/5 * * * *', () => {
//     // console.log('running a task every 5 minutes');
//     updateArbitrageStatus()
// })
app.use('/v1/users/', user_route_1.default);
app.use('/v1/admin/', admin_route_1.default);
app.use('/v1/bet/', bet_route_1.default);
app.use('/v1/auth/', auth_route_1.default);
app.use('/v1/bot/', bot_route_1.default);
// Serve static files from the /app/data directory
// This allows the client to access the files in the /app/data directory eg http://localhost:4001/data/countries.json
app.use('/data', express_1.default.static(path_1.default.join(__dirname, 'app/data')));
// 404 Error Handler
app.use((req, res, next) => {
    res.status(404).json({ status: "error", message: "Not found" });
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
server.listen(port, () => {
    console.log(`listening to port ${port}`);
});
exports.default = app;
