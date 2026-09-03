import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import BackendStatusCard from './components/BackendStatusCard.jsx';
import DiscordChannelPicker from './components/DiscordChannelPicker.jsx';
// import DocPreview from './components/DocPreview.jsx';
import FileTable from './components/FileTable.jsx';
import FileUploader from './components/FileUploader.jsx';
import Layout from './components/Layout.jsx';
import {
  listDiscordChannels,
  subscribeToDiscordChannels
} from './lib/discordChannels.js';
import {
  createPreviewUrl,
  deleteDocument,
  listDocuments,
  queueDiscordShare,
  uploadDocument
} from './lib/files.js';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [search, setSearch] = useState('');
  const [channelId, setChannelId] = useState('');
  const [discordChannels, setDiscordChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState(null);

  const filteredDocuments = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return documents;

    return documents.filter((doc) => {
      const haystack =
        `${doc.title || ''} ${doc.file_name || ''} ${doc.mime_type || ''}`.toLowerCase();

      return haystack.includes(value);
    });
  }, [documents, search]);

  async function refreshDocuments() {
    setLoading(true);
    setNotice(null);

    try {
      const rows = await listDocuments();

      setDocuments(rows);

      setSelectedDoc((current) => {
        if (!current) return rows[0] || null;

        return (
          rows.find((doc) => doc.id === current.id) ||
          rows[0] ||
          null
        );
      });
    } catch (error) {
      setNotice({
        type: 'error',
        message: error.message || 'Could not load files.'
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshDocuments();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadChannels() {
      try {
        const rows = await listDiscordChannels();

        if (isMounted) {
          setDiscordChannels(rows);
        }
      } catch (error) {
        console.error(
          'Failed to load Discord channels:',
          error.message
        );
      }
    }

    loadChannels();

    const unsubscribe =
      subscribeToDiscordChannels(loadChannels);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  async function handleUpload(payload) {
    setBusy(true);
    setNotice(null);

    try {
      const uploaded = await uploadDocument(payload);

      setDocuments((current) => [uploaded, ...current]);
      setSelectedDoc(uploaded);

      setNotice({
        type: 'success',
        message: 'File uploaded.'
      });

      return uploaded;
    } catch (error) {
      setNotice({
        type: 'error',
        message: error.message || 'Upload failed.'
      });

      return null;
    } finally {
      setBusy(false);
    }
  }

  async function handleQueueShare(event) {
    event.preventDefault();

    if (!selectedDoc) return;

    setBusy(true);
    setNotice(null);

    try {
      await queueDiscordShare(selectedDoc, {
        channelId
      });

      setDocuments((current) =>
        current.map((doc) =>
          doc.id === selectedDoc.id
            ? { ...doc, status: 'queued' }
            : doc
        )
      );

      setSelectedDoc((current) =>
        current
          ? { ...current, status: 'queued' }
          : current
      );

      setChannelId('');

      setNotice({
        type: 'success',
        message: 'Discord message queued.'
      });
    } catch (error) {
      setNotice({
        type: 'error',
        message: error.message || 'Queue failed.'
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleOpen(doc) {
    if (!doc) return;

    if (!doc.storage_path) {
      setNotice({
        type: 'error',
        message:
          'No file path available for this document.'
      });

      return;
    }

    const newTab = window.open('', '_blank');

    if (newTab) {
      newTab.opener = null;
    }

    try {
      const url = await createPreviewUrl(doc);

      if (newTab) {
        newTab.location.href = url;
      } else {
        window.open(url, '_blank');
      }
    } catch (error) {
      if (newTab) newTab.close();

      setNotice({
        type: 'error',
        message: error.message || 'Could not open file.'
      });
    }
  }

  async function handleDelete(doc) {
    if (!doc) return;

    const name =
      doc.title || doc.file_name || 'this file';

    if (
      !window.confirm(
        `Delete "${name}" from storage and the database?`
      )
    ) {
      return;
    }

    setDeletingId(doc.id);
    setNotice(null);

    try {
      await deleteDocument(doc);

      setDocuments((current) =>
        current.filter((item) => item.id !== doc.id)
      );

      setSelectedDoc((current) => {
        if (!current || current.id !== doc.id)
          return current;

        return (
          documents.find(
            (item) => item.id !== doc.id
          ) || null
        );
      });

      setNotice({
        type: 'success',
        message:
          'File deleted from storage and database.'
      });
    } catch (error) {
      setNotice({
        type: 'error',
        message: error.message || 'Delete failed.'
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Layout
      onRefresh={refreshDocuments}
      loading={loading}
    >
      <aside className="space-y-4">

        <FileUploader
          onUpload={handleUpload}
          busy={busy}
        />

        <section className="rounded-[14px] border border-zinc-700 bg-zinc-900 p-4 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)]">
          <div className="mb-4 flex items-center gap-2">
            <Send
              size={18}
              className="text-white"
            />
            <h2 className="text-base font-semibold text-white">
              Send to Discord
            </h2>
          </div>

          <form
            onSubmit={handleQueueShare}
            className="space-y-4"
          >
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-white">
                Selected file
              </span>

              <input
                type="text"
                value={
                  selectedDoc
                    ? selectedDoc.title ||
                      selectedDoc.file_name
                    : ''
                }
                readOnly
                className="h-10 w-full rounded-[8px] border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-300"
              />
            </label>

            <DiscordChannelPicker
              channels={discordChannels}
              value={channelId}
              onChange={setChannelId}
              disabled={busy}
            />

            <button
              type="submit"
              disabled={
                busy ||
                !selectedDoc ||
                !channelId.trim()
              }
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

              Queue
            </button>
          </form>
        </section>

        {/* ── Backend wake-up card (below Discord panel) ── */}
        <BackendStatusCard />

        {notice && (
          <div
            className={`notice-in flex gap-3 rounded-[8px] p-4 text-sm ring-1 ${
              notice.type === 'error'
                ? 'bg-red-950/40 text-red-300 ring-red-800'
                : 'bg-emerald-950/40 text-emerald-300 ring-emerald-800'
            }`}
          >
            {notice.type === 'error' ? (
              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0"
              />
            ) : (
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0"
              />
            )}

            <span>{notice.message}</span>
          </div>
        )}
      </aside>

      <div className="min-w-0">
        <FileTable
          documents={filteredDocuments}
          selectedId={selectedDoc?.id}
          onSelect={setSelectedDoc}
          onDelete={handleDelete}
          onOpen={handleOpen}
          deletingId={deletingId}
          disabled={busy}
          search={search}
          onSearchChange={setSearch}
        />

        {/* <DocPreview doc={selectedDoc} /> */}
      </div>
    </Layout>
  );
}