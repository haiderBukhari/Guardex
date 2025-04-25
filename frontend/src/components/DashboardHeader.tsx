
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Plus } from "lucide-react";
import { Link } from 'react-router-dom';

const DashboardHeader = () => {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex h-full items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/website-scan">
            <Button size="sm" className="flex items-center space-x-1 glow-sm">
              <Plus size={16} />
              <span>New Scan</span>
            </Button>
          </Link>
          
          <Button size="icon" variant="ghost" className="relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 size-2 rounded-full bg-guardex-500"></span>
          </Button>
          
          <Avatar className="size-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback className="bg-guardex-500/20 text-guardex-500">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
