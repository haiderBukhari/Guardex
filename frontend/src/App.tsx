import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Pages
import Index from "./pages/Index"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import WebsiteScanDashboard from "./pages/WebsiteScanDashboard"
import ScanResultsPage from "./pages/ScanResultsPage"
import NotFound from "./pages/NotFound"
import Agent from "./pages/Agent"
import Verify from "./pages/Verify"
import ScannedWebsitesPage from "./pages/ScannedWebsites"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/agent" element={<Agent />} />
          <Route path="/dashboard/scanned" element={<ScannedWebsitesPage />} />
          <Route path="/verify/:id" element={<Verify />} />
          <Route path="/dashboard/website-scan" element={<WebsiteScanDashboard />} />
          <Route path="/dashboard/scan-results/:websiteId" element={<ScanResultsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
