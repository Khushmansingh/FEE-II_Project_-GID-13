import { Bot, Database, FileUp, RefreshCcw } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase.js';

export default function Layout({ children, onRefresh, loading }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-indigo-500 text-white shadow-[0_1px_2px_0_rgba(0,0,0,0.2),0_10px_30px_-12px_rgba(0,0,0,0.6)]">
              <Bot size={21} aria-hidden="true" />
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white">
                Discord File Bot
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <FileUp size={13} aria-hidden="true" />
                  Files
                </span>

                <span
                  className="h-1 w-1 rounded-full bg-zinc-700"
                  aria-hidden="true"
                />

                <span className="inline-flex items-center gap-1.5">
                  <Database size={13} aria-hidden="true" />
                  Supabase
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isSupabaseConfigured && (
              <span className="rounded-[8px] bg-red-950 px-3 py-2 text-sm font-medium text-red-300 ring-1 ring-red-800">
                Missing web env
              </span>
            )}

            <button
              type="button"
              title="Refresh files"
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-zinc-700 bg-zinc-900 px-3.5 text-sm font-semibold text-white transition-[transform,background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-indigo-500 hover:bg-zinc-800 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw
                size={15}
                className={
                  loading ? 'animate-spin [animation-duration:0.6s]' : ''
                }
                aria-hidden="true"
              />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl items-start gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[368px_minmax(0,1fr)] lg:px-8">
        {children}
      </main>
    </div>
  );
}