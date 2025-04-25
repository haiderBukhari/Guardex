"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { BarChart, LineChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import ReactECharts from 'echarts-for-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import DashboardHeader from "@/components/DashboardHeader"
import DashboardSidebar from "@/components/DashboardSidebar"

// Chart components
const Chart = ({ className, ...props }) => <div className={`w-full ${className || ""}`} {...props} />

const ChartContainer = ({ className, ...props }) => (
  <div className={`h-[350px] w-full p-4 rounded-md border ${className || ""}`} {...props} />
)

const ChartTooltip = ({ className, ...props }) => (
  <div
    className={`z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md ${className || ""}`}
    {...props}
  />
)

const ChartTooltipContent = ({ className, ...props }) => (
  <div className={`flex flex-col space-y-1 ${className || ""}`} {...props} />
)

const ChartLegend = ({ className, ...props }) => <div className={`flex items-center ${className || ""}`} {...props} />

const ChartLegendItem = ({ className, name, color, ...props }) => (
  <div className={`flex items-center space-x-2 ${className || ""}`} {...props}>
    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
    <span>{name}</span>
  </div>
)

export default function Dashboard() {
  const [scans, setScans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalScans: 0,
    criticalIssues: 0,
    highIssues: 0,
    mediumIssues: 0,
    lowIssues: 0,
    totalIssues: 0,
  })
  const [selectedVulnerability, setSelectedVulnerability] = useState(null)

  useEffect(() => {
    fetchScans()
  }, [])

  useEffect(() => {
    if (scans?.length > 0) {
      calculateStats()
    }
  }, [scans])

  const fetchScans = async () => {
    setIsLoading(true)
    try {
      const userData = Cookies.get("guardex_user")
      if (!userData) {
        setIsLoading(false)
        return
      }

      const userId = JSON.parse(userData).id
      const res = await fetch("https://guardex-node-js.vercel.app/api/scan?user_id=" + userId)
      const json = await res.json()

      setScans(json?.scans || [])
    } catch (error) {
      console.error("Error fetching scans:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = () => {
    let criticalCount = 0
    let highCount = 0
    let mediumCount = 0
    let lowCount = 0
    let totalCount = 0

    scans?.forEach((scan) => {
      scan.vulnerabilities?.forEach((vuln) => {
        totalCount++
        switch (vuln.severity.toLowerCase()) {
          case "critical":
            criticalCount++
            break
          case "high":
            highCount++
            break
          case "medium":
            mediumCount++
            break
          case "low":
            lowCount++
            break
        }
      })
    })

    setStats({
      totalScans: scans?.length,
      criticalIssues: criticalCount,
      highIssues: highCount,
      mediumIssues: mediumCount,
      lowIssues: lowCount,
      totalIssues: totalCount,
    })
  }

  // Function to get domain from URL
  const getDomain = (url) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace("www.", "")
    } catch (e) {
      return url
    }
  }

  // Function to format date
  const formatDate = (dateString, includeTime = false) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: includeTime ? undefined : "numeric",
      hour: includeTime ? "2-digit" : undefined,
      minute: includeTime ? "2-digit" : undefined,
    }).format(date)
  }

  // Function to get badge variant based on severity
  const getSeverityBadge = (severity) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return <Badge className="bg-amber-500">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Scan Summary Cards Component
  const ScanSummaryCards = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-background/80 backdrop-blur">
        <CardHeader className="pb-2">
          <CardDescription>Total Scanned Websites</CardDescription>
          <CardTitle className="text-3xl font-bold">{stats.totalScans}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            <Badge variant="outline" className="mr-1">
              Active Monitoring
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-background/80 backdrop-blur">
        <CardHeader className="pb-2">
          <CardDescription>Critical Issues</CardDescription>
          <CardTitle className="text-3xl font-bold text-destructive">{stats.criticalIssues}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            <Badge variant="destructive" className="mr-1">
              Immediate Action Required
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-background/80 backdrop-blur">
        <CardHeader className="pb-2">
          <CardDescription>High & Medium Issues</CardDescription>
          <CardTitle className="text-3xl font-bold text-amber-500">{stats.highIssues + stats.mediumIssues}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
              High: {stats.highIssues}
            </Badge>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
              Medium: {stats.mediumIssues}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-background/80 backdrop-blur">
        <CardHeader className="pb-2">
          <CardDescription>Low Issues</CardDescription>
          <CardTitle className="text-3xl font-bold text-blue-500">{stats.lowIssues}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
              Monitor
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Vulnerability Chart Component

  const VulnerabilityChart = () => {
    const processedData = scans
      .filter((scan) => scan.vulnerabilities?.length)
      .map((scan) => {
        const domain = getDomain(scan.website_link)
        const critical = scan.vulnerabilities?.filter((v) => v.severity?.toLowerCase() === 'critical')?.length || 0
        const high = scan.vulnerabilities?.filter((v) => v.severity?.toLowerCase() === 'high')?.length || 0
        const medium = scan.vulnerabilities?.filter((v) => v.severity?.toLowerCase() === 'medium')?.length || 0
        const low = scan.vulnerabilities?.filter((v) => v.severity?.toLowerCase() === 'low')?.length || 0
        return { domain, critical, high, medium, low }
      })

    if (!processedData.length) {
      return <div className="flex items-center justify-center h-[300px]">No data available for chart.</div>
    }

    const xLabels = processedData.map((item) => item.domain)

    const makeLineSeries = (name, color, dataKey) => ({
      name,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        color,
        borderColor: '#fff',
        borderWidth: 2,
      },
      lineStyle: {
        width: 3,
        color,
        shadowColor: color + '55',
        shadowBlur: 8,
      },
      areaStyle: {
        color: color + '22',
      },
      emphasis: {
        focus: 'series',
      },
      data: processedData.map((item) => item[dataKey]),
    })

    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        textStyle: { color: '#000' },
      },
      legend: {
        top: 10,
        icon: 'circle',
        itemWidth: 12,
        itemHeight: 12,
        textStyle: { fontWeight: 500 },
        data: ['Critical', 'High', 'Medium', 'Low'],
      },
      grid: {
        top: 60,
        left: '3%',
        right: '4%',
        bottom: 60,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        axisLabel: {
          rotate: 40,
          fontSize: 10,
          fontWeight: 500,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Vulnerabilities',
        axisLine: { show: true },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#ddd',
          },
        },
      },
      series: [
        makeLineSeries('Critical', '#ef4444', 'critical'),
        makeLineSeries('High', '#f97316', 'high'),
        makeLineSeries('Medium', '#eab308', 'medium'),
        makeLineSeries('Low', '#3b82f6', 'low'),
      ],
    }

    return (
      <ChartContainer>
        <ReactECharts option={option} style={{ height: 360, width: '100%' }} />
      </ChartContainer>
    )
  }

  // Severity Donut Chart Component
  const SeverityDonutChart = () => {
    const data = [
      { name: "Critical", value: stats.criticalIssues, color: "#ef4444" },
      { name: "High", value: stats.highIssues, color: "#f97316" },
      { name: "Medium", value: stats.mediumIssues, color: "#eab308" },
      { name: "Low", value: stats.lowIssues, color: "#3b82f6" },
    ]?.filter((item) => item.value > 0)

    if (data?.length === 0) {
      return <div className="flex h-[200px] items-center justify-center">No vulnerability data available</div>
    }

    return (

      <div className="h-[200px] w-full">
        <ChartContainer>
          <Chart>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Chart>
        </ChartContainer>
      </div>
    )
  }

  // Website Vulnerability Table Component
  const WebsiteVulnerabilityTable = () => (
    <ScrollArea className="h-[400px] w-full rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-background">
          <TableRow>
            <TableHead>Website</TableHead>
            <TableHead>Scan Date</TableHead>
            <TableHead>Critical</TableHead>
            <TableHead>High</TableHead>
            <TableHead>Medium</TableHead>
            <TableHead>Low</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scans?.map((scan) => {
            const criticalCount = scan.vulnerabilities?.filter((v) => v.severity.toLowerCase() === "critical")?.length
            const highCount = scan.vulnerabilities?.filter((v) => v.severity.toLowerCase() === "high")?.length
            const mediumCount = scan.vulnerabilities?.filter((v) => v.severity.toLowerCase() === "medium")?.length
            const lowCount = scan.vulnerabilities?.filter((v) => v.severity.toLowerCase() === "low")?.length

            return (
              <TableRow key={scan.id}>
                <TableCell className="font-medium">{getDomain(scan.website_link)}</TableCell>
                <TableCell>{formatDate(scan.scanned_on)}</TableCell>
                <TableCell className={criticalCount > 0 ? "text-destructive font-bold" : ""}>{criticalCount}</TableCell>
                <TableCell className={highCount > 0 ? "text-amber-500 font-bold" : ""}>{highCount}</TableCell>
                <TableCell className={mediumCount > 0 ? "text-yellow-500 font-bold" : ""}>{mediumCount}</TableCell>
                <TableCell className={lowCount > 0 ? "text-blue-500 font-bold" : ""}>{lowCount}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Vulnerabilities for {getDomain(scan.website_link)}</DialogTitle>
                        <DialogDescription>Scanned on {formatDate(scan.scanned_on)}</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Severity</TableHead>
                              <TableHead>Vulnerability</TableHead>
                              <TableHead>Type</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {scan.vulnerabilities?.map((vuln, index) => (
                              <TableRow key={index}>
                                <TableCell>{getSeverityBadge(vuln.severity)}</TableCell>
                                <TableCell className="font-medium">{vuln.name}</TableCell>
                                <TableCell>{vuln.vulnerability_type}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  )

  // Recent Scans Timeline Component
  const RecentScansTimeline = () => {
    // Sort scans by date (newest first)
    const sortedScans = [...scans].sort((a, b) => new Date(b.scanned_on).getTime() - new Date(a.scanned_on).getTime())

    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-border">
          {sortedScans?.length === 0 ? (
            <div className="py-4 px-6 text-center text-muted-foreground">No scan history available</div>
          ) : (
            sortedScans?.map((scan, index) => {
              const totalIssues = scan.vulnerabilities?.length
              const criticalIssues = scan.vulnerabilities?.filter((v) => v.severity.toLowerCase() === "critical")?.length

              return (
                <div key={scan.id} className="relative pl-10">
                  <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">{getDomain(scan.website_link)}</p>
                      {criticalIssues > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {criticalIssues} Critical
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(scan.scanned_on, true)}</p>
                    <p className="text-sm">
                      Found {totalIssues} {totalIssues === 1 ? "issue" : "issues"}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-background to-background/95">
        <div className="min-h-screen bg-gray-50 flex">
          <DashboardSidebar />

          <div className="flex-1 ml-64">
            <DashboardHeader />

            <SidebarInset className="bg-background">
              <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/40 bg-background/95 px-6 backdrop-blur">
                <SidebarTrigger />
                <div className="flex-1">
                  <h1 className="text-xl font-semibold">Security Dashboard</h1>
                </div>
                <Button variant="outline" size="sm" onClick={fetchScans}>
                  Refresh Data
                </Button>
              </header>
              <main className="container mx-auto p-6">
                {isLoading ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {Array(4)
                      .fill(0)
                      ?.map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                      ))}
                  </div>
                ) : (
                  <>
                    <ScanSummaryCards />

                    <div className="mt-8 grid gap-6">
                      <Card className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <div>
                            <CardTitle>Vulnerability Trends</CardTitle>
                            <CardDescription>Distribution of vulnerabilities by severity over time</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <BarChart className="h-4 w-4" />
                              <span className="sr-only">Bar Chart</span>
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <LineChart className="h-4 w-4" />
                              <span className="sr-only">Line Chart</span>
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <VulnerabilityChart />
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-3">
                      <Card className="col-span-2">
                        <CardHeader>
                          <CardTitle>Website Vulnerabilities</CardTitle>
                          <CardDescription>Detailed breakdown of issues by website</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <WebsiteVulnerabilityTable />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Scans</CardTitle>
                          <CardDescription>Timeline of your latest security scans</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <RecentScansTimeline />
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </main>
            </SidebarInset>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
