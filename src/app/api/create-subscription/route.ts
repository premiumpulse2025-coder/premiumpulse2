import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      planName, 
      amount, 
      businessName, 
      coverages 
    } = body;

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum is $1.00" },
        { status: 400 }
      );
    }

    if (!planName) {
      return NextResponse.json(
        { error: "Plan name is required" },
        { status: 400 }
      );
    }

    const monthlyAmount = Math.round((amount / 12) * 100);

    const customer = await stripe.customers.create({
      name: businessName || "Commercial Client",
      metadata: {
        planName,
        coverages: JSON.stringify(coverages || []),
        type: "commercial_insurance",
      },
    });

    const product = await stripe.products.create({
      name: `${planName} - Commercial Insurance`,
      description: `Monthly subscription for ${businessName || "Commercial Client"}`,
      metadata: {
        type: "commercial_insurance",
        plan: planName,
      },
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: monthlyAmount,
      currency: "usd",
      recurring: {
        interval: "month",
        interval_count: 1,
      },
      metadata: {
        businessName: businessName || "Commercial Client",
        planName,
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: monthlyAmount,
      currency: "usd",
      customer: customer.id,
      setup_future_usage: "off_session",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        businessName: businessName || "Commercial Client",
        planName,
        coverages: JSON.stringify(coverages || []),
        priceId: price.id,
        type: "commercial_insurance_subscription",
        subscriptionPending: "true",
      },
      description: `First month payment for ${planName} - Commercial Insurance subscription`,
    });

    if (!paymentIntent.client_secret) {
      throw new Error("No client secret found in payment intent");
    }

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customerId: customer.id,
      priceId: price.id,
      monthlyAmount: monthlyAmount / 100,
      intentType: "payment",
    });
  } catch (error) {
    console.error("Subscription creation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create subscription";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
