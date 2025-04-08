import fs from "fs";
import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
import momentTZ from "moment-timezone";
import moment  from "moment";
import nodemailer  from "nodemailer";
import { Op } from "sequelize";
import { IPrivilege } from "../interfaces/IPrivilege";
import { Readable } from 'stream';
import csv from 'csv-parser';
import { get } from "http";
import Identity from "./Identity";
import { bookmakersServiceContainer } from './BookmakerMarketFuncs';
import countries from '../data/countries.json';
import markets from '../data/markets.json';
import { IUserToken } from "./types.d";
import config from '../utils/config';




// const fs = require("fs");
// const jwt = require("jsonwebtoken");
// const moment = require("moment");
// const momentTZ = require('moment-timezone');
// const { Player, Arena } = require("../database/sqlite/models");
// const { Op } = require("sequelize");
// const dotenv = require('dotenv');

// dotenv.config();
export const JWT_SECRET = config.jwt;
// let folder = './app/public/uploads/'
const timezone = 'Europe/Oslo'; // Replace with your desired timezone
const now = moment().tz(timezone);
// export const TIMESTAMP = Math.floor(moment().tz(timezone).valueOf()/1000)
export const TIMESTAMP = momentTZ.tz(timezone).unix()
export const maxAge = 30 * 24 * 60 *60;
export const SMTP_SETTINGS_1 = {password:config.stmp[1].password, email:config.stmp[1].email}


// exports.maxAge = maxAge
// export maxAge = maxAge

/**
 * Creates a JWT token based on the specified type and value.
 * @param {string} type - The type of the token (e.g., 'user', 'admin').
 * @param {any} value - The value associated with the token type.
 * @param {boolean} remember - Optional. Indicates whether the token should have a longer expiration (default is true).
 * @returns {string} The generated JWT token.
 */
export const createToken = (type:string,value:object|string,remember=true):string =>{
  const JWTSecret = config.jwt
  if(JWTSecret){
    return jwt.sign({[type]:value},JWTSecret,{
      expiresIn:remember?maxAge * 30:maxAge / 30
    })
  }
  else{
    throw new Error("JWT Secret not set")
  }
}

export const generateToken = (id: string) => {
  
  return jwt.sign({ id }, config.jwt, {
    expiresIn: '30d',
  });
};

export const generateAccessToken = (user:IUserToken ) => {
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" '15m'*/
  // The expiresIn will set the expiration to current 0.25 hrs because the current function will generate it in GMT while the server timezone is in GMT + 2
  // return jwt.sign(user, config.accessToken, { expiresIn: "2.25 hrs"});
  // return jwt.sign(user, config.accessToken, { expiresIn: 60 * 60});
  // Set in 15 mins time
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 15),
    user
  }, config.accessToken);
};

// Set without expiration date
export const generateRefreshToken = (user:IUserToken) => {
  return jwt.sign(user, config.refreshToken);
};


/**
 * Generates a random string of the specified length and character type.
 * @param {number} length - The length of the generated string.
 * @param {string} type - The type of characters in the string ('alpha numeral', 'alpha', 'digit', or 'mix').
 * @returns {string} The generated random string.
 */
const genid = (length:number,type="alpha numeral"):string => {
    let result = '';
    let characters = '';
    if(type == "mix"){
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/.!@#$%^&*'
    }
    else if(type == "alpha"){
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }
    else if(type == "digit"){
        characters = '0123456789'
    }
    else{
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    }
    // var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const genID = genid

/**
 * Generates a unique game identifier in the format "GM" followed by a combination of digits and alphabetic characters.
 * @returns {string} The generated unique game identifier.
 */
export const genGMID = () => {
    const alpha = genid(2,"alpha")
    const digit = genid(4,"digit")
    return `GM${digit}${alpha}`
}


/**
 * Generates a random integer within the specified range.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} The generated random integer.
 */
export const randomInt = (min, max) =>  {
    return min + Math.floor((max - min) * Math.random());
}

export const sortPrivileges = (privileges:IPrivilege[],token:string,isMain:boolean) => {
    const mainPrivileges:IPrivilege[] = []
    const subPrivileges:IPrivilege[] = []
    privileges.forEach(privilege => {
        if(privilege.type === "role" || privilege.type === "class"){
            mainPrivileges.push(privilege)
        }
        else{
            subPrivileges.push(privilege)
        }
    });
    // Put all the subPrivileges under the mainPrivileges. So the privileges array will be an array of all privileges with the mainPrivileges as the first element
    const finalPrivileges = mainPrivileges.map(mainPrivilege => {
        return {
            token:token,
            name:mainPrivilege.type == "class"? `${mainPrivilege.role}: ${mainPrivilege.id}`:mainPrivilege.role,
            isMain:isMain,
            isActive:false,
            privileges:[mainPrivilege,...subPrivileges]
        }
    })
    // Pick a random privilege and make it active
    const activePrivilege = Math.floor(Math.random() * (finalPrivileges.length))
    finalPrivileges[activePrivilege].isActive = true
    return finalPrivileges
}

export const createUserAgent = (req:any):any => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    // console.log(req.ip,req.headers['x-forwarded-for'],req.connection.remoteAddress,req.headers,req.connection)
    // console.log({userAgent})
    let userAgent = req.useragent;
    const browser = userAgent.browser+ " "+userAgent.version;
    const type = userAgent.isMobile ? 'Mobile' : userAgent.isTablet ? 'Tablet' : 'Desktop';
    const model = userAgent.platform+` (${userAgent.os})`;
    const firstLogin = new Date()
    // const firstLogin = Date.now() //timestamp
    // const os = req.headers["sec-ch-ua-platform"] || userAgent.platform
    userAgent = {model,firstLogin,lastLogin:firstLogin,location:"Nigeria",browser,ip,type,useragent:req.get('User-Agent'),notificationSubscription:null,status:1}
    return userAgent
}

// Recursively update an object
export const updateObject = (source, update) => {
    for (const key in update) {
      if (update.hasOwnProperty(key)) {
        if (typeof update[key] === 'object' && update[key] !== null && !Array.isArray(update[key])) {
          // Recursive call for nested objects
          source[key] = updateObject(source[key] || {}, update[key]);
        } else {
          // Update the value
          source[key] = update[key];
        }
      }
    }
    return source;
}

export const uploadFile =(filename:string,folder:string,fileContent:any,prevFile=null):any => {
    try{
        const fileExtension = fileContent.name.split(".")[1]
        filename = filename+"."+fileExtension.toLowerCase()
        fs.writeFileSync("./uploads/"+folder+filename, fileContent.data);
        let prevFileSize = 0
        // Delete the previous file
        if(prevFile){
          prevFileSize = fs.statSync("./uploads/"+folder+prevFile).size
          fs.unlinkSync("./uploads/"+folder+prevFile);
        }
        return {status:true,prevFileSize,filename}
    }
    catch(err:any){
      throw new Error(err)
    }
}

export const getTimestamps = (dateString:string) => {
  // Parse the input date string in the Europe/Oslo timezone
  const osloDate = moment.tz(dateString, timezone);

  // Set the time to the start of the day (00:00:00)
  const startOfDay = osloDate.startOf('day').valueOf()/1000;

  // Set the time to the end of the day (23:59:59.999)
  const endOfDay = osloDate.endOf('day').valueOf()/1000;

  return { startOfDay, endOfDay };
}

/**
 * Formats a UNIX timestamp into a human-readable date and time string.
 * @param {number} timestamp - The UNIX timestamp to be formatted.
 * @returns {string} The formatted date and time string.
 */
export const formatUnix = (timestamp: number):string =>{
    timestamp = Number(timestamp)*1000
    const osloTime = momentTZ.tz(timestamp, timezone);
    // Format the timestamp
    // let formattedTime = moment.unix(timestamp).tz(timezone).format('MMM D, YYYY h:mm A');
    const formattedTime = osloTime.format('ddd, D MMM, YYYY h:mm A');
    // const formattedTime = osloTime.format('MMM D, YYYY h:mm A');
    return formattedTime
}

/**
 * Calculates the time elapsed based on the time difference in milliseconds.
 * @param {number} difference - The time difference in milliseconds.
 * @returns {string} A formatted string indicating the time elapsed.
 */
export const timeElasped = (difference) => {
    difference = Number(difference)*1000
    if (difference < 0) {
        return "Expired";
    }
    else{
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference  % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference  % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference  % (1000 * 60)) / 1000);
        let timeVar = "";
        if (days>0) {
            timeVar += `${days}d `;
        }
        if (hours>0) {
            timeVar += `${hours}h `;
        }
        if (minutes>0) {
            timeVar += `${minutes}m `;
        }
        if (seconds>0) {
            timeVar += `${seconds}s `;
        }
        if(timeVar == ""){
            timeVar = "Now";
        }
        return timeVar;
    }
}

/**
 * Validates form data and returns an array of validation errors.
 * @param {Object} data - The form data to be validated.
 * @returns {Array} An array of validation error messages.
 */
export const validateFormData = (data) =>{
    const errors: string[] = [];
  
    // Validation for first name
    if (!data.fname.trim()) {
      errors.push("First name is required");
    }
  
    // Validation for last name
    if (!data.lname.trim()) {
      errors.push("Last name is required");
    }
  
    // Validation for email
    if (!data.email.trim()) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.push("Invalid email format");
    }
  
    // Validation for username
    if (!data.username.trim()) {
      errors.push("Username is required");
    }
  
    // Validation for password
    if (!data.password.trim()) {
      errors.push("Password is required");
    } else if (data.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
  
    // Validation for confirm password
    if (!data.cpassword.trim()) {
      errors.push("Confirm password is required");
    } else if (data.cpassword !== data.password) {
      errors.push("Passwords do not match");
    }
  
    return errors;
}


/**
 * Function to check if a data is an object or not and parse it if it is not an object
 * @param {*} data string or object
 * @returns an object
 */
export const makeJSON = (data)=>{
    if(typeof data != "object"){
        return JSON.parse(data)
    }
    return data
}

export const createSlug = (input)  => {
    // Replace special characters with a space
    const cleaned = input.replace(/[^\w\s]/gi, ' ');

    // Remove extra spaces and trim the string
    const slug = cleaned.trim().replace(/\s+/g, '-');

    return slug;
}

export const encodeCourseLink = (code,dateTimeString,id) => {
    const unixTimestamp = moment(dateTimeString, 'YYYY-MM-DD HH:mm:ss').unix();
    const urlID = `${createSlug(code)}-${id}${unixTimestamp}`
    const courseLink = `https://uis.signedin.today/course/${urlID}`;
    const encodedLink = encodeURI(courseLink);
    return encodedLink;
}

export const decodeCourseLink = (urlID) => {
    // Separate the course code from the rest of the string
    const segments = urlID.split('-');
    const IDUnix = segments[segments.length - 1];
    // Get the last 10 characters of the string
    const unixTimestamp = Number(IDUnix.slice(-10));
    // Get the rest of the string
    const courseID = Number(IDUnix.slice(0, -10));
    const createdAt = moment.unix(unixTimestamp).format('YYYY-MM-DD HH:mm:ss');
    // Return the course code, id and date
    return {id:courseID, createdAt};
}

export const genDayToken = () => {  
    const id = new Identity()
    const dayTokenIDFormat = {static:2,number:5,alphabet:3,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};
    const dayTokenID = id.getNewID(dayTokenIDFormat) + moment().tz(timezone).format("YYMMDDHHSS")
    const timestamp = momentTZ.tz(timezone).unix()
    return {id:dayTokenID,timestamp,isNew:true}
}

export const verifyDayToken = (dayToken) => {
    // console.log({TIMESTAMP}) 
    // if(instanceID.slice(-6) != moment().tz(timezone).format("YYMMDD")){
    if(!dayToken || (momentTZ.unix(dayToken.timestamp).tz(timezone).format("YYMMDD") != momentTZ.tz(timezone).format("YYMMDD"))){
        return genDayToken()
    }
    return {id:dayToken.id,isNew:false} 
}

export const readCSV = (csvString:string): Promise<any[]> => {
    const dataArray:any[] = [];
    const readableStream = Readable.from(csvString);
    
    return new Promise((resolve, reject) => {
        readableStream.pipe(csv())
          .on('data', (row) => {
            // Process each row and push it to the dataArray
            dataArray.push(row);
          })
          .on('end', () => {
            // Resolve the promise with the dataArray when parsing is complete
            resolve(dataArray);
          })
          .on('error', (error) => {
            // Reject the promise with the error if there's an issue during parsing
            reject(error);
          });
      });
}


export const daysDifference = (date:string) => {
    const currentDate = moment().tz(timezone);
    // Target date
    const targetDate = moment(date, 'YYYY-MM-DD');
    
    // Calculate the difference in days
    const daysDifferenceVal = targetDate.diff(currentDate, 'days');
    return daysDifferenceVal
}
export const getNextDate = (day:string) => {
    const today = moment().tz(timezone);
    const weekDays =["sun","mon","tue","wed","thu","fri","sat"]
    const daysUntil = (weekDays.indexOf(day) - today.day() + 7) % 7;
    const date = today.clone().add(daysUntil, 'days').format('YYYY-MM-DD');
    // return date + " " + daysDifference(date)
    return date
}


const PI = 3.14159265;
const TWOPI = 2 * PI;

/**
 * This function calculates the 2D angle between two vectors represented by their components (y1, x1) and (y2, x2).
 * It uses the Math.atan2 function to calculate the angle and normalizes the result to be within the range [-π, π].
 * @param {*} y1
 * @param {*} x1
 * @param {*} y2
 * @param {*} x2
 * @returns
 */
export const angle2D = (y1, x1, y2, x2) => {
  let dtheta, theta1, theta2;

  theta1 = Math.atan2(y1, x1);
  theta2 = Math.atan2(y2, x2);
  dtheta = theta2 - theta1;
  while (dtheta > PI) dtheta -= TWOPI;
  while (dtheta < -PI) dtheta += TWOPI;

  return dtheta;
};


/**
 * This function checks if a given coordinate (latitude, longitude) is inside a polygon defined by arrays latArray and longArray.
 * It does so by calculating the sum of interior angles formed by the given coordinate and each consecutive pair of points in the polygon.
 * The angle2D function is called to calculate the 2D angle between two vectors.
 * @param {*} latitude
 * @param {*} longitude
 * @param {*} latArray
 * @param {*} longArray
 * @returns
 */
export const isCoordinateInsidePolygon = (
  latitude,
  longitude,
  polygon
) => {
  let angle = 0;
  let p1Lat;
  let p1Long;
  let p2Lat;
  let p2Long;
//   const polygonStr =
//     '5.7393613 58.939143, 5.7401995 58.9389513, 5.7403296 58.939107, 5.7395102 58.9393, 5.7393613 58.939143';
//   const polygon = polygonStr.split(', ');
  const n = polygon.length;
//   console.log({ polygon });
  for (let i = 0; i < n; i++) {
    const coordinate1 = polygon[i];
    const coordinate2 = polygon[(i + 1) % n];
    // const coordinate1 = polygon[i].split(' ');
    // const coordinate2 = polygon[(i + 1) % n].split(' ');
    p1Lat = Number(coordinate1[1]) - latitude;
    p1Long = Number(coordinate1[0]) - longitude;
    p2Lat = Number(coordinate2[1]) - latitude;
    p2Long = Number(coordinate2[0]) - longitude;

    angle += angle2D(p1Lat, p1Long, p2Lat, p2Long);
  }
  return !(Math.abs(angle) < PI);
};
/**
 * This function checks if a given pair of latitude and longitude values represent a valid coordinate.
 * It ensures that both values are not empty strings, are numeric, and fall within typical ranges for latitude and longitude.
 * @param {*} latitude
 * @param {*} longitude
 * @returns
 */
export const isValidCoordinate = (latitude, longitude) => {
  return (
    latitude !== '' &&
    longitude !== '' &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude > -90 &&
    latitude < 90 &&
    longitude > -180 &&
    longitude < 180
  );
};

export const sendMail = ({subject,html,to,callback}) => {
    const email = config.stmp[0].email
    const password = config.stmp[0].password
    const from = `Oddsplug <${email}>`
    const smtp = nodemailer.createTransport({
        host: "premium78.web-hosting.com",
        port: 465,
        secure: true, // use TLS
        auth: {
          user:email,
          pass:password
        }
    })
    const mailOptions = {
        from,
        to,
        subject,
        html
    };

    smtp.sendMail(mailOptions, callback)
}


// export const hashID = (value) => 
//     CryptoJS.MD5(JSON.stringify(value)).toString(CryptoJS.enc.Hex);


export const translateBookmakerMarket = (bookmaker, data) => {
  // const container = bookmakersServiceC ;
  const container = bookmakersServiceContainer;
  const bookmakerFunction = container.resolve(bookmaker);
  if (bookmakerFunction) {
    return bookmakerFunction(data);
  }
  else {
    console.error('No function found for bookmaker:', bookmaker);
    return false
  }
}
export const  marketKeys = {
  "first_half":"1st",
  "second_half":"2nd",
  "first_period":"1st",
  "second_period":"2nd",
  "third_period":"3rd",
  "first_quarter":"1st",
  "second_quarter":"2nd",
  "third_quarter":"3rd",
  "fourth_quarter":"4th",
  "first_set":"1st",
  "second_set":"2nd",
  "third_set":"3rd",
  "fourth_set":"4th",
  "fifth_set":"5th"
}

export const scannedBookmakers = {
  "bet9ja":{
    "icon":"https://oddsplug.com/bucket/bookmakers/bet9ja.png", 
    "link":"https://sports.bet9ja.com/"
  },
  "ilotbet":{
    "icon":"https://oddsplug.com/bucket/bookmakers/ilot.png", 
    "link":"https://www.ilotbet.com/"
  },
  "nairabet":{
    "icon":"https://oddsplug.com/bucket/bookmakers/nairabet.png",
    "link":"https://www.nairabet.com/"
  },
  "betking":{
    "icon":"https://oddsplug.com/bucket/bookmakers/betking.png",
    "link":"https://www.betking.com/"
  },
  "sportybet":{
    "icon":"https://oddsplug.com/bucket/bookmakers/sportybet.png",
    "link":"https://www.sportybet.com/"
  },
  "accessbet":{
    "icon":"https://oddsplug.com/bucket/bookmakers/accessbet.png",
    "link":"https://accessbet.shop/"
  },
  "betpawa":{
    "icon":"https://oddsplug.com/bucket/bookmakers/betpawa.png",
    "link":"https://www.betpawa.ng/"
  },
  "n1bet":{
    "icon":"https://oddsplug.com/bucket/bookmakers/n1bet.png",
    "link":"https://n1bet.ng/soccer"
  },
  "betwgb":{
    "icon":"https://oddsplug.com/bucket/bookmakers/betwgb1.png",
    "link":"https://www.betwgb.com/"
  },
  "msport":{
    "icon":"https://oddsplug.com/bucket/bookmakers/msport.png",
    "link":"https://www.msport.com/ng/"
  },
  "frapapa":{
    "icon":"https://oddsplug.com/bucket/bookmakers/frapapa.png",
    "link":"https://www.frapapa.com"
  },
  "livescorebet":{
    "icon":"https://oddsplug.com/bucket/bookmakers/livescorebet.png",
    "link":"https://www.livescorebet.com/"
  },
  "surebet247":{
    "icon":"https://oddsplug.com/bucket/bookmakers/surebet247.png",
    "link":"https://surebet247.com/"
  },
  "22bet":{
    "icon":"https://oddsplug.com/bucket/bookmakers/_22bet.png",
    "link":"https://22bet.ng/line/football"
  },
  "1xbet":{
    "icon":"https://oddsplug.com/bucket/bookmakers/_1xbet.jpg",
    "link":"https://ng.1x001.com/"
  },
  "paripesa":{
    "icon":"https://oddsplug.com/bucket/bookmakers/paripesa.png",
    "link":"https://paripesa.ng/"
  },
  "betwinner":{
    "icon":"https://oddsplug.com/bucket/bookmakers/betwinner.png",
    "link":"https://betwinner.ng/"
  },
  "zebet":{
    "icon":"https://oddsplug.com/bucket/bookmakers/zebet.png",
    "link":"https://www.zebet.ng/"
  }
}

export const ourBookmakers = [
  {
    folder:"bet9ja",
    name:"Bet9ja",
    icon:"https://oddsplug.com/bucket/bookmakers/bet9ja.png",
    link:"https://sports.bet9ja.com/",
    status:1
  },
  {
    folder:"ilotbet",
    name:"iLOTBet",
    icon:"https://oddsplug.com/bucket/bookmakers/ilot.png",
    link:"https://www.ilotbet.com/",
    status:1
  },
  {
    folder:"nairabet",
    name:"Nairabet",
    icon:"https://oddsplug.com/bucket/bookmakers/nairabet.png",
    link:"https://www.nairabet.com/",
    status:1
  },
  {
    folder:"betking",
    name:"Betking",
    icon:"https://oddsplug.com/bucket/bookmakers/betking.png",
    link:"https://www.betking.com/",
    status:1
  },
  {
    folder:"sportybet",
    name:"Sportybet",
    icon:"https://oddsplug.com/bucket/bookmakers/sportybet.png",
    link:"https://www.sportybet.com/",
    status:1
  },
  // {
  //   folder:"accessbet",
  //   name:"Accessbet",
  //   icon:"https://oddsplug.com/bucket/bookmakers/accessbet.png",
  //   link:"https://accessbet.shop/",
  //   status:1
  // },
  {
    folder:"betpawa",
    name:"Betpawa",
    icon:"https://oddsplug.com/bucket/bookmakers/betpawa.png",
    link:"https://www.betpawa.ng/",
    status:1
  },
  {
    folder:"n1bet",
    name:"N1bet",
    icon:"https://oddsplug.com/bucket/bookmakers/n1bet.png",
    link:"https://n1bet.ng/soccer",
    status:1
  },
  {
    folder:"betwgb",
    name:"Betwgb",
    icon:"https://oddsplug.com/bucket/bookmakers/betwgb1.png",
    link:"https://www.betwgb.com/",
    status:1
  },
  {
    folder:"msport",
    name:"Msport",
    icon:"https://oddsplug.com/bucket/bookmakers/msport.png",
    link:"https://www.msport.com/ng/",
    status:1
  },
  {
    folder:"frapapa",
    name:"Frapapa",
    icon:"https://oddsplug.com/bucket/bookmakers/frapapa.png",
    link:"https://www.frapapa.com",
    status:1
  },
  {
    folder:"livescorebet",
    name:"Livescorebet",
    icon:"https://oddsplug.com/bucket/bookmakers/livescorebet.png",
    link:"https://www.livescorebet.com/",
    status:1
  },
  {
    folder:"surebet247",
    name:"Surebet247",
    icon:"https://oddsplug.com/bucket/bookmakers/surebet247.png",
    link:"https://surebet247.com/",
    status:1
  },
  {
    folder:"_1xbet",
    name:"1xbet",
    icon:"https://oddsplug.com/bucket/bookmakers/_1xbet.jpg",
    link:"https://ng.1x001.com/",
    status:1
  },
  // {
  //   folder:"zebet",
  //   name:"Zebet",
  //   icon:"https://oddsplug.com/bucket/bookmakers/zebet.png",
  //   link:"https://www.zebet.ng/",
  //   status:1
  // }
]

export const cloneBookmakers = [
  {
    "parent":"_1xbet",
    "clones":[
      {
        folder:"_22bet",
        name:"22bet",
        icon:"https://oddsplug.com/bucket/bookmakers/_22bet.png",
        link:"https://22bet.ng/line/football",
        status:1
      },
      {
        folder:"paripesa",
        name:"Paripesa",
        icon:"https://oddsplug.com/bucket/bookmakers/paripesa.png",
        link:"https://paripesa.ng/",
        status:1
      },
      {
        folder:"betwinner",
        name:"Betwinner",
        icon:"https://oddsplug.com/bucket/bookmakers/betwinner.png",
        link:"https://betwinner.ng/",
        status:1
      },
      {
        folder:"_1xbet",
        name:"1xbet",
        icon:"https://oddsplug.com/bucket/bookmakers/_1xbet.jpg",
        link:"https://ng.1x001.com/",
        status:1
      }
    ]
  }
]
export const ourSports = [
  {
    idName:"american_football",
    name:"American Football",
    icon:"https://oddsplug.com/bucket/sports/american_football.png",
    status:1
  },
  {
    idName:"baseball",
    name:"Baseball",
    icon:"https://oddsplug.com/bucket/sports/baseball.png",
    status:1
  },
  {
    idName:"basketball",
    name:"Basketball",
    icon:"https://oddsplug.com/bucket/sports/basketball.png",
    status:1
  },
  {
    idName:"boxing",
    name:"Boxing",
    icon:"https://oddsplug.com/bucket/sports/boxing.png",
    status:1
  },
  {
    idName:"cricket",
    name:"Cricket",
    icon:"https://oddsplug.com/bucket/sports/cricket.png",
    status:1
  },
  {
    idName:"darts",
    name:"Darts",
    icon:"https://oddsplug.com/bucket/sports/darts.png",
    status:1
  },
  {
    idName:"esports",
    name:"Esports",
    icon:"https://oddsplug.com/bucket/sports/esports.png",
    status:1
  },
  {
    idName:"football",
    name:"Football",
    icon:"https://oddsplug.com/bucket/sports/football.png",
    status:1
  },
  {
    idName:"futsal",
    name:"Futsal",
    icon:"https://oddsplug.com/bucket/sports/futsal.png",
    status:1
  },
  {
    idName:"handball",
    name:"Handball",
    icon:"https://oddsplug.com/bucket/sports/handball.png",
    status:1
  },
  {
    idName:"ice_hockey",
    name:"Ice Hockey",
    icon:"https://oddsplug.com/bucket/sports/ice_hockey.png",
    status:1
  },
  {
    idName:"mma",
    name:"MMA",
    icon:"https://oddsplug.com/bucket/sports/mma.png",
    status:1
  },
  {
    idName:"rugby",
    name:"Rugby",
    icon:"https://oddsplug.com/bucket/sports/rugby.png",
    status:1
  },
  {
    idName:"table_tennis",
    name:"Table Tennis",
    icon:"https://oddsplug.com/bucket/sports/table_tennis.png",
    status:1
  },
  {
    idName:"tennis",
    name:"Tennis",
    icon:"https://oddsplug.com/bucket/sports/tennis.png",
    status:1
  },
  {
    idName:"volleyball",
    name:"Volleyball",
    icon:"https://oddsplug.com/bucket/sports/volleyball.png",
    status:1
  }
]
// export const marketKeys = marketKeys
// export const scannedBookmakers = scannedBookmakers

export const formatArbitragesForWebView = (arbitrages, marketsDefinition) => {
  const newArbitrages = arbitrages.map(arb => {
    arb = arb.dataValues || arb
    arb = JSON.parse(JSON.stringify(arb)) //clone object to avoid mutation
    const userTimezone = 'Africa/Lagos'; //fetch from user settings
    arb.arbPercentage = parseFloat(arb.arbPercentage).toFixed(2)
    // Convert the timestamp to the specified timezone and format it
    arb.startAtTimestamp = Number(arb.startAt);
    arb.startAt = momentTZ.unix(arb.startAt).tz(userTimezone).format('D, MMM HH:mm');
    arb.bookmakers =  typeof arb.bookmakers === "string"?JSON.parse(arb.bookmakers):arb.bookmakers
    arb.market = marketsDefinition[arb.marketCode]
    arb.bookmakers = arb.bookmakers.map(bookmaker => {
      bookmaker.teams = bookmaker.home+" vs "+bookmaker.away
      bookmaker.icon = scannedBookmakers[bookmaker.bookmaker.toLowerCase()]["icon"]
      bookmaker.market = bookmaker.market in marketKeys?marketKeys[bookmaker.market]:bookmaker.market
      return bookmaker
    })
    return arb
  })
  return newArbitrages
}
// Function to group by sport
export const groupBySport = (arr: any[]) => {
  return arr.reduce((acc, obj) => {
    const key = obj.sport;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};



// Function that checks if an arbitrage matches a given exclusion rule.
export const matchesRule = (arb: any, rule: any) => {
  for (const key in rule) {
    if (Object.hasOwnProperty.call(rule, key)) {
      const ruleValue = rule[key];

      // Skip the rule if the value is "any"
      if (ruleValue === "any") continue;

      // Special handling for "bookmaker" key: check if any bookmaker matches.
      if (key === "bookmaker") {
        if (!arb.bookmakers || !arb.bookmakers.some(b => b.bookmaker === ruleValue)) {
          return false;
        }
      } else {
        // For other keys, directly compare the arb's value.
        if (arb[key] !== ruleValue) {
          return false;
        }
      }
    }
  }
  return true;
}

// Function that filters arbList: remove any arb that matches any exclusion rule.
export const filterArbList = (arbList: any[], exclusionRules: any) => {
  const rejectedArbitrages: any[] = [];
  const rejectedArbitragesIds: any[] = [];
  const validArbitrages = arbList.filter(arb => {
    const isRejected = exclusionRules.some(rule => matchesRule(arb, rule));
    if (isRejected) {
      rejectedArbitrages.push(arb);
      rejectedArbitragesIds.push(arb.id);
    }
    return !isRejected;
  });
  return { validArbitrages, rejectedArbitrages, rejectedArbitragesIds };
}


// export const translateBookmakerMarket = (bookmaker: string, data: any): any  => {
//     const container: ServiceContainer = bookmakersServiceContainer;
//     const bookmakerFunction = container.resolve(bookmaker);
//     if (bookmakerFunction) {
//         return bookmakerFunction(data);
//     }
//     else {
//         console.error('No function found for bookmaker:', bookmaker);
//         return false
//     }
// }

