import Navbar from "@/components/doba/Navbar";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";

export default function Support() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      <VantaBackground />
      <Navbar />

      <main className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">

        <h1 className="text-4xl sm:text-5xl font-black mb-4 text-foreground tracking-tight">
          Support & Help Center
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 font-medium">
          Have questions or need assistance? Our community and support team are here to help.
        </p>

        <div className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-2xl font-bold text-foreground mb-3">Community Discord</h2>
            <p className="text-sm mb-4">Join our Discord server for real-time support from team members and fellow creators.</p>
            <a href="https://discord.gg/69sUSFQT3" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-cyber-pink text-white px-5 py-2.5 rounded-md font-bold text-sm">
              Join Discord Server →
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
