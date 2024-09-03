
// class ServiceContainer {
//     constructor() {
//         this.services = new Map();
//     }

//     register(bookmaker, fn) {
//         this.services.set(bookmaker, fn);
//     }

//     resolve(bookmaker) {
//         return this.services.get(bookmaker);
//     }
// }

// // module.exports = ServiceContainer;
// export default ServiceContainer;
type ServiceFunction = (param:any) => any[]

class ServiceContainer {
    private services: Map<string, ServiceFunction>;

    constructor() {
        this.services = new Map<string, ServiceFunction>();
    }

    register(bookmaker: string, fn: ServiceFunction): void {
        this.services.set(bookmaker, fn);
    }

    resolve(bookmaker: string): ServiceFunction | undefined {
        return this.services.get(bookmaker);
    }
}

export default ServiceContainer;


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