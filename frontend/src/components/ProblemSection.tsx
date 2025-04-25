
import React from 'react';
import { Check } from "lucide-react";

const ProblemSection = () => {
  return (
    <section className="py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-guardex-800/20 bg-guardex-500/10 text-guardex-500 text-xs font-medium mb-6">
            The Problem
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Web Security is Broken</h2>
          <p className="text-lg text-muted-foreground">
            Traditional security tools weren't built for modern web development workflows, leaving teams frustrated and applications vulnerable.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div className="relative rounded-xl border p-6 glass-effect">
            <div className="absolute -top-3 -left-3 w-16 h-16 rounded-lg bg-destructive/20 blur-2xl"></div>
            <h3 className="text-xl font-semibold mb-4 flex items-start">
              <span className="inline-block size-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-3 mt-1">1</span>
              Outdated Tools
            </h3>
            <p className="text-muted-foreground mb-4">
              Tools like Burp Suite and ZAP were designed for a different era. They're cumbersome, complex, and require extensive training.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="inline-block size-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-2 mt-0.5">✕</span>
                <span>Steep learning curve</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block size-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-2 mt-0.5">✕</span>
                <span>Manual configuration required</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block size-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-2 mt-0.5">✕</span>
                <span>Desktop-only interfaces</span>
              </li>
            </ul>
          </div>
          
          <div className="relative rounded-xl border p-6 glass-effect">
            <div className="absolute -top-3 -left-3 w-16 h-16 rounded-lg bg-destructive/20 blur-2xl"></div>
            <h3 className="text-xl font-semibold mb-4 flex items-start">
              <span className="inline-block size-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-3 mt-1">2</span>
              Overly Technical Reports
            </h3>
            <p className="text-muted-foreground mb-4">
              Security reports are filled with technical jargon and false positives, making it hard to prioritize and fix real issues.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="inline-block size-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-2 mt-0.5">✕</span>
                <span>Overwhelming detail</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block size-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-2 mt-0.5">✕</span>
                <span>No clear remediation steps</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block size-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-2 mt-0.5">✕</span>
                <span>Too many false positives</span>
              </li>
            </ul>
          </div>
          
          <div className="relative rounded-xl border p-6 glass-effect">
            <div className="absolute -top-3 -left-3 w-16 h-16 rounded-lg bg-destructive/20 blur-2xl"></div>
            <h3 className="text-xl font-semibold mb-4 flex items-start">
              <span className="inline-block size-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-3 mt-1">3</span>
              Security Added Too Late
            </h3>
            <p className="text-muted-foreground mb-4">
              Security is often an afterthought, bolted on at the end of development when changes are expensive and time-consuming.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="inline-block size-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-2 mt-0.5">✕</span>
                <span>Last-minute security reviews</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block size-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-2 mt-0.5">✕</span>
                <span>Launch delays due to findings</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block size-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-2 mt-0.5">✕</span>
                <span>Security as a bottleneck</span>
              </li>
            </ul>
          </div>
          
          <div className="relative rounded-xl border p-6 glass-effect">
            <div className="absolute -top-3 -left-3 w-16 h-16 rounded-lg bg-destructive/20 blur-2xl"></div>
            <h3 className="text-xl font-semibold mb-4 flex items-start">
              <span className="inline-block size-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-3 mt-1">4</span>
              No Collaboration Platform
            </h3>
            <p className="text-muted-foreground mb-4">
              Development, security, and QA teams use disconnected tools, leading to confusion, duplicate work, and missed vulnerabilities.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="inline-block size-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-2 mt-0.5">✕</span>
                <span>Siloed tooling</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block size-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-2 mt-0.5">✕</span>
                <span>Limited visibility across teams</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block size-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-2 mt-0.5">✕</span>
                <span>Tedious manual reporting</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
