import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-void text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,hsl(var(--cyber-pink)/0.2),transparent_35%),radial-gradient(circle_at_80%_75%,hsl(var(--lavender)/0.2),transparent_40%)]" />

      <div className="container relative z-10 mx-auto flex min-h-screen items-center justify-center px-6 py-16 md:px-12">
        <section className="glass-surface w-full max-w-3xl border border-white/10 p-8 md:p-12">
          <div className="mb-10 flex flex-col items-center gap-6 text-center">
            <img
              src="/doba.png"
              alt="doba protocol logo"
              className="h-24 w-24 rounded-xl border border-white/15 bg-void/60 p-2"
            />
            <h1 className="font-mono text-2xl font-semibold tracking-[0.2em] text-cyber-pink md:text-3xl">
              ERROR 404
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-soft md:text-lg">
              The page you are looking for does not exist here. You can return to the home page or go back to the previous page.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-lavender px-6 py-3 font-semibold text-void transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-void"
            >
              Go to the homepage
            </Link>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-foreground transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-void"
            >
              Go back
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default NotFound;
