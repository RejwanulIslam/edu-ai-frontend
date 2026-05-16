"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Code2, BarChart2, Palette, Briefcase, Globe, Music, Camera, FlaskConical } from "lucide-react";

const categories = [
  { name: "Web Development", icon: Code2, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", count: "120+ courses" },
  { name: "Data Science", icon: BarChart2, color: "bg-green-500/10 text-green-600 dark:text-green-400", count: "80+ courses" },
  { name: "Design", icon: Palette, color: "bg-pink-500/10 text-pink-600 dark:text-pink-400", count: "60+ courses" },
  { name: "Business", icon: Briefcase, color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400", count: "50+ courses" },
  { name: "Language", icon: Globe, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", count: "40+ courses" },
  { name: "Music", icon: Music, color: "bg-orange-500/10 text-orange-600 dark:text-orange-400", count: "30+ courses" },
  { name: "Photography", icon: Camera, color: "bg-red-500/10 text-red-600 dark:text-red-400", count: "25+ courses" },
  { name: "Science", icon: FlaskConical, color: "bg-teal-500/10 text-teal-600 dark:text-teal-400", count: "35+ courses" },
];

export function CategoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-primary font-medium text-sm mb-2">Explore by Topic</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse Categories</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find courses in your area of interest from our wide range of categories.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/courses?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center p-6 rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-card group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${cat.color}`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-sm text-center mb-1">{cat.name}</h3>
                <p className="text-xs text-muted-foreground">{cat.count}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
