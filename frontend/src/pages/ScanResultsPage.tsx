"use client"

import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertTriangle, XCircle, CheckCircle, ExternalLink, Shield } from "lucide-react"
import DashboardHeader from "@/components/DashboardHeader"
import DashboardSidebar from "@/components/DashboardSidebar"

// Dummy vulnerability data
const dummyVulnerabilities = [
  {
    id: "vuln-1",
    type: "Cross-Site Scripting (XSS)",
    severity: "critical",
    location: "/search?q=<script>alert(1)</script>",
    description:
      "User input in the search field is not properly sanitized before being displayed, allowing for script injection.",
    recommendation:
      "Implement proper HTML escaping for user inputs. Consider using React's built-in XSS protection or libraries like DOMPurify.",
  },
  {
    id: "vuln-2",
    type: "Missing Content-Security-Policy",
    severity: "medium",
    location: "HTTP Headers",
    description: "The application does not implement Content-Security-Policy headers, increasing risk of XSS attacks.",
    recommendation:
      "Add CSP headers to restrict resource loading and prevent script injection: Content-Security-Policy: default-src 'self'; script-src 'self'",
  },
  {
    id: "vuln-3",
    type: "Insecure Cookies",
    severity: "low",
    location: "Authentication Cookies",
    description: "Session cookies are not set with the 'secure' flag, exposing them to interception over HTTP.",
    recommendation:
      "Set the 'secure' and 'httpOnly' flags on all sensitive cookies to ensure they're only transmitted over HTTPS and not accessible via JavaScript.",
  },
  {
    id: "vuln-4",
    type: "Outdated Dependencies",
    severity: "medium",
    location: "package.json",
    description: "Several npm packages are outdated and contain known security vulnerabilities.",
    recommendation: "Run npm audit fix to update vulnerable dependencies to their latest secure versions.",
  },
  {
    id: "vuln-5",
    type: "Open Redirect",
    severity: "medium",
    location: "/redirect?url=https://malicious-site.com",
    description:
      "The redirect endpoint does not validate the URL parameter, allowing attackers to redirect users to malicious sites.",
    recommendation:
      "Implement a whitelist of allowed redirect URLs or validate that redirects only go to trusted domains.",
  },
]

// Dummy scan details
const dummyScanDetails = {
  scanDate: new Date().toLocaleString(),
  duration: "3m 42s",
  endpointsDiscovered: 32,
  requestsSent: 156,
  scanStatus: "Completed",
}

// Helper function to get severity badge
const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "critical":
      return (
        <Badge variant="destructive" className="bg-red-500">
          <XCircle className="h-3 w-3 mr-1" /> Critical
        </Badge>
      )
    case "medium":
      return (
        <Badge variant="outline" className="border-orange-500 text-orange-500">
          <AlertTriangle className="h-3 w-3 mr-1" /> Medium
        </Badge>
      )
    case "low":
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
          <AlertTriangle className="h-3 w-3 mr-1" /> Low
        </Badge>
      )
    default:
      return (
        <Badge variant="outline">
          <CheckCircle className="h-3 w-3 mr-1" /> Info
        </Badge>
      )
  }
}

const ScanResultsPage = () => {
  const { websiteId } = useParams<{ websiteId: string }>()

  // In a real app, you would fetch the website data based on the ID
  // For now, we'll use a dummy website
  const website = {
    id: websiteId,
    name: "example.com",
    url: "https://example.com",
    lastScan: new Date().toLocaleString(),
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <div className="flex-1 ml-64">
        <DashboardHeader />

        <main className="px-6 py-6">
          <div className="mb-6">
            <Link to="/website-scan">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
              </Button>
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">Scan Results: {website.name}</h1>
                <p className="text-muted-foreground">Last scanned on {website.lastScan}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" /> Visit Website
                </Button>
                <Button size="sm" className="glow-sm">
                  <Shield className="h-4 w-4 mr-1" /> Rescan Website
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-effect p-4 text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Scan Date</h3>
              <p className="text-lg font-semibold">{dummyScanDetails.scanDate}</p>
            </div>
            <div className="glass-effect p-4 text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Duration</h3>
              <p className="text-lg font-semibold">{dummyScanDetails.duration}</p>
            </div>
            <div className="glass-effect p-4 text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Endpoints</h3>
              <p className="text-lg font-semibold">{dummyScanDetails.endpointsDiscovered}</p>
            </div>
            <div className="glass-effect p-4 text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Vulnerabilities</h3>
              <p className="text-lg font-semibold text-red-500">{dummyVulnerabilities.length}</p>
            </div>
          </div>

          <div className="glass-effect mb-8">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-medium">Vulnerabilities Found</h2>
            </div>
            <div className="p-0 divide-y divide-border">
              {dummyVulnerabilities.map((vuln) => (
                <div key={vuln.id} className="p-4 hover:bg-guardex-500/5 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium">{vuln.type}</h3>
                        {getSeverityBadge(vuln.severity)}
                      </div>
                      <div className="text-xs font-mono mt-1 text-muted-foreground">{vuln.location}</div>
                      <p className="text-sm mt-2">{vuln.description}</p>
                      <div className="mt-3 p-3 bg-guardex-500/5 rounded border border-guardex-500/10 text-sm">
                        <div className="text-xs uppercase font-semibold text-guardex-400 mb-1">Recommendation</div>
                        {vuln.recommendation}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-medium">Scan Details</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Scan Configuration</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Scan Type:</span>
                      <span>Full Scan</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Authentication:</span>
                      <span>None</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Crawl Depth:</span>
                      <span>3 levels</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Scan Engine:</span>
                      <span>Guardex v1.0</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Scan Statistics</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Requests Sent:</span>
                      <span>{dummyScanDetails.requestsSent}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Scan Status:</span>
                      <span>{dummyScanDetails.scanStatus}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Critical Issues:</span>
                      <span className="text-red-500">
                        {dummyVulnerabilities.filter((v) => v.severity === "critical").length}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Medium Issues:</span>
                      <span className="text-orange-500">
                        {dummyVulnerabilities.filter((v) => v.severity === "medium").length}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ScanResultsPage
