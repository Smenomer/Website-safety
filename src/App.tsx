import { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Calendar, 
  Clock, 
  Building, 
  ShieldAlert, 
  TrendingUp, 
  Loader2, 
  ShieldCheck, 
  Lock, 
  Activity, 
  CheckCircle2, 
  Menu,
  X
} from 'lucide-react';
import { analyzeDomain, type AnalysisResult } from './mockData';

// Tiny custom SVG Sparkline chart component
function CustomSparkline({ data, status }: { data: { month: string; visits: number }[], status: 'success' | 'warning' | 'destructive' }) {
  if (!data || data.length === 0) return null;

  const width = 120;
  const height = 40;
  const padding = 2;

  const visits = data.map(d => d.visits);
  const min = Math.min(...visits);
  const max = Math.max(...visits);
  const range = max - min === 0 ? 1 : max - min;

  const points = data.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - ((d.visits - min) * (height - padding * 2)) / range;
    return { x, y };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  // Get color based on status
  let color = '#3b82f6'; // default blue
  let gradientId = 'grad-blue';
  if (status === 'success') {
    color = '#22c55e'; // green
    gradientId = 'grad-success';
  } else if (status === 'warning') {
    color = '#f59e0b'; // amber
    gradientId = 'grad-warning';
  } else if (status === 'destructive') {
    color = '#ef4444'; // red
    gradientId = 'grad-destructive';
  }

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path
        d={areaD}
        fill={`url(#${gradientId})`}
      />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="2"
          fill={color}
          className="opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        />
      ))}
    </svg>
  );
}

function App() {
  const [inputUrl, setInputUrl] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  
  // Set default state to null or a static demo initially
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  // Animated score dial state
  const [animatedScore, setAnimatedScore] = useState(0);

  const checkerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Handle smooth scroll helper
  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsSearching(true);
    setLoadingStep(0);
    setAnimatedScore(0);

    // Simulated multi-step secure analysis
    const stepIntervals = [350, 750, 1150];
    
    // Step 0 -> 1 -> 2
    stepIntervals.forEach((time, index) => {
      setTimeout(() => {
        setLoadingStep(index + 1);
        if (index === stepIntervals.length - 1) {
          // Final resolution
          const analysis = analyzeDomain(inputUrl);
          setResult(analysis);
          setIsSearching(false);
          // Scroll slightly down to results
          setTimeout(() => {
            if (resultsRef.current) {
              resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
      }, time);
    });
  };

  // Run dial animation when result changes
  useEffect(() => {
    if (result) {
      setAnimatedScore(0);
      const timer = setTimeout(() => {
        setAnimatedScore(result.trustScore);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [result]);

  // Load a demo domain on first mount for demo layout state
  useEffect(() => {
    // Set a static demo default result so results dashboard shows state initially
    const demoResult = analyzeDomain('wikipedia.org');
    setResult(demoResult);
  }, []);

  // Determine trust level status
  const getStatus = (score: number): 'success' | 'warning' | 'destructive' => {
    if (score >= 70) return 'success';
    if (score >= 40) return 'warning';
    return 'destructive';
  };

  const status = result ? getStatus(result.trustScore) : 'success';

  const getStatusColorClass = (stat: 'success' | 'warning' | 'destructive') => {
    switch (stat) {
      case 'success': return 'text-success stroke-success';
      case 'warning': return 'text-warning stroke-warning';
      case 'destructive': return 'text-destructive stroke-destructive';
    }
  };

  const getFlagEmoji = (code: string) => {
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char =>  127397 + char.charCodeAt(0));
    try {
      return String.fromCodePoint(...codePoints);
    } catch {
      return '🌐';
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      
      {/* 1. HERO & ABOVE THE FOLD WRAPPER */}
      <header className="relative w-full overflow-hidden flex flex-col min-h-screen">
        
        {/* Fullscreen Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-25 pointer-events-none"
          src="https://assets.mixkit.co/videos/preview/mixkit-blue-and-purple-futuristic-plexus-39744-large.mp4"
          poster="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23002233'/></svg>"
        />

        {/* Top Navbar */}
        <nav className="relative z-10 w-full px-6 sm:px-8 py-6 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span 
              className="text-3xl tracking-tight text-foreground select-none cursor-pointer"
              style={{ fontFamily: "'Instrument Serif', serif" }}
              onClick={() => setActiveTab('home')}
            >
              TrustLens<sup className="text-xs">®</sup>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { id: 'home', label: 'Home' },
              { id: 'how-it-works', label: 'How It Works' },
              { id: 'reports', label: 'Reports' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'contact', label: 'Contact' }
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(link.id);
                  if (link.id === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    const el = document.getElementById(link.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeTab === link.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              onClick={() => scrollToSection(checkerRef)}
              className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-all duration-300 shadow-md font-medium"
            >
              Check a URL
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground p-1 z-20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="absolute top-0 left-0 w-full h-screen bg-background/95 backdrop-blur-lg z-15 flex flex-col justify-center items-center gap-8 md:hidden">
            {[
              { id: 'home', label: 'Home' },
              { id: 'how-it-works', label: 'How It Works' },
              { id: 'reports', label: 'Reports' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'contact', label: 'Contact' }
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(link.id);
                  setIsMobileMenuOpen(false);
                  if (link.id === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    const el = document.getElementById(link.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`text-2xl font-normal transition-colors duration-200 ${
                  activeTab === link.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                style={{ fontFamily: link.id === 'home' ? "'Instrument Serif', serif" : 'inherit' }}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                scrollToSection(checkerRef);
              }}
              className="liquid-glass rounded-full px-8 py-3 text-base text-foreground mt-4"
            >
              Check a URL
            </button>
          </div>
        )}

        {/* Hero Content Section */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto -mt-16">
          <h1
            className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] font-normal text-foreground animate-fade-rise"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Know a website <br className="hidden sm:inline" />
            <em className="not-italic text-muted-foreground">before</em> it <em className="not-italic text-muted-foreground">knows you.</em>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay font-normal">
            Instantly check any domain's age, ownership, traffic, and trust score.
            See through the noise before you click, sign up, or pay.
          </p>

          <button
            onClick={() => scrollToSection(checkerRef)}
            className="liquid-glass rounded-full px-14 py-5 text-base text-foreground mt-12 hover:scale-[1.03] cursor-pointer transition-all duration-300 shadow-lg font-medium animate-fade-rise-delay-2"
          >
            Scan a Website
          </button>
        </div>
      </header>

      {/* 2. FUNCTIONAL PANELS & RESULTS (FLAT BACKGROUND BELOW FOLD) */}
      <main className="relative z-10 flex-1 bg-background pb-20">
        
        {/* Checker Input Wrapper */}
        <div 
          ref={checkerRef} 
          id="checker-section" 
          className="max-w-3xl mx-auto px-6 -mt-8 relative z-20 animate-fade-rise-delay-2"
        >
          <form 
            onSubmit={handleSearch}
            className="liquid-glass rounded-full flex items-center px-4 sm:px-6 py-4 gap-3 shadow-2xl"
          >
            <Globe className="text-muted-foreground flex-shrink-0" size={22} />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter a website URL (e.g. example.com)"
              className="bg-transparent text-foreground placeholder:text-muted-foreground/60 text-base flex-1 outline-none min-w-0"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="liquid-glass rounded-full px-6 py-2.5 text-sm font-medium text-foreground hover:scale-[1.03] active:scale-95 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSearching ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                </>
              )}
            </button>
          </form>

          <div className="text-xs text-muted-foreground mt-3 text-center tracking-wide">
            No signup required · Results in seconds
          </div>
        </div>

        {/* Loading / Analytical Sequence State */}
        {isSearching && (
          <div className="max-w-xl mx-auto px-6 mt-16 text-center animate-fade-rise">
            <div className="liquid-glass rounded-2xl p-8 border border-white/5 shadow-xl flex flex-col items-center gap-6">
              <Loader2 className="animate-spin text-muted-foreground" size={32} />
              
              <div className="space-y-2 h-14">
                {loadingStep >= 0 && (
                  <p className="text-sm font-medium transition-all duration-300">
                    {loadingStep === 0 && "Initiating deep package capture..."}
                    {loadingStep === 1 && "Checking DNS SEC, WHOIS registries & root routing..."}
                    {loadingStep === 2 && "Analyzing monthly click stream log records..."}
                    {loadingStep === 3 && "Finalizing safety signals summary..."}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Please keep this window open</p>
              </div>

              {/* Fake progress bar */}
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-foreground h-full transition-all duration-300 ease-out" 
                  style={{ width: `${(loadingStep / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Panel */}
        {!isSearching && result && (
          <div ref={resultsRef} className="mt-16 w-full animate-fade-rise">
            
            {/* Header info showing current domain queried */}
            <div className="max-w-6xl mx-auto px-6 mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs tracking-widest text-muted-foreground uppercase">Analysis Report</p>
                <h2 className="text-2xl sm:text-3xl font-semibold mt-1 tracking-tight flex items-center gap-2 font-body text-white">
                  <span>{result.domain}</span>
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                    status === 'success' ? 'bg-success' : status === 'warning' ? 'bg-warning' : 'bg-destructive'
                  }`} />
                </h2>
              </div>
              <div className="text-xs text-muted-foreground sm:text-right">
                Refreshed {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Live Database
              </div>
            </div>

            {/* Grid of Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto px-6">
              
              {/* Card 1: Trust Score */}
              <div 
                className="liquid-glass rounded-2xl p-6 flex flex-col justify-between shadow-lg animate-fade-rise"
                style={{ animationDelay: '0ms' }}
              >
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">Trust Rating</span>
                  <ShieldCheck size={18} className={getStatusColorClass(status)} />
                </div>
                
                {/* SVG Gauge */}
                <div className="relative flex justify-center items-center py-6">
                  <svg className="w-32 h-32 transform -rotate-90">
                    {/* Background Track Circle */}
                    <circle
                      cx="64"
                      cy="64"
                      r="48"
                      className="stroke-white/5"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    {/* Foreground Arc */}
                    <circle
                      cx="64"
                      cy="64"
                      r="48"
                      className={`transition-all duration-1000 ease-out ${
                        status === 'success' 
                          ? 'stroke-success' 
                          : status === 'warning' 
                          ? 'stroke-warning' 
                          : 'stroke-destructive'
                      }`}
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={301.6}
                      strokeDashoffset={301.6 - (301.6 * animatedScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Text at center */}
                  <div className="absolute flex flex-col justify-center items-center">
                    <span 
                      className="text-5xl font-normal leading-none"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {animatedScore}
                    </span>
                    <span className="text-[10px] text-muted-foreground tracking-widest uppercase mt-1">/100</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium">
                    {result.trustScore >= 70 ? 'Highly Secure' : result.trustScore >= 40 ? 'Moderate Risk' : 'High Threat Risk'}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Verified trust status protocol
                  </p>
                </div>
              </div>

              {/* Card 2: Domain Age */}
              <div 
                className="liquid-glass rounded-2xl p-6 flex flex-col justify-between shadow-lg animate-fade-rise"
                style={{ animationDelay: '150ms' }}
              >
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">Domain Lifespan</span>
                  <Clock size={18} />
                </div>

                <div className="py-6 flex flex-col justify-center">
                  <span 
                    className="text-4xl sm:text-5xl font-normal tracking-tight text-white leading-tight"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {result.domainAge}
                  </span>
                  <span className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                    <Calendar size={13} className="text-muted-foreground/70" />
                    {result.registeredDate}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {result.trustScore < 30 ? 'New / Temporary Site' : 'Established Domain'}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Longer lifespan indicates structural safety
                  </p>
                </div>
              </div>

              {/* Card 3: Ownership */}
              <div 
                className="liquid-glass rounded-2xl p-6 flex flex-col justify-between shadow-lg animate-fade-rise"
                style={{ animationDelay: '300ms' }}
              >
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">Ownership</span>
                  <Building size={18} />
                </div>

                <div className="py-6 flex flex-col justify-center">
                  <span 
                    className="text-2xl font-medium tracking-tight text-white truncate"
                    title={result.registrant}
                  >
                    {result.registrant}
                  </span>
                  <span className="text-xs text-muted-foreground mt-2 truncate">
                    Registrar: {result.registrar}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <span>Origin:</span>
                    <span>{getFlagEmoji(result.countryCode)}</span>
                    <span className="font-medium text-white/80">{result.countryName}</span>
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {result.registrant === 'Privacy Protected' ? 'Masked WHOIS Registry' : 'Corporate Entity'}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Public registry documentation integrity
                  </p>
                </div>
              </div>

              {/* Card 4: Traffic Estimate */}
              <div 
                className="liquid-glass rounded-2xl p-6 flex flex-col justify-between shadow-lg animate-fade-rise"
                style={{ animationDelay: '450ms' }}
              >
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">Traffic Index</span>
                  <TrendingUp size={18} />
                </div>

                <div className="py-6 flex flex-col justify-center gap-3">
                  <div>
                    <span 
                      className="text-4xl sm:text-5xl font-normal text-white leading-tight"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {result.monthlyVisits}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase ml-1.5">visits / mo</span>
                  </div>

                  {/* SVG Sparkline */}
                  <div className="h-10 w-full flex items-center">
                    <CustomSparkline data={result.trafficTrend} status={status} />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {result.trustScore < 30 ? 'Near-Zero Traffic' : 'Stable Traffic Flow'}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Verified click logs from global streams
                  </p>
                </div>
              </div>

            </div>

            {/* Additional Signals Row */}
            <div 
              className="max-w-6xl mx-auto px-6 mt-6 animate-fade-rise"
              style={{ animationDelay: '600ms' }}
            >
              <div className="liquid-glass rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-white/5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Activity size={14} />
                  Security Protocols
                </span>
                
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                  {result.signals.map((sig, idx) => (
                    <div 
                      key={idx}
                      className="liquid-glass rounded-full px-4 py-2 text-xs flex items-center gap-2 border border-white/5 bg-white/[0.005]"
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        sig.status === 'success' ? 'bg-success' : sig.status === 'warning' ? 'bg-warning' : 'bg-destructive'
                      }`} />
                      <span className="font-medium text-white/90">{sig.name}:</span>
                      <span className="text-muted-foreground">{sig.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 3. HOW IT WORKS SECTION (Premium visual addition) */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-6 mt-32 pt-10 border-t border-white/5">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 
              className="text-4xl text-white font-normal" 
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Real-time site reputation scoring.
            </h2>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              TrustLens aggregates active domain records, DNS routing history, network firewalls, and traffic indices to safeguard your connection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Lock className="text-muted-foreground" size={24} />,
                title: "SSL Cryptography",
                desc: "We analyze TLS handshakes and authority seals. Self-signed, expired, or hyper-young certificate issues are flagged instantly."
              },
              {
                icon: <Activity className="text-muted-foreground" size={24} />,
                title: "Global Traffic Spark",
                desc: "Through global telemetry feeds, we query organic monthly visits. High discrepancy in site volume vs. age highlights potential clones."
              },
              {
                icon: <ShieldAlert className="text-muted-foreground" size={24} />,
                title: "Malware & Phishing Shields",
                desc: "We verify the domain against 68 active threat databases, analyzing blacklists, malicious script assets, and bad domain patterns."
              }
            ].map((feature, i) => (
              <div key={i} className="liquid-glass rounded-2xl p-6 border border-white/5 hover:bg-white/[0.015] transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. REPORTS SECTION */}
        <section id="reports" className="max-w-6xl mx-auto px-6 mt-32">
          <div className="liquid-glass rounded-3xl p-8 sm:p-12 border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Bulk Queries</span>
              <h2 className="text-4xl text-white font-normal mt-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Enterprise threat feeds and CSV reporting API.
              </h2>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                Connect your workspace directly to the TrustLens DNS intelligence engine. Download domain metadata, threat indexes, registry ownerships, and SSL timelines.
              </p>
            </div>
            <button
              onClick={() => scrollToSection(checkerRef)}
              className="liquid-glass rounded-full px-8 py-3.5 text-sm font-medium text-foreground hover:scale-[1.03] transition-all duration-300 flex items-center gap-2 whitespace-nowrap self-start md:self-center"
            >
              Request Access
            </button>
          </div>
        </section>

        {/* 5. PRICING SECTION */}
        <section id="pricing" className="max-w-6xl mx-auto px-6 mt-32">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-4xl text-white font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Clean plans for secure routing.
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Start searching instantly. Upgrade for automated alert streams and high-volume limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                tier: "Informational",
                price: "$0",
                desc: "For rapid checking and personal security checks.",
                features: ["Uncapped search logs", "Deterministic DNS metrics", "Standard loading charts", "SSL analysis summary"]
              },
              {
                tier: "Pro Safeguard",
                price: "$19",
                desc: "For security practitioners and tech professionals.",
                features: ["5,000 queries per month", "Bulk CSV analysis download", "Priority DNS resolution queue", "E-mail alerts on watchlisted domains", "Active API credentials"]
              },
              {
                tier: "Autonomous API",
                price: "$99",
                desc: "For automated firewalls and proxy integrations.",
                features: ["Unlimited search logs", "Under 100ms API latency response", "Direct WHOIS scrapers", "Daily threat list export", "Dedicated dashboard nodes"]
              }
            ].map((plan, i) => (
              <div 
                key={i} 
                className={`liquid-glass rounded-2xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                  i === 1 ? 'border-white/20 bg-white/[0.02]' : 'border-white/5'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-white/80">{plan.tier}</span>
                    {i === 1 && (
                      <span className="text-[10px] bg-white text-background rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-semibold text-white">{plan.price}</span>
                    <span className="text-muted-foreground text-xs ml-1">/mo</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{plan.desc}</p>
                  
                  <div className="w-full bg-white/5 h-[1px] my-6" />

                  <ul className="space-y-3">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-white/40 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="liquid-glass rounded-full w-full py-2.5 text-xs text-foreground mt-8 hover:scale-[1.02] active:scale-95 transition-all duration-200">
                  Select {plan.tier}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CONTACT SECTION */}
        <section id="contact" className="max-w-xl mx-auto px-6 mt-32 text-center">
          <h2 className="text-3xl text-white font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Reach the TrustLens Labs team.
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Report malicious domains, false-positive scores, or inquire about custom platform licensing.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully! Our security lab will review your request.'); }} className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Name"
                className="liquid-glass rounded-xl px-4 py-3 bg-white/[0.005] border border-white/5 outline-none placeholder:text-muted-foreground/60 text-sm w-full"
              />
              <input
                type="email"
                required
                placeholder="Email"
                className="liquid-glass rounded-xl px-4 py-3 bg-white/[0.005] border border-white/5 outline-none placeholder:text-muted-foreground/60 text-sm w-full"
              />
            </div>
            <textarea
              required
              rows={4}
              placeholder="Your inquiry or safety report..."
              className="liquid-glass rounded-xl px-4 py-3 bg-white/[0.005] border border-white/5 outline-none placeholder:text-muted-foreground/60 text-sm w-full resize-none"
            />
            <button
              type="submit"
              className="liquid-glass rounded-full px-8 py-3 text-xs text-foreground hover:scale-[1.02] transition-transform w-full"
            >
              Send Message
            </button>
          </form>
        </section>

        {/* Footer */}
        <footer className="text-center text-[11px] text-muted-foreground/60 mt-32 px-6 max-w-2xl mx-auto leading-relaxed">
          <p className="mb-2">
            TrustLens® aggregates public WHOIS, traffic, and reputation data. Results are informational and not a guarantee of safety.
          </p>
          <p>© {new Date().getFullYear()} TrustLens Technologies. All rights reserved.</p>
        </footer>

      </main>
    </div>
  );
}

export default App;
