"use strict";
// class ServiceContainer {
//     constructor() {
//         this.services = new Map();
//     }
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceContainer {
    constructor() {
        this.services = new Map();
    }
    register(bookmaker, fn) {
        this.services.set(bookmaker, fn);
    }
    resolve(bookmaker) {
        return this.services.get(bookmaker);
    }
}
exports.default = ServiceContainer;
// class ServiceContainer {
//     private services: Map<string, IBookmakerClassFunction> = new Map();
//     register(bookmaker: string, fn: IBookmakerClassFunction): void {
//         this.services.set(bookmaker, fn);
//     }
//     resolve(bookmaker: string): IBookmakerClassFunction | undefined {
//         return this.services.get(bookmaker);
//     }
// }
// export default ServiceContainer;
