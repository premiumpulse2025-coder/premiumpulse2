"use client";

import { useState, useEffect } from "react";
import { getStripe } from "@/lib/stripe-client";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CreditCard, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

const stripePromise = getStripe();

interface PaymentFormProps {
  planName: string;
  amount: number;
  businessName: string;
  coverages: string[];
  paymentMode: "annual" | "monthly";
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

interface CheckoutFormProps {
  clientSecret: string;
  amount: number;
  paymentMode: "annual" | "monthly";
  intentType: "payment" | "setup";
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

function CheckoutForm({ 
  clientSecret, 
  amount, 
  paymentMode, 
  intentType,
  onSuccess, 
  onError 
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isElementsReady, setIsElementsReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !isElementsReady) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message || "An error occurred");
      setIsProcessing(false);
      return;
    }

    let result;

    if (intentType === "setup") {
      result = await stripe.confirmSetup({
        elements,
        clientSecret,
        redirect: "if_required",
      });
    } else {
      result = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: "if_required",
      });
    }

    if (result.error) {
      setErrorMessage(result.error.message || "Payment failed");
      onError(result.error.message || "Payment failed");
      setIsProcessing(false);
    } else {
      const intentId = intentType === "setup" 
        ? (result as { setupIntent?: { id: string } }).setupIntent?.id
        : (result as { paymentIntent?: { id: string } }).paymentIntent?.id;
      onSuccess(intentId || "success");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4 max-h-[400px] overflow-y-auto">
        <PaymentElement 
          onReady={() => setIsElementsReady(true)}
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing || !isElementsReady}
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 h-14 text-lg font-bold gap-3"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : !isElementsReady ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Pay ${paymentMode === "monthly" ? Math.round(amount / 12).toLocaleString() : amount.toLocaleString()}
            {paymentMode === "monthly" && <span className="text-sm font-normal opacity-80">/mo</span>}
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="h-4 w-4" />
        <span>256-bit SSL Encrypted | Powered by Stripe</span>
      </div>
    </form>
  );
}

export function PaymentForm({
  planName,
  amount,
  businessName,
  coverages,
  paymentMode,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentType, setIntentType] = useState<"payment" | "setup">("payment");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const createIntent = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const endpoint = paymentMode === "monthly" 
          ? "/api/create-subscription" 
          : "/api/create-payment-intent";

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planName,
            amount,
            businessName,
            coverages,
            paymentMode,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to initialize payment");
        }

        setClientSecret(data.clientSecret);
        if (data.intentType) {
          setIntentType(data.intentType);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to initialize payment";
        setLoadError(errorMessage);
        onError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (amount > 0 && planName) {
      createIntent();
    }
  }, [amount, planName, businessName, coverages, paymentMode, onError]);

  if (isLoading) {
    return (
      <Card className="border-2 border-violet-200">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-violet-600 mb-4" />
            <p className="text-gray-600 font-medium">Initializing secure payment...</p>
            <p className="text-sm text-gray-400 mt-1">This may take a moment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loadError) {
    return (
      <Card className="border-2 border-red-200">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Initialization Failed</h3>
            <p className="text-gray-600 mb-4">{loadError}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-violet-200 text-violet-700"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return null;
  }

  const discountedAmount = paymentMode === "annual" ? Math.round(amount * 0.9) : amount;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#7c3aed",
            colorBackground: "#ffffff",
            colorText: "#1f2937",
            colorDanger: "#ef4444",
            fontFamily: "system-ui, sans-serif",
            spacingUnit: "4px",
            borderRadius: "12px",
          },
          rules: {
            ".Input": {
              borderColor: "#e5e7eb",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            },
            ".Input:focus": {
              borderColor: "#7c3aed",
              boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.2)",
            },
            ".Label": {
              fontWeight: "500",
            },
          },
        },
      }}
    >
      <CheckoutForm
        clientSecret={clientSecret}
        amount={discountedAmount}
        paymentMode={paymentMode}
        intentType={intentType}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}
