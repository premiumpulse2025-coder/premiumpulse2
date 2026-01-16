"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-6">
              <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent tracking-tight">
                premiumpulse
              </span>
              <div className="ml-2 flex h-5 w-10 items-center justify-center rounded-full bg-purple-600">
                <span className="text-[10px] font-black text-white">.ai</span>
              </div>
            </div>
            <p className="text-slate-400 text-base leading-relaxed">
              AI-powered insurance premium prediction helping families and businesses make informed decisions about their coverage.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white text-lg mb-6">Insurance Types</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/family-insurance" className="text-slate-400 hover:text-purple-400 transition-colors font-medium">
                  Family Insurance
                </Link>
              </li>
              <li>
                <Link href="/individual-insurance" className="text-slate-400 hover:text-purple-400 transition-colors font-medium">
                  Individual Insurance
                </Link>
              </li>
              <li>
                <Link href="/commercial-insurance" className="text-slate-400 hover:text-purple-400 transition-colors font-medium">
                  Commercial Insurance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-slate-400 hover:text-purple-400 transition-colors font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-purple-400 transition-colors font-medium">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-purple-400 transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-purple-400 transition-colors font-medium">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-lg mb-6">Contact</h3>
            <ul className="space-y-5">
              <li className="flex items-center gap-3 text-slate-400 font-medium">
                <div className="w-8 h-8 rounded-lg bg-purple-900/50 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-purple-400" />
                </div>
                1800-123-4567
              </li>
              <li className="flex items-center gap-3 text-slate-400 font-medium">
                <div className="w-8 h-8 rounded-lg bg-purple-900/50 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-purple-400" />
                </div>
                support@premiumpulse.ai
              </li>
              <li className="flex items-start gap-3 text-slate-400 font-medium">
                <div className="w-8 h-8 rounded-lg bg-purple-900/50 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-purple-400" />
                </div>
                123 Tech Park, Bangalore, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-sm font-medium">
              © {new Date().getFullYear()} PremiumPulse.ai. All rights reserved.
            </p>
          <div className="flex gap-8">
            <Link href="#" className="text-slate-500 hover:text-purple-400 text-sm font-medium">Twitter</Link>
            <Link href="#" className="text-slate-500 hover:text-purple-400 text-sm font-medium">LinkedIn</Link>
            <Link href="#" className="text-slate-500 hover:text-purple-400 text-sm font-medium">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
