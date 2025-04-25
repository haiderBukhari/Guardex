import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import VulnerabilitiesSection from '@/components/VulnerabilitiesSection';
import TargetAudienceSection from '@/components/TargetAudienceSection';
import TeamSection from '@/components/TeamSection';
import RoadmapSection from '@/components/RoadmapSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <VulnerabilitiesSection />
        <TargetAudienceSection />
        <PricingSection />
        <TeamSection />
        <RoadmapSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
