
import React from 'react';

const teamMembers = [
  {
    name: "Alex Morgan",
    role: "Founder & Full Stack Developer",
    bio: "Former security engineer at AWS. Built Guardex after struggling with existing security tools that weren't developer-friendly.",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
  },
  {
    name: "Dr. Mia Chen",
    role: "AI & NLP Researcher",
    bio: "PhD in Natural Language Processing. Leads the development of Guardex's vulnerability explanation and fix generation system.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
  },
  {
    name: "Daniel Park",
    role: "UX & Frontend Lead",
    bio: "Passionate about creating developer tools that are beautiful and intuitive. Previously designed interfaces at GitHub.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
  }
];

const TeamSection = () => {
  return (
    <section id="team" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-guardex-800/20 bg-guardex-500/10 text-guardex-500 text-xs font-medium mb-6">
            Our Story
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">The Team Behind Guardex</h2>
          <p className="text-lg text-muted-foreground">
            We're a team of security engineers, developers, and UX experts who believe security should be simple and accessible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-background rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-guardex-500 text-sm mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
