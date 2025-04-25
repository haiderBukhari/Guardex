import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CloudCog, Globe, Trash2 } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardSidebar from "@/components/DashboardSidebar";
import ScanningCard from "@/components/scanning/ScanningCard";
import StatusBox from "@/components/scanning/StatusBox";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

const socket: Socket = io("https://vulnerabledetector-cefdd82d0105.herokuapp.com/");

const WebsiteScanDashboard = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [website, setWebsite] = useState(null);
  const { toast } = useToast();
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    socket.on("scan_update", (data) => {
      const message = data?.message;
      if (!message) return;

      setWebsite((prev) =>
        prev?.isScanning
          ? {
            ...prev,
            messages: [...(prev.messages || []), message],
            status: message,
          }
          : prev
      );
    });

    socket.on("scan_complete", (result) => {
      setWebsite((prev) => {
        if (!prev || !prev.isScanning) return prev;
        if (intervalRef.current) clearInterval(intervalRef.current);
        return {
          ...prev,
          isScanning: false,
          progress: 100,
          scanComplete: true,
          status: "Scan complete",
          fullResult: result,
          messages: [...(prev.messages || []), "Scan completed"],
        };
      });
    });

    return () => {
      socket.off("scan_update");
      socket.off("scan_complete");
    };
  }, []);

  const extractDomainName = (url: string): string => {
    try {
      if (!url.startsWith("http")) url = "https://" + url;
      const domain = new URL(url).hostname;
      return domain.replace("www.", "");
    } catch {
      return url;
    }
  };

  const addWebsite = () => {
    if (!inputUrl.trim()) {
      toast({ title: "Please enter a URL", variant: "destructive" });
      return;
    }

    if (website) {
      toast({
        title: "Only one website allowed",
        description: "Remove the current one to add a new one.",
        variant: "destructive",
      });
      return;
    }

    const domainName = extractDomainName(inputUrl);

    const newWebsite = {
      id: Date.now().toString(),
      url: inputUrl,
      name: domainName,
      isScanning: false,
      dateAdded: new Date(),
      progress: 0,
      status: "",
      scanComplete: false,
      currentStatusIndex: 0,
      messages: [],
    };

    setWebsite(newWebsite);
    setInputUrl("");
    toast({ title: "Website added", description: `${domainName} added to dashboard.` });
  };

  const startScanning = () => {
    if (!website || website.isScanning) return;

    const userData = Cookies.get("guardex_user");

    if (!userData) {
      toast({ title: "Unauthorized", description: "User not logged in", variant: "destructive" });
      return;
    }

    const userId = JSON.parse(userData)

    setWebsite((prev) => ({
      ...prev,
      isScanning: true,
      progress: 0,
      status: "🔍 Starting scan...",
      scanComplete: false,
      messages: [],
    }));

    toast({ title: `Scanning ${website.name}`, description: "Scan started." });
    socket.emit("start_scan", { id: website.id, url: website.url, user_id: userId.id });

    intervalRef.current = setInterval(() => {
      setWebsite((prev) => {
        if (!prev || !prev.isScanning) return prev;

        let progress = prev.progress;
        if (progress < 99) progress += 1;
        return { ...prev, progress };
      });
    }, 1200);
  };

  const removeWebsite = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (website) {
      toast({ title: "Website removed", description: `${website.name} removed.` });
      setWebsite(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 ml-64 overflow-auto max-h-screen">
        <DashboardHeader />

        <main className="px-6 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold mb-2">🔍 Scan a New Website</h1>
            <p className="text-muted-foreground mb-6 max-w-2xl">
              Guardex lets you scan one website at a time for security issues like exposed APIs, secrets, or JS vulnerabilities.
            </p>

            {!website && (
              <div className="flex gap-3 max-w-xl">
                <Input
                  type="text"
                  placeholder="Enter website URL (e.g., example.com)"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="flex-1 bg-background/50 focus:ring-guardex-400"
                  onKeyDown={(e) => e.key === "Enter" && addWebsite()}
                />
                <Button onClick={addWebsite} className="glow-sm">
                  Add
                </Button>
              </div>
            )}
          </div>

          {!website ? (
            <div className="glass-effect p-12 text-center">
              <Globe className="mx-auto h-12 w-12 text-guardex-400 mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No website added</h3>
              <p className="text-muted-foreground">Add a website to begin vulnerability scanning</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 w-full">
              <div className="flex flex-col md:flex-row gap-6 group h-[350px] w-full">
                <div className="md:w-1/3 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 z-10"
                    onClick={removeWebsite}
                    disabled={website.isScanning}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>

                  <ScanningCard
                    id={website.id}
                    name={website.name}
                    url={website.url}
                    dateAdded={website.dateAdded}
                    isScanning={website.isScanning}
                    progress={website.progress}
                    scanComplete={website.scanComplete}
                    vulnerabilities={website.vulnerabilities}
                    onStartScan={() => startScanning()}
                  />
                </div>

                <div className="md:w-2/3">
                  <StatusBox
                    isScanning={website.isScanning}
                    messages={website.messages.map((text) => ({ text, type: "info" }))}
                    currentIndex={website.messages.length - 1}
                  />
                </div>
              </div>

              {website.fullResult && (
                <div className="bg-background border mt-4 p-4 rounded text-xs">
                  <h4 className="font-semibold mb-2">🧠 Scan Results:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {website.fullResult.map((vuln, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="max-h-20 overflow-auto text-lg font-semibold break-words whitespace-pre-wrap mb-1">
                          {vuln.name || "Unnamed Vulnerability"}
                        </div>

                        <div className="max-h-40 overflow-auto text-sm text-gray-700 break-words whitespace-pre-wrap mb-2">
                          {vuln.description || "No description provided."}
                        </div>
                        <div className="text-sm mb-1 break-words whitespace-pre-wrap">
                          <strong>Leaked Value:</strong>{" "}
                          {(() => {
                            const val = vuln.leaked_value;

                            if (!val || val === "null") {
                              return <span className="text-gray-500 italic">None</span>;
                            }

                            if (typeof val === "string") {
                              // Check if it's a valid URL
                              const isUrl = /^https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=]+$/.test(val);
                              return isUrl ? (
                                <a
                                  className="text-blue-500 underline break-all"
                                  href={val}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {val}
                                </a>
                              ) : (
                                <span className="break-words">{val}</span>
                              );
                            }

                            return (
                              <pre className="bg-gray-50 border rounded p-2 overflow-auto max-h-40 text-xs text-gray-700">
                                {JSON.stringify(val, null, 2)}
                              </pre>
                            );
                          })()}
                        </div>
                        <div className="text-sm">
                          <strong>Recommendation:</strong> {vuln.recommendation}
                        </div>
                        <div className={`mt-1 text-sm font-medium ${vuln.severity === 'critical' ? 'text-red-500' : vuln.severity === 'high' ? 'text-orange-500' : 'text-green-500'}`}>
                          Severity: {vuln.severity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WebsiteScanDashboard;