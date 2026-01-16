import { NextRequest, NextResponse } from "next/server";
import { predictPremium } from "@/lib/ml/premium-calculator";
import { supabase } from "@/lib/supabase";
import type { FamilyMember, HealthDetails, PaymentCapacity } from "@/types/insurance";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { members, healthDetails, paymentCapacity } = body as {
      members: FamilyMember[];
      healthDetails: Record<string, HealthDetails>;
      paymentCapacity: PaymentCapacity;
    };

    if (!members || members.length === 0) {
      return NextResponse.json(
        { error: "At least one family member is required" },
        { status: 400 }
      );
    }

    if (!healthDetails || Object.keys(healthDetails).length === 0) {
      return NextResponse.json(
        { error: "Health details are required for all members" },
        { status: 400 }
      );
    }

    if (!paymentCapacity) {
      return NextResponse.json(
        { error: "Payment capacity information is required" },
        { status: 400 }
      );
    }

    const prediction = predictPremium(members, healthDetails, paymentCapacity);

    // Persist to Supabase
    const isFamily = members.length > 1 || members[0].type !== 'self';
    const { data: quote, error: quoteError } = await supabase
      .from('insurance_quotes')
      .insert({
        type: isFamily ? 'family' : 'individual',
        payment_capacity: paymentCapacity,
        prediction: prediction
      })
      .select()
      .single();

    if (quoteError) {
      console.error("Error saving quote:", quoteError);
    } else if (quote) {
      const membersToInsert = members.map(m => ({
        quote_id: quote.id,
        type: m.type,
        name: m.name,
        age: m.age,
        gender: m.gender,
        relationship: m.relationship,
        city: m.city,
        state: m.state,
        country: m.country,
        health_details: healthDetails[m.id] || {}
      }));

      const { error: membersError } = await supabase
        .from('quote_members')
        .insert(membersToInsert);

      if (membersError) {
        console.error("Error saving members:", membersError);
      }
    }

    return NextResponse.json({
      success: true,
      prediction,
      disclaimer: "The recommended premium is generated using AI/ML models based on the health and personal information provided. Factors such as age, medical history, lifestyle habits, and number of insured members influence the final amount. This is an indicative estimate and actual premiums may vary based on insurer underwriting policies."
    });
  } catch (error) {
    console.error("Premium prediction error:", error);
    return NextResponse.json(
      { error: "Failed to predict premium" },
      { status: 500 }
    );
  }
}
