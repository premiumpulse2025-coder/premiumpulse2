import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";

export const metadata: Metadata = {
  title: "PremiumPulse.ai - AI-Powered Insurance Premium Prediction",
  description: "Get accurate, AI-powered insurance premium estimates with transparent explanations. Orchid AI Insurance helps families make informed decisions about health coverage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="3577173e-5f0d-42b4-8918-18be44a7f920"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        {/* Global glass ambient orbs — fixed, behind everything */}
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-violet-400/20 rounded-full blur-[100px] animate-float-orb" />
          <div className="absolute bottom-[-15%] right-[-8%] w-[700px] h-[700px] bg-indigo-400/15 rounded-full blur-[120px] animate-float-orb" style={{animationDelay: "5s", animationDuration: "18s"}} />
          <div className="absolute top-[40%] left-[55%] w-[400px] h-[400px] bg-pink-400/10 rounded-full blur-[80px] animate-float-orb" style={{animationDelay: "9s", animationDuration: "16s"}} />
        </div>
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
