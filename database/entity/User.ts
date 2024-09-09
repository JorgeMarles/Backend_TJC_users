import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Bill } from './Bill'

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 50 })
    email: string;

    @Column('varchar', { length: 50 })
    username: string;

    @Column('varchar', { length: 200 })
    password: string;

    @OneToMany(() => Bill, (bill) => bill.user)
    bills: Bill[];
}