import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { servers, type Server as ServerType } from './data/servers';
import { countries } from './data/countries';
import {
  ShieldIcon, ServerIcon, UserIcon, LifebuoyIcon, GlobeIcon,
  SearchIcon, ZapIcon, LockIcon, ActivityIcon, ChevronDownIcon,
  XIcon, MessageCircleIcon, BookIcon, SettingsIcon,
  WifiIcon, MailIcon, PhoneIcon, ArrowRightIcon
} from './components/Icons';
import { Toast } from './components/Toast';
import { t, localizeCountry, type Lang } from './i18n/translations';

/* ──────────── Types ──────────── */
type Tab = 'home' | 'servers' | 'profile' | 'support';
type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';
type SubPage = null | 'settings' | 'security' | 'devices' | 'subscription' | 'privacy';

/* ──────────── Toast Hook ──────────── */
function useToast() {
  const [toast, setToast] = useState<{ type: 'success' | 'error'; title: string; message: string; serverFlag?: string; serverName?: string; actionLabel?: string; onAction?: () => void } | null>(null);
  const show = useCallback((data: typeof toast) => setToast(data), []);
  const hide = useCallback(() => setToast(null), []);
  return { toast, show, hide };
}

/* ──────────── Connection Modal ──────────── */
function ConnectionModal({
  server, state, progress, onClose, lang
}: {
  server: ServerType; state: ConnectionState; progress: number;
  onClose: () => void; lang: Lang;
}) {
  const phaseText = state === 'connecting'
    ? progress < 30 ? t('resolving', lang)
    : progress < 60 ? t('establishing', lang)
    : progress < 90 ? t('verifying', lang)
    : t('finalizing', lang)
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#1a0d2e] via-[#150a25] to-[#0f0820] border-2 border-purple-500/40 shadow-2xl shadow-purple-900/60 p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-600/20 rounded-full blur-3xl" />

        <button onClick={onClose} className="absolute top-4 right-4 text-purple-400 hover:text-white transition-colors z-20">
          <XIcon size={20} />
        </button>

        <div className="relative z-10 flex flex-col items-center">
          <div className="text-7xl mb-3 drop-shadow-lg">{server.flag}</div>
          <h3 className="text-2xl font-bold text-white mb-1">{server.name}</h3>
          <p className="text-purple-300 text-sm mb-6">
            {localizeCountry(server.country, lang)}{server.city ? ` • ${server.city}` : ''}
          </p>

          {state === 'connecting' && (
            <div className="w-full">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-r-purple-300 animate-spin" />
                </div>
                <div>
                  <p className="text-white font-bold">{t('connecting', lang)}</p>
                  <p className="text-purple-300 text-sm">{Math.round(progress)}%</p>
                </div>
              </div>
              <div className="w-full h-2 bg-[#0f0820] rounded-full overflow-hidden border border-purple-500/30">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 via-violet-500 to-purple-400 rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-purple-400">
                <span>{phaseText}</span>
                <span>{server.ping}ms</span>
              </div>
            </div>
          )}

          {state === 'connected' && (
            <div className="w-full text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              </div>
              <p className="text-green-400 font-bold text-lg">{t('connectionSuccess', lang)}</p>
            </div>
          )}

          {state === 'error' && (
            <div className="w-full text-center">
              <p className="text-red-400 font-bold text-lg mb-2">{t('connectionError', lang)}</p>
              <p className="text-purple-300 text-sm">{t('connectionErrorDesc', lang)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────── Server Card ──────────── */
function ServerCard({ server, onConnect, isConnected, lang }: { server: ServerType; onConnect: () => void; isConnected: boolean; lang: Lang }) {
  const country = localizeCountry(server.country, lang);
  return (
    <button
      onClick={onConnect}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 group ${
        isConnected
          ? 'bg-green-500/10 border border-green-500/40 shadow-lg shadow-green-500/10'
          : 'bg-[#16102a] border border-purple-500/10 hover:border-purple-500/30 hover:bg-[#1d1538] hover:shadow-lg hover:shadow-purple-500/10'
      }`}
    >
      <span className="text-2xl flex-shrink-0">{server.flag}</span>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium text-sm truncate">{server.name}</span>
          {server.special && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold flex-shrink-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-yellow-300 border border-yellow-500/40">
              {server.specialTag}
            </span>
          )}
          {isConnected && (
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          )}
        </div>
        <p className="text-purple-400 text-xs">{country}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1 text-xs text-purple-400">
          <ActivityIcon size={12} />
          <span>{server.ping}ms</span>
        </div>
        <div className="w-14 h-1.5 bg-[#0f0a1a] rounded-full mt-1.5 overflow-hidden">
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

/* ──────────── HOME ──────────── */
function HomeTab({
  connectedServer, connectionState, onConnectBest, onChooseOther, lang
}: {
  connectedServer: ServerType | null;
  connectionState: ConnectionState;
  onConnectBest: () => void;
  onChooseOther: () => void;
  lang: Lang;
}) {
  const bestServer = useMemo(() => servers.reduce((a: ServerType, b: ServerType) => a.ping < b.ping ? a : b), []);
  const isConnecting = connectionState === 'connecting';
  const isConnected = connectionState === 'connected';

  return (
    <div className="px-5 pb-32 pt-6">
      {/* Status header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldIcon size={18} className={isConnected ? 'text-green-400' : isConnecting ? 'text-purple-400' : 'text-purple-500'} />
          <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : isConnecting ? 'text-purple-300' : 'text-purple-400'}`}>
            {isConnected ? t('protected', lang) : isConnecting ? t('connecting', lang) : t('notProtected', lang)}
          </span>
        </div>
        {/* Country flag (for connected or recommended) */}
        {isConnected && connectedServer ? (
          <span className="text-3xl">{connectedServer.flag}</span>
        ) : isConnecting ? (
          <span className="text-3xl opacity-50">🔗</span>
        ) : (
          <span className="text-3xl">{bestServer.flag}</span>
        )}
      </div>

      {/* Main text */}
      <h2 className="text-2xl font-bold text-white mb-2">
        {isConnected ? t('connectedTo', lang) : t('tapToConnect', lang)}
      </h2>
      {isConnected && (
        <p className="text-purple-300 text-base font-medium mb-6">{connectedServer?.name}</p>
      )}
      {!isConnected && !isConnecting && <div className="mb-6" />}

      {/* Connect button */}
      {!isConnected && !isConnecting && (
        <div className="space-y-3">
          <button
            onClick={onConnectBest}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-lg transition-all shadow-lg shadow-purple-600/30 hover:shadow-purple-500/40 active:scale-[0.98]"
          >
            {t('connectTo', lang)} {bestServer.city} {bestServer.flag}
          </button>
          <button
            onClick={onChooseOther}
            className="w-full py-4 rounded-2xl bg-[#16102a] border border-purple-500/20 hover:border-purple-500/40 text-purple-300 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <GlobeIcon size={18} />
            <span className="font-medium">{t('chooseOtherServer', lang)}</span>
          </button>
        </div>
      )}

      {isConnecting && (
        <div className="w-full py-4 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
          <span className="text-purple-300 font-medium">{t('securingConnection', lang)}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6 mt-6">
        <div className="bg-[#16102a] border border-purple-500/10 rounded-2xl p-3 text-center">
          <WifiIcon size={20} className="text-purple-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{isConnected ? '256' : '0'}</p>
          <p className="text-purple-500 text-xs">{t('Mbps', lang)}</p>
        </div>
        <div className="bg-[#16102a] border border-purple-500/10 rounded-2xl p-3 text-center">
          <LockIcon size={20} className="text-purple-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">AES-256</p>
          <p className="text-purple-500 text-xs">{t('encryption', lang)}</p>
        </div>
        <div className="bg-[#16102a] border border-purple-500/10 rounded-2xl p-3 text-center">
          <ZapIcon size={20} className="text-purple-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{isConnected ? connectedServer?.ping || '--' : '--'}</p>
          <p className="text-purple-500 text-xs">{t('ping', lang)}</p>
        </div>
      </div>

      {/* Features */}
      <h3 className="text-white font-bold text-lg mb-3">{t('features', lang)}</h3>
      <div className="space-y-3">
        {[
          { icon: <ShieldIcon size={20} />, titleKey: 'killSwitch' as const, descKey: 'killSwitchDesc' as const, color: 'text-green-400' },
          { icon: <GlobeIcon size={20} />, titleKey: 'serversCount' as const, descKey: 'serversCountDesc' as const, color: 'text-blue-400' },
          { icon: <LockIcon size={20} />, titleKey: 'noLogs' as const, descKey: 'noLogsDesc' as const, color: 'text-purple-400' },
          { icon: <ZapIcon size={20} />, titleKey: 'lightningFast' as const, descKey: 'lightningFastDesc' as const, color: 'text-yellow-400' },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-4 bg-[#16102a] border border-purple-500/10 rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center ${f.color}`}>
              {f.icon}
            </div>
            <div>
              <p className="text-white font-medium">{t(f.titleKey, lang)}</p>
              <p className="text-purple-400 text-sm">{t(f.descKey, lang)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────── SERVERS ──────────── */
function ServersTab({
  onConnect, connectedServer, connectionState, lang
}: {
  onConnect: (s: ServerType) => void;
  connectedServer: ServerType | null;
  connectionState: ConnectionState;
  lang: Lang;
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
    const q = search.toLowerCase().trim();
    let result = servers;
    if (q) {
      result = result.filter((s: ServerType) => {
        const countryRu = countries.find(c => c.en === s.country)?.ru || '';
        return (
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          countryRu.toLowerCase().includes(q)
        );
      });
    }
    result.sort((a: ServerType, b: ServerType) => {
      if (a.special && !b.special) return -1;
      if (!a.special && b.special) return 1;
      if (sortBy === 'ping') return a.ping - b.ping;
      if (sortBy === 'country') {
        const aC = localizeCountry(a.country, lang);
        const bC = localizeCountry(b.country, lang);
        return aC.localeCompare(bC);
      }
      return a.name.localeCompare(b.name);
    });
    return result;
  }, [search, sortBy, lang]);

  return (
    <div className="px-5 pb-32 pt-6">
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <SearchIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchServers', lang)}
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
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#1a1028] border border-purple-500/30 rounded-xl shadow-xl shadow-purple-900/50 overflow-hidden z-30">
              {([
                ['ping', 'sortByPing'],
                ['name', 'sortByName'],
                ['country', 'sortByCountry'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setSortBy(key); setShowSortDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    sortBy === key ? 'bg-purple-600/30 text-white' : 'text-purple-400 hover:bg-purple-500/10'
                  }`}
                >
                  {t(label, lang)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Special servers section */}
      {filtered.some((s: ServerType) => s.special) && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <ZapIcon size={14} className="text-yellow-400" />
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">{t('specialServers', lang)}</span>
          </div>
          <div className="space-y-2 mb-3">
            {filtered.filter((s: ServerType) => s.special).map((s: ServerType) => (
              <ServerCard
                key={s.id}
                server={s}
                onConnect={() => onConnect(s)}
                isConnected={connectionState === 'connected' && connectedServer?.id === s.id}
                lang={lang}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <p className="text-purple-400 text-sm">{filtered.filter((s: ServerType) => !s.special).length} {t('serversLabel', lang)}</p>
        {connectedServer && connectionState === 'connected' && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs">{connectedServer.name}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
        {filtered.filter((s: ServerType) => !s.special).map((s: ServerType) => (
          <ServerCard
            key={s.id}
            server={s}
            onConnect={() => onConnect(s)}
            isConnected={connectionState === 'connected' && connectedServer?.id === s.id}
            lang={lang}
          />
        ))}
        {filtered.filter((s: ServerType) => !s.special).length === 0 && (
          <div className="text-center py-16">
            <GlobeIcon size={48} className="text-purple-600 mx-auto mb-3" />
            <p className="text-purple-400">{t('noServersFound', lang)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────── SETTINGS SUB-PAGE ──────────── */
function SettingsPage({ lang, setLang, onBack }: { lang: Lang; setLang: (l: Lang) => void; onBack: () => void }) {
  const [killSwitch, setKillSwitch] = useState(true);
  const [autoConnect, setAutoConnect] = useState(false);
  const [dnsProtection, setDnsProtection] = useState(true);

  return (
    <div className="px-5 pb-32 pt-6">
      <button onClick={onBack} className="flex items-center gap-2 text-purple-400 mb-4 hover:text-purple-300 transition-colors">
        <ArrowRightIcon size={16} className="rotate-180" />
        <span className="text-sm">{t('back', lang)}</span>
      </button>
      <h2 className="text-2xl font-bold text-white mb-6">{t('settingsTitle', lang)}</h2>

      <div className="space-y-3">
        <div className="bg-[#16102a] border border-purple-500/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <GlobeIcon size={20} />
            </div>
            <div>
              <p className="text-white font-medium">{t('language', lang)}</p>
              <p className="text-purple-500 text-sm">{t('languageDesc', lang)}</p>
            </div>
          </div>
          <div className="flex gap-2 ml-[52px]">
            <button
              onClick={() => setLang('ru')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                lang === 'ru' ? 'bg-purple-600 text-white' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              }`}
            >
              🇷🇺 Русский
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                lang === 'en' ? 'bg-purple-600 text-white' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        <div className="bg-[#16102a] border border-purple-500/10 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <WifiIcon size={20} />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{t('protocol', lang)}</p>
              <p className="text-purple-500 text-sm">{t('protocolDesc', lang)}</p>
            </div>
            <span className="text-purple-300 text-sm bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20">WireGuard</span>
          </div>
        </div>

        {[
          { label: t('autoConnect', lang), desc: t('autoConnectDesc', lang), val: autoConnect, set: setAutoConnect },
          { label: t('killSwitchToggle', lang), desc: t('killSwitchToggleDesc', lang), val: killSwitch, set: setKillSwitch },
          { label: t('dnsLeakProtection', lang), desc: t('dnsLeakProtectionDesc', lang), val: dnsProtection, set: setDnsProtection },
        ].map((item, i) => (
          <div key={i} className="bg-[#16102a] border border-purple-500/10 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{item.label}</p>
              <p className="text-purple-500 text-sm">{item.desc}</p>
            </div>
            <button
              onClick={() => item.set(!item.val)}
              className={`w-12 h-7 rounded-full transition-all relative ${item.val ? 'bg-purple-600' : 'bg-purple-500/20'}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow ${item.val ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        ))}

        <div className="text-center pt-4">
          <p className="text-purple-600 text-xs">{t('version', lang)}</p>
        </div>
      </div>
    </div>
  );
}

/* ──────────── SECURITY SUB-PAGE ──────────── */
function SecurityPage({ lang, onBack }: { lang: Lang; onBack: () => void }) {
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="px-5 pb-32 pt-6">
      <button onClick={onBack} className="flex items-center gap-2 text-purple-400 mb-4 hover:text-purple-300 transition-colors">
        <ArrowRightIcon size={16} className="rotate-180" />
        <span className="text-sm">{t('back', lang)}</span>
      </button>
      <h2 className="text-2xl font-bold text-white mb-6">{t('securityTitle', lang)}</h2>
      <div className="space-y-3">
        <div className="bg-[#16102a] border border-purple-500/10 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400"><LockIcon size={20} /></div>
            <div>
              <p className="text-white font-medium">{t('twoFA', lang)}</p>
              <p className="text-purple-500 text-sm">{t('twoFADesc', lang)}</p>
            </div>
          </div>
          <button onClick={() => setTwoFA(!twoFA)} className={`w-12 h-7 rounded-full transition-all relative ${twoFA ? 'bg-purple-600' : 'bg-purple-500/20'}`}>
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow ${twoFA ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
        {[
          { icon: <LockIcon size={20} />, label: t('password', lang), desc: t('passwordDesc', lang) },
          { icon: <ActivityIcon size={20} />, label: t('sessions', lang), desc: t('sessionsDesc', lang) },
          { icon: <ShieldIcon size={20} />, label: t('biometrics', lang), desc: t('biometricsDesc', lang) },
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center gap-3 p-4 bg-[#16102a] border border-purple-500/10 rounded-2xl hover:border-purple-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">{item.icon}</div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">{item.label}</p>
              <p className="text-purple-500 text-sm">{item.desc}</p>
            </div>
            <ArrowRightIcon size={16} className="text-purple-600 group-hover:text-purple-400" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ──────────── DEVICES SUB-PAGE ──────────── */
function DevicesPage({ lang, onBack }: { lang: Lang; onBack: () => void }) {
  return (
    <div className="px-5 pb-32 pt-6">
      <button onClick={onBack} className="flex items-center gap-2 text-purple-400 mb-4 hover:text-purple-300 transition-colors">
        <ArrowRightIcon size={16} className="rotate-180" />
        <span className="text-sm">{t('back', lang)}</span>
      </button>
      <h2 className="text-2xl font-bold text-white mb-6">{t('devicesTitle', lang)}</h2>
      <p className="text-purple-400 text-sm mb-4">{t('connectedDevices', lang)}</p>
      <div className="space-y-3">
        {[
          { icon: '📱', name: t('device1', lang), status: t('deviceStatus', lang) },
          { icon: '💻', name: t('device2', lang), status: t('deviceStatus', lang) },
          { icon: '📋', name: t('device3', lang), status: t('deviceStatus', lang) },
        ].map((dev, i) => (
          <div key={i} className="bg-[#16102a] border border-purple-500/10 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">{dev.icon}</span>
            <div className="flex-1">
              <p className="text-white font-medium">{dev.name}</p>
              <p className="text-green-400 text-xs">{dev.status}</p>
            </div>
            <button className="text-red-400 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all">
              {t('disconnectDevice', lang)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────── SUBSCRIPTION SUB-PAGE ──────────── */
function SubscriptionPage({ lang, onBack }: { lang: Lang; onBack: () => void }) {
  return (
    <div className="px-5 pb-32 pt-6">
      <button onClick={onBack} className="flex items-center gap-2 text-purple-400 mb-4 hover:text-purple-300 transition-colors">
        <ArrowRightIcon size={16} className="rotate-180" />
        <span className="text-sm">{t('back', lang)}</span>
      </button>
      <h2 className="text-2xl font-bold text-white mb-6">{t('subscriptionTitle', lang)}</h2>
      <div className="bg-gradient-to-br from-purple-600/20 to-violet-700/20 border border-purple-500/30 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white text-xs font-bold">{t('premium', lang)}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between"><span className="text-purple-300 text-sm">{t('currentPlan', lang)}</span><span className="text-white font-medium">{t('premiumAnnual', lang)}</span></div>
          <div className="flex justify-between"><span className="text-purple-300 text-sm">{t('nextBilling', lang)}</span><span className="text-white font-medium">{t('billingDate', lang)}</span></div>
          <div className="flex justify-between"><span className="text-purple-300 text-sm">{t('paymentMethod', lang)}</span><span className="text-white font-medium">{t('paymentCard', lang)}</span></div>
        </div>
      </div>
      <div className="space-y-3">
        <button className="w-full py-3.5 rounded-2xl bg-[#16102a] border border-purple-500/20 text-white font-medium hover:border-purple-500/40 transition-all">
          {t('manageSubscription', lang)}
        </button>
        <button className="w-full py-3.5 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all font-medium">
          {t('cancelSubscription', lang)}
        </button>
      </div>
    </div>
  );
}

/* ──────────── PRIVACY SUB-PAGE ──────────── */
function PrivacyPage({ lang, onBack }: { lang: Lang; onBack: () => void }) {
  return (
    <div className="px-5 pb-32 pt-6">
      <button onClick={onBack} className="flex items-center gap-2 text-purple-400 mb-4 hover:text-purple-300 transition-colors">
        <ArrowRightIcon size={16} className="rotate-180" />
        <span className="text-sm">{t('back', lang)}</span>
      </button>
      <h2 className="text-2xl font-bold text-white mb-6">{t('privacyTitle', lang)}</h2>
      <div className="space-y-3">
        {[
          { icon: <ShieldIcon size={20} />, label: t('dataCollection', lang), desc: t('dataCollectionDesc', lang) },
          { icon: <EyeIcon />, label: t('adTracking', lang), desc: t('adTrackingDesc', lang) },
        ].map((item, i) => (
          <div key={i} className="bg-[#16102a] border border-purple-500/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">{item.icon}</div>
            <div>
              <p className="text-white font-medium">{item.label}</p>
              <p className="text-purple-500 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
        <button className="w-full py-3.5 rounded-2xl bg-[#16102a] border border-purple-500/20 text-white font-medium hover:border-purple-500/40 transition-all mt-4">
          {t('clearCache', lang)}
        </button>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/* ──────────── PROFILE TAB ──────────── */
function ProfileTab({ subPage, setSubPage, lang, setLang }: { subPage: SubPage; setSubPage: (p: SubPage) => void; lang: Lang; setLang: (l: Lang) => void }) {
  if (subPage === 'settings') return <SettingsPage lang={lang} setLang={setLang} onBack={() => setSubPage(null)} />;
  if (subPage === 'security') return <SecurityPage lang={lang} onBack={() => setSubPage(null)} />;
  if (subPage === 'devices') return <DevicesPage lang={lang} onBack={() => setSubPage(null)} />;
  if (subPage === 'subscription') return <SubscriptionPage lang={lang} onBack={() => setSubPage(null)} />;
  if (subPage === 'privacy') return <PrivacyPage lang={lang} onBack={() => setSubPage(null)} />;

  return (
    <div className="px-5 pb-32 pt-6">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-lg shadow-purple-500/30 border-4 border-purple-400/30 bg-purple-900/50 flex items-center justify-center">
          <img
            src="https://i.ibb.co/8gt7pYzz/8-B69-F972-4-D0-B-4123-B804-57-D1813-EE322.png"
            alt="YUKI VPN"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-3xl font-bold text-white">Y</span>'; }}
          />
        </div>
        <h2 className="text-2xl font-bold text-white">{t('profileName', lang)}</h2>
        <p className="text-purple-400 text-sm mb-1">{t('profileEmail', lang)}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-bold">{t('premium', lang)}</span>
          <span className="text-purple-400 text-xs">{t('expires', lang)}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-600/20 to-violet-700/20 border border-purple-500/30 rounded-2xl p-5 mb-6">
        <h3 className="text-white font-bold mb-3">{t('yourPlan', lang)}</h3>
        <div className="space-y-3">
          <div className="flex justify-between"><span className="text-purple-300 text-sm">{t('plan', lang)}</span><span className="text-white font-medium">{t('premiumAnnual', lang)}</span></div>
          <div className="flex justify-between"><span className="text-purple-300 text-sm">{t('devices', lang)}</span><span className="text-white font-medium">3 / 5</span></div>
          <div className="flex justify-between"><span className="text-purple-300 text-sm">{t('dataUsed', lang)}</span><span className="text-white font-medium">142.3 GB</span></div>
          <div className="flex justify-between"><span className="text-purple-300 text-sm">{t('memberSince', lang)}</span><span className="text-white font-medium">Jan 2025</span></div>
        </div>
      </div>

      <div className="space-y-2">
        {[
          { icon: <SettingsIcon size={20} />, label: t('settings', lang), desc: t('settingsDesc', lang), page: 'settings' as SubPage },
          { icon: <LockIcon size={20} />, label: t('security', lang), desc: t('securityDesc', lang), page: 'security' as SubPage },
          { icon: <WifiIcon size={20} />, label: t('devicesLabel', lang), desc: t('devicesDesc', lang), page: 'devices' as SubPage },
          { icon: <BookIcon size={20} />, label: t('subscription', lang), desc: t('subscriptionDesc', lang), page: 'subscription' as SubPage },
          { icon: <ShieldIcon size={20} />, label: t('privacy', lang), desc: t('privacyDesc', lang), page: 'privacy' as SubPage },
        ].map((item, i) => (
          <button key={i} onClick={() => setSubPage(item.page)} className="w-full flex items-center gap-4 p-4 bg-[#16102a] border border-purple-500/10 rounded-2xl hover:border-purple-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition-colors">
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">{item.label}</p>
              <p className="text-purple-500 text-sm">{item.desc}</p>
            </div>
            <ArrowRightIcon size={16} className="text-purple-600 group-hover:text-purple-400 transition-colors" />
          </button>
        ))}
      </div>

      <button className="w-full mt-4 py-3.5 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all font-medium">
        {t('logout', lang)}
      </button>
    </div>
  );
}

/* ──────────── SUPPORT TAB ──────────── */
function SupportTab({ lang }: { lang: Lang }) {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  const faqs = [
    { q: t('faq1q', lang), a: t('faq1a', lang) },
    { q: t('faq2q', lang), a: t('faq2a', lang) },
    { q: t('faq3q', lang), a: t('faq3a', lang) },
    { q: t('faq4q', lang), a: t('faq4a', lang) },
    { q: t('faq5q', lang), a: t('faq5a', lang) },
  ];

  return (
    <div className="px-5 pb-32 pt-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/30">
          <LifebuoyIcon size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">{t('supportCenter', lang)}</h2>
        <p className="text-purple-400 text-sm mt-1">{t('hereToHelp', lang)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: <MessageCircleIcon size={28} />, label: t('liveChat', lang), sub: t('online', lang), subColor: 'text-green-400' },
          { icon: <MailIcon size={28} />, label: t('email', lang), sub: 'support@yukivpn.io', subColor: 'text-purple-400' },
          { icon: <PhoneIcon size={28} />, label: t('phone', lang), sub: '+1-800-YUKI-VPN', subColor: 'text-purple-400' },
          { icon: <BookIcon size={28} />, label: t('knowledgeBase', lang), sub: t('browseArticles', lang), subColor: 'text-purple-400' },
        ].map((c, i) => (
          <button key={i} className="bg-[#16102a] border border-purple-500/15 rounded-2xl p-4 text-center hover:border-purple-500/40 transition-all group">
            <div className="text-purple-400 group-hover:text-purple-300 mb-2 flex justify-center">{c.icon}</div>
            <p className="text-white font-medium text-sm">{c.label}</p>
            <p className={`${c.subColor} text-xs mt-0.5`}>{c.sub}</p>
          </button>
        ))}
      </div>

      <h3 className="text-white font-bold text-lg mb-3">{t('faq', lang)}</h3>
      <div className="space-y-2 mb-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-[#16102a] border border-purple-500/10 rounded-2xl overflow-hidden">
            <button onClick={() => setSelectedFaq(selectedFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
              <span className="text-white font-medium text-sm pr-3">{faq.q}</span>
              <ChevronDownIcon size={16} className={`text-purple-400 flex-shrink-0 transition-transform ${selectedFaq === i ? 'rotate-180' : ''}`} />
            </button>
            {selectedFaq === i && <div className="px-4 pb-4"><p className="text-purple-300 text-sm leading-relaxed">{faq.a}</p></div>}
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-purple-600/20 to-violet-700/20 border border-purple-500/30 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-2">{t('stillNeedHelp', lang)}</h3>
        <p className="text-purple-400 text-sm mb-4">{t('ticketDesc', lang)}</p>
        <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-medium transition-all shadow-lg shadow-purple-600/20">
          {t('submitTicket', lang)}
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
  const [subPage, setSubPage] = useState<SubPage>(null);
  const [lang, setLang] = useState<Lang>('ru');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast, show: showToast, hide: hideToast } = useToast();

  const connect = useCallback((server: ServerType) => {
    setConnectingServer(server);
    setConnectionState('connecting');
    setProgress(0);

    const duration = Math.random() * 5000 + 2000;
    const willFail = Math.random() < 0.15;
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
        showToast({
          type: 'error',
          title: t('connectionError', lang),
          message: t('connectionErrorDesc', lang),
          serverFlag: server.flag,
          serverName: `${server.city ? server.city + ', ' : ''}${localizeCountry(server.country, lang)}`,
          actionLabel: t('retry', lang),
          onAction: () => { hideToast(); connect(server); },
        });
      } else {
        setProgress(100);
        setConnectionState('connected');
        setConnectedServer(server);
        showToast({
          type: 'success',
          title: t('connectionSuccess', lang),
          message: t('connectionSuccessDesc', lang),
          serverFlag: server.flag,
          serverName: `${server.city ? server.city + ', ' : ''}${localizeCountry(server.country, lang)}`,
          actionLabel: t('disconnect', lang),
          onAction: () => { setConnectionState('disconnected'); setConnectedServer(null); hideToast(); },
        });
      }
      setConnectingServer(null);
    }, duration);
  }, [lang, showToast, hideToast]);

  const closeModal = useCallback(() => {
    setConnectionState('disconnected');
    setConnectingServer(null);
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const bestServer = useMemo(() => servers.reduce((a: ServerType, b: ServerType) => a.ping < b.ping ? a : b), []);

  const Footer = () => (
    <div className="text-center pt-8 pb-4">
      <p className="text-[11px] text-purple-700">{t('allRightsReserved', lang)}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0714] text-white selection:bg-purple-500/40">
      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          serverFlag={toast.serverFlag}
          serverName={toast.serverName}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onClose={hideToast}
        />
      )}

      {/* Status bar */}
      <div className="sticky top-0 z-40 bg-[#0b0714]/80 backdrop-blur-xl border-b border-purple-500/10">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-purple-500/20">
              <img
                src="https://i.ibb.co/8gt7pYzz/8-B69-F972-4-D0-B-4123-B804-57-D1813-EE322.png"
                alt="YUKI VPN"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>'; }}
              />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent leading-tight">
                {t('appTitle', lang)}
              </h1>
              <p className="text-[10px] text-purple-500 leading-tight">{t('appTagline', lang)}</p>
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
              {connectionState === 'connected' ? t('protected', lang)
                : connectionState === 'connecting' ? t('connecting', lang)
                : connectionState === 'error' ? lang === 'ru' ? 'Ошибка' : 'Error'
                : t('notProtected', lang)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto pb-24">
        {activeTab === 'home' && (
          <>
            <HomeTab
              connectedServer={connectedServer}
              connectionState={connectionState}
              onConnectBest={() => connect(bestServer)}
              onChooseOther={() => setActiveTab('servers')}
              lang={lang}
            />
            <Footer />
          </>
        )}
        {activeTab === 'servers' && (
          <>
            <ServersTab onConnect={connect} connectedServer={connectedServer} connectionState={connectionState} lang={lang} />
            <Footer />
          </>
        )}
        {activeTab === 'profile' && (
          <>
            <ProfileTab subPage={subPage} setSubPage={setSubPage} lang={lang} setLang={setLang} />
            <Footer />
          </>
        )}
        {activeTab === 'support' && (
          <>
            <SupportTab lang={lang} />
            <Footer />
          </>
        )}
      </div>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-lg mx-auto bg-[#0b0714]/90 backdrop-blur-xl border-t border-purple-500/10">
          <div className="flex items-center justify-around py-2 px-2">
            {([
              { tab: 'home' as Tab, icon: <ShieldIcon size={22} />, label: t('home', lang) },
              { tab: 'servers' as Tab, icon: <ServerIcon size={22} />, label: t('servers', lang) },
              { tab: 'profile' as Tab, icon: <UserIcon size={22} />, label: t('profile', lang) },
              { tab: 'support' as Tab, icon: <LifebuoyIcon size={22} />, label: t('support', lang) },
            ]).map(item => (
              <button
                key={item.tab}
                onClick={() => { setActiveTab(item.tab); setSubPage(null); }}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all min-w-[60px] ${
                  activeTab === item.tab ? 'text-purple-400' : 'text-purple-600 hover:text-purple-400'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
                {activeTab === item.tab && <div className="w-1 h-1 rounded-full bg-purple-400" />}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Connection modal */}
      {connectingServer && (connectionState === 'connecting' || connectionState === 'connected' || connectionState === 'error') && (
        <ConnectionModal
          server={connectingServer}
          state={connectionState}
          progress={progress}
          onClose={closeModal}
          lang={lang}
        />
      )}
    </div>
  );
}
