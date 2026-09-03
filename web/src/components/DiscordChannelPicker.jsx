import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const UNCATEGORIZED = 'uncategorized';

export default function DiscordChannelPicker({
  channels,
  value,
  onChange,
  disabled
}) {
  const categories = useMemo(
    () =>
      channels
        .filter((channel) => channel.type === 'category')
        .sort((a, b) => a.position - b.position),
    [channels]
  );

  const channelsByCategory = useMemo(() => {
    const map = new Map();

    for (const channel of channels) {
      if (channel.type !== 'text') continue;

      const key = channel.parent_id || UNCATEGORIZED;

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key).push(channel);
    }

    for (const list of map.values()) {
      list.sort((a, b) => a.position - b.position);
    }

    return map;
  }, [channels]);

  const selectedChannel = useMemo(
    () => channels.find((channel) => channel.id === value) || null,
    [channels, value]
  );

  const [categoryId, setCategoryId] = useState(
    selectedChannel?.parent_id || UNCATEGORIZED
  );

  useEffect(() => {
    if (selectedChannel) {
      setCategoryId(selectedChannel.parent_id || UNCATEGORIZED);
    }
  }, [selectedChannel]);

  const hasUncategorized =
    (channelsByCategory.get(UNCATEGORIZED) || []).length > 0;

  const channelOptions = channelsByCategory.get(categoryId) || [];

  function handleCategoryChange(event) {
    setCategoryId(event.target.value);
    onChange('');
  }

  function handleChannelChange(event) {
    onChange(event.target.value);
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-white">
          Category
        </span>

        <div className="relative">
          <select
            value={categoryId}
            onChange={handleCategoryChange}
            disabled={disabled}
            className="h-10 w-full appearance-none rounded-[8px] border border-zinc-700 bg-zinc-900 px-3 pr-9 text-sm text-white outline-none transition-colors duration-150 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-zinc-800"
          >
            <option value="" disabled>
              Select a category
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}

            {hasUncategorized && (
              <option value={UNCATEGORIZED}>
                No category
              </option>
            )}
          </select>

          <ChevronDown
            size={15}
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
        </div>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-white">
          Channel
        </span>

        <div className="relative">
          <select
            value={value || ''}
            onChange={handleChannelChange}
            disabled={disabled || !categoryId}
            className="h-10 w-full appearance-none rounded-[8px] border border-zinc-700 bg-zinc-900 px-3 pr-9 text-sm text-white outline-none transition-colors duration-150 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-zinc-800"
          >
            <option value="">
              {categoryId
                ? 'Select a channel'
                : 'Choose a category first'}
            </option>

            {channelOptions.map((channel) => (
              <option key={channel.id} value={channel.id}>
                #{channel.name}
              </option>
            ))}
          </select>

          <ChevronDown
            size={15}
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
        </div>

        {categoryId && channelOptions.length === 0 && (
          <span className="mt-1.5 block text-xs text-zinc-400">
            No channels in this category.
          </span>
        )}
      </label>
    </div>
  );
}