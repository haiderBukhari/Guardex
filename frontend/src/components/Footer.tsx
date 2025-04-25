
import React from 'react';
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mb-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Your AI-powered security engineer in a box
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Always scanning. Always helping you ship safely. One platform. One URL.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-guardex-500 hover:bg-guardex-600">
              Try Guardex Free
            </Button>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            No credit card required. Free plan includes 5 scans per month.
          </div>
        </div>
        
        <div className="border-t pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="size-8 rounded-lg bg-guardex-500 text-white font-bold flex items-center justify-center">G</div>
                <span className="font-bold text-xl">guardex</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Web security reimagined for developers. Fast, accurate, and actually helpful.
              </p>
              <div className="flex items-center space-x-3">
                <a href="#" className="size-8 rounded-full bg-card flex items-center justify-center border hover:border-guardex-500 transition-colors">
                  <Github size={16} />
                </a>
                <a href="#" className="size-8 rounded-full bg-card flex items-center justify-center border hover:border-guardex-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="size-8 rounded-full bg-card flex items-center justify-center border hover:border-guardex-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">Features</a></li>
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">How It Works</a></li>
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">Integrations</a></li>
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">Enterprise</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">Community</a></li>
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">Security Research</a></li>
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">About Us</a></li>
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">Contact</a></li>
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm hover:text-guardex-500 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Guardex. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-guardex-500 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-guardex-500 transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-guardex-500 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
