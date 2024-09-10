import { AppDataSource } from "../database";
import { Product } from "../database/entity/Product";

export const ProductRepository = AppDataSource.getRepository(Product);