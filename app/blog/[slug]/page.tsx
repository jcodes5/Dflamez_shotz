import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"

// Mock blog posts data (in a real app, this would come from a database or CMS)
const blogPosts = [
  {
    id: "the-art-of-seeing-souls",
    title: "The Art of Seeing Souls",
    excerpt:
      "What does it mean to truly see someone? In my years as a soul portraitor, I've learned that the most powerful images come from moments of genuine connection...",
    content: `What does it mean to truly see someone? In my years as a soul portraitor, I've learned that the most powerful images come from moments of genuine connection.

When I first started photography, I was obsessed with technical perfection. The right lighting, the perfect composition, the sharpest focus. But something was missing. My images were technically sound but emotionally hollow.

The breakthrough came during a session with an elderly woman named Grace. She had lived through decades of joy and sorrow, and it was all written in the lines of her face. As we talked, I stopped thinking about camera settings and started listening to her stories. When I finally raised my camera, I wasn't just taking a picture – I was documenting a lifetime of experiences.

That's when I understood: soul portraiture isn't about capturing how someone looks. It's about revealing who they are.

Every person carries a universe within them. My job is to create a safe space where that universe can shine through. It requires patience, empathy, and the willingness to see beyond the surface.

The technical skills matter, of course. But they're just tools in service of something greater: the art of human connection.`,
    category: "Photography",
    tags: ["soul portraits", "philosophy", "connection"],
    author: "Dfalmez Shotz",
    publishedAt: "2024-01-15",
    readTime: "5 min read",
    image: "/artistic-soul-portrait-bw.png",
  },
  {
    id: "behind-the-lens-vulnerability",
    title: "Behind the Lens: On Vulnerability",
    excerpt:
      "Creating authentic portraits requires both the subject and photographer to embrace vulnerability. Here's what I've learned about courage in front of the camera...",
    content: `Creating authentic portraits requires both the subject and photographer to embrace vulnerability. Here's what I've learned about courage in front of the camera.

Vulnerability is not weakness. It's the birthplace of authenticity, creativity, and change. When someone sits for a soul portrait, they're making a choice to be seen – really seen – perhaps for the first time.

I remember Sarah, a successful entrepreneur who came to me feeling disconnected from her own image. "I don't recognize myself in photos anymore," she said. "I feel like I'm wearing a mask all the time."

During our session, we talked about her journey, her fears, her dreams. Slowly, the professional facade began to soften. When she laughed at a story about her childhood, I captured that moment. It wasn't posed or planned – it was pure, unguarded joy.

That image became her favorite portrait ever taken. Not because she looked perfect, but because she looked like herself.

As photographers, we hold space for people's stories. We witness their courage to be vulnerable. And in return, we must be willing to be vulnerable ourselves – to connect authentically, to see clearly, and to honor the trust they place in us.

The camera is just a tool. The real magic happens in the space between souls.`,
    category: "Personal",
    tags: ["vulnerability", "authenticity", "stories"],
    author: "Dfalmez Shotz",
    publishedAt: "2024-01-08",
    readTime: "4 min read",
    image: "/bw-emotional-portrait.png",
  },
  {
    id: "light-and-shadow-metaphors",
    title: "Light and Shadow: Life's Metaphors",
    excerpt:
      "In photography, we learn that shadows are just as important as light. The same is true in life. Here's how I use contrast to tell deeper stories...",
    content: `In photography, we learn that shadows are just as important as light. The same is true in life. Here's how I use contrast to tell deeper stories.

Light without shadow is flat. Shadow without light is invisible. It's in the dance between the two that we find depth, dimension, and meaning.

I've always been drawn to dramatic lighting – the way a single beam of light can transform an ordinary moment into something extraordinary. But over the years, I've come to appreciate the shadows just as much.

Shadows represent the parts of ourselves we often try to hide. The struggles, the doubts, the imperfections. But these aren't flaws to be eliminated – they're essential parts of our story.

In my portraits, I don't try to eliminate every shadow or smooth away every line. Instead, I use light and shadow to create a visual metaphor for the human experience. The interplay between brightness and darkness tells a story that pure light never could.

I think about Maria, a cancer survivor who wanted portraits to mark her recovery. She was self-conscious about the changes in her appearance, but I saw strength in every line, beauty in every scar. By using dramatic side lighting, we created images that celebrated both her vulnerability and her resilience.

The shadows in her portraits weren't something to hide from – they were proof of battles fought and won.

Life isn't meant to be lived in constant brightness. It's in embracing both our light and our shadows that we become whole.`,
    category: "Technique",
    tags: ["lighting", "metaphor", "storytelling"],
    author: "Dfalmez Shotz",
    publishedAt: "2024-01-01",
    readTime: "6 min read",
    image: "/dramatic-shadows-fashion.png",
  },
  {
    id: "the-power-of-pause",
    title: "The Power of Pause",
    excerpt:
      "In our fast-paced world, we've forgotten the value of stillness. Here's why I always include moments of quiet in my sessions...",
    content: `In our fast-paced world, we've forgotten the value of stillness. Here's why I always include moments of quiet in my sessions.

We live in a world of constant motion. Scrolling, clicking, rushing from one thing to the next. But the most powerful portraits happen in the spaces between – in the pause before a smile, in the quiet moment of reflection.

During every session, I build in time for stillness. Not the posed, artificial stillness of traditional portraiture, but genuine moments of pause. I might ask someone to close their eyes and think about a person they love. Or to take a deep breath and just be present.

These moments of pause are where magic happens. The mask drops. The performance stops. What remains is pure, unfiltered humanity.

I learned this lesson from my grandmother, who taught me that silence isn't empty – it's full of possibility. She would sit with me in her garden, not talking, just being. In those quiet moments, I felt more connected to her than in any conversation.

Now I bring that same reverence for stillness to my work. Some of my most powerful images have been captured in these quiet moments – a slight tilt of the head, a soft exhale, the gentle closing of eyes.

In a world that never stops moving, there's profound power in choosing to pause.`,
    category: "Philosophy",
    tags: ["mindfulness", "stillness", "presence"],
    author: "Dfalmez Shotz",
    publishedAt: "2023-12-20",
    readTime: "3 min read",
    image: "/artistic-composition.png",
  },
]

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = blogPosts.find((item) => item.id === params.slug)

  if (!post) {
    return { title: "Article Not Found" }
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.id}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image, alt: post.title }],
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: { card: "summary_large_image", images: [post.image] },
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((p) => p.id === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Breadcrumbs items={[{ label: "Gold's Pen", href: "/blog" }, { label: post.title }]} />

      {/* Hero Image */}
      <section className="relative h-[60vh] overflow-hidden">
        <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-8 left-8">
          <Button asChild variant="ghost" className="text-white hover:bg-white/20">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="text-primary border-primary">
                {post.category}
              </Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="font-serif text-4xl font-black tracking-tight text-foreground sm:text-6xl mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <span>By {post.author}</span>
            </div>
          </header>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            {post.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-lg leading-8 text-foreground mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">Enjoyed this article?</h3>
                <p className="text-muted-foreground">Share it with others who might find it inspiring.</p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-16">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-8">More from Gold's Pen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts
                .filter((p) => p.id !== post.id)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                    <div className="group cursor-pointer">
                      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted mb-4">
                        <img
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <h4 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-muted-foreground text-sm line-clamp-2">{relatedPost.excerpt}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
