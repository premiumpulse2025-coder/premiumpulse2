import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      planName, 
      amount, 
      paymentMode, 
      businessName, 
      coverages 
    } = body;

    if (!amount || !planName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const isAnnual = paymentMode === "annual";
    const discountedAmount = isAnnual ? Math.round(amount * 0.9) : amount;
    const unitAmount = isAnnual 
      ? Math.round(discountedAmount * 100) 
      : Math.round((discountedAmount / 12) * 100);

    const metadata = {
      businessName: businessName || "Commercial Client",
      planName,
      paymentMode,
      coverages: JSON.stringify(coverages || []),
      originalAmount: amount.toString(),
      finalAmount: discountedAmount.toString(),
    };

    let sessionConfig: Stripe.Checkout.SessionCreateParams;

    if (isAnnual) {
      sessionConfig = {
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${planName} - Commercial Insurance`,
                description: `Annual Premium (10% discount applied) for ${businessName || "your business"}`,
                metadata: {
                  type: "commercial_insurance",
                  plan: planName,
                },
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${request.headers.get("origin")}/commercial-insurance/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.headers.get("origin")}/commercial-insurance?canceled=true`,
        metadata,
      };
    } else {
      sessionConfig = {
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${planName} - Commercial Insurance`,
                description: `Monthly Installments for ${businessName || "your business"}`,
                metadata: {
                  type: "commercial_insurance",
                  plan: planName,
                },
              },
              unit_amount: unitAmount,
              recurring: {
                interval: "month",
                interval_count: 1,
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${request.headers.get("origin")}/commercial-insurance/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.headers.get("origin")}/commercial-insurance?canceled=true`,
        metadata,
        subscription_data: {
          metadata,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Stripe Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
