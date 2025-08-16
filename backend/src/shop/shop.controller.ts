import { Controller, Get, Post, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { ShopService } from './shop.service';

@Controller()
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('products')
  getProducts() {
    return this.shopService.getProducts();
  }

  @Get('user')
  getUser() {
    return this.shopService.getUser();
  }

  @Post('user/add-points')
  addPoints(@Body('points') points: number) {
    if (typeof points !== 'number' || points <= 0) {
      throw new BadRequestException('Invalid points value');
    }
    return this.shopService.addPoints(points);
  }

  @Post('user/buy')
  buyProduct(@Body('productId') productId: number) {
    if (!productId) {
      throw new BadRequestException('ProductId is required');
    }
    return this.shopService.buyProduct(productId);
  }

  @Post('create-checkout-session')
  async createCheckout(@Body('productId') productId: number) {
    if (!productId) {
      throw new BadRequestException('ProductId is required');
    }
    const session = await this.shopService.createCheckout(productId);
    return { url: session.url };
  }
}
