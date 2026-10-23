import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { AppRoutes } from "./App.tsx";
// Statically imported on purpose: `renderToString` emits a Suspense fallback for a
// `React.lazy` route and never waits for the chunk, so the paps landing would be
// prerendered as an empty div. The client keeps its lazy chunk (see App.tsx).
import Paps from "./pages/Paps.tsx";

interface RenderResult {
  html: string;
  helmet: HelmetServerState | null;
}

export function render(path: string): RenderResult {
  const helmetContext: { helmet?: HelmetServerState | null } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={path}>
        <AppRoutes paps={<Paps />} />
      </StaticRouter>
    </HelmetProvider>
  );

  return { html, helmet: helmetContext.helmet ?? null };
}
