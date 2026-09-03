import { requireSupabase } from './supabase.js';

export async function listDiscordChannels() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('discord_channels')
    .select('*')
    .order('position', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Subscribes to live inserts/updates/deletes on discord_channels so the
// channel picker stays current when the bot syncs new categories/channels.
// Returns an unsubscribe function.
export function subscribeToDiscordChannels(onChange) {
  const client = requireSupabase();

  const channel = client
    .channel('discord_channels_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'discord_channels' }, onChange)
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}
