import { Eye, FileText, Inbox, Loader2, Search, Trash2 } from 'lucide-react';
import StatusPill from './StatusPill.jsx';
import { formatBytes } from '../lib/files.js';

export default function FileTable({
  documents,
  selectedId,
  onSelect,
  onDelete,
  onOpen,
  deletingId,
  disabled,
  search,
  onSearchChange
}) {
  const isFiltered = search.trim().length > 0;

  return (
    <section className="rounded-[14px] border border-zinc-700 bg-zinc-900 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)]">
      <div className="flex flex-col gap-3 border-b border-zinc-700 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-white" />

          <h2 className="text-base font-semibold text-white">
            Files
          </h2>

          <span className="rounded-full bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-400 [font-variant-numeric:tabular-nums]">
            {documents.length}
          </span>
        </div>

        <label className="relative block sm:w-72">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search files"
            className="h-10 w-full rounded-[8px] border border-zinc-700 bg-zinc-800 pl-9 pr-3 text-sm text-white outline-none transition-colors duration-150 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </label>
      </div>

      {documents.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-700 text-sm">
            <thead className="bg-zinc-800 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Name
                </th>

                <th scope="col" className="px-4 py-3">
                  Size
                </th>

                <th scope="col" className="px-4 py-3">
                  Status
                </th>

                <th scope="col" className="w-28 px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800">
              {documents.map((doc, index) => (
                <tr
                  key={doc.id}
                  className={`row-in transition-colors duration-150 ${
                    selectedId === doc.id
                      ? 'bg-indigo-500/10'
                      : 'hover:bg-zinc-800'
                  }`}
                  style={{
                    animationDelay: `${Math.min(index, 8) * 35}ms`
                  }}
                >
                  <td className="max-w-[320px] px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onSelect(doc)}
                      className="block min-w-0 text-left"
                    >
                      <span className="block truncate font-semibold text-white">
                        {doc.title || doc.file_name}
                      </span>

                      <span className="block truncate text-xs text-zinc-400">
                        {doc.file_name}
                      </span>
                    </button>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-zinc-400 [font-variant-numeric:tabular-nums]">
                    {formatBytes(doc.size_bytes)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusPill status={doc.status} />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        title="Open file in new tab"
                        onClick={() => onOpen?.(doc)}
                        className="grid h-9 w-9 place-items-center rounded-[8px] border border-emerald-800 bg-emerald-950/40 text-emerald-300 transition-all duration-150 hover:bg-emerald-900/50 active:scale-[0.95]"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        title="Delete file"
                        onClick={() => onDelete(doc)}
                        disabled={disabled || deletingId === doc.id}
                        className="grid h-9 w-9 place-items-center rounded-[8px] border border-red-800 bg-red-950/40 text-red-300 transition-all duration-150 hover:bg-red-900/50 active:scale-[0.95] disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
                      >
                        {deletingId === doc.id ? (
                          <Loader2
                            size={15}
                            className="animate-spin [animation-duration:0.6s]"
                          />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {documents.length === 0 && isFiltered && (
        <div className="grid min-h-32 place-items-center border-t border-zinc-700 p-6 text-center">
          <p className="text-sm text-zinc-400">
            No files match "{search.trim()}".
          </p>
        </div>
      )}

      {documents.length === 0 && !isFiltered && (
        <div className="flex flex-col items-center gap-2 border-t border-zinc-700 p-10 text-center">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-zinc-800 text-zinc-500">
            <Inbox size={20} />
          </div>

          <p className="text-sm font-medium text-white">
            No files yet
          </p>

          <p className="max-w-xs text-sm text-zinc-400">
            Upload a file on the left to see it listed here.
          </p>
        </div>
      )}
    </section>
  );
}