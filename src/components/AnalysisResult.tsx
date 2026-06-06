"use client";

import { useState } from "react";
import JobSuggestions from "./JobSuggestions";

interface Analysis {
  score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  rewritten_summary: string;
  tip: string;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 70 ? "#1D9E75" : score >= 50 ? "#f59e0b" : "#ef4444";
  const trackColor = score >= 70 ? "#dcfaed" : score >= 50 ? "#fef3c7" : "#fee2e2";

  return (
    <div className="relative w-[128px] h-[128px] flex items-center justify-center shrink-0">
      <svg width="128" height="128" className="-rotate-90 absolute inset-0">
        <circle cx="64" cy="64" r={radius} fill="none" stroke={trackColor} strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="relative flex flex-col items-center">
        <span className="text-3xl font-bold text-gray-900 leading-none">{score}</span>
        <span className="text-xs text-gray-400 font-medium mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

export default function AnalysisResult({ analysis, cv }: { analysis: Analysis; cv: string }) {
  const [copied, setCopied] = useState(false);

  const scoreLabel =
    analysis.score >= 70 ? "Strong match" : analysis.score >= 50 ? "Moderate match" : "Weak match";
  const scoreBadge =
    analysis.score >= 70
      ? "bg-brand-50 text-brand border-brand/20"
      : analysis.score >= 50
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-red-50 text-red-600 border-red-200";
  const scoreDesc =
    analysis.score >= 70
      ? "Your CV is well-aligned with this role."
      : analysis.score >= 50
      ? "Your CV partially matches — see improvements below."
      : "Your CV needs significant tailoring for this role.";

  function handleCopy() {
    navigator.clipboard.writeText(analysis.rewritten_summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Score card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card flex flex-col sm:flex-row items-center gap-6">
        <ScoreRing score={analysis.score} />
        <div className="text-center sm:text-left">
          <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border mb-2 ${scoreBadge}`}>
            {scoreLabel}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Match Score</h2>
          <p className="text-gray-500 text-sm mt-1">{scoreDesc}</p>
          <p className="text-xs text-gray-400 mt-1">Based on skills, experience, and keyword alignment</p>
        </div>
      </div>

      {/* Keywords */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Matched */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
              <span className="w-5 h-5 rounded-full bg-brand-50 border border-brand/20 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Matched Keywords
            </h3>
            <span className="text-xs font-semibold text-brand bg-brand-50 border border-brand/20 px-2 py-0.5 rounded-full">
              {analysis.matched_keywords.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.matched_keywords.length === 0 ? (
              <p className="text-sm text-gray-400">No matched keywords found</p>
            ) : (
              analysis.matched_keywords.map((kw) => (
                <span key={kw} className="text-xs font-medium bg-brand-50 text-brand border border-brand/20 px-2.5 py-1 rounded-full">
                  {kw}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
              <span className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              Missing Keywords
            </h3>
            <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              {analysis.missing_keywords.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.missing_keywords.length === 0 ? (
              <p className="text-sm text-gray-400">No missing keywords — great match!</p>
            ) : (
              analysis.missing_keywords.map((kw) => (
                <span key={kw} className="text-xs font-medium bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full">
                  {kw}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Rewritten summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm mb-4">
          <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </span>
          AI-Rewritten CV Summary
        </h3>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-3">
          <p className="text-gray-700 text-sm leading-relaxed">{analysis.rewritten_summary}</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-brand transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy to clipboard
            </>
          )}
        </button>
      </div>

      {/* Tip */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="font-semibold text-amber-900 flex items-center gap-2 text-sm mb-2">
          <span className="w-5 h-5 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </span>
          Your #1 Improvement
        </h3>
        <p className="text-amber-800 text-sm leading-relaxed">{analysis.tip}</p>
      </div>

      {/* Find Matching Jobs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card">
        <JobSuggestions
          cv={cv}
          matched_keywords={analysis.matched_keywords}
          missing_keywords={analysis.missing_keywords}
        />
      </div>
    </div>
  );
}
