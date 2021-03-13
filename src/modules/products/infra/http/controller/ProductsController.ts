import { Request, Response } from 'express';

import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import CreateProductService from '@modules/products/services/CreateProductService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;

    const productsRepository = new ProductsRepository();
    const createProduct = new CreateProductService(productsRepository);

    const product = await createProduct.execute({ name, price, quantity });

    return response.json(product);
  }
}
