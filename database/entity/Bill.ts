import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { BillProduct } from "./BillProducts";

@Entity({name: 'bills' })
export class Bill {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column('double')
    total_price: number;

    @ManyToOne(() => User, (user) => user.bills)
    user: User;

    @OneToMany(() => BillProduct, (billProduct) => billProduct.bill)
    public billProducts: BillProduct[];
}