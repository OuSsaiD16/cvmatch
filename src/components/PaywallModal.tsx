"use client";

import { useState } from "react";

interface PaywallModalProps {
  onClose: () => void;
}

export default function PaywallModal({ onClose }: PaywallModalProps) {
  const [loading, setLoading] = useState<"monthly" | "yearly" | null>(null);

  async function handleCheckout(plan: "monthly" | "yearly") {
    setLoading(plan);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(null);
    }
  }

  const features = [
    "Unlimited CV analyses",
    "Detailed keyword matching",
    "AI-powered CV rewrites",
    "PDF & DOCX upload",
    "Actionable tips",
    "Cancel anytime",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,0.7)" }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7 animate-fade-up border border-gray-100">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="w-12 h-12 bg-brand-50 border border-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1.5">You&apos;ve used your free analyses</h2>
          <p className="text-sm text-gray-500">
            Upgrade to Pro for unlimited CV analyses and land your dream job faster.
          </p>
        </div>

        {/* Plan options */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleCheckout("monthly")}
            disabled={loading !== null}
            className="w-full border-2 border-gray-200 hover:border-brand rounded-xl p-4 text-left transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-brand transition-colors">Monthly</div>
                <div className="text-xs text-gray-400 mt-0.5">Billed every month</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">$9<span className="text-sm font-normal text-gray-400">/mo</span></div>
              </div>
            </div>
            {loading === "monthly" && (
              <div className="mt-2 text-xs text-brand flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Redirecting to checkout…
              </div>
            )}
          </button>

          <button
            onClick={() => handleCheckout("yearly")}
            disabled={loading !== null}
            className="w-full border-2 border-brand bg-brand-50 rounded-xl p-4 text-left transition-all group disabled:opacity-60 disabled:cursor-not-allowed relative"
          >
            <div className="absolute -top-2.5 right-4 bg-brand text-white text-xs font-bold px-3 py-0.5 rounded-full shadow-brand-sm">
              Save 45%
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-brand">Yearly</div>
                <div className="text-xs text-brand/60 mt-0.5">Billed annually</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-brand">$59<span className="text-sm font-normal text-brand/60">/yr</span></div>
                <div className="text-xs text-brand/60">~$4.92/mo</div>
              </div>
            </div>
            {loading === "yearly" && (
              <div className="mt-2 text-xs text-brand flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Redirecting to checkout…
              </div>
            )}
          </button>
        </div>

        {/* Features list */}
        <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 mb-6">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
