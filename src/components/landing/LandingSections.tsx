"use client";
import { motion } from "framer-motion";
import { Brain, Zap, Target, Shield, BarChart3, MessageSquare, Star, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const features = [
  {
    icon: Brain,
    title: "AI Smart Recommendations",
    desc: "Our AI analyzes your learning history to suggest the perfect next course, personalized just for you.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: MessageSquare,
    title: "AI Study Assistant",
    desc: "Chat with your 24/7 AI tutor. Ask any question, get instant explanations, and deepen your understanding.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Zap,
    title: "AI Quiz Generator",
    desc: "Auto-generate quizzes from any course content using Gemini AI to test your knowledge instantly.",
    color: "bg-yellow-500/10 text-yellow-600",
  },
  {
    icon: Target,
    title: "Auto Content Classification",
    desc: "AI automatically categorizes and tags courses for precise discovery and better organization.",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    desc: "Detailed analytics on your learning journey — track time spent, scores, and completion rates.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Shield,
    title: "Verified Instructors",
    desc: "All instructors are verified professionals. Quality content guaranteed on every course.",
    color: "bg-purple-500/10 text-purple-600",
  },
];

const stats = [
  { value: "500+", label: "Courses Available" },
  { value: "10K+", label: "Active Students" },
  { value: "50+", label: "Expert Instructors" },
  { value: "4.8★", label: "Average Rating" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Developer",
    avatar: "",
    comment: "EduAI's recommendation engine is incredible. It suggested a React course right when I needed it, and the AI assistant helped me debug issues instantly. Best learning platform I've used.",
    rating: 5,
  },
  {
    name: "Ahmed Hassan",
    role: "Data Scientist",
    avatar: "",
    comment: "The AI quiz generator is a game-changer. I can test my knowledge immediately after each lesson. My retention has improved dramatically since joining EduAI.",
    rating: 5,
  },
  {
    name: "Maria Chen",
    role: "UX Designer",
    avatar: "",
    comment: "The AI study assistant answered my design theory questions at 2 AM when I was cramming. It's like having a tutor available 24/7. Worth every penny.",
    rating: 5,
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div {...fadeInUp} className="text-center mb-14">
          <p className="text-primary font-medium text-sm mb-2">Why Choose EduAI</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powered by{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We combine world-class courses with cutting-edge AI to give you an unmatched learning experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-primary-foreground/70 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div {...fadeInUp} className="text-center mb-14">
          <p className="text-primary font-medium text-sm mb-2">Student Success Stories</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of learners who have transformed their careers with EduAI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="h-full border border-border hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.comment}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={t.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {t.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    { step: "01", title: "Create Your Account", desc: "Sign up for free and tell us your learning goals and interests." },
    { step: "02", title: "Get AI Recommendations", desc: "Our AI analyzes your profile and suggests the best courses for you." },
    { step: "03", title: "Learn with AI Support", desc: "Study with AI quizzes, a 24/7 chat assistant, and smart progress tracking." },
    { step: "04", title: "Achieve Your Goals", desc: "Complete courses, earn certificates, and advance your career." },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div {...fadeInUp} className="text-center mb-14">
          <p className="text-primary font-medium text-sm mb-2">Simple Process</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get started in minutes and begin your AI-enhanced learning journey today.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-primary/20 mb-4">{s.step}</div>
              <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4 text-center">
        <motion.div {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Learn Smarter?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join over 10,000 students already learning with AI on EduAI. Start free today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 h-12 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started Free <Brain className="h-4 w-4" />
            </a>
            <a
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-8 h-12 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
            >
              Browse Courses
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
