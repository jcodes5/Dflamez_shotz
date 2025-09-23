import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
  readTime: string
  image: string
}

interface BlogCardProps {
  post: BlogPost
  index: number
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <Card
      className={cn(
        "group overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer",
        // Neubrutalism random rotations
        index % 3 === 0 && "rotate-1",
        index % 3 === 1 && "-rotate-1",
        index % 3 === 2 && "rotate-2",
      )}
    >
      <Link href={`/blog/${post.id}`}>
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-primary border-primary">
              {post.category}
            </Badge>
          </div>

          <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}
