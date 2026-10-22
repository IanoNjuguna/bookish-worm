import { useEffect, type ReactNode } from 'react';
import { IconX } from '@tabler/icons-react';

/**
 * The one sheet shape: a panel that comes up from the bottom edge, square top corners,
 * a hairline, and a close you can hit without aiming. Escape closes it, because on a
 * laptop that is the key people reach for.
 */
export function Sheet({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="close" onClick={onClose} className="flex-1 bg-black/60" />
      <div className="max-h-[86vh] overflow-y-auto border-t border-line bg-panel pb-[env(safe-area-inset-bottom)]">
        <div className="sticky top-0 flex items-center justify-between border-b border-line bg-panel px-4 py-3">
          <h2 className="text-title text-fg">{title}</h2>
          <button onClick={onClose} aria-label="close" className="rounded-control p-1 text-muted hover:text-fg">
            <IconX size={18} />
          </button>
        </div>
        <div className="px-4 py-4">{children}</div>
        {footer && <div className="sticky bottom-0 border-t border-line bg-panel px-4 py-3">{footer}</div>}
      </div>
    </div>
  );
}
