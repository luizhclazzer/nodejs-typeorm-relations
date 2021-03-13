import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  constructor(
    private ordersRepository: IOrdersRepository,
    private productsRepository: IProductsRepository,
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    const productsId = products.map(product => {
      return { id: product.id };
    });

    const productsFound = await this.productsRepository.findAllById(productsId);

    const orderProducts = productsFound.map(orderProduct => {
      const finalProduct = products.find(
        productFind => productFind.id === orderProduct.id,
      );

      return {
        product_id: orderProduct.id,
        price: orderProduct.price,
        quantity: finalProduct?.quantity || 0,
      };
    });

    if (products.length > orderProducts.length) {
      throw new AppError('Product not found');
    }

    await this.productsRepository.updateQuantity(products);

    const order = await this.ordersRepository.create({
      customer,
      products: orderProducts,
    });

    return order;
  }
}

export default CreateOrderService;
