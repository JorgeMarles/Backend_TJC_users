import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BillProduct } from "./BillProducts";

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 100 })
    name: string;

    @Column('int')
    stock: number;

    @Column('double')
    price: number;

    @OneToMany(() => BillProduct, (billProduct) => billProduct.product)
    public billProducts: BillProduct[];
}