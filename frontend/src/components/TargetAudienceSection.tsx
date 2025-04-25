"use client";

import { useTilt } from "@/hooks/use-tilt";

interface AudienceCardProps {
  name: string;
  description: string;
}

const AudienceCard = ({ name, description }: AudienceCardProps) => {
  const [cardRef] = useTilt<HTMLDivElement>({
    max: 10,
    perspective: 1000,
    scale: 1.02,
  });

  return (
    <div
      ref={cardRef}
      className="bg-card rounded-xl p-6 border hover:border-guardex-500/50 transition-colors group relative overflow-hidden"
    >
      <div className="absolute -right-8 -bottom-8 size-24 rounded-full bg-guardex-500/5 group-hover:bg-guardex-500/10 transition-colors"></div>
      <h3 className="text-xl font-semibold mb-3 relative">{name}</h3>
      <p className="text-muted-foreground relative">{description}</p>
    </div>
  );
};

const audiences = [
  {
    name: "SaaS Teams",
    description: "Protect customer data and maintain compliance with automated security scanning.",
  },
  {
    name: "Startups",
    description: "Ship fast without sacrificing security. Perfect for lean teams without security specialists.",
  },
  {
    name: "DevOps Engineers",
    description: "Integrate security scanning into your CI/CD pipeline for continuous protection.",
  },
  {
    name: "Agencies",
    description: "Deliver secure applications to clients while reducing liability and risk.",
  },
  {
    name: "Development Teams",
    description: "Find and fix vulnerabilities during development, not after launch.",
  },
  {
    name: "Enterprises",
    description: "Centralize security scanning while maintaining compliance across departments.",
  },
];

const TargetAudienceSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-guardex-800/20 bg-guardex-500/10 text-guardex-500 text-xs font-medium mb-6">
            Perfect For
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Who It's For</h2>
          <p className="text-lg text-muted-foreground">
            Guardex is built for everyone who builds software and cares about security.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {audiences.map((audience) => (
            <AudienceCard
              key={audience.name}
              name={audience.name}
              description={audience.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;
