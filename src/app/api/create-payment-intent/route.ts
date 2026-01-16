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
      coverages,
      paymentMode 
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

    const isAnnual = paymentMode === "annual";
    const discountedAmount = isAnnual ? Math.round(amount * 0.9) : amount;
    const unitAmount = Math.round(discountedAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: unitAmount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        businessName: businessName || "Commercial Client",
        planName,
        paymentMode: paymentMode || "annual",
        coverages: JSON.stringify(coverages || []),
        originalAmount: amount.toString(),
        finalAmount: discountedAmount.toString(),
        type: "commercial_insurance",
      },
      description: `${planName} - Commercial Insurance for ${businessName || "Commercial Client"}`,
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: discountedAmount,
    });
  } catch (error) {
    console.error("Payment Intent creation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create payment intent";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
