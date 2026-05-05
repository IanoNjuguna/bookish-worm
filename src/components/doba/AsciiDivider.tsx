type AsciiDividerProps = {
  symbol?: string;
  className?: string;
};

const AsciiDivider = ({ symbol = "···", className = "" }: AsciiDividerProps) => {
  return (
    <div className={`w-full flex justify-center text-center ${className}`.trim()} aria-hidden="true">
      <span className="font-mono text-xs text-lavender/45 tracking-widest select-none">
        {symbol}
      </span>
    </div>
  );
};

export default AsciiDivider;
