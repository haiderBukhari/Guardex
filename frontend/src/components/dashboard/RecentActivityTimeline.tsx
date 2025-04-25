import React from 'react';
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";

// Sample data for the timeline
const activityData = [
  {
    id: 1,
    time: "10:30 AM",
    date: "Today",
    event: "Scan Completed",
    website: "example.com",
    status: "critical",
    details: "5 vulnerabilities found"
  },
  {
    id: 2,
    time: "9:15 AM",
    date: "Today",
    event: "Scan Started",
    website: "newproject.io",
    status: "pending",
    details: "Full scan in progress"
  },
  {
    id: 3,
    time: "Yesterday",
    date: "Apr 21",
    event: "Fix Applied",
    website: "myapp.dev",
    status: "success",
    details: "XSS vulnerability fixed"
  },
  {
    id: 4,
    time: "Apr 20",
    date: "Apr 20",
    event: "Scan Completed",
    website: "securesite.net",
    status: "safe",
    details: "No vulnerabilities found"
  }
];

// Gets the appropriate icon and color based on event type
const getEventIcon = (event: string, status: string) => {
  switch (event) {
    case 'Scan Completed':
      return status === 'safe' 
        ? <CheckCircle size={16} className="text-guardex-500" /> 
        : status === 'critical' 
          ? <XCircle size={16} className="text-red-500" />
          : <FileText size={16} className="text-guardex-500" />;
    case 'Scan Started':
      return <Clock size={16} className="text-guardex-500" />;
    case 'Fix Applied':
      return <CheckCircle size={16} className="text-green-500" />;
    default:
      return <FileText size={16} className="text-guardex-500" />;
  }
};

const RecentActivityTimeline = () => {
  return (
    <div className="glass-effect">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-medium">Recent Activity</h2>
      </div>
      <div className="p-4 pt-2">
        <div className="space-y-4">
          {activityData.map((activity) => (
            <div key={activity.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="size-8 rounded-full bg-guardex-500/10 border border-guardex-500/20 flex items-center justify-center">
                  {getEventIcon(activity.event, activity.status)}
                </div>
                {activity.id !== activityData.length && (
                  <div className="h-full w-px bg-border mt-1"></div>
                )}
              </div>
              <div className="pb-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium">{activity.event}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {activity.time} · {activity.date}
                  </span>
                </div>
                <div className="text-sm mt-1">
                  <span className="font-mono">{activity.website}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {activity.details}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivityTimeline;
