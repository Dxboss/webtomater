import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Section } from "@/components/ui/Section"
import { Container } from "@/components/ui/Container"
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"
import { Metadata } from "next"

// Revalidate every hour
export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | WebAutomate Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: post.featured_image ? [post.featured_image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="pt-32 pb-16 bg-gray-50 border-b border-gray-200">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/blog"
              className="inline-flex items-center text-sm font-mono text-gray-500 hover:text-accent mb-8 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
            </Link>
            
            <div className="flex items-center gap-6 text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.created_at), 'MMM d, yyyy')}
              </span>
              <span className="w-px h-4 bg-gray-300" />
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                5 min read
              </span>
            </div>

            <h1 className="text-display text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-8">
              {post.title}
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light">
              {post.excerpt}
            </p>
          </div>
        </Container>
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="w-full h-[40vh] md:h-[60vh] relative">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <Section className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg prose-gray prose-headings:font-display prose-headings:font-bold prose-headings:uppercase prose-a:text-accent prose-img:rounded-xl max-w-none">
              <ReactMarkdown
                components={{
                  img: ({ node, ...props }) => (
                    <img 
                      {...props} 
                      className="rounded-xl shadow-lg w-full h-auto my-8" 
                      loading="lazy"
                    />
                  )
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
              <div className="text-sm text-gray-500 font-mono">
                Share this article
              </div>
              <div className="flex gap-4">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="py-24 bg-foreground text-background">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-display text-4xl md:text-5xl font-bold uppercase mb-6">
              Ready to implement this?
            </h2>
            <p className="text-xl text-gray-400 mb-10 font-light">
              We help companies build these exact systems.
            </p>
            <Link 
              href="/contact"
              className="inline-block bg-accent text-white px-8 py-4 text-lg font-mono uppercase tracking-wider hover:bg-white hover:text-foreground transition-all duration-300"
            >
              Start the conversation
            </Link>
          </div>
        </Container>
      </Section>
    </article>
  )
}
