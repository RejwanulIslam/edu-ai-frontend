import { Suspense } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import {
  FeaturesSection,
  StatsSection,
  TestimonialsSection,
  HowItWorksSection,
  CTASection,
} from "@/components/landing/LandingSections";
import { FeaturedCoursesSection } from "@/components/landing/FeaturedCoursesSection";
import { CategoriesSection } from "@/components/landing/CategoriesSection";
import { NewsletterSection } from "@/components/landing/NewsletterSection";
import { FAQSection } from "@/components/landing/NewsletterSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading courses...</div>}>
          <FeaturedCoursesSection />
        </Suspense>
        <CategoriesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <NewsletterSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
