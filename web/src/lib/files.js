import { bucketName, requireSupabase } from './supabase.js';

const FALLBACK_MIME = 'application/octet-stream';

function sanitizeFileName(name) {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function todayPathSegment() {
  return new Date().toISOString().slice(0, 10);
}

export function formatBytes(bytes = 0) {
  if (!bytes) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export async function listDocuments() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  return data || [];
}

export async function uploadDocument({ file, title, channelId, message }) {
  if (!file) {
    throw new Error('Choose a file first.');
  }

  const client = requireSupabase();
  const id = crypto.randomUUID();
  const cleanName = sanitizeFileName(file.name) || `upload-${id}`;
  const storagePath = `documents/${todayPathSegment()}/${id}-${cleanName}`;
  const mimeType = file.type || FALLBACK_MIME;

  const uploadResult = await client.storage.from(bucketName).upload(storagePath, file, {
    cacheControl: '3600',
    contentType: mimeType,
    upsert: false
  });

  if (uploadResult.error) throw uploadResult.error;

  const documentRow = {
    id,
    bucket: bucketName,
    storage_path: storagePath,
    title: title?.trim() || file.name,
    file_name: file.name,
    mime_type: mimeType,
    size_bytes: file.size,
    discord_channel_id: channelId?.trim() || null,
    message: message?.trim() || null,
    status: channelId?.trim() ? 'queued' : 'uploaded'
  };

  const { data, error } = await client
    .from('documents')
    .insert(documentRow)
    .select('*')
    .single();

  if (error) throw error;

  if (channelId?.trim()) {
    await queueDiscordShare(data, {
      channelId,
      message: message || `Shared file: ${data.title}`
    });
  }

  return data;
}

export async function createPreviewUrl(doc) {
  const client = requireSupabase();
  const { data } = client.storage
    .from(doc.bucket || bucketName)
    .getPublicUrl(doc.storage_path);
  return data.publicUrl;
}

export async function deleteDocument(doc) {
  if (!doc?.id) {
    throw new Error('Choose a file to delete.');
  }

  const client = requireSupabase();

  if (doc.storage_path) {
    const storageResult = await client.storage
      .from(doc.bucket || bucketName)
      .remove([doc.storage_path]);

    if (storageResult.error) throw storageResult.error;
  }

  const deleteResult = await client
    .from('documents')
    .delete()
    .eq('id', doc.id);

  if (deleteResult.error) throw deleteResult.error;
}

export async function queueDiscordShare(doc, { channelId, message }) {
  const client = requireSupabase();
  const cleanChannelId = channelId?.trim();
  const cleanMessage = message?.trim() || `Shared file: ${doc.title || doc.file_name}`;

  if (!cleanChannelId) {
    throw new Error('Add a Discord channel ID.');
  }

  const { data, error } = await client
    .from('outgoing_messages')
    .insert({
      document_id: doc.id,
      channel_id: cleanChannelId,
      message: cleanMessage,
      status: 'pending'
    })
    .select('*')
    .single();

  if (error) throw error;

  const updateResult = await client
    .from('documents')
    .update({
      status: 'queued',
      discord_channel_id: cleanChannelId,
      message: cleanMessage
    })
    .eq('id', doc.id);

  if (updateResult.error) throw updateResult.error;

  return data;
}
