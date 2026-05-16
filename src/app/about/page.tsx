import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { GraduationCap, Brain, Users, Globe, Target, Heart } from "lucide-react";

export const metadata = { title: "About — EduAI" };

export default function AboutPage() {
  const team = [
    { name: "Alex Chen", role: "Founder & CEO", bio: "Former Google engineer passionate about democratizing education through AI." },
    { name: "Priya Sharma", role: "Head of AI", bio: "PhD in Machine Learning. Building the future of personalized learning." },
    { name: "Marcus Johnson", role: "Lead Instructor", bio: "10+ years teaching web development. Believes everyone can code." },
    { name: "Sofia Rodriguez", role: "UX Director", bio: "Designing learning experiences that are intuitive and delightful." },
  ];

  const values = [
    { icon: Brain, title: "AI-First", desc: "We believe AI should enhance every part of the learning journey." },
    { icon: Globe, title: "Accessible", desc: "Quality education should be available to everyone, everywhere." },
    { icon: Target, title: "Results-Driven", desc: "We measure success by our students' real-world outcomes." },
    { icon: Heart, title: "Student-Centric", desc: "Every decision we make starts with the student experience." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="py-20 bg-muted/20 border-b border-border">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">About EduAI</h1>
            <p className="text-lg text-muted-foreground">
              We're on a mission to make high-quality, AI-powered education accessible to every learner on the planet.
              Founded in 2024, EduAI combines expert-taught courses with cutting-edge AI to create a truly personalized
              learning experience.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center p-6 rounded-xl border border-border hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-muted/20 border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="text-center p-6 rounded-xl border border-border bg-background">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
