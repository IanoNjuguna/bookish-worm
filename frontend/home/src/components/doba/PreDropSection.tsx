import { Link } from "react-router-dom";
import dictionary from "@/data/adjectives.json";

interface DictionaryEntry {
  term: string;
  pronunciation?: string;
  partOfSpeech?: string;
  grammar?: string;
  register?: string;
  definition: string;
  example?: string;
  etymology?: string;
}

const entries = (dictionary as DictionaryEntry[]).filter(
  (entry) => entry.term.toLowerCase() === "pre-drop"
);

const EntryLine = ({ entry }: { entry: DictionaryEntry }) => (
  <div>
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
      <span className="text-xs font-bold uppercase tracking-widest text-cyber-pink">
        {entry.partOfSpeech}
      </span>
      {entry.grammar && (
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
          {entry.grammar}
        </span>
      )}
      {entry.register && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          ({entry.register})
        </span>
      )}
    </div>
    <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-2">
      <span className="text-cyber-pink font-bold mr-2">1</span>
      {entry.definition}
    </p>
    {entry.example && (
      <p className="text-xs italic text-zinc-500 dark:text-zinc-500 ml-5 border-l-2 border-cyber-pink/30 pl-3">
        “{entry.example}”
      </p>
    )}
  </div>
);

const PreDropSection = () => {
  const headword = entries[0]?.term ?? "pre-drop";
  const pronunciation = entries[0]?.pronunciation ?? "/ˌpriːˈdrɒp/";
  const etymology = entries[0]?.etymology ?? "from pre- + drop";

  return (
    <section className="pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground lowercase">
            {headword}
          </h1>
          <span className="font-mono text-base text-zinc-500 dark:text-zinc-400">
            {pronunciation}
          </span>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
          <span className="font-bold uppercase tracking-wider">Origin</span>{" "}
          {etymology}
        </p>

        <div className="h-[1px] rounded-full bg-gradient-to-r from-transparent via-midnight/[0.08] dark:via-white/[0.08] to-transparent mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {entries.map((entry, index) => (
            <EntryLine key={index} entry={entry} />
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/pre-drop"
          className="inline-flex items-center justify-center h-11 px-7 rounded-lg bg-cyber-pink hover:bg-cyber-pink/90 text-black font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-md"
        >
          Learn more
        </Link>
      </div>
    </section>
  );
};

export default PreDropSection;
