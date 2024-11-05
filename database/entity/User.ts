import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 50 })
    name: string;

    @Column("varchar", { length: 50 })
    nickname: string;

    @Column("varchar", { length: 50 })
    email: string;

    @Column("varchar", { length: 200 })
    password: string;

    @Column("boolean")
    type: boolean;

    @Column("boolean")
    disable: boolean;
}
