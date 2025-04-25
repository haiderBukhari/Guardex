"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Clock,
  Code,
  Bug,
  Users,
  Github,
  ArrowRight,
} from "lucide-react";
import { useTilt } from "@/hooks/use-tilt";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({
  icon,
  title,
  description,
}: FeatureCardProps) => {
  const [cardRef] = useTilt<HTMLDivElement>({
    max: 10,
    perspective: 1000,
    scale: 1.02,
  });

  return (
    <div
      ref={cardRef}
      className="bg-card rounded-xl p-6 border hover:border-guardex-500/50 transition-colors group"
    >
      <div className="size-12 rounded-lg bg-guardex-500/10 flex items-center justify-center mb-4 text-guardex-500 group-hover:bg-guardex-500 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const SolutionSection = () => {
  const features = [
    {
      icon: <Zap size={24} />,
      title: "Instant Scanning",
      description:
        "Just enter a URL and we'll handle the rest. No setup, no agents, no complex configurations required.",
    },
    {
      icon: <Clock size={24} />,
      title: "Real-Time Results",
      description:
        "Watch findings appear as they're discovered. No waiting for long scan completions to see critical issues.",
    },
    {
      icon: <Code size={24} />,
      title: "AI-Generated Fixes",
      description:
        "Get concrete, ready-to-implement code fixes for each vulnerability, tailored to your tech stack and codebase.",
    },
    {
      icon: <Bug size={24} />,
      title: "Modern App Support",
      description:
        "Our scanner is built for today's apps, with full support for JavaScript frontends, SPAs, APIs, and modern authentication.",
    },
    {
      icon: <Users size={24} />,
      title: "Team Collaboration",
      description:
        "Built for cross-functional teams, with role-based access, shared findings, and integrated workflows.",
    },
    {
      icon: <Github size={24} />,
      title: "CI/CD Integration",
      description:
        "Seamlessly integrate with GitHub, GitLab, Jenkins, and other CI/CD platforms to automate security testing.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-guardex-800/20 bg-guardex-500/10 text-guardex-500 text-xs font-medium mb-6">
            The Solution
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Introducing Guardex:{" "}
            <span className="text-guardex-500">AI-Powered</span> Vulnerability
            Scanning
          </h2>
          <p className="text-lg text-muted-foreground">
            Security that works the way developers do. Fast, integrated, and
            actually helpful.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="max-w-md mx-auto text-center">
          <Button size="lg" className="group mb-4">
            Try Guardex Free
            <ArrowRight
              size={16}
              className="ml-2 transition-transform group-hover:translate-x-1"
            />
          </Button>
          <p className="text-sm text-muted-foreground">
            No credit card required. Start scanning in seconds.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
