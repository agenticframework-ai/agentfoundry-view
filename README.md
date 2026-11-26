# Enterprise Agentic AI Strategy Framework

An interactive, browser-based executive briefing and customer workshop tool. It presents 18 connected sections—from opportunity discovery and agent suitability through architecture, security, operations, AI model benchmarking, cloud cost estimation and an executive action brief.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Create a static production bundle with `npm run build`; preview it with `npm run preview`.

## Presentation controls

- **← / →**, **Page Up / Page Down**, or **Space**: previous / next section
- **Home / End**: first / last section
- **F**: toggle browser fullscreen
- **Esc**: close the contents menu
- Use the section progress markers, Previous / Next controls, and Contents menu for mouse navigation.
- The final executive summary can be printed or saved to PDF from the browser.

## Interactive sections

The presentation includes a discovery canvas, weighted suitability calculator, clickable architecture layers, framework filter, RAG pipeline and sample retrieval, lifecycle explorer, AWS/Azure/GCP service mapping, threat/control/evidence explorer, governance model, release pipeline, illustrative monitoring dashboard, AI model benchmarking with CSV/JSON import and export, an interactive cloud service cost estimator comparing AWS, Azure and Google Cloud, use-case workflow, roadmap gates, RACI matrix and summary generator.

## Assumptions and responsible use

All costs, metrics, sample sources and business case numbers are illustrative and configurable where applicable. Cost rates are not vendor quotations. Suitability scoring is a workshop heuristic, not an industry standard or an approval mechanism. Validate data access, risk, performance, cost and legal obligations against the customer environment. High-impact financial, credit, legal and regulated decisions require appropriate human accountability and controls. Parameter and ColorTokens are illustrative options, not mandatory components; verify product capabilities and fit independently. Microsegmentation complements rather than replaces application authorization and guardrails.

The application is frontend-only. It does not send questionnaire, calculator or summary inputs to a backend. Google Fonts are requested by the browser at runtime; system sans-serif fallbacks are provided.

## Project structure

```text
src/
  components/   Reusable UI and section content
  data/         Presentation copy, architecture and reference data
  styles/       Responsive theme and print styles
  App.jsx       Presentation shell, keyboard controls and navigation
  main.jsx      React entry point
```



