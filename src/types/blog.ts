export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  category?: string
  content: string
  featured_image: string
  published: boolean
  created_at: string
  updated_at: string
}
