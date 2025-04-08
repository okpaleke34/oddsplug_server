import { IArbitrage } from "../mongodb/models/arbitrage.model";

export interface IArbitrageRepository {
    create(arbitrage: IArbitrage): Promise<IArbitrage>;
    findById(id: string): Promise<IArbitrage | null>;
    findAll(): Promise<IArbitrage[]>;
    findByAggregate(aggregate: any): Promise<any>;
    findSelection(filter:IArbitrage): Promise<IArbitrage[]>;
    update(filter:IArbitrage, arbitrage: Partial<IArbitrage>): Promise<IArbitrage | null>;
    updateMany(filter:IArbitrage, arbitrage: Partial<IArbitrage> | any): Promise<number | null>;
    delete(id: string): Promise<IArbitrage | null>
}