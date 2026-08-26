# Amarthya S. George — Portfolio

A responsive, editorial-style portfolio for **Amarthya S. George**, an AI / Data Science Engineer focused on applied artificial intelligence, machine-learning systems, agent orchestration, retrieval pipelines, and the infrastructure that supports them in production.

The site is designed as a lightweight multi-page experience with a warm paper palette, condensed display typography, structured metadata, responsive navigation, and dedicated pages for work, background, experience, and contact.

## Pages

| Page | Purpose |
|---|---|
| [Home](client/index.html) | Introduction and primary navigation into the portfolio. |
| [Work](client/work.html) | Selected projects across AI, machine learning, blockchain, security, and Android development. |
| [About](client/about.html) | Professional background, interests, technical skills, and tools. |
| [Experience](client/experience.html) | Internship experience and education history. |
| [Contact](client/contact.html) | Email, LinkedIn, GitHub, and résumé links. |

## Featured work

The portfolio highlights projects including a decentralized medical-records platform, a multi-agent social-deduction game, an Android media-player fork, a network-intrusion simulation and detection system, and an attention-based traffic-classification engine. Each project includes a concise overview, technology tags, and a link to its source repository where available.

## Technology

| Area | Technologies |
|---|---|
| Build and preview | Vite, TypeScript configuration, pnpm |
| Frontend | Semantic HTML, CSS, responsive layouts, vanilla JavaScript |
| Typography | Google Fonts including Bebas Neue, League Gothic, Inter, IBM Plex Mono, PT Serif, and Space Grotesk |
| Visual system | Warm paper surfaces, dark editorial ink, muted metadata, responsive navigation, and motion-aware transitions |
| Deployment configuration | Vercel with a Vite build and `dist/public` output |

## Run locally

Install the dependencies with pnpm and start the development server:

```bash
pnpm install
pnpm dev
```

The development server runs on port `3000` by default. Open the local address shown by Vite, then use the navigation or the following routes:

```text
/
/work.html
/about.html
/experience.html
/contact.html
```

To create a production build, run:

```bash
pnpm build
```

The project also includes the following useful commands:

| Command | Description |
|---|---|
| `pnpm dev` | Starts the Vite development server. |
| `pnpm build` | Builds the static site and supporting bundle. |
| `pnpm preview` | Serves the production build locally. |
| `pnpm check` | Runs the TypeScript compiler without emitting files. |
| `pnpm format` | Formats the project with Prettier. |

## Project structure

```text
Portfolio/
├── client/
│   ├── about.html
│   ├── contact.html
│   ├── experience.html
│   ├── index.html
│   ├── work.html
│   ├── css/
│   │   ├── base.css
│   │   ├── desktop.css
│   │   ├── mobile.css
│   │   └── site.css
│   └── js/
│       └── main.js
├── patches/
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```

## Author

**Amarthya S. George** is an AI / Data Science Engineer based in Mangaluru, India. For professional enquiries, visit the [Contact page](client/contact.html).

## License

This project is provided as a personal portfolio site. Refer to the repository for the current licensing details.
