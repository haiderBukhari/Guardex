
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

// Sample vulnerability data
const vulnerabilities = [
  {
    id: 1,
    type: "Cross-Site Scripting (XSS)",
    severity: "critical",
    location: "/search?q=<script>alert(1)</script>",
    description: "User input in the search field is not properly sanitized before being displayed, allowing for script injection.",
    recommendation: "Implement proper HTML escaping for user inputs. Consider using React's built-in XSS protection or libraries like DOMPurify."
  },
  {
    id: 2,
    type: "Missing Content-Security-Policy",
    severity: "medium",
    location: "HTTP Headers",
    description: "The application does not implement Content-Security-Policy headers, increasing risk of XSS attacks.",
    recommendation: "Add CSP headers to restrict resource loading and prevent script injection: Content-Security-Policy: default-src 'self'; script-src 'self'"
  },
  {
    id: 3,
    type: "Insecure Cookies",
    severity: "low",
    location: "Authentication Cookies",
    description: "Session cookies are not set with the 'secure' flag, exposing them to interception over HTTP.",
    recommendation: "Set the 'secure' and 'httpOnly' flags on all sensitive cookies to ensure they're only transmitted over HTTPS and not accessible via JavaScript."
  }
];

// Determine severity icon and color
const getSeverityIndicator = (severity: string) => {
  switch (severity) {
    case 'critical':
      return <XCircle size={16} className="text-red-500" />;
    case 'medium':
      return <AlertTriangle size={16} className="text-orange-500" />;
    case 'low':
      return <AlertTriangle size={16} className="text-yellow-500" />;
    default:
      return <AlertTriangle size={16} className="text-muted-foreground" />;
  }
};

const AIRecommendationsPanel = () => {
  return (
    <div className="glass-effect">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-medium">AI Recommendations</h2>
      </div>
      <div className="p-0 divide-y divide-border">
        {vulnerabilities.map((vuln) => (
          <div key={vuln.id} className="p-4 hover:bg-guardex-500/5 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  {getSeverityIndicator(vuln.severity)}
                  <h3 className="font-medium text-sm">{vuln.type}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    vuln.severity === 'critical' ? 'bg-red-500/10 text-red-500' :
                    vuln.severity === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {vuln.severity}
                  </span>
                </div>
                <div className="text-xs font-mono mt-1 text-muted-foreground">
                  {vuln.location}
                </div>
                <p className="text-sm mt-2">
                  {vuln.description}
                </p>
                <div className="mt-3 p-3 bg-guardex-500/5 rounded border border-guardex-500/10 text-sm">
                  <div className="text-xs uppercase font-semibold text-guardex-400 mb-1">AI Recommendation</div>
                  {vuln.recommendation}
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm" className="text-xs">
                <CheckCircle size={14} className="mr-1" />
                Mark as Fixed
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendationsPanel;
