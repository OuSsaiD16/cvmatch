import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Blog CV & Emploi — CVMatch",
  description:
    "Conseils, guides et stratégies pour optimiser votre CV, passer les filtres ATS et décrocher plus d'entretiens.",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const posts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "#0A0F1E" }}>
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[300px]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -5%, rgba(29,158,117,0.2) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-12 text-center">
          <div
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-sm font-medium px-4 py-1.5 rounded-full mb-5"
            style={{ color: "#94A3B8" }}
          >
            <svg className="w-3.5 h-3.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Ressources & Guides
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Blog CV &amp; Emploi
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
            Conseils pratiques pour optimiser votre CV, passer les filtres ATS
            et décrocher plus d&apos;entretiens.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {posts.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              Aucun article pour l&apos;instant — revenez bientôt.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
                >
                  <div className="h-1 bg-gradient-to-r from-brand to-brand-light shrink-0" />

                  <div className="p-5 flex flex-col flex-1">
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-medium text-brand bg-brand-50 border border-brand/20 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="text-[15px] font-bold text-gray-900 mb-2 leading-snug group-hover:text-brand transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4 line-clamp-3">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                      <span>{formatDate(post.date)}</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {post.readingTime} min
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer style={{ background: "#0A0F1E", borderTop: "1px solid #1E293B" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand rounded-md flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">CVMatch</span>
          </Link>
          <p className="text-sm" style={{ color: "#475569" }}>
            © {new Date().getFullYear()} CVMatch ·{" "}
            <Link href="/" className="hover:text-white transition-colors">
              Analyser mon CV →
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
