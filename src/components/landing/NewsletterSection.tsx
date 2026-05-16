"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const faqs = [
  { q: "Is EduAI free to use?", a: "We offer both free and paid courses. You can browse and enroll in free courses without any payment. Premium courses require a one-time purchase." },
  { q: "How does the AI Study Assistant work?", a: "Our AI assistant is powered by Google Gemini. It understands your questions in context, provides detailed explanations, and can help you with any topic covered in our courses." },
  { q: "Can I become an instructor?", a: "Yes! Register as a student first, then contact us to upgrade your account to Instructor status. You can then create and publish courses on the platform." },
  { q: "How are quiz questions generated?", a: "When an instructor creates a quiz, they can use our AI Quiz Generator powered by Gemini to automatically create questions based on the lesson content." },
  { q: "Do I get a certificate after completing a course?", a: "Yes, upon completing 100% of a course, your enrollment status is marked as Completed. Certificate features are on the roadmap for the next release." },
  { q: "Can I access courses on mobile?", a: "Absolutely! EduAI is fully responsive and works great on mobile, tablet, and desktop devices." },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-primary font-medium text-sm mb-2">Got Questions?</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-border rounded-xl bg-card overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left font-medium text-sm hover:text-primary transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {faq.q}
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 pb-5 text-sm text-muted-foreground"
                >
                  {faq.a}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("You're subscribed! Welcome to EduAI.");
    setEmail("");
    setLoading(false);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Stay in the Loop</h2>
          <p className="text-muted-foreground mb-8">
            Get the latest courses, AI feature updates, and exclusive learning tips delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-11"
            />
            <Button type="submit" disabled={loading} className="h-11 px-6 shrink-0">
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">No spam. Unsubscribe at any time.</p>
        </motion.div>
      </div>
    </section>
  );
}
