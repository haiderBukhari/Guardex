
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Send } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hello! I\'m your security assistant. How can I help you today?' }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { sender: 'user', text: message }]);
    
    // Clear input
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      let response = "I'm analyzing your query...";
      
      // Simple pattern matching for demo purposes
      if (message.toLowerCase().includes('sql injection')) {
        response = "To prevent SQL injection, use parameterized queries or prepared statements instead of building SQL queries with string concatenation. Libraries like Sequelize or TypeORM can help manage this safely.";
      } else if (message.toLowerCase().includes('xss')) {
        response = "To prevent XSS attacks, always sanitize user inputs and use frameworks that automatically escape output. For React, avoid using dangerouslySetInnerHTML and consider libraries like DOMPurify when handling HTML.";
      } else if (message.toLowerCase().includes('csrf')) {
        response = "Protect against CSRF by implementing anti-CSRF tokens in your forms and validating them on the server side. Many modern frameworks include built-in CSRF protection.";
      } else {
        response = "I can help with security questions about web vulnerabilities like XSS, CSRF, SQL Injection, and more. Could you provide more details about your security concern?";
      }
      
      setChatHistory(prev => [...prev, { sender: 'bot', text: response }]);
    }, 1000);
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-96 glass-effect rounded-lg shadow-lg flex flex-col z-50 glow-sm">
          <div className="flex items-center justify-between p-3 border-b border-border bg-guardex-500/10 rounded-t-lg">
            <div className="flex items-center">
              <MessageCircle size={18} className="text-guardex-400 mr-2" />
              <h3 className="font-medium">Security Assistant</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </Button>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto">
            <div className="space-y-3">
              {chatHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-guardex-500 text-white ml-4'
                        : 'bg-background border border-border mr-4'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a security question..."
                className="min-h-9 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button size="icon" onClick={handleSendMessage} className="h-9 w-9">
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)} 
          className="fixed bottom-6 right-6 size-14 rounded-full shadow-lg flex items-center justify-center glow-md z-50"
        >
          <MessageCircle size={24} />
        </Button>
      )}
    </>
  );
};

export default Chatbot;
