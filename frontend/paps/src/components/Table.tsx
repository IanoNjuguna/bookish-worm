import { cn } from '../lib/cn';

/** Shared blotter table furniture: hairline rows, mono numerals, labels left, numbers right. */

export const Th = ({ cols }: { cols: string[] }) => (
  <tr className="border-b border-line">
    {cols.map((c) => (
      <th key={c} className="px-3 py-1.5 text-left font-normal first:pl-3">
        {c}
      </th>
    ))}
  </tr>
);

export const Td = ({
  children,
  num,
  muted,
  tone,
}: {
  children: React.ReactNode;
  num?: boolean;
  muted?: boolean;
  tone?: 'long' | 'short';
}) => (
  <td
    className={cn(
      'px-3 py-1.5',
      num && 'num',
      muted && 'text-muted',
      tone === 'long' && 'text-long',
      tone === 'short' && 'text-short',
    )}
  >
    {children}
  </td>
);

export const Empty = ({ cols, text }: { cols: number; text: string }) => (
  <tr>
    <td colSpan={cols} className="px-3 py-6 text-center text-[11px] text-muted">
      {text}
    </td>
  </tr>
);
