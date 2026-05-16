import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, MessageSquare, CreditCard, Settings, Shield, Zap } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Help Center — EduAI" };

const helpCategories = [
  { icon: BookOpen, title: "Getting Started", desc: "New to EduAI? Learn how to enroll, navigate, and begin your learning journey.", links: ["How to create an account", "Enrolling in your first course", "Using the AI assistant"] },
  { icon: MessageSquare, title: "AI Features", desc: "Learn how to get the most out of EduAI's AI-powered tools.", links: ["Using AI Study Assistant", "Understanding AI recommendations", "Generating quizzes with AI"] },
  { icon: CreditCard, title: "Billing & Payments", desc: "Questions about pricing, refunds, and payment methods.", links: ["Payment methods accepted", "Getting a refund", "Free vs paid courses"] },
  { icon: Settings, title: "Account Settings", desc: "Manage your profile, notifications, and preferences.", links: ["Updating your profile", "Changing your password", "Managing notifications"] },
  { icon: Shield, title: "Privacy & Security", desc: "Learn about how we protect your data and privacy.", links: ["Data privacy policy", "Account security tips", "Deleting your account"] },
  { icon: Zap, title: "Technical Issues", desc: "Troubleshoot common technical problems.", links: ["Video not loading?", "Login issues", "Browser compatibility"] },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="py-16 bg-muted/20 border-b border-border text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-3">Help Center</h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Find answers to common questions or contact our support team.
            </p>
          </div>
        </section>

        <section className="py-12 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {helpCategories.map((cat) => (
              <Card key={cat.title} className="border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <cat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{cat.desc}</p>
                  <ul className="space-y-2">
                    {cat.links.map((link) => (
                      <li key={link}>
                        <Link href="/contact" className="text-sm text-primary hover:underline">
                          → {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 p-8 rounded-2xl bg-primary/5 border border-primary/20 max-w-2xl mx-auto">
            <h3 className="font-bold text-lg mb-2">Still need help?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Can't find what you're looking for? Our support team is here 24/7.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <MessageSquare className="h-4 w-4" /> Contact Support
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
