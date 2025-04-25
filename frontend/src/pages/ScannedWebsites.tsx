"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/DashboardHeader"
import DashboardSidebar from "@/components/DashboardSidebar"
import { ArrowLeft, Calendar, CheckCircle, ChevronRight, ExternalLink, Globe, Shield, ShieldAlert, ShieldCheck, XCircle } from 'lucide-react'
import Cookies from "js-cookie"

const ScannedWebsitesPage = () => {
    const [scans, setScans] = useState([])
    const [selectedScan, setSelectedScan] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
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
                console.log(json)
                setScans(json?.scans || [])
            } catch (err) {
                console.error("Failed to fetch scans:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchScans()
    }, [])

    const formatDate = (isoDate) => {
        try {
            const date = new Date(isoDate)
            return new Intl.DateTimeFormat('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }).format(date)
        } catch {
            return isoDate
        }
    }

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical':
                return 'bg-red-500/10 text-red-700 border-red-200'
            case 'high':
                return 'bg-orange-500/10 text-orange-700 border-orange-200'
            case 'medium':
                return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
            case 'low':
                return 'bg-green-500/10 text-green-700 border-green-200'
            default:
                return 'bg-blue-500/10 text-blue-700 border-blue-200'
        }
    }

    const getSeverityIcon = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical':
                return <ShieldAlert className="w-5 h-5 text-red-500" />
            case 'high':
                return <ShieldAlert className="w-5 h-5 text-orange-500" />
            case 'medium':
                return <Shield className="w-5 h-5 text-yellow-500" />
            case 'low':
                return <ShieldCheck className="w-5 h-5 text-green-500" />
            default:
                return <Shield className="w-5 h-5 text-blue-500" />
        }
    }

    const getHostname = (url) => {
        try {
            return new URL(url).hostname.replace("www.", "")
        } catch {
            return url
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-background/95 flex">
            <DashboardSidebar />
            <div className="flex-1 ml-64 overflow-auto max-h-screen">
                <DashboardHeader />
                <main className="px-6 py-6 container mx-auto max-w-7xl">
                    <AnimatePresence mode="wait">
                        {selectedScan ? (
                            <motion.div
                                key="scan-details"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <Button
                                        variant="ghost"
                                        className="group flex items-center gap-2"
                                        onClick={() => setSelectedScan(null)}
                                    >
                                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                        <span>Back to scans</span>
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="flex items-center gap-1 px-3 py-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {formatDate(selectedScan.scanned_on)}
                                        </Badge>

                                        <Badge
                                            variant={selectedScan.scan_complete ? "default" : "destructive"}
                                            className="flex items-center gap-1 px-3 py-1.5"
                                        >
                                            {selectedScan.scan_complete ?
                                                <><CheckCircle className="w-3.5 h-3.5" /> Complete</> :
                                                <><XCircle className="w-3.5 h-3.5" /> Incomplete</>
                                            }
                                        </Badge>
                                    </div>
                                </div>

                                <Card className="mb-6 overflow-hidden border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                                    <CardHeader className="bg-muted/30 border-b">
                                        <CardTitle className="flex items-center gap-2">
                                            <Globe className="w-5 h-5 text-primary" />
                                            <a
                                                href={selectedScan.website_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-primary transition-colors flex items-center gap-1"
                                            >
                                                {getHostname(selectedScan.website_link)}
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </CardTitle>
                                    </CardHeader>
                                </Card>

                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <Shield className="w-6 h-6 text-primary" />
                                    Vulnerability Report
                                </h2>

                                {selectedScan.vulnerabilities && selectedScan.vulnerabilities.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {selectedScan.vulnerabilities.map((vuln, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                            >
                                                <Card className="h-full overflow-hidden hover:shadow-md transition-all border bg-card/80 backdrop-blur-sm">
                                                    <CardHeader className={`pb-2 ${getSeverityColor(vuln.severity)}`}>
                                                        <div className="flex justify-between items-start gap-2">
                                                            <CardTitle className="text-lg font-bold line-clamp-2">
                                                                {vuln.name || "Unnamed Vulnerability"}
                                                            </CardTitle>
                                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                                {getSeverityIcon(vuln.severity)}
                                                                <span className="capitalize">{vuln.severity || "Unknown"}</span>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="pt-4 pb-2">
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-sm text-muted-foreground mb-1.5">
                                                                    {vuln.description || "No description provided."}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-sm font-semibold mb-1">Leaked Value:</h4>
                                                                {(() => {
                                                                    const val = vuln.leaked_value;

                                                                    if (!val || val === "null") {
                                                                        return <span className="text-muted-foreground italic text-sm">None</span>;
                                                                    }

                                                                    if (typeof val === "string") {
                                                                        const isUrl = /^https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=]+$/.test(val);
                                                                        return isUrl ? (
                                                                            <a
                                                                                className="text-primary underline break-all text-sm"
                                                                                href={val}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                            >
                                                                                {val}
                                                                            </a>
                                                                        ) : (
                                                                            <div className="bg-muted/50 p-2 rounded text-sm font-mono overflow-auto max-h-20">
                                                                                {val}
                                                                            </div>
                                                                        );
                                                                    }

                                                                    return (
                                                                        <pre className="bg-muted/50 rounded p-2 overflow-auto max-h-20 text-xs">
                                                                            {JSON.stringify(val, null, 2)}
                                                                        </pre>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="border-t bg-muted/20 flex flex-col items-start pt-3">
                                                        <h4 className="text-sm font-semibold mb-1">Recommendation:</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {vuln.recommendation || "No recommendation provided."}
                                                        </p>
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="p-12 text-center bg-card/80 backdrop-blur-sm">
                                        <div className="flex flex-col items-center gap-3">
                                            <ShieldCheck className="w-16 h-16 text-green-500 opacity-80" />
                                            <h3 className="text-xl font-medium">No vulnerabilities detected</h3>
                                            <p className="text-muted-foreground max-w-md mx-auto">
                                                Great news! Our scan didn't detect any vulnerabilities for this website.
                                            </p>
                                        </div>
                                    </Card>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="scan-list"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h1 className="text-3xl font-extrabold flex items-center gap-2">
                                        <Shield className="w-8 h-8 text-primary" />
                                        Previously Scanned Websites
                                    </h1>
                                </div>

                                {isLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[...Array(6)].map((_, i) => (
                                            <Card key={i} className="overflow-hidden">
                                                <CardHeader className="pb-2">
                                                    <Skeleton className="h-6 w-3/4" />
                                                </CardHeader>
                                                <CardContent className="pb-2 pt-4">
                                                    <Skeleton className="h-4 w-1/2 mb-2" />
                                                    <Skeleton className="h-4 w-1/3" />
                                                </CardContent>
                                                <CardFooter className="border-t pt-3">
                                                    <Skeleton className="h-5 w-1/4" />
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                ) : scans.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {scans.map((scan, index) => (
                                            <motion.div
                                                key={scan.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                            >
                                                <Card
                                                    className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 border bg-card/80 backdrop-blur-sm"
                                                    onClick={() => setSelectedScan({ ...scan, vulnerabilities: scan.vulnerabilities })}
                                                >
                                                    <CardHeader className="pb-2 border-b bg-muted/30">
                                                        <CardTitle className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 truncate">
                                                                <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                                                                <span className="truncate">{getHostname(scan.website_link)}</span>
                                                            </div>
                                                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="pt-4 pb-2">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>Scanned on: {formatDate(scan.scanned_on)}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant={scan.scan_complete ? "outline" : "destructive"}
                                                                className="flex items-center gap-1"
                                                            >
                                                                {scan.scan_complete ?
                                                                    <><CheckCircle className="w-3.5 h-3.5" /> Complete</> :
                                                                    <><XCircle className="w-3.5 h-3.5" /> Incomplete</>
                                                                }
                                                            </Badge>

                                                            {scan.vulnerabilities && scan.vulnerabilities.length > 0 && (
                                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                                    <ShieldAlert className="w-3.5 h-3.5" />
                                                                    {scan.vulnerabilities.length} {scan.vulnerabilities.length === 1 ? 'issue' : 'issues'}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="border-t pt-3 bg-muted/20">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
                                                        >
                                                            View details
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="p-12 text-center bg-card/80 backdrop-blur-sm">
                                        <div className="flex flex-col items-center gap-3">
                                            <Shield className="w-16 h-16 text-muted-foreground opacity-50" />
                                            <h3 className="text-xl font-medium">No scans found</h3>
                                            <p className="text-muted-foreground max-w-md mx-auto">
                                                You haven't scanned any websites yet. Start by scanning a website to see results here.
                                            </p>
                                            <Button className="mt-2">Scan a Website</Button>
                                        </div>
                                    </Card>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}

export default ScannedWebsitesPage
