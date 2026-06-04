import { getAllPosts } from '@/lib/posts'

export async function GET() {
  const posts = getAllPosts()
  const baseUrl = 'https://cvmatch-mocha.vercel.app'

  const urls = [
    { loc: baseUrl, priority: '1.0' },
    { loc: `${baseUrl}/blog`, priority: '0.8' },
    ...posts.map(p => ({ loc: `${baseUrl}/blog/${p.slug}`, priority: '0.7' }))
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  })
}
