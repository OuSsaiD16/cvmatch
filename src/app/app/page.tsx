import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import AnalysisForm from "@/components/AnalysisForm";

export default async function AppPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const serviceClient = createServiceClient();
  const { data: usage } = await serviceClient
    .from("users_usage")
    .select("analysis_count, is_pro")
    .eq("user_id", user.id)
    .single();

  const analysisCount = usage?.analysis_count ?? 0;
  const isPro = usage?.is_pro ?? false;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header user={user} isPro={isPro} />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Banners */}
        {searchParams.success && (
          <div className="mb-6 bg-brand-50 border border-brand/20 text-brand text-sm rounded-xl px-4 py-3.5 flex items-center gap-3 animate-fade-up">
            <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span><strong>Payment successful!</strong> You now have unlimited analyses. Welcome to Pro.</span>
          </div>
        )}
        {searchParams.canceled && (
          <div className="mb-6 bg-white border border-gray-200 text-gray-600 text-sm rounded-xl px-4 py-3.5 animate-fade-up">
            Payment canceled. You can upgrade anytime from the app.
          </div>
        )}

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">CV Analyzer</h1>
          <p className="text-gray-500 text-sm mt-1">
            Paste or upload your CV and a job description to get your match score and improvement tips.
          </p>
        </div>

        <AnalysisForm initialIsPro={isPro} initialCount={analysisCount} />
      </div>
    </div>
  );
}
