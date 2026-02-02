"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { BlogPost } from "@/types/blog"
import { Button } from "@/components/ui/Button"
import { ImagePlus, Save, ArrowLeft, Loader2, X, Bold, Italic, Link as LinkIcon, Code, Heading1, Heading2, Heading3, Image as ImageIcon, List, ListOrdered, Quote, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PostEditorProps {
  post?: BlogPost
}

export default function PostEditor({ post }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [category, setCategory] = useState(post?.category || "Automation") // Default category
  const [content, setContent] = useState(post?.content || "")
  const [published, setPublished] = useState(post?.published || false)
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || "")
  const [uploading, setUploading] = useState(false)
  const [contentUploading, setContentUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const contentFileRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  // Auto-generate slug from title if creating new post
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!post) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return

    setDeleting(true)
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', post?.id)

    if (error) {
      alert("Error deleting post")
      console.error(error)
      setDeleting(false)
    } else {
      router.push('/admin/posts')
      router.refresh()
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploading(true)
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      setFeaturedImage(data.publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setContentUploading(true)
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `content-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      insertMarkdown(`![Image description](${data.publicUrl})`, "")
    } catch (error) {
      console.error('Error uploading content image:', error)
      alert('Error uploading content image')
    } finally {
      setContentUploading(false)
      // Reset input
      if (contentFileRef.current) contentFileRef.current.value = ""
    }
  }

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const before = text.substring(0, start)
    const selection = text.substring(start, end)
    const after = text.substring(end)

    const newText = before + prefix + selection + suffix + after
    setContent(newText)
    
    // Restore focus and selection
    setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + prefix.length, end + prefix.length)
    }, 0)
  }

  const handleSave = async () => {
    if (!title || !slug) {
      alert("Title and Slug are required")
      return
    }

    setSaving(true)

    const postData = {
      title,
      slug,
      excerpt,
      content,
      category,
      featured_image: featuredImage,
      published,
      updated_at: new Date().toISOString(),
    }

    try {
      if (post) {
        // Update
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', post.id)
        
        if (error) throw error
      } else {
        // Create
        const { error } = await supabase
          .from('posts')
          .insert([postData])
        
        if (error) throw error
      }

      router.push('/admin')
      router.refresh()
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error saving post')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-gray-50/80 backdrop-blur-md py-4 z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            {post ? 'Edit Post' : 'New Post'}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {post && (
            <Button 
              variant="outline" 
              onClick={handleDelete} 
              disabled={deleting || saving}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </Button>
          )}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded border-gray-300 text-accent focus:ring-accent"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
              Published
            </label>
          </div>
          <Button onClick={handleSave} disabled={saving || uploading} className="min-w-[120px]">
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Save Post</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-lg font-bold focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
              placeholder="Enter post title..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Content</label>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent transition-all">
              {/* Toolbar */}
              <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 overflow-x-auto">
                <Button 
                  type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" 
                  onClick={() => insertMarkdown('# ', '')} title="Heading 1"
                >
                  <Heading1 className="w-4 h-4" />
                </Button>
                <Button 
                  type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" 
                  onClick={() => insertMarkdown('## ', '')} title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </Button>
                <Button 
                  type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" 
                  onClick={() => insertMarkdown('### ', '')} title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-gray-300 mx-1" />
                <Button 
                  type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" 
                  onClick={() => insertMarkdown('**', '**')} title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button 
                  type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" 
                  onClick={() => insertMarkdown('*', '*')} title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button 
                  type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" 
                  onClick={() => insertMarkdown('> ', '')} title="Quote"
                >
                  <Quote className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-gray-300 mx-1" />
                <Button 
                  type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" 
                  onClick={() => insertMarkdown('- ', '')} title="List"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button 
                  type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" 
                  onClick={() => insertMarkdown('1. ', '')} title="Ordered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-gray-300 mx-1" />
                <Button 
                  type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" 
                  onClick={() => insertMarkdown('[', '](url)')} title="Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </Button>
                <Button 
                  type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" 
                  onClick={() => contentFileRef.current?.click()} title="Insert Image"
                  disabled={contentUploading}
                >
                  {contentUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                </Button>
                <Button 
                  type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" 
                  onClick={() => insertMarkdown('```\n', '\n```')} title="Code Block"
                >
                  <Code className="w-4 h-4" />
                </Button>
              </div>

              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[600px] px-4 py-4 font-mono text-sm outline-none resize-none bg-white border-0 focus:ring-0"
                placeholder="# Write your masterpiece here..."
              />
            </div>
            
            <input 
              type="file" 
              ref={contentFileRef} 
              onChange={handleContentImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <p className="text-xs text-gray-500 text-right">Supports Markdown formatting</p>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4">Featured Image</h3>
            
            {featuredImage ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 mb-4 group">
                <Image 
                  src={featuredImage} 
                  alt="Featured" 
                  fill 
                  className="object-cover"
                />
                <button 
                  onClick={() => setFeaturedImage("")}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors mb-4"
              >
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-accent animate-spin" />
                ) : (
                  <>
                    <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload</span>
                  </>
                )}
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Category */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4">Category</h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            >
              {['Automation', 'Strategy', 'Case Studies', 'Tech Stack'].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Slug */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4">URL Slug</h3>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">
              webautomate.com/blog/<span className="font-medium text-gray-700">{slug}</span>
            </p>
          </div>

          {/* Excerpt */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4">Excerpt</h3>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
              placeholder="Short summary for search engines and cards..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
