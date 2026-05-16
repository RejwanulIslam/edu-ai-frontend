import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Blog — EduAI" };

const posts = [
  { id: 1, title: "How AI is Revolutionizing Online Education", excerpt: "Artificial intelligence is transforming how we learn — from personalized recommendations to intelligent tutoring systems that adapt to your pace.", category: "AI & Education", date: "Jan 15, 2025", readTime: "5 min", slug: "ai-revolutionizing-education" },
  { id: 2, title: "10 Tips to Learn Programming Faster with AI", excerpt: "Leveraging AI tools like study assistants and code generators can dramatically accelerate your programming learning curve.", category: "Tips & Tricks", date: "Jan 20, 2025", readTime: "7 min", slug: "learn-programming-faster-ai" },
  { id: 3, title: "The Future of Personalized Learning", excerpt: "Personalized education isn't just a buzzword anymore. Learn how adaptive learning systems are delivering better outcomes for students worldwide.", category: "Future of Learning", date: "Feb 1, 2025", readTime: "6 min", slug: "future-personalized-learning" },
  { id: 4, title: "Building Your First Machine Learning Project", excerpt: "A step-by-step guide to building your first ML project from scratch — from data collection to model deployment.", category: "Data Science", date: "Feb 10, 2025", readTime: "12 min", slug: "first-ml-project-guide" },
  { id: 5, title: "Why Continuous Learning Matters in 2025", excerpt: "The job market is evolving faster than ever. Here's why lifelong learning is no longer optional — and how to make it a habit.", category: "Career Growth", date: "Feb 18, 2025", readTime: "4 min", slug: "continuous-learning-2025" },
  { id: 6, title: "Top 5 Web Development Trends This Year", excerpt: "From React Server Components to AI-integrated frontends, explore the hottest trends shaping web development right now.", category: "Web Development", date: "Mar 1, 2025", readTime: "8 min", slug: "web-dev-trends-2025" },
];

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="py-16 bg-muted/20 border-b border-border">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-3">EduAI Blog</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Insights on AI, education, and the future of learning.</p>
          </div>
        </section>

        <section className="py-12 container mx-auto px-4">
          {/* Featured */}
          <Card className="mb-10 border border-border overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 min-h-[200px] flex items-center justify-center">
                  <span className="text-6xl">🤖</span>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge className="self-start mb-3 bg-primary/10 text-primary border-0">{featured.category}</Badge>
                  <h2 className="text-2xl font-bold mb-3">{featured.title}</h2>
                  <p className="text-muted-foreground mb-4">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{featured.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{featured.readTime} read</span>
                  </div>
                  <Link href={`/blog/${featured.slug}`} className="inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline">
                    Read Article <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Card key={post.id} className="border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="bg-gradient-to-br from-muted to-muted/50 h-32 flex items-center justify-center text-4xl rounded-t-lg">
                  📚
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <Badge className="self-start mb-2 bg-primary/10 text-primary border-0 text-xs">{post.category}</Badge>
                  <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="text-xs text-primary hover:underline font-medium">Read →</Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
