import * as dotenv from 'dotenv';
dotenv.config();

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';

// Тестовые товары
export const PRODUCTS = [
  { id: 1, name: "Sword", description: "A shiny sword", price: 10, rarity: "common", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSj3pZQyhe1jv1Dm95uOnW04P82Ry2ystYlg&s" },
  { id: 2, name: "Shield", description: "Protect yourself", price: 20, rarity: "rare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr8fLT2o9RTd2jOMGZ3DAWC0JSHV7Ph8i8SA&s" },
  { id: 3, name: "Crown", description: "Be the king", price: 50, rarity: "legendary", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSduDM8r5NmskhUYfXU9l6vn9qBmA7WcoYFGQ&s" },
];

let user = {
  points: 5000,
  purchasedItems: [] as number[],
};

@Injectable()
export class ShopService {
  private stripe: Stripe;

  constructor() {
    if (!process.env.REMOVED) {
      throw new Error("❌ REMOVED is not set in .env");
    }

    this.stripe = new Stripe(process.env.REMOVED, {
        apiVersion: '2025-07-30.basil',
    });
  }

  getProducts() {
    return PRODUCTS;
  }

  getUser() {
    return user;
  }

  addPoints(points: number) {
    user.points += points;
    return user;
  }

  buyProduct(productId: number) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) throw new NotFoundException('Product not found');

    if (user.purchasedItems.includes(productId)) {
      throw new BadRequestException('Product already purchased');
    }

    if (user.points < product.price) {
      throw new BadRequestException('Insufficient points');
    }

    user.points -= product.price;
    user.purchasedItems.push(productId);
    return user;
  }

  async createCheckout(productId: number) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) throw new NotFoundException('Product not found');

    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: product.name },
            unit_amount: product.price * 100, // $10 → 1000 центов
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });
  }
}
