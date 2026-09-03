import { Loader2, Send, UploadCloud, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function FileUploader({ onUpload, busy }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function clearFile() {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const uploaded = await onUpload({
      file,
      title
    });

    if (uploaded) {
      setFile(null);
      setTitle('');
      event.currentTarget.reset();
    }
  }

  return (
    <section className="rounded-[14px] border border-zinc-700 bg-zinc-900 p-4 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)]">
      <div className="mb-4 flex items-center gap-2">
        <UploadCloud size={18} className="text-white" />
        <h2 className="text-base font-semibold text-white">
          Upload
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <span className="mb-1.5 block text-sm font-semibold text-white">
            File
          </span>

          <div
            role="button"
            tabIndex={0}
            aria-label="Choose a file to upload, or drop one here"
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={`flex min-h-[104px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[10px] border-2 border-dashed px-4 py-5 text-center transition-colors duration-150 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-zinc-700 bg-zinc-800 hover:border-zinc-500'
            }`}
          >
            <UploadCloud
              size={20}
              className="text-zinc-500"
            />

            <p className="text-sm font-medium text-white">
              Drop a file or click to browse
            </p>

            <p className="text-xs text-zinc-400">
              PDF, Word, image, or text
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.md,image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) =>
                setFile(event.target.files?.[0] || null)
              }
              className="hidden"
            />
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-white">
            Title
          </span>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Quarterly plan"
            className="h-10 w-full rounded-[8px] border border-zinc-700 bg-zinc-900 px-3 text-sm text-white outline-none transition-colors duration-150 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </label>

        {file && (
          <div className="flex items-center justify-between gap-3 rounded-[8px] bg-zinc-800 px-3 py-2 text-sm ring-1 ring-zinc-700">
            <div className="min-w-0">
              {previewUrl ? (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate font-semibold text-indigo-400 hover:underline"
                >
                  {title.trim() || file.name}
                </a>
              ) : (
                <span className="block truncate font-semibold text-white">
                  {title.trim() || file.name}
                </span>
              )}

              <span className="block truncate font-mono text-xs text-zinc-400">
                {file.name}
              </span>
            </div>

            <button
              type="button"
              title="Clear selected file"
              onClick={clearFile}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-zinc-400 transition-colors duration-150 hover:bg-zinc-700 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={busy || !file}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-indigo-600 px-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-700"
        >
          {busy ? (
            <Loader2
              size={16}
              className="animate-spin [animation-duration:0.6s]"
            />
          ) : (
            <Send size={16} />
          )}

          Upload
        </button>
      </form>
    </section>
  );
}