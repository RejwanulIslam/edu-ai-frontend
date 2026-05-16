import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata = { title: "Privacy Policy — EduAI" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 1, 2025</p>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
            {[
              { title: "1. Information We Collect", body: "We collect information you provide directly, such as your name, email address, and profile information when you register. We also collect usage data including courses viewed, quiz scores, and AI chat sessions to improve your learning experience." },
              { title: "2. How We Use Your Information", body: "We use your information to provide and improve our services, personalize your learning experience through AI recommendations, send you important updates about your courses, and communicate platform news. We never sell your personal data to third parties." },
              { title: "3. AI Data Processing", body: "When you interact with our AI Study Assistant (powered by Google Gemini), your messages are processed by Google's AI systems. Chat history is stored to provide context in future sessions. You can delete your chat history at any time from your settings." },
              { title: "4. Data Security", body: "We implement industry-standard security measures including SSL encryption, secure password hashing, and regular security audits. Your data is stored on secure servers with restricted access." },
              { title: "5. Your Rights", body: "You have the right to access, correct, or delete your personal data at any time. You can export your data from your account settings or request deletion by contacting us at privacy@eduai.dev." },
              { title: "6. Cookies", body: "We use essential cookies for authentication and session management, and optional analytics cookies to understand how users interact with our platform. You can control cookie preferences in your browser settings." },
              { title: "7. Contact Us", body: "If you have questions about this Privacy Policy, contact us at privacy@eduai.dev or write to us at 123 Main Street, San Francisco, CA 94102." },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
