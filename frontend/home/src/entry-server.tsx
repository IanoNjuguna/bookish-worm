import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { AppRoutes } from "./App.tsx";

interface RenderResult {
  html: string;
  helmet: HelmetServerState | null;
}

export function render(path: string): RenderResult {
  const helmetContext: { helmet?: HelmetServerState | null } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={path}>
        <AppRoutes />
      </StaticRouter>
    </HelmetProvider>
  );

  return { html, helmet: helmetContext.helmet ?? null };
}
