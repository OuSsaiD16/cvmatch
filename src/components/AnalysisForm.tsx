"use client";

import { useState, useRef } from "react";
import AnalysisResult from "./AnalysisResult";
import PaywallModal from "./PaywallModal";

interface Analysis {
  score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  rewritten_summary: string;
  tip: string;
}

interface AnalysisFormProps {
  initialIsPro: boolean;
  initialCount: number;
}

const FREE_ANALYSES = 2;

export default function AnalysisForm({ initialIsPro, initialCount }: AnalysisFormProps) {
  const [cv, setCv] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPro, setIsPro] = useState(initialIsPro);
  const [usageCount, setUsageCount] = useState(initialCount);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remaining = isPro ? null : Math.max(0, FREE_ANALYSES - usageCount);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/parse-cv", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to read file.");
      } else {
        setCv(data.text);
        setFileName(file.name);
      }
    } catch {
      setError("Failed to read file. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cv.trim() || !jobDescription.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, jobDescription }),
      });

      const data = await res.json();

      if (res.status === 402 || data.error === "PAYWALL") {
        setShowPaywall(true);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Analysis failed. Please try again.");
        return;
      }

      setResult(data.analysis);
      setIsPro(data.is_pro);
      if (!data.is_pro) setUsageCount((c) => c + 1);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
  }

  if (result) {
    return (
      <div className="animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Analysis Results</h2>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New analysis
          </button>
        </div>
        <AnalysisResult analysis={result} />
      </div>
    );
  }

  return (
    <>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      {/* Usage badge */}
      {!isPro && (
        <div className="mb-5 flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-card">
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <div className="w-6 h-6 rounded-full bg-brand-50 border border-brand/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span>
              <strong className="text-gray-900 font-semibold">{remaining}</strong>{" "}
              free {remaining === 1 ? "analysis" : "analyses"} remaining
            </span>
          </div>
          <button
            onClick={() => setShowPaywall(true)}
            className="text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            Upgrade to Pro →
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid lg:grid-cols-2 gap-5">
          {/* CV Input */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-800">Your CV / Resume</span>
              </div>

              <div className="flex items-center gap-2">
                {fileName && (
                  <span className="hidden sm:flex items-center gap-1.5 text-xs text-brand bg-brand-50 border border-brand/20 px-2.5 py-1 rounded-full max-w-[140px] truncate">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="truncate">{fileName}</span>
                    <button
                      type="button"
                      onClick={() => { setCv(""); setFileName(null); }}
                      className="flex-shrink-0 hover:text-brand-dark"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Reading…
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload PDF/DOCX
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col p-3">
              <textarea
                value={cv}
                onChange={(e) => { setCv(e.target.value); setFileName(null); }}
                placeholder="Paste your full CV or resume here, or click Upload PDF/DOCX above…"
                rows={16}
                className="flex-1 w-full text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none leading-relaxed p-2"
                required
              />
            </div>
            <div className="px-5 py-2.5 border-t border-gray-100 flex items-center justify-end">
              <span className="text-xs text-gray-400 tabular-nums">{cv.length.toLocaleString()} chars</span>
            </div>
          </div>

          {/* Job Description Input */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden flex flex-col">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-800">Job Description</span>
            </div>

            <div className="flex-1 flex flex-col p-3">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here — include requirements, responsibilities, and preferred skills…"
                rows={16}
                className="flex-1 w-full text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none leading-relaxed p-2"
                required
              />
            </div>
            <div className="px-5 py-2.5 border-t border-gray-100 flex items-center justify-end">
              <span className="text-xs text-gray-400 tabular-nums">{jobDescription.length.toLocaleString()} chars</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3.5 flex items-start gap-2.5">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading || !cv.trim() || !jobDescription.trim()}
            className="group flex items-center gap-2.5 bg-brand hover:bg-brand-dark disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-brand-sm hover:shadow-brand disabled:shadow-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing your CV…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Analyze Match
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
