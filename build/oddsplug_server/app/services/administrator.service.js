"use strict";
// import Administrator from '../models/administrator.model';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// export const findAdminById = async findAdminById (id: string) => {
//   return await Administrator.findById(id);
// };
class AdministratorService {
    // findAdminById = async  (id: string) => {
    //   return await Administrator.findById(id);
    // };
    getAdministrators() {
        return __awaiter(this, void 0, void 0, function* () {
            // throw new Error('Method not implemented.');
            // fetch arbitrages
            const mockAdministrators = [
                { id: 1, name: 'Admin 1', email: 'admin1@example.com' },
                { id: 2, name: 'Admin 2', email: 'admin2@example.com' }
            ];
            return mockAdministrators;
        });
    }
}
exports.default = AdministratorService;
