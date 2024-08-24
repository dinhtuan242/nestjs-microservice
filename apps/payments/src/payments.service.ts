import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATION_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentCreateChargeDto } from './dto/payment-create-charge.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('Stripe secret key not defined');
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-06-20',
    });
  }

  async createCharge({ amount, email }: PaymentCreateChargeDto) {
    try {
      // Create a payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        payment_method: 'pm_card_visa',
        amount: amount * 100, // Convert amount to cents
        confirm: true,
        payment_method_types: ['card'],
        currency: 'usd',
      });

      this.notificationService.emit('notify_email', {
        email,
        text: `Your payment of ${amount} USD has complete successfully`,
      });

      return paymentIntent;
    } catch (error) {
      console.error('Payment creation failed', error);
      throw error;
    }
  }
}
