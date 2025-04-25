
import React from 'react';

const roadmapItems = [
  {
    month: "April",
    year: 2025,
    title: "Compliance Modules",
    description: "Dedicated scanning modules for GDPR, HIPAA, PCI-DSS, and SOC2 compliance requirements."
  },
  {
    month: "May",
    year: 2025,
    title: "Mobile App Scanner",
    description: "Native vulnerability scanning for iOS and Android applications with platform-specific checks."
  },
  {
    month: "June",
    year: 2025,
    title: "Plugin SDK",
    description: "Build custom vulnerability checks and integrations using our developer SDK."
  },
  {
    month: "July",
    year: 2025,
    title: "Continuous Scanning",
    description: "Automated, scheduled scanning with change detection and regression alerts."
  }
];

const RoadmapSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-guardex-800/20 bg-guardex-500/10 text-guardex-500 text-xs font-medium mb-6">
            Coming Soon
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Roadmap Preview</h2>
          <p className="text-lg text-muted-foreground">
            We're constantly improving Guardex. Here's what we're working on next.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block"></div>
          
          <div className="space-y-16 md:space-y-0">
            {roadmapItems.map((item, index) => (
              <div key={item.title} className={`md:flex items-center ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                {/* For even items (left side) */}
                {index % 2 === 0 && (
                  <>
                    <div className="hidden md:block md:w-[calc(50%-2rem)] pr-8">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground mb-3">{item.description}</p>
                    </div>
                    
                    <div className="relative">
                      <div className="size-16 rounded-full bg-guardex-500/10 border-2 border-guardex-500 flex flex-col items-center justify-center text-guardex-500 z-10">
                        <span className="text-xs font-medium">{item.month}</span>
                        <span className="text-xs">{item.year}</span>
                      </div>
                    </div>
                    
                    <div className="md:hidden mt-4">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground mb-3">{item.description}</p>
                    </div>
                  </>
                )}
                
                {/* For odd items (right side) */}
                {index % 2 !== 0 && (
                  <>
                    <div className="md:w-[calc(50%-2rem)] hidden md:block"></div>
                    
                    <div className="relative">
                      <div className="size-16 rounded-full bg-guardex-500/10 border-2 border-guardex-500 flex flex-col items-center justify-center text-guardex-500 z-10">
                        <span className="text-xs font-medium">{item.month}</span>
                        <span className="text-xs">{item.year}</span>
                      </div>
                    </div>
                    
                    <div className="md:w-[calc(50%-2rem)] pl-8">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground mb-3">{item.description}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
