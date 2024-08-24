import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '@app/common';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('Stripe secret key not defined');
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-06-20',
    });
  }

  async createCharge({ amount }: CreateChargeDto) {
    try {
      // Create a payment intent
      return await this.stripe.paymentIntents.create({
        payment_method: 'pm_card_visa',
        amount: amount * 100, // Convert amount to cents
        confirm: true,
        payment_method_types: ['card'],
        currency: 'usd',
      });
    } catch (error) {
      console.error('Payment creation failed', error);
      throw error;
    }
  }
}
