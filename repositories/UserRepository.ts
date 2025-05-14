import { Brackets } from "typeorm";
import { AppDataSource } from "../database";
import { User } from "../database/entity/User";

export const UserRepository = AppDataSource.getRepository(User).extend({
    async findUsersBySearch(query: string): Promise<User[]> {
        return this.createQueryBuilder("user")
            .where(new Brackets(qb => {
                qb.where("LOWER(user.name) LIKE :query", { query: `%${query.toLowerCase()}%` })
                    .orWhere("LOWER(user.nickname) LIKE :query", { query: `%${query.toLowerCase()}%` })
                    .orWhere("LOWER(user.email) LIKE :query", { query: `%${query.toLowerCase()}%` });
            }))
            .andWhere("user.type = :type", { type: false })
            .andWhere("user.disable = :disable", { disable: false })
            .getMany();
    }
})