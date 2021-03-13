import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProduct = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return findProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const idList = products.map(product => product.id);
    // const findProduct = await this.ormRepository.findByIds(products);
    const findProduct = await this.ormRepository.find({ id: In(idList) });

    return findProduct;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productIds = products.map(product => {
      return {
        id: product.id,
      };
    });

    const currentProducts = await this.findAllById(productIds);

    const updateProducts = currentProducts.map(currentProduct => {
      const receiveProduct = products.find(
        product => product.id === currentProduct.id,
      );

      if (!receiveProduct) {
        throw new AppError('Product not found.');
      }

      if (receiveProduct.quantity > currentProduct.quantity) {
        throw new AppError('Insufficient product quantity.');
      }

      const updatedQuantityProduct = currentProduct;
      updatedQuantityProduct.quantity -= receiveProduct.quantity;

      return updatedQuantityProduct;
    });

    const updatedProducts = await this.ormRepository.save(updateProducts);

    return updatedProducts;
  }
}

export default ProductsRepository;
