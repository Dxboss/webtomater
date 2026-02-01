import Link from "next/link"
import Image from "next/image"
import { NewsletterForm } from "./newsletter-form"
import { supabase } from "@/lib/supabase"
import { Section } from "@/components/ui/Section"
import { Container } from "@/components/ui/Container"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Insights & Automation Journal | WebAutomate",
  description: "Expert articles on business automation, revenue engineering, and system architecture.",
}

// Revalidate every hour
export const revalidate = 3600

async function getPosts() {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
  
  return data || []
}

export default async function BlogPage({ searchParams }: { searchParams: { category?: string } }) {
  const posts = await getPosts()
  const categoryFilter = searchParams?.category

  const filteredPosts = categoryFilter 
    ? posts.filter(post => post.category?.toLowerCase() === categoryFilter.toLowerCase())
    : posts

  return (
    <div className="bg-gray-50 min-h-screen">
      <Section className="pt-32 pb-16 bg-white border-b border-gray-200">
        <Container>
          <div className="max-w-4xl">
            <span className="font-mono text-accent text-sm tracking-widest uppercase block mb-6">
              // The Journal
            </span>
            <h1 className="text-display text-4xl md:text-7xl font-bold uppercase leading-[0.9] mb-8">
              Engineering <br />
              Revenue
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl font-light leading-relaxed">
              Deep dives into automation strategies, system architecture, and how to scale without increasing headcount.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
              {/* Categories */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-display font-bold text-lg mb-4 uppercase">Categories</h3>
                <ul className="space-y-2">
                  {['Automation', 'Strategy', 'Case Studies', 'Tech Stack'].map((cat) => (
                    <li key={cat}>
                      <Link href={`/blog?category=${cat.toLowerCase()}`} className="text-gray-600 hover:text-accent transition-colors flex justify-between items-center group">
                        <span>{cat}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-accent transition-colors" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div className="bg-accent/5 p-6 rounded-xl border border-accent/10">
                <h3 className="font-display font-bold text-lg mb-2 uppercase">Subscribe</h3>
                <p className="text-sm text-gray-600 mb-4">Get the latest automation insights directly to your inbox.</p>
                <NewsletterForm />
              </div>
            </div>

            {/* Posts Grid */}
            <div className="lg:col-span-9 order-1 lg:order-2">
              {categoryFilter && (
                 <div className="mb-8 flex items-center gap-2">
                    <span className="text-gray-500">Showing posts in:</span>
                    <span className="font-bold text-gray-900 capitalize">{categoryFilter.replace('-', ' ')}</span>
                    <Link href="/blog" className="ml-2 text-sm text-accent hover:underline">Clear filter</Link>
                 </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {post.featured_image ? (
                      <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] relative overflow-hidden bg-accent/5 flex items-center justify-center">
                        <span className="text-accent/20 font-display font-bold text-4xl">
                          WA
                        </span>
                      </div>
                    )}
                    
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs font-mono text-gray-400 mb-4 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(post.created_at), 'MMM d, yyyy')}
                        </span>
                        <span className="w-px h-3 bg-gray-200" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          5 min read
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>
                      
                      <p className="text-gray-500 line-clamp-3 mb-8 flex-1 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center text-accent font-bold font-mono text-sm uppercase tracking-wider">
                        Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
                  <p className="text-gray-500 text-lg">No articles published yet. Check back soon.</p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
