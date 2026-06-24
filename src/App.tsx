import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { servers, type Server as ServerType } from './data/servers';
import {
  ShieldIcon, ServerIcon, UserIcon, LifebuoyIcon, GlobeIcon,
  SearchIcon, ZapIcon, LockIcon, ActivityIcon, ChevronDownIcon,
  XIcon, CheckIcon, MessageCircleIcon, BookIcon, SettingsIcon,
  WifiIcon, MailIcon, PhoneIcon, ArrowRightIcon
} from './components/Icons';

type Tab = 'home' | 'servers' | 'profile' | 'support';
type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

/* ──────────── Connection Modal ──────────── */
function ConnectionModal({
  server, state, progress, onClose, onDisconnect
}: {
  server: ServerType; state: ConnectionState; progress: number;
  onClose: () => void; onDisconnect: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#1a1028] to-[#0f0a18] border border-purple-500/30 shadow-2xl shadow-purple-900/50 p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-600/15 rounded-full blur-3xl" />

        <button onClick={onClose} className="absolute top-4 right-4 text-purple-400 hover:text-white transition-colors">
          <XIcon size={20} />
        </button>

        <div className="relative z-10 flex flex-col items-center">
          {/* Server flag & name */}
          <div className="text-6xl mb-3">{server.flag}</div>
          <h3 className="text-xl font-bold text-white">{server.name}</h3>
          <p className="text-purple-400 text-sm mb-6">{server.country} • {server.city}</p>

          {state === 'connecting' && (
            <div className="w-full">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
                <div>
                  <p className="text-white font-medium">Connecting...</p>
                  <p className="text-purple-400 text-xs">{Math.round(progress)}%</p>
                </div>
              </div>
              <div className="w-full h-2 bg-[#1a1028] rounded-full overflow-hidden border border-purple-500/20">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 via-violet-500 to-purple-400 rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-purple-500">
                <span>Resolving DNS...</span>
                <span>{server.ping}ms</span>
              </div>
            </div>
          )}

          {state === 'connected' && (
            <div className="w-full text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <CheckIcon size={32} className="text-green-400" />
              </div>
              <p className="text-green-400 font-bold text-lg mb-1">Connected!</p>
              <p className="text-purple-400 text-sm mb-4">Your IP is now protected</p>
              <button
                onClick={onDisconnect}
                className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all font-medium"
              >
                Disconnect
              </button>
            </div>
          )}

          {state === 'error' && (
            <div className="w-full text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mx-auto mb-4">
                <XIcon size={32} className="text-red-400" />
              </div>
              <p className="text-red-400 font-bold text-lg mb-1">Connection Failed</p>
              <p className="text-purple-400 text-sm mb-4">Unable to connect to server. Try again.</p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition-all text-white font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────── Server Card ──────────── */
function ServerCard({ server, onConnect, isConnected }: { server: ServerType; onConnect: () => void; isConnected: boolean }) {
  return (
    <button
      onClick={onConnect}
      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 group ${
        isConnected
          ? 'bg-green-500/15 border border-green-500/40 shadow-lg shadow-green-500/10'
          : 'bg-[#16102a] border border-purple-500/10 hover:border-purple-500/40 hover:bg-[#1d1538] hover:shadow-lg hover:shadow-purple-500/10'
      }`}
    >
      <span className="text-2xl flex-shrink-0">{server.flag}</span>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium truncate">{server.name}</span>
          {isConnected && (
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          )}
        </div>
        <p className="text-purple-400 text-xs">{server.country}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1 text-xs text-purple-400">
          <ActivityIcon size={12} />
          <span>{server.ping}ms</span>
        </div>
        <div className="w-16 h-1.5 bg-[#0f0a1a] rounded-full mt-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              server.capacity > 75 ? 'bg-red-500' : server.capacity > 45 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${server.capacity}%` }}
          />
        </div>
      </div>
    </button>
  );
}

/* ──────────── HOME TAB ──────────── */
function HomeTab({
  connectedServer, connectionState, onConnectBest
}: {
  connectedServer: ServerType | null;
  connectionState: ConnectionState;
  onConnectBest: () => void;
}) {
  const bestServer = useMemo(() => servers.reduce((a: ServerType, b: ServerType) => a.ping < b.ping ? a : b), [servers]);
  const isConnecting = connectionState === 'connecting';
  const isConnected = connectionState === 'connected';

  return (
    <div className="px-5 pb-28 pt-6">
      {/* Hero connection card */}
      <div className="relative rounded-3xl overflow-hidden mb-6">
        <div className="bg-gradient-to-br from-purple-600/40 via-violet-700/40 to-indigo-800/40 border border-purple-500/30 p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <ShieldIcon size={18} className="text-purple-300" />
              <span className="text-purple-300 text-sm font-medium">
                {isConnected ? 'Protected' : isConnecting ? 'Connecting...' : 'Not Protected'}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">
              {isConnected ? connectedServer?.flag || '' : isConnecting ? '🔗' : '🛡️'}
            </h2>
            <p className="text-white/80 text-lg font-medium mb-4">
              {isConnected
                ? `Connected to ${connectedServer?.name}`
                : isConnecting
                ? 'Establishing secure tunnel'
                : 'Tap to connect'}
            </p>

            {!isConnected && !isConnecting && (
              <button
                onClick={onConnectBest}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-lg transition-all shadow-lg shadow-purple-600/30 hover:shadow-purple-500/40 active:scale-[0.98]"
              >
                Connect to {bestServer.city} {bestServer.flag}
              </button>
            )}

            {isConnecting && (
              <div className="w-full py-4 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                <span className="text-purple-300 font-medium">Securing your connection...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#16102a] border border-purple-500/10 rounded-2xl p-3 text-center">
          <WifiIcon size={20} className="text-purple-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{isConnected ? '256' : '0'}</p>
          <p className="text-purple-500 text-xs">Mbps</p>
        </div>
        <div className="bg-[#16102a] border border-purple-500/10 rounded-2xl p-3 text-center">
          <LockIcon size={20} className="text-purple-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">AES-256</p>
          <p className="text-purple-500 text-xs">Encryption</p>
        </div>
        <div className="bg-[#16102a] border border-purple-500/10 rounded-2xl p-3 text-center">
          <ZapIcon size={20} className="text-purple-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{isConnected ? connectedServer?.ping || '--' : '--'}</p>
          <p className="text-purple-500 text-xs">Ping (ms)</p>
        </div>
      </div>

      {/* Features */}
      <h3 className="text-white font-bold text-lg mb-3">Features</h3>
      <div className="space-y-3">
        {[
          { icon: <ShieldIcon size={20} />, title: 'Kill Switch', desc: 'Auto-disconnect if VPN drops', color: 'text-green-400' },
          { icon: <GlobeIcon size={20} />, title: '170+ Servers', desc: 'Across 20+ countries', color: 'text-blue-400' },
          { icon: <LockIcon size={20} />, title: 'No Logs', desc: 'Your data stays yours', color: 'text-purple-400' },
          { icon: <ZapIcon size={20} />, title: 'Lightning Fast', desc: 'Up to 10Gbps speeds', color: 'text-yellow-400' },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-4 bg-[#16102a] border border-purple-500/10 rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center ${f.color}`}>
              {f.icon}
            </div>
            <div>
              <p className="text-white font-medium">{f.title}</p>
              <p className="text-purple-400 text-sm">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────── SERVERS TAB ──────────── */
function ServersTab({
  onConnect, connectedServer, connectionState
}: {
  onConnect: (s: ServerType) => void;
  connectedServer: ServerType | null;
  connectionState: ConnectionState;
}) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'ping' | 'name' | 'country'>('ping');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = useMemo(() => {
    let result = servers.filter((s: ServerType) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.country.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
    );
    result.sort((a: ServerType, b: ServerType) => {
      if (sortBy === 'ping') return a.ping - b.ping;
      if (sortBy === 'country') return a.country.localeCompare(b.country);
      return a.name.localeCompare(b.name);
    });
    return result;
  }, [search, sortBy]);

  return (
    <div className="px-5 pb-28 pt-6">
      {/* Search & Sort */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <SearchIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search servers..."
            className="w-full bg-[#16102a] border border-purple-500/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="bg-[#16102a] border border-purple-500/20 rounded-xl px-3 py-3 text-purple-400 hover:border-purple-500/50 transition-colors"
          >
            <ChevronDownIcon size={18} />
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-[#1a1028] border border-purple-500/30 rounded-xl shadow-xl shadow-purple-900/50 overflow-hidden z-30">
              {(['ping', 'name', 'country'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => { setSortBy(s); setShowSortDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    sortBy === s ? 'bg-purple-600/30 text-white' : 'text-purple-400 hover:bg-purple-500/10'
                  }`}
                >
                  {s === 'ping' ? '⚡ Lowest Ping' : s === 'name' ? '🔤 By Name' : '🌍 By Country'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-purple-400 text-sm">{filtered.length} servers</p>
        {connectedServer && connectionState === 'connected' && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs">{connectedServer.name}</span>
          </div>
        )}
      </div>

      {/* Server list */}
      <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 scrollbar-thin">
        {filtered.map((s: ServerType) => (
          <ServerCard
            key={s.id}
            server={s}
            onConnect={() => onConnect(s)}
            isConnected={connectionState === 'connected' && connectedServer?.id === s.id}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <GlobeIcon size={48} className="text-purple-600 mx-auto mb-3" />
            <p className="text-purple-400">No servers found</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────── PROFILE TAB ──────────── */
function ProfileTab() {
  return (
    <div className="px-5 pb-28 pt-6">
      {/* Profile header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 border-4 border-purple-400/30">
          <span className="text-3xl font-bold text-white">Y</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Yuki Tanaka</h2>
        <p className="text-purple-400 text-sm mb-1">yuki@yukivpn.io</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-bold">PREMIUM</span>
          <span className="text-purple-400 text-xs">Expires Dec 2026</span>
        </div>
      </div>

      {/* Plan info */}
      <div className="bg-gradient-to-br from-purple-600/20 to-violet-700/20 border border-purple-500/30 rounded-2xl p-5 mb-6">
        <h3 className="text-white font-bold mb-3">Your Plan</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-purple-300 text-sm">Plan</span>
            <span className="text-white font-medium">Premium Annual</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-300 text-sm">Devices</span>
            <span className="text-white font-medium">3 / 5</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-300 text-sm">Data Used</span>
            <span className="text-white font-medium">142.3 GB</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-300 text-sm">Member Since</span>
            <span className="text-white font-medium">Jan 2025</span>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="space-y-2">
        {[
          { icon: <SettingsIcon size={20} />, label: 'Settings', sub: 'Preferences, security' },
          { icon: <LockIcon size={20} />, label: 'Security', sub: '2FA, passwords' },
          { icon: <WifiIcon size={20} />, label: 'Devices', sub: 'Manage connected devices' },
          { icon: <BookIcon size={20} />, label: 'Subscription', sub: 'Billing & plans' },
          { icon: <ShieldIcon size={20} />, label: 'Privacy', sub: 'Data & tracking' },
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center gap-4 p-4 bg-[#16102a] border border-purple-500/10 rounded-2xl hover:border-purple-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition-colors">
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">{item.label}</p>
              <p className="text-purple-500 text-sm">{item.sub}</p>
            </div>
            <ArrowRightIcon size={16} className="text-purple-600 group-hover:text-purple-400 transition-colors" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button className="w-full mt-4 py-3.5 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all font-medium">
        Log Out
      </button>
    </div>
  );
}

/* ──────────── SUPPORT TAB ──────────── */
function SupportTab() {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  const faqs = [
    { q: 'How does YUKI VPN protect my data?', a: 'YUKI VPN uses AES-256 encryption, the same standard used by governments and military. All your data is encrypted before it leaves your device.' },
    { q: 'Can I use YUKI VPN on multiple devices?', a: 'Yes! Premium plan allows up to 5 simultaneous connections. Basic plan supports 2 devices.' },
    { q: 'Why is my connection slow?', a: 'Try connecting to a server closer to your location. You can also try changing the protocol in Settings > Connection.' },
    { q: 'Does YUKI VPN keep logs?', a: 'No. YUKI VPN has a strict no-logs policy. We do not store any browsing history, connection logs, or personal data.' },
    { q: 'How do I cancel my subscription?', a: 'Go to Profile > Subscription > Cancel. You will have access until the end of your billing period.' },
  ];

  return (
    <div className="px-5 pb-28 pt-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/30">
          <LifebuoyIcon size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Support Center</h2>
        <p className="text-purple-400 text-sm mt-1">We're here to help 24/7</p>
      </div>

      {/* Quick contact cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button className="bg-[#16102a] border border-purple-500/15 rounded-2xl p-4 text-center hover:border-purple-500/40 transition-all group">
          <MessageCircleIcon size={28} className="text-purple-400 mx-auto mb-2 group-hover:text-purple-300" />
          <p className="text-white font-medium text-sm">Live Chat</p>
          <p className="text-green-400 text-xs mt-0.5">● Online</p>
        </button>
        <button className="bg-[#16102a] border border-purple-500/15 rounded-2xl p-4 text-center hover:border-purple-500/40 transition-all group">
          <MailIcon size={28} className="text-purple-400 mx-auto mb-2 group-hover:text-purple-300" />
          <p className="text-white font-medium text-sm">Email</p>
          <p className="text-purple-400 text-xs mt-0.5">support@yukivpn.io</p>
        </button>
        <button className="bg-[#16102a] border border-purple-500/15 rounded-2xl p-4 text-center hover:border-purple-500/40 transition-all group">
          <PhoneIcon size={28} className="text-purple-400 mx-auto mb-2 group-hover:text-purple-300" />
          <p className="text-white font-medium text-sm">Phone</p>
          <p className="text-purple-400 text-xs mt-0.5">+1-800-YUKI-VPN</p>
        </button>
        <button className="bg-[#16102a] border border-purple-500/15 rounded-2xl p-4 text-center hover:border-purple-500/40 transition-all group">
          <BookIcon size={28} className="text-purple-400 mx-auto mb-2 group-hover:text-purple-300" />
          <p className="text-white font-medium text-sm">Knowledge Base</p>
          <p className="text-purple-400 text-xs mt-0.5">Browse articles</p>
        </button>
      </div>

      {/* FAQ */}
      <h3 className="text-white font-bold text-lg mb-3">Frequently Asked Questions</h3>
      <div className="space-y-2 mb-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-[#16102a] border border-purple-500/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => setSelectedFaq(selectedFaq === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="text-white font-medium text-sm pr-3">{faq.q}</span>
              <ChevronDownIcon size={16} className={`text-purple-400 flex-shrink-0 transition-transform ${selectedFaq === i ? 'rotate-180' : ''}`} />
            </button>
            {selectedFaq === i && (
              <div className="px-4 pb-4">
                <p className="text-purple-300 text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit ticket */}
      <div className="bg-gradient-to-br from-purple-600/20 to-violet-700/20 border border-purple-500/30 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-2">Still need help?</h3>
        <p className="text-purple-400 text-sm mb-4">Submit a support ticket and we'll get back to you within 24 hours.</p>
        <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-medium transition-all shadow-lg shadow-purple-600/20">
          Submit Ticket
        </button>
      </div>
    </div>
  );
}

/* ──────────── APP ──────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [connectedServer, setConnectedServer] = useState<ServerType | null>(null);
  const [connectingServer, setConnectingServer] = useState<ServerType | null>(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback((server: ServerType) => {
    setConnectingServer(server);
    setConnectionState('connecting');
    setProgress(0);

    const duration = Math.random() * 5000 + 2000; // 2-7 seconds
    const willFail = Math.random() < 0.15; // 15% error rate
    const step = 30;

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const increment = (100 / (duration / step));
        const next = prev + increment;
        return Math.min(next, 99);
      });
    }, step);

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (willFail) {
        setConnectionState('error');
        setProgress(0);
      } else {
        setProgress(100);
        setConnectionState('connected');
        setConnectedServer(server);
      }
      setConnectingServer(null);
    }, duration);
  }, []);

  const disconnect = useCallback(() => {
    setConnectionState('disconnected');
    setConnectedServer(null);
    setConnectingServer(null);
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const closeModal = useCallback(() => {
    setConnectionState('disconnected');
    setConnectingServer(null);
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const bestServer = useMemo(() => servers.reduce((a: ServerType, b: ServerType) => a.ping < b.ping ? a : b), []);

  const showModal = connectionState === 'connecting' || connectionState === 'connected' || connectionState === 'error';

  return (
    <div className="min-h-screen bg-[#0b0714] text-white selection:bg-purple-500/40">
      {/* Status bar */}
      <div className="sticky top-0 z-40 bg-[#0b0714]/80 backdrop-blur-xl border-b border-purple-500/10">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <ShieldIcon size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent leading-tight">
                YUKI VPN
              </h1>
              <p className="text-[10px] text-purple-500 leading-tight">Secure. Fast. Private.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {connectionState === 'connected' && (
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            )}
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              connectionState === 'connected'
                ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                : connectionState === 'connecting'
                ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                : connectionState === 'error'
                ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                : 'bg-purple-500/10 text-purple-400 border border-purple-500/15'
            }`}>
              {connectionState === 'connected' ? 'Connected'
                : connectionState === 'connecting' ? 'Connecting'
                : connectionState === 'error' ? 'Error'
                : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto">
        {activeTab === 'home' && (
          <HomeTab
            connectedServer={connectedServer}
            connectionState={connectionState}
            onConnectBest={() => connect(bestServer)}
          />
        )}
        {activeTab === 'servers' && (
          <ServersTab
            onConnect={connect}
            connectedServer={connectedServer}
            connectionState={connectionState}
          />
        )}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'support' && <SupportTab />}
      </div>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-lg mx-auto bg-[#0b0714]/90 backdrop-blur-xl border-t border-purple-500/10">
          <div className="flex items-center justify-around py-2 px-2">
            {([
              { tab: 'home' as Tab, icon: <ShieldIcon size={22} />, label: 'Home' },
              { tab: 'servers' as Tab, icon: <ServerIcon size={22} />, label: 'Servers' },
              { tab: 'profile' as Tab, icon: <UserIcon size={22} />, label: 'Profile' },
              { tab: 'support' as Tab, icon: <LifebuoyIcon size={22} />, label: 'Support' },
            ]).map(item => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all min-w-[60px] ${
                  activeTab === item.tab
                    ? 'text-purple-400'
                    : 'text-purple-600 hover:text-purple-400'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
                {activeTab === item.tab && (
                  <div className="w-1 h-1 rounded-full bg-purple-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Connection modal */}
      {showModal && connectingServer && (
        <ConnectionModal
          server={connectingServer}
          state={connectionState}
          progress={progress}
          onClose={closeModal}
          onDisconnect={disconnect}
        />
      )}

      {/* Footer */}
      <div className="fixed bottom-[68px] left-0 right-0 z-30 text-center pb-2">
        <p className="text-[10px] text-purple-700">
          © 2026 YUKI VPN™. All rights reserved. Licensed under YUKI Technologies Inc.
        </p>
      </div>
    </div>
  );
}
