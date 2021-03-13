import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;

    const customersRepository = new CustomersRepository();
    const createCustomer = new CreateCustomerService(customersRepository);

    const customer = await createCustomer.execute({ name, email });

    return response.json(customer);
  }
}
