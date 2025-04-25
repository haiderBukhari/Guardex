import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Sample data for the table
const websiteData = [
  {
    url: "example.com",
    lastScan: "2 hours ago",
    vulnerabilities: 5,
    status: "critical"
  },
  {
    url: "securesite.net",
    lastScan: "1 day ago",
    vulnerabilities: 0,
    status: "safe"
  },
  {
    url: "myapp.dev",
    lastScan: "3 days ago",
    vulnerabilities: 2,
    status: "warning"
  },
  {
    url: "newproject.io",
    lastScan: "Just now",
    vulnerabilities: 0,
    status: "pending"
  },
  {
    url: "legacy-app.com",
    lastScan: "1 week ago",
    vulnerabilities: 12,
    status: "critical"
  }
];

// Generate status badge based on status
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'critical':
      return <Badge variant="destructive" className="bg-red-500">Critical</Badge>;
    case 'warning':
      return <Badge variant="outline" className="border-orange-500 text-orange-500">Warning</Badge>;
    case 'safe':
      return <Badge variant="outline" className="border-guardex-500 text-guardex-500">Safe</Badge>;
    case 'pending':
      return <Badge variant="outline" className="border-guardex-500 text-guardex-500">Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const WebsitesOverview = () => {
  return (
    <div className="glass-effect overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-medium">Websites Overview</h2>
      </div>
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Website URL</TableHead>
              <TableHead>Last Scan</TableHead>
              <TableHead>Vulnerabilities</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {websiteData.map((site) => (
              <TableRow key={site.url} className="cursor-pointer hover:bg-guardex-500/5">
                <TableCell className="font-medium">{site.url}</TableCell>
                <TableCell>{site.lastScan}</TableCell>
                <TableCell>
                  {site.vulnerabilities > 0 ? (
                    <span className="text-destructive-500">{site.vulnerabilities}</span>
                  ) : (
                    <span className="text-guardex-500">{site.vulnerabilities}</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(site.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WebsitesOverview;
