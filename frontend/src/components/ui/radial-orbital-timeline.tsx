import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {};
      Object.keys(prev).forEach((k) => { newState[parseInt(k)] = false; });
      newState[id] = !prev[id];
      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const related = timelineData.find((i) => i.id === id)?.relatedIds ?? [];
        const pulse: Record<number, boolean> = {};
        related.forEach((r) => { pulse[r] = true; });
        setPulseEffect(pulse);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  useEffect(() => {
    if (!autoRotate) return;
    const id = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(id);
  }, [autoRotate]);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;
    return {
      x: radius * Math.cos(radian),
      y: radius * Math.sin(radian),
      zIndex: Math.round(100 + 50 * Math.cos(radian)),
      opacity: Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))),
    };
  };

  const isRelatedToActive = (itemId: number) => {
    if (!activeNodeId) return false;
    return timelineData.find((i) => i.id === activeNodeId)?.relatedIds.includes(itemId) ?? false;
  };

  const getStatusStyles = (status: TimelineItem["status"]) => {
    if (status === "completed") return "text-white bg-black border-white";
    if (status === "in-progress") return "text-black bg-white border-black";
    return "text-white bg-black/40 border-white/50";
  };

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          {/* Center orb */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-20 h-20 rounded-full border border-orange-300/20 animate-ping opacity-70" />
            <div className="absolute w-24 h-24 rounded-full border border-orange-300/10 animate-ping opacity-50" style={{ animationDelay: "0.5s" }} />
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md" />
          </div>

          {/* Orbit ring */}
          <div className="absolute w-96 h-96 rounded-full border border-white/10" />

          {timelineData.map((item, index) => {
            const pos = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                  zIndex: isExpanded ? 200 : pos.zIndex,
                  opacity: isExpanded ? 1 : pos.opacity,
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {/* Glow */}
                <div
                  className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse" : ""}`}
                  style={{
                    background: "radial-gradient(circle, rgba(255,165,0,0.15) 0%, rgba(255,165,0,0) 70%)",
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                />

                {/* Node icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 transform
                  ${isExpanded ? "bg-orange-500 text-black border-orange-400 scale-150 shadow-lg shadow-orange-500/30"
                    : isRelated ? "bg-orange-500/20 text-orange-300 border-orange-400 animate-pulse"
                    : "bg-black text-white/70 border-white/30 hover:border-orange-500/50"}`}
                >
                  <Icon size={16} />
                </div>

                {/* Label */}
                <div className={`absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300
                  ${isExpanded ? "text-orange-300 scale-125" : "text-white/60"}`}>
                  {item.title}
                </div>

                {/* Expanded card */}
                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-72 bg-black/95 backdrop-blur-lg border-orange-500/20 shadow-xl shadow-orange-500/10">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-orange-500/50" />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
                          {item.status === "completed" ? "ACTIVE" : item.status === "in-progress" ? "IN PROGRESS" : "PENDING"}
                        </Badge>
                        <span className="text-xs font-mono text-white/40">{item.date}</span>
                      </div>
                      <CardTitle className="text-sm mt-2 text-white">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-white/70">
                      <p>{item.content}</p>
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center text-white/50"><Zap size={10} className="mr-1" />Activity</span>
                          <span className="font-mono text-orange-400">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500" style={{ width: `${item.energy}%` }} />
                        </div>
                      </div>
                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center mb-2">
                            <Link size={10} className="text-white/40 mr-1" />
                            <h4 className="text-xs uppercase tracking-wider text-white/40">Connects to</h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relId) => {
                              const rel = timelineData.find((i) => i.id === relId);
                              return (
                                <Button
                                  key={relId}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 py-0 text-xs rounded-none border-orange-500/20 bg-transparent hover:bg-orange-500/10 text-orange-300 hover:text-orange-200 transition-all"
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relId); }}
                                >
                                  {rel?.title}
                                  <ArrowRight size={8} className="ml-1" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
