import { Navbar } from "@/components/navbar"
import { BlogCard } from "@/components/blog-card"
import { BlogFilter } from "@/components/blog-filter"
import { Button } from "@/components/ui/button"
import { PenTool } from "lucide-react"
import Link from "next/link"

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
    author: "Dflamez Shotz",
    publishedAt: "2024-01-15",
    readTime: "5 min read",
    image: "/blog-featured-image-1.png",
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
    author: "Dflamez Shotz",
    publishedAt: "2024-01-08",
    readTime: "4 min read",
    image: "/blog-featured-image-2.png",
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
    author: "Dflamez Shotz",
    publishedAt: "2024-01-01",
    readTime: "6 min read",
    image: "/blog-featured-image-3.png",
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
    author: "Dflamez Shotz",
    publishedAt: "2023-12-20",
    readTime: "3 min read",
    image: "/portrait-session-candid.png",
  },
]

const categories = ["All", "Photography", "Personal", "Technique", "Philosophy"]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center transform rotate-3">
              <PenTool className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-5xl font-black tracking-tight text-foreground sm:text-7xl">
              <span className="block text-primary transform -rotate-1 inline-block">GOLD'S</span>
              <span className="block">PEN</span>
            </h1>
          </div>
          <p className="text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
            Thoughts, insights, and stories from behind the lens. Where art meets philosophy and creativity flows like
            gold.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <BlogFilter categories={categories} />
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-black text-foreground mb-6">
            <span className="block">STAY</span>
            <span className="block text-primary transform rotate-1 inline-block">INSPIRED</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get notified when I publish new articles and insights from my creative journey.
          </p>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-4 text-lg"
          >
            <Link href="/contact">SUBSCRIBE TO UPDATES</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
