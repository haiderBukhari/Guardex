
import React from 'react';
import { Check } from "lucide-react";

const vulnerabilities = [
  {
    name: "Cross-Site Scripting (XSS)",
    description: "Detects all types of XSS vulnerabilities: reflected, stored, and DOM-based"
  },
  {
    name: "SQL Injection",
    description: "Identifies vulnerable database queries and potential data exfiltration points"
  },
  {
    name: "JWT Vulnerabilities",
    description: "Detects insecure JWT implementation, weak signatures, and missing validations"
  },
  {
    name: "CSRF Weaknesses",
    description: "Finds missing or bypassed CSRF protections on state-changing operations"
  },
  {
    name: "Authentication Flaws",
    description: "Identifies weak password policies, missing MFA, and authentication bypasses"
  },
  {
    name: "API Security Issues",
    description: "Detects broken object-level authorization and mass assignment vulnerabilities"
  },
  {
    name: "Content Security Policy",
    description: "Analyzes CSP headers for weaknesses and unsafe-inline directives"
  },
  {
    name: "CORS Misconfigurations",
    description: "Identifies overly permissive CORS policies that could lead to data leakage"
  },
  {
    name: "Server Misconfigurations",
    description: "Detects information disclosure, default credentials, and outdated software"
  },
  {
    name: "Insecure Dependencies",
    description: "Identifies vulnerable third-party libraries and outdated frameworks"
  },
  {
    name: "DOM-based Vulnerabilities",
    description: "Finds client-side vulnerabilities in JavaScript frameworks and libraries"
  },
  {
    name: "Access Control Issues",
    description: "Identifies broken access controls and privilege escalation vectors"
  },
  {
    name: "Security Headers",
    description: "Analyzes missing or misconfigured security headers like HSTS, X-Frame-Options"
  },
  {
    name: "Path Traversal",
    description: "Detects directory traversal vulnerabilities in file operations"
  },
  {
    name: "Sensitive Data Exposure",
    description: "Identifies exposed credentials, API keys, and personal information"
  },
  {
    name: "Command Injection",
    description: "Finds OS command injection vulnerabilities in server-side functions"
  }
];

const VulnerabilitiesSection = () => {
  const half = Math.ceil(vulnerabilities.length / 2);
  const firstColumn = vulnerabilities.slice(0, half);
  const secondColumn = vulnerabilities.slice(half);

  return (
    <section id="what-it-detects" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-guardex-800/20 bg-guardex-500/10 text-guardex-500 text-xs font-medium mb-6">
            Comprehensive Coverage
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">What Guardex Detects</h2>
          <p className="text-lg text-muted-foreground">
            Our continuously updated security engine detects the latest vulnerabilities across your entire application.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div className="space-y-5">
            {firstColumn.map((item) => (
              <div key={item.name} className="flex">
                <div className="shrink-0 mr-3 mt-1">
                  <div className="size-5 rounded-full bg-guardex-500/10 text-guardex-500 flex items-center justify-center">
                    <Check size={14} />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-5">
            {secondColumn.map((item) => (
              <div key={item.name} className="flex">
                <div className="shrink-0 mr-3 mt-1">
                  <div className="size-5 rounded-full bg-guardex-500/10 text-guardex-500 flex items-center justify-center">
                    <Check size={14} />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full border-2 border-guardex-500/30 bg-guardex-500/5 text-guardex-500 text-sm">
            <span className="h-2 w-2 rounded-full bg-guardex-500 animate-pulse mr-2"></span>
            Our detection models are updated daily based on the latest threats and vulnerabilities
          </div>
        </div>
      </div>
    </section>
  );
};

export default VulnerabilitiesSection;
