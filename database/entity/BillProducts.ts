import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";
import { Bill } from "./Bill";

@Entity({ name: "billProducts"})
export class BillProduct {
    @PrimaryGeneratedColumn()
    public id : number;

    @Column()
    public productId : number;

    @Column()
    public billId: number;

    @Column()
    public quantity: number;

    @ManyToOne(() => Product, (product) => product.billProducts)
    public product: Product;

    @ManyToOne(() => Bill, (bill) => bill.billProducts)
    public bill: Bill;
}