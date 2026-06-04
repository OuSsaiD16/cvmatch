import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";

const stats = [
  { value: "12,400+", label: "CVs analyzed" },
  { value: "89%", label: "ATS pass rate" },
  { value: "< 2 min", label: "avg. time to results" },
];

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Match Score",
    desc: "Instant 0–100 compatibility score. Know exactly where you stand before you apply.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    title: "Keyword Analysis",
    desc: "See exactly which ATS keywords you have and which critical ones you're missing.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: "AI CV Rewrite",
    desc: "Claude AI rewrites your professional summary to naturally weave in missing keywords.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Actionable Tips",
    desc: "One specific, concrete improvement you can make right now to boost your chances.",
  },
];

const steps = [
  {
    num: "01",
    title: "Paste or upload your CV",
    desc: "Supports PDF, DOCX, or plain text. Your data stays private — never stored or shared.",
  },
  {
    num: "02",
    title: "Add the job description",
    desc: "Copy and paste the full job listing. The more detail you provide, the more accurate your score.",
  },
  {
    num: "03",
    title: "Get your results instantly",
    desc: "Match score, keyword gaps, a rewritten summary, and one clear next step — in under 2 minutes.",
  },
];

const freePlan = [
  "2 CV analyses",
  "Full keyword report",
  "AI summary rewrite",
  "Actionable tip",
];

const proPlan = [
  "Unlimited analyses",
  "All free features",
  "PDF & DOCX upload",
  "Priority support",
  "Cancel anytime",
];

const yearlyPlan = [
  "Everything in Pro",
  "~$4.92 / month",
  "PDF & DOCX upload",
  "Priority support",
  "Cancel anytime",
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "w-4 h-4 text-brand flex-shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default async function LandingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <main className="flex-1">
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{ background: "#0A0F1E" }}
        >
          {/* Subtle top glow */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[500px]"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% -5%, rgba(29,158,117,0.22) 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-20 sm:pb-28 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-navy-300 text-sm font-medium px-4 py-1.5 rounded-full mb-8 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              Powered by Claude AI
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up delay-100 text-4xl sm:text-5xl md:text-[64px] font-bold text-white tracking-tight leading-[1.1] mb-6">
              Match your CV to any job.
              <br />
              <span className="text-brand">Beat the ATS.</span> Get interviews.
            </h1>

            {/* Subheadline */}
            <p className="animate-fade-up delay-200 text-lg sm:text-xl text-navy-300 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "#94A3B8" }}>
              Paste or upload your CV and a job description. Get an instant AI-powered
              match score, keyword gaps, and a rewritten summary — in under 2 minutes.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link
                href={user ? "/app" : "/auth"}
                className="group flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-brand hover:shadow-brand text-base"
              >
                {user ? "Go to app" : "Get started free"}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <span className="text-sm font-medium" style={{ color: "#64748B" }}>
                2 free analyses · No credit card needed
              </span>
            </div>

            {/* Stats row */}
            <div className="animate-fade-up delay-400 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-xs font-medium mt-0.5" style={{ color: "#64748B" }}>{s.label}</div>
                  </div>
                  {i < stats.length - 1 && (
                    <div className="hidden sm:block w-px h-8" style={{ background: "#1E293B" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24 bg-gray-50 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                Everything you need to stand out
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Stop guessing. Know exactly why you are or aren&apos;t getting callbacks.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 animate-fade-up`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="w-10 h-10 bg-brand-50 text-brand rounded-xl flex items-center justify-center mb-4 border border-brand/10">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                How it works
              </h2>
              <p className="text-gray-500">Three steps. Under two minutes.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
              {steps.map((step, i) => (
                <div key={step.num} className="relative">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-5 left-[calc(50%+2rem)] right-[-50%] h-px bg-gradient-to-r from-brand/30 to-transparent" />
                  )}
                  <div className="flex flex-col items-start sm:items-center sm:text-center">
                    <div className="text-5xl font-bold text-gray-100 mb-3 leading-none select-none">{step.num}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────── */}
        <section id="pricing" className="py-20 sm:py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                Simple, honest pricing
              </h2>
              <p className="text-gray-500">Start free. Upgrade when you need more.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5 items-start">
              {/* Free */}
              <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-card">
                <div className="mb-5">
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Free</div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-gray-900">$0</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">2 analyses included</div>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {freePlan.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth"
                  className="block text-center w-full border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Get started free
                </Link>
              </div>

              {/* Monthly Pro — highlighted */}
              <div className="bg-white rounded-2xl border-2 border-brand p-7 shadow-card-hover relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-brand-sm">
                  Most popular
                </div>
                <div className="mb-5">
                  <div className="text-sm font-semibold text-brand uppercase tracking-wide mb-2">Pro Monthly</div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-gray-900">$9</span>
                    <span className="text-gray-400 text-base mb-1">/mo</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">Billed monthly</div>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {proPlan.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth"
                  className="block text-center w-full bg-brand hover:bg-brand-dark text-white font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-brand-sm hover:shadow-brand"
                >
                  Start with Pro
                </Link>
              </div>

              {/* Yearly Pro */}
              <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-card relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-3.5 py-1 rounded-full">
                  Best value
                </div>
                <div className="mb-5">
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Pro Yearly</div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-gray-900">$59</span>
                    <span className="text-gray-400 text-base mb-1">/yr</span>
                  </div>
                  <div className="text-sm font-medium text-brand mt-1">Save 45% vs monthly</div>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {yearlyPlan.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth"
                  className="block text-center w-full border border-gray-200 hover:border-brand hover:text-brand bg-white font-semibold py-2.5 rounded-xl transition-colors text-sm text-gray-800"
                >
                  Get yearly plan
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────── */}
        <section
          className="py-20 sm:py-24 text-center"
          style={{ background: "#0A0F1E" }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 h-[300px]"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(29,158,117,0.12) 0%, transparent 70%)",
            }}
          />
          <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to land your dream job?
            </h2>
            <p className="mb-8 text-lg" style={{ color: "#64748B" }}>
              Join thousands of job seekers who use CVMatch to get more interviews.
            </p>
            <Link
              href={user ? "/app" : "/auth"}
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-brand hover:shadow-lg text-base"
            >
              {user ? "Go to app" : "Get started — it's free"}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ background: "#0A0F1E", borderTop: "1px solid #1E293B" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand rounded-md flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">CVMatch</span>
          </div>
          <p className="text-sm" style={{ color: "#475569" }}>
            © {new Date().getFullYear()} CVMatch · Built with Claude AI
          </p>
        </div>
      </footer>
    </div>
  );
}
