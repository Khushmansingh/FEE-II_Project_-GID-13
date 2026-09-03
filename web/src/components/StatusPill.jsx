const styles = {
  uploaded: {
    dot: 'bg-zinc-400',
    text: 'text-zinc-300',
    bg: 'bg-zinc-800',
    ring: 'ring-zinc-700'
  },

  queued: {
    dot: 'bg-amber-400',
    text: 'text-amber-300',
    bg: 'bg-amber-950/40',
    ring: 'ring-amber-800'
  },

  sent: {
    dot: 'bg-emerald-400',
    text: 'text-emerald-300',
    bg: 'bg-emerald-950/40',
    ring: 'ring-emerald-800'
  },

  failed: {
    dot: 'bg-red-400',
    text: 'text-red-300',
    bg: 'bg-red-950/40',
    ring: 'ring-red-800'
  }
};

export default function StatusPill({ status = 'uploaded' }) {
  const style = styles[status] || styles.uploaded;

  return (
    <span
      className={`inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold capitalize ring-1 ${style.bg} ${style.text} ${style.ring}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}