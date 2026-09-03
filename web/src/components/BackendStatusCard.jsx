/**
 * BackendStatusCard.jsx
 *
 * Wakes a Render free-tier backend as soon as the sidebar mounts.
 *
 * Strategy:
 *   1. Render an iframe pointing at BACKEND_URL.
 *      - If the backend allows embedding, users see the live Render page → the
 *        request itself wakes the dyno.
 *   2. At the same time, start polling /health (GET, no-cors).
 *      - If the iframe load event fires cleanly we know the site is up.
 *      - If X-Frame-Options / CSP blocks embedding the iframe becomes blank;
 *        we detect this after a short grace period and hide the iframe, then
 *        show the status-pill UI instead.
 *   3. Status cycles: "waking" → "online" | "offline".
 *      Retries every POLL_INTERVAL_MS until online.
 *
 * Usage:
 *   import BackendStatusCard from './components/BackendStatusCard.jsx';
 *   // then drop <BackendStatusCard /> wherever you want in <aside>
 *
 * Configuration — edit the two constants below:
 */

import { Activity, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const BACKEND_URL = 'https://studybot-fxwk.onrender.com'; // ← your Render URL
const HEALTH_PATH = '/health';                              // ← your health endpoint
const POLL_INTERVAL_MS = 5_000;                            // retry every 5 s
const IFRAME_GRACE_MS  = 4_000;                            // wait before deciding iframe is blocked
// ─────────────────────────────────────────────────────────────────────────────

/** Attempt a no-cors fetch; resolves true if the server responds at all. */
async function pingBackend() {
  try {
    await fetch(`${BACKEND_URL}${HEALTH_PATH}`, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
    });
    // no-cors always resolves (opaque response) if the server is reachable.
    return true;
  } catch {
    return false;
  }
}

// Status metadata ─────────────────────────────────────────────────────────────
const STATUS_META = {
  waking: {
    label: 'Waking Up…',
    color: 'text-amber-400',
    ringColor: 'ring-amber-500/30',
    bg: 'bg-amber-500/10',
    dotClass: 'bg-amber-400 animate-pulse',
    Icon: RefreshCw,
    iconClass: 'text-amber-400 animate-spin [animation-duration:2s]',
  },
  online: {
    label: 'Online',
    color: 'text-emerald-400',
    ringColor: 'ring-emerald-500/30',
    bg: 'bg-emerald-500/10',
    dotClass: 'bg-emerald-400',
    Icon: Wifi,
    iconClass: 'text-emerald-400',
  },
  offline: {
    label: 'Offline',
    color: 'text-red-400',
    ringColor: 'ring-red-500/30',
    bg: 'bg-red-500/10',
    dotClass: 'bg-red-400',
    Icon: WifiOff,
    iconClass: 'text-red-400',
  },
};

export default function BackendStatusCard() {
  const [status, setStatus]           = useState('waking');   // 'waking' | 'online' | 'offline'
  const [iframeBlocked, setIframeBlocked] = useState(false);  // true → hide iframe, show pill UI
  const [iframeLoaded, setIframeLoaded]   = useState(false);
  const [retryCount, setRetryCount]   = useState(0);

  const iframeRef      = useRef(null);
  const pollTimerRef   = useRef(null);
  const graceTimerRef  = useRef(null);
  const isMountedRef   = useRef(true);

  // ── iframe load handler ────────────────────────────────────────────────────
  // When the iframe fires "load", the server responded (or the browser showed
  // its own blocked-frame page).  We try to read contentDocument: if we get a
  // SecurityError we know it embedded fine (cross-origin doc).  If the
  // document is empty/null the browser silently refused to embed it.
  const handleIframeLoad = useCallback(() => {
    if (!isMountedRef.current) return;
    setIframeLoaded(true);

    try {
      const doc = iframeRef.current?.contentDocument;
      // contentDocument accessible & empty → likely blocked by X-Frame-Options
      if (doc && doc.body && doc.body.innerHTML.trim() === '') {
        setIframeBlocked(true);
      }
      // If we got here without throwing, the page loaded (possibly same-origin).
      setStatus('online');
    } catch {
      // SecurityError → cross-origin frame rendered fine; server is up.
      setStatus('online');
    }
  }, []);

  // ── polling loop ───────────────────────────────────────────────────────────
  const startPolling = useCallback(() => {
    async function tick() {
      if (!isMountedRef.current) return;
      const alive = await pingBackend();
      if (!isMountedRef.current) return;

      if (alive) {
        setStatus('online');
        setRetryCount(0);
      } else {
        setStatus((prev) => (prev === 'online' ? 'offline' : prev));
        setRetryCount((n) => n + 1);
        pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
      }
    }
    tick();
  }, []);

  // ── grace-period: decide if iframe is blocked ──────────────────────────────
  useEffect(() => {
    graceTimerRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      if (!iframeLoaded) {
        // iframe never fired load → server still asleep or blocked
        setIframeBlocked(true);
        startPolling();
      }
    }, IFRAME_GRACE_MS);

    return () => clearTimeout(graceTimerRef.current);
  }, [iframeLoaded, startPolling]);

  // ── kick off polling immediately (wake signal even if iframe blocked) ──────
  useEffect(() => {
    // Fire once immediately; also acts as the "pre-warm" fetch even when
    // the iframe is allowed, giving us an early status signal.
    (async () => {
      const alive = await pingBackend();
      if (!isMountedRef.current) return;
      if (alive) setStatus('online');
    })();

    return () => {
      isMountedRef.current = false;
      clearTimeout(pollTimerRef.current);
      clearTimeout(graceTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── manual retry ──────────────────────────────────────────────────────────
  const handleManualRetry = useCallback(() => {
    setStatus('waking');
    setRetryCount(0);
    clearTimeout(pollTimerRef.current);
    startPolling();
  }, [startPolling]);

  const meta = STATUS_META[status];

  return (
    <section
      className="rounded-[14px] border border-zinc-700 bg-zinc-900 p-4 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)]"
      aria-label="Backend status"
    >
      {/* ── Header ── */}
      <div className="mb-3 flex items-center gap-2">
        <Activity size={18} className="text-white" />
        <h2 className="text-base font-semibold text-white">
          Backend Status
        </h2>
      </div>

      {/* ── iframe (shown when not blocked) ── */}
      {!iframeBlocked && (
        <div className="overflow-hidden rounded-[8px] border border-zinc-700 bg-zinc-800">
          {/* Loading shimmer shown until iframe fires load */}
          {!iframeLoaded && (
            <div className="flex h-[120px] items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw
                  size={20}
                  className="animate-spin text-zinc-500 [animation-duration:1.4s]"
                />
                <span className="text-xs text-zinc-500">
                  Connecting to backend…
                </span>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={BACKEND_URL}
            title="Backend status page"
            onLoad={handleIframeLoad}
            className={`w-full rounded-[8px] border-0 bg-zinc-800 transition-opacity duration-300 ${
              iframeLoaded ? 'opacity-100' : 'pointer-events-none h-0 opacity-0'
            }`}
            style={{ height: iframeLoaded ? '160px' : '0' }}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}

      {/* ── Status pill (always visible; primary UI when iframe is blocked) ── */}
      <div
        className={`mt-3 flex items-center justify-between rounded-[8px] px-3 py-2.5 ring-1 transition-all duration-500 ${meta.bg} ${meta.ringColor}`}
      >
        <div className="flex items-center gap-2.5">
          {/* Animated dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            {status === 'waking' && (
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${meta.dotClass}`}
              />
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${meta.dotClass}`}
            />
          </span>

          <span className={`text-sm font-semibold ${meta.color}`}>
            {meta.label}
          </span>

          {status === 'waking' && retryCount > 0 && (
            <span className="text-xs text-zinc-500">
              (attempt {retryCount + 1})
            </span>
          )}
        </div>

        {/* Icon / retry button */}
        {status === 'offline' ? (
          <button
            onClick={handleManualRetry}
            className="rounded-[6px] p-1 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
            aria-label="Retry connection"
            title="Retry"
          >
            <RefreshCw size={14} />
          </button>
        ) : (
          <meta.Icon size={15} className={meta.iconClass} />
        )}
      </div>

      {/* ── Sub-label ── */}
      <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
        {status === 'waking' &&
          'Render free-tier dyno is starting — this takes ~30 s.'}
        {status === 'online' && 'Backend is reachable. Uploads & queuing are ready.'}
        {status === 'offline' &&
          'Backend is unreachable. Check your Render dashboard.'}
      </p>
    </section>
  );
}
