"use client";

import { useState } from "react";

interface Job {
  title: string;
  company_type: string;
  why_it_matches: string;
  search_query: string;
}

interface JobSuggestionsProps {
  cv: string;
  matched_keywords: string[];
  missing_keywords: string[];
}

export default function JobSuggestions({ cv, matched_keywords, missing_keywords }: JobSuggestionsProps) {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFindJobs() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/find-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, matched_keywords, missing_keywords }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to find jobs. Please try again.");
        return;
      }
      setJobs(data.jobs);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function buildSearchUrl(query: string) {
    return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}`;
  }

  if (jobs) {
    return (
      <div className="animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
            <span className="w-5 h-5 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            Matching Job Opportunities
          </h3>
          <button
            onClick={() => { setJobs(null); setError(null); }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {jobs.map((job, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-card flex flex-col gap-3 hover:border-purple-200 transition-colors"
            >
              <div>
                <span className="inline-block text-[10px] font-semibold text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full mb-2">
                  {job.company_type}
                </span>
                <h4 className="font-semibold text-gray-900 text-sm leading-snug">{job.title}</h4>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed flex-1">{job.why_it_matches}</p>

              <a
                href={buildSearchUrl(job.search_query)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 rounded-lg px-3 py-2 transition-colors group"
              >
                <span className="text-[11px] font-medium text-gray-600 group-hover:text-purple-700 truncate">
                  {job.search_query}
                </span>
                <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-purple-500 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 pt-1">
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      <button
        onClick={handleFindJobs}
        disabled={loading}
        className="group flex items-center gap-2 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 text-gray-700 hover:text-purple-700 font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-card disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin text-purple-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Finding matching jobs…
          </>
        ) : (
          <>
            <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Find Matching Jobs
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
      <p className="text-xs text-gray-400">Get 5 job suggestions tailored to your CV</p>
    </div>
  );
}
