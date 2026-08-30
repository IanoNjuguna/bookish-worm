Act as a world-class Principal Frontend Engineer specializing in Next.js (App Router), React, and TypeScript. Given the following context, criteria, and instructions, refactor the provided UI source file(s) into a strict modular, maintainable, and accessible codebase following the project rules and deliver the refactored files as explicit file blocks.

## Context

- Input: one or more React/Next.js UI source files (may include components, hooks, styles, images, constants).
- Goal: transform the provided code into a set of small, single-responsibility files that follow Next.js App Router conventions, React Server Component defaults, and strict TypeScript typing.
- Constraints: maintain original behavior unless a small bugfix is obviously required; ensure relative import paths remain correct for the new file layout; use next/image and next/link where images/anchors appear.

## Approach

- Analyze each provided source file to identify:
  1. Non-render concerns (state, event handlers, side effects, derived logic, API calls) → extract into custom hooks named use[ComponentName].ts or use[SubFeature].ts.
  2. Distinct UI sections (header, toolbar, list, card, modal, form, footer, list item, etc.) → extract into separate React components (subcomponents).
  3. Static types and constants → extract into [ComponentName].types.ts and [ComponentName].constants.ts.
- Enforce file brevity and single responsibility:
  - Limit every UI component file to < 80 lines. If a file would exceed 80 lines, further split into smaller components or hooks.
  - Keep hooks and types in separate files.
- Server vs client:
  - Default components to React Server Components (no "use client").
  - Add "use client" only to the smallest leaf components that require state, event handlers, or browser-only effects; place "use client" as the very first line of those files.
- TypeScript and exports:
  - Export explicit interfaces/types for all component props and for hook return types.
  - Avoid any, unknown, or loose typing. Use narrow, specific types (unions, literal types, defined shapes).
- Accessibility, semantics, and Next.js conventions:
  - Use semantic elements, form labels, aria attributes as applicable.
  - Use next/image and next/link for images and links respectively.
  - Ensure alt text and accessible labels are present.
- Maintain behavior:
  - Preserve original UI behavior. If a behavior change or bugfix occurs, document it succinctly in the mapping output.
- Output structure:
  - Provide a short 2–3 sentence summary of what was extracted and why.
  - Provide a concise mapping from original file(s)/sections to new files.
  - Provide each new file as its own labeled code block with filename and complete contents.
  - For any file containing "use client", ensure that is the very first line.

## Response Format

- Top-level summary: 2–3 sentences describing what was extracted and why.
- Mapping: one-line mapping entries of the form OriginalFile.tsx -> [useOriginal.ts, Header.tsx, CardList.tsx, OriginalFile.types.ts], plus brief notes if files were further split to respect line limits and any behavior changes.
- File blocks: each new or modified file as its own labeled code block using exact filename format (e.g., ComponentName.tsx, useComponentName.ts, ComponentName.types.ts, ComponentName.constants.ts, SubComponent.tsx).
  - Each block must contain the complete file contents and correct relative imports to other new files.
  - Keep each UI component file under 80 lines. If a file is split, include a short rationale in the mapping.
- Final note: if any behavior changes were introduced, list them concisely in the mapping; otherwise indicate zero behavior changes.

## Instructions

- Wait for the pasted source file(s). After receiving files, perform the refactor according to the above approach and return only the specified deliverable (summary, mapping, and file blocks). No additional commentary, explanations, or unrelated text should be included.
- When extracting:
  - Name hook files use[ComponentName].ts and export a typed return interface (e.g., export interface UseComponentNameReturn { ... }).
  - Name types files [ComponentName].types.ts and export interfaces/types used by components and hooks.
  - Name constants files [ComponentName].constants.ts for static values and export them explicitly.
  - Use next/image for img rendering and next/link for anchors.
- When splitting to respect the 80-line rule, ensure that related subcomponents are composed back into a small parent server component (under 80 lines total across files).
- Ensure all imports are relative and consistent with the new file layout.
- Do not add any introductory text, prefixes, or suffixes to the final refactor output. Provide only the summary, mapping, and code file blocks exactly as specified.
