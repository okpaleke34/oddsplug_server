"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateMarket = exports.bookmakersServiceContainer = void 0;
// const ServiceContainer = require('./BookmakerMarketServiceContainer');
// const CryptoJS = require('crypto-js');
// const { hashID } = require("./functions");
const crypto_js_1 = __importDefault(require("crypto-js"));
const BookmakerMarketServiceContainer_1 = __importDefault(require("./BookmakerMarketServiceContainer"));
// exports.bookmakersServiceContainer = bookmakersServiceContainer;
const hashID = (value) => crypto_js_1.default.MD5(JSON.stringify(value)).toString(crypto_js_1.default.enc.Hex);
const round = (value, decimals) => {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};
// {
//     "id":"ee975cf502a863bab8b36643c3d9d0df",
//     "background":"bg-success",
//     "condition":[
//        [
//           "description",
//           "1x2"
//        ],
//        [
//           "specifiers",
//           ""
//        ]
//     ],
//     "outcomes_identifier":[
//        [
//           [
//              "description",
//              "Home"
//           ]
//        ],
//        [
//           [
//              "description",
//              "Draw"
//           ]
//        ],
//        [
//           [
//              "description",
//              "Away"
//           ]
//        ]
//     ],
//     "outcomes_odd":[
//        "1.09",
//        "8.20",
//        "20.00"
//     ]
// }
//  type ITranslatedMarket = {
//     id: string; //id to identify a market
//     name: string; //The name that will be displayed as the market name. Only used for displaying to admin
//     background: string; //Background color to show admin that this is done or not
//     condition: [string, string][]; //Condition for the market. This is the if statement condition
//     outcomes_identifier: [string[]][]; //Different outcomes that are in the market
//     outcomes_odd: string[]; //The odds for the outcomes
//  }
function translateMSportMarket(bookmakerMarkets) {
    //   bookmakerMarkets = bookmakerMarkets["data"]["markets"]
    bookmakerMarkets = bookmakerMarkets.data.markets;
    const readableMarket = [];
    for (let i = 0; i < bookmakerMarkets.length; i++) {
        const market = bookmakerMarkets[i];
        let name = market.specifiers.trim() ? ` (${market.specifiers})` : '';
        name = market.description + name;
        const marketObj = {
            condition: [
                ['description', market.description],
                ['specifiers', market.specifiers],
            ],
            name,
            outcomes_identifier: [],
            outcomes_odd: [],
        };
        for (let j = 0; j < market.outcomes.length; j++) {
            const outcome = market.outcomes[j];
            const marketIdentifier = [['description', outcome.description]];
            marketObj.outcomes_identifier.push(marketIdentifier);
            marketObj.outcomes_odd.push(outcome.odds);
        }
        if (marketObj.outcomes_identifier.length > 1 &&
            marketObj.outcomes_identifier.length <= 3) {
            readableMarket.push(Object.assign({ id: hashID(marketObj), background: '' }, marketObj));
        }
    }
    return readableMarket;
}
function translateFrapapaMarket(bookmakerMarkets) {
    bookmakerMarkets = bookmakerMarkets.markets;
    const readableMarket = [];
    for (let i = 0; i < bookmakerMarkets.length; i++) {
        const market = bookmakerMarkets[i];
        let name = market.specifier.trim() ? ` (${market.specifier})` : '';
        name = market.marketName + name;
        const marketObj = {
            condition: [
                ['marketName', market.marketName],
                ['specifier', market.specifier],
            ],
            name,
            outcomes_identifier: [],
            outcomes_odd: [],
        };
        for (let j = 0; j < market.outcomes.length; j++) {
            const outcome = market.outcomes[j];
            const marketIdentifier = [['displayName', outcome.displayName]];
            marketObj.outcomes_identifier.push(marketIdentifier);
            //   marketObj.outcomes_odd.push(round(outcome.odds,2));
            marketObj.outcomes_odd.push(round(outcome.odds, 2));
        }
        if (marketObj.outcomes_identifier.length > 1 &&
            marketObj.outcomes_identifier.length <= 3) {
            readableMarket.push(Object.assign({ id: hashID(marketObj), background: '' }, marketObj));
        }
    }
    //   console.log(readableMarket[0])
    return readableMarket;
}
function translateN1betMarket(bookmakerMarkets) {
    const readableMarket = [];
    for (let i = 0; i < bookmakerMarkets.length; i++) {
        const market = bookmakerMarkets[i];
        if (market.outcomes.length > 1 &&
            market.outcomes.length <= 3) {
        }
        else {
            continue;
        }
        // Remove all player markets
        if (market.market_groups.includes("all") && market.market_groups.includes("player")) {
            continue;
        }
        // The market specifier contains the handicap value with other values, we need to extract the handicap value
        const specifierMatch = market.specifier.match(/hcp=([+-]?\d+(\.\d+)?)/);
        const hcpValue = specifierMatch ? specifierMatch[1] : null;
        let name = hcpValue ? ` (${hcpValue})` : '';
        name = market.name + name;
        const marketObj = {
            condition: [
                ['name', market.name],
                // ['specifier', hcpValue],
            ],
            name,
            outcomes_identifier: [],
            outcomes_odd: [],
        };
        if (hcpValue) {
            marketObj.condition.push(['specifier', "hcp=" + hcpValue]);
        }
        for (let j = 0; j < market.outcomes.length; j++) {
            const outcome = market.outcomes[j];
            const marketIdentifier = [['name', outcome.name]];
            marketObj.outcomes_identifier.push(marketIdentifier);
            marketObj.outcomes_odd.push(outcome.odds / 1000);
        }
        readableMarket.push(Object.assign({ id: hashID(marketObj), background: '' }, marketObj));
    }
    //   console.log(readableMarket[13].condition)
    //   console.log(readableMarket[13].name)
    return readableMarket;
}
function translateLivescorebetMarket(bookmakerMarkets) {
    const readableMarket = [];
    bookmakerMarkets = bookmakerMarkets.event.markets;
    // console.log(bookmakerMarkets.length)
    let marketCount = 0;
    for (let i = 0; i < bookmakerMarkets.length; i++) {
        const market = bookmakerMarkets[i];
        if (market.selections.length > 1 &&
            market.selections.length <= 3) {
            marketCount += 1;
        }
        else {
            continue;
        }
        const marketObj = {
            condition: [
                ['name', market.name],
                ['marketKind', market.marketKind],
            ],
            name: market.name,
            outcomes_identifier: [],
            outcomes_odd: [],
        };
        for (let j = 0; j < market.selections.length; j++) {
            const outcome = market.selections[j];
            const outcomesIdentifier = [['name', outcome.name]];
            marketObj.outcomes_identifier.push(outcomesIdentifier);
            //   marketObj.outcomes_odd.push(round(outcome.odds,2));
            marketObj.outcomes_odd.push(outcome.odds);
        }
        readableMarket.push(Object.assign({ id: hashID(marketObj), background: '' }, marketObj));
        //   console.log(market)
    }
    // console.log({marketCount})
    // const id = 12
    // console.log(readableMarket[id])
    // console.log(readableMarket[id]["outcomes_identifier"])
    return readableMarket;
}
function preprocessData(data, key) {
    const map = new Map();
    for (const item of Object.values(data)) {
        if (item[key] !== undefined) {
            map.set(item[key], item);
        }
    }
    return map;
}
function searchObject(preprocessedData, value) {
    return preprocessedData.get(value) || null;
}
function translateSurebet247Market(bookmakerMarkets) {
    const readableMarket = [];
    bookmakerMarkets = bookmakerMarkets["scs"];
    let mappedMarket = require(`../data/bookmakers/surebet247.mapped_markets.json`);
    // console.log(mappedMarket)
    console.log(bookmakerMarkets.length);
    let marketCount = 0;
    for (let i = 0; i < bookmakerMarkets.length; i++) {
        const market = bookmakerMarkets[i];
        // console.log({market})
        if (market.eqs.length > 1 &&
            market.eqs.length <= 3) {
            marketCount += 1;
        }
        else {
            continue;
        }
        // const marketDef = searchObject(mappedMarket, "cs", 15)
        const key = 'cs';
        const valueToFind = market.cs;
        // Preprocess the data
        const preprocessedData = preprocessData(mappedMarket, key);
        // Search the preprocessed data
        const marketDef = searchObject(preprocessedData, valueToFind);
        if (!marketDef) {
            continue;
        }
        // console.log(marketDef)
        const marketObj = {
            condition: [
                ['cs', market.cs],
            ],
            name: marketDef["ds"],
            outcomes_identifier: [],
            outcomes_odd: [],
        };
        for (let j = 0; j < market.eqs.length; j++) {
            const outcome = market.eqs[j];
            const outcomesIdentifier = [['ce', outcome.ce]];
            marketObj.outcomes_identifier.push(outcomesIdentifier);
            //   marketObj.outcomes_odd.push(round(outcome.odds,2));
            marketObj.outcomes_odd.push(outcome.q / 100);
        }
        readableMarket.push(Object.assign({ id: hashID(marketObj), background: '' }, marketObj));
        //   console.log(market)
    }
    // console.log({marketCount})
    // const id = 12
    // console.log(readableMarket[id])
    // console.log(readableMarket[id]["outcomes_identifier"])
    // console.log(readableMarket)
    return readableMarket;
}
const bookmakersServiceContainer = new BookmakerMarketServiceContainer_1.default();
exports.bookmakersServiceContainer = bookmakersServiceContainer;
bookmakersServiceContainer.register('msport', translateMSportMarket);
bookmakersServiceContainer.register('frapapa', translateFrapapaMarket);
bookmakersServiceContainer.register('n1bet', translateN1betMarket);
bookmakersServiceContainer.register('livescorebet', translateLivescorebetMarket);
bookmakersServiceContainer.register('surebet247', translateSurebet247Market);
const translateMarket = translateSurebet247Market;
exports.translateMarket = translateMarket;
// import ServiceContainer from "./BookmakerMarketServiceContainer";
// import { hashID } from "./marketMatch";
// const bookmakersServiceContainer = new ServiceContainer();
// bookmakersServiceContainer.register('msport', translateMSportsMarket);
// bookmakersServiceContainer.register('bookmaker2', function2);
// bookmakersServiceContainer.register('bookmaker3', function3);
// export default bookmakersServiceContainer;
// function translateMSportsMarket(bookmakerMarkets: any){
//     const readableMarket: any[] = [];
//     for (let i = 0; i < bookmakerMarkets.length; i++) {
//       const market = bookmakerMarkets[i];
//       const marketObj: IBookmakerType = {
//         condition: [
//           ['description', market.description],
//           ['specifiers', market.specifiers],
//         ],
//         // "outcomes_identifier":[["description", ""]]
//         outcomes_identifier: [],
//         outcomes_odd: [],
//       };
//       for (let j = 0; j < market.outcomes.length; j++) {
//         const outcome = market.outcomes[j];
//         // Add more ways to identify the odd if needed
//         // const marketIdentifier = [["description",outcome.description],["odd",outcome.odds]]
//         const marketIdentifier = [['description', outcome.description]];
//         marketObj.outcomes_identifier.push(marketIdentifier);
//         marketObj.outcomes_odd.push(outcome.odds);
//       }
//       if (
//         marketObj.outcomes_identifier.length > 1 &&
//         marketObj.outcomes_identifier.length <= 3
//       ) {
//         // Add markets with 2 or 3 outcomes
//         readableMarket.push({
//           id: hashID(marketObj),
//           background: '',
//           ...marketObj,
//         });
//       }
//     }
//     return readableMarket;
// };
// function function2(data: any): void {
//     console.log('Function 2 called with data:', data);
//     // Implementation for bookmaker2
// }
// function function3(data: any): void {
//     console.log('Function 3 called with data:', data);
//     // Implementation for bookmaker3
// }
