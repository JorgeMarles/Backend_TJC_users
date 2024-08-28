import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'users' })
export class User {
    @PrimaryColumn()
    email: string

    @Column()
    username: string

    @Column()
    password: string
}