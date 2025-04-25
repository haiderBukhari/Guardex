import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3 bg-background/80 backdrop-blur-lg border-b' : 'py-5'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="size-8 rounded-lg bg-guardex-500 text-white font-bold flex items-center justify-center">G</div>
          <span className="font-bold text-xl">guardex</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm hover:text-guardex-500 transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm hover:text-guardex-500 transition-colors">How It Works</a>
          <a href="#what-it-detects" className="text-sm hover:text-guardex-500 transition-colors">What It Detects</a>
          <a href="#team" className="text-sm hover:text-guardex-500 transition-colors">Team</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button size="sm" className="bg-guardex-500 hover:bg-guardex-600 text-white">Sign In</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
