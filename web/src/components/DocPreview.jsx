import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2
} from 'lucide-react';
import mammoth from 'mammoth';
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { createPreviewUrl } from '../lib/files.js';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

function useElementWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(720);

  useEffect(() => {
    if (!ref.current) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

function getPreviewKind(doc) {
  const type = doc?.mime_type || '';
  const name = doc?.file_name || '';

  if (type.includes('pdf') || name.endsWith('.pdf')) return 'pdf';
  if (type.includes('wordprocessingml') || name.endsWith('.docx')) return 'docx';
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('text/') || name.endsWith('.md') || name.endsWith('.txt')) return 'text';

  return 'unsupported';
}

export default function DocPreview({ doc }) {
  const [url, setUrl] = useState('');
  const [html, setHtml] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [previewRef, previewWidth] = useElementWidth();

  const kind = getPreviewKind(doc);

  useEffect(() => {
    let cancelled = false;

    async function loadPreview() {
      setUrl('');
      setHtml('');
      setText('');
      setError('');
      setLoading(Boolean(doc));
      setPageNumber(1);
      setPageCount(0);

      if (!doc) {
        setLoading(false);
        return;
      }

      try {
        const signedUrl = await createPreviewUrl(doc);

        if (cancelled) return;

        setUrl(signedUrl);

        if (kind === 'docx') {
          const response = await fetch(signedUrl);
          const buffer = await response.arrayBuffer();
          const result = await mammoth.convertToHtml({
            arrayBuffer: buffer
          });

          if (!cancelled) {
            setHtml(result.value);
          }
        }

        if (kind === 'text') {
          const response = await fetch(signedUrl);
          const value = await response.text();

          if (!cancelled) {
            setText(value);
          }
        }
      } catch (previewError) {
        if (!cancelled) {
          setError(previewError.message || 'Preview failed.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, [doc, kind]);

  return (
    <section className="rounded-[14px] border border-zinc-700 bg-zinc-900 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)]">
      <div className="flex flex-col gap-3 border-b border-zinc-700 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-white">
            Preview
          </h2>

          <p className="mt-1 truncate text-sm text-zinc-400">
            {doc ? doc.title || doc.file_name : 'Select a file'}
          </p>
        </div>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-zinc-700 bg-zinc-800 px-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-zinc-700"
          >
            <ExternalLink size={15} />
            Open
          </a>
        )}
      </div>

      <div ref={previewRef} className="min-h-[420px] overflow-hidden p-4">
        {!doc && (
          <div className="grid min-h-[360px] place-items-center text-sm text-zinc-400">
            Select a file to preview it here.
          </div>
        )}

        {loading && (
          <div className="grid min-h-[360px] place-items-center text-sm font-medium text-zinc-400">
            <span className="inline-flex items-center gap-2">
              <Loader2
                size={17}
                className="animate-spin [animation-duration:0.6s]"
              />
              Loading preview
            </span>
          </div>
        )}

        {error && (
          <div className="flex min-h-[360px] items-center justify-center">
            <div className="flex max-w-md gap-3 rounded-[8px] bg-red-950/40 p-4 text-sm text-red-300 ring-1 ring-red-800">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && url && kind === 'pdf' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-[8px] bg-zinc-800 px-3 py-2">
              <button
                type="button"
                title="Previous page"
                onClick={() =>
                  setPageNumber((current) =>
                    Math.max(current - 1, 1)
                  )
                }
                disabled={pageNumber <= 1}
                className="grid h-9 w-9 place-items-center rounded-[8px] border border-zinc-700 bg-zinc-900 text-zinc-400 transition-all duration-150 hover:text-white active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
              </button>

              <span className="font-mono text-sm font-medium text-zinc-300 [font-variant-numeric:tabular-nums]">
                {pageNumber} / {pageCount || 1}
              </span>

              <button
                type="button"
                title="Next page"
                onClick={() =>
                  setPageNumber((current) =>
                    Math.min(current + 1, pageCount || 1)
                  )
                }
                disabled={!pageCount || pageNumber >= pageCount}
                className="grid h-9 w-9 place-items-center rounded-[8px] border border-zinc-700 bg-zinc-900 text-zinc-400 transition-all duration-150 hover:text-white active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="flex justify-center overflow-auto rounded-[8px] bg-zinc-800 p-3">
              <Document
                file={url}
                onLoadSuccess={({ numPages }) =>
                  setPageCount(numPages)
                }
              >
                <Page
                  pageNumber={pageNumber}
                  width={Math.max(
                    280,
                    Math.min(previewWidth - 32, 860)
                  )}
                />
              </Document>
            </div>
          </div>
        )}

        {!loading && !error && url && kind === 'docx' && (
          <article
            className="preview-prose max-h-[700px] overflow-auto rounded-[8px] border border-zinc-700 bg-zinc-900 p-5 text-sm leading-6 text-white"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}

        {!loading && !error && url && kind === 'image' && (
          <div className="grid min-h-[360px] place-items-center rounded-[8px] bg-zinc-800 p-3">
            <img
              src={url}
              alt={doc.title || doc.file_name}
              className="max-h-[700px] max-w-full rounded-[6px] object-contain"
            />
          </div>
        )}

        {!loading && !error && url && kind === 'text' && (
          <pre className="max-h-[700px] overflow-auto whitespace-pre-wrap rounded-[8px] border border-zinc-700 bg-black p-4 font-mono text-sm leading-6 text-zinc-100">
            {text}
          </pre>
        )}

        {!loading && !error && url && kind === 'unsupported' && (
          <div className="grid min-h-[360px] place-items-center text-center text-sm text-zinc-400">
            <span>Preview unavailable for this file type.</span>
          </div>
        )}
      </div>
    </section>
  );
}