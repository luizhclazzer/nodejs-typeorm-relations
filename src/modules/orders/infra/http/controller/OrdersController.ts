import { Request, Response } from 'express';

import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const ordersRepository = new OrdersRepository();
    const productsRepository = new ProductsRepository();
    const customersRepository = new CustomersRepository();
    const showOrder = new FindOrderService(
      ordersRepository,
      productsRepository,
      customersRepository,
    );

    const order = await showOrder.execute({ id });

    return response.json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    const ordersRepository = new OrdersRepository();
    const productsRepository = new ProductsRepository();
    const customersRepository = new CustomersRepository();
    const createOrder = new CreateOrderService(
      ordersRepository,
      productsRepository,
      customersRepository,
    );

    const order = await createOrder.execute({ customer_id, products });

    return response.json(order);
  }
}
