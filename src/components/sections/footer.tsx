"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Twitter, Linkedin, Github, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  insurance: [
    { label: "Family Insurance", href: "/family-insurance" },
    { label: "Individual Insurance", href: "/individual-insurance" },
    { label: "Commercial Insurance", href: "/commercial-insurance" },
    { label: "Bill Simulator", href: "/bill-simulator" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "How It Works", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

const socials = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[2px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-purple-600/5 blur-3xl" />

      <div className="container mx-auto px-6 py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-flex items-center mb-5 group">
              <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent tracking-tight group-hover:from-purple-300 group-hover:to-violet-300 transition-all">
                premiumpulse
              </span>
              <div className="ml-2 flex h-5 w-10 items-center justify-center rounded-full bg-purple-600 group-hover:bg-purple-500 transition-colors">
                <span className="text-[10px] font-black text-white">.ai</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              AI-powered insurance premium prediction helping families and businesses make informed decisions about their coverage.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {socials.map(social => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ y: -2 }}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-purple-800/60 border border-slate-700/50 hover:border-purple-500/50 flex items-center justify-center text-slate-400 hover:text-purple-300 transition-all"
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Insurance Links */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5">Insurance Types</h3>
            <ul className="space-y-3">
              {footerLinks.insurance.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-purple-300 transition-colors text-sm font-medium flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-purple-300 transition-colors text-sm font-medium flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5">Contact</h3>
            <ul className="space-y-4">
              {[
                { icon: Phone, text: "1800-123-4567" },
                { icon: Mail, text: "support@premiumpulse.ai" },
                { icon: MapPin, text: "123 Tech Park, Bangalore, India" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-slate-400 text-sm group cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-800/30 flex items-center justify-center shrink-0 group-hover:bg-purple-800/60 transition-colors mt-0.5">
                    <Icon className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="font-medium leading-relaxed group-hover:text-slate-300 transition-colors">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} PremiumPulse.ai — All rights reserved.
          </p>
          <div className="flex gap-6">
            {socials.map(s => (
              <a key={s.label} href={s.href} className="text-slate-500 hover:text-purple-400 text-sm font-medium transition-colors">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
