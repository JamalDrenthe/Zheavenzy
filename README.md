# Zheavenzy

Zheavenzy is een moderne Nederlandstalige website voor een muziekplatform voor
independent artiesten. De site presenteert distributie, promotie, mixing &
mastering, studioboekingen, netwerkmogelijkheden en strategisch advies vanuit
één duidelijke merkervaring.

## Functionaliteiten

- Responsieve homepage met hero-sectie, statistieken, animaties en call-to-actions.
- Overzicht van diensten voor artiesten, waaronder distributie, marketing,
  mixing & mastering en studioboekingen.
- Netwerkpagina voor samenwerkingen, events en regionale kansen.
- Over-pagina met informatie over de visie en werkwijze van Zheavenzy.
- Contactpagina met contactformulier, contactgegevens en sociale links.
- Nederlandstalige navigatie met aparte routes voor Home, Artiesten, Netwerk,
  Over en Contact.
- Scroll-reveal-effecten, motion-animaties, particle-achtergrond en interactieve
  mobiele navigatie.
- Herbruikbare UI-componenten op basis van Radix UI en Tailwind CSS.

## Tech stack

- React 19
- TypeScript
- Vite 7
- React Router
- Tailwind CSS
- Framer Motion en GSAP
- Lucide React
- Radix UI
- ESLint

## Lokaal draaien

### Vereisten

- Node.js 20 of nieuwer
- npm

### Installatie

```bash
npm install
```

### Ontwikkelserver starten

```bash
npm run dev
```

De ontwikkelserver is daarna beschikbaar op de lokale URL die Vite toont.

### Productiebuild maken

```bash
npm run build
```

### Productiebuild lokaal bekijken

```bash
npm run preview
```

## Scripts

| Script | Beschrijving |
| --- | --- |
| `npm run dev` | Start de Vite-ontwikkelserver met hot module replacement. |
| `npm run build` | Controleert de TypeScript-projecten en maakt een production build. |
| `npm run lint` | Voert ESLint uit op het project. |
| `npm run preview` | Serveert de production build lokaal. |

## Projectstructuur

```text
.
├── public/
│   ├── _redirects
│   └── images/             # Afbeeldingen voor de website
├── src/
│   ├── components/         # Layout-, navigatie- en UI-componenten
│   │   └── ui/             # Herbruikbare UI-primitieven
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Gedeelde hulpfuncties
│   ├── pages/              # Pagina's voor de verschillende routes
│   ├── App.tsx             # Routerconfiguratie en rootcomponent
│   ├── App.css             # Applicatiespecifieke stijlen
│   ├── index.css           # Globale stijlen en Tailwind-basis
│   └── main.tsx            # Applicatie-entrypoint
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Licentie

Er is op dit moment geen aparte licentie in deze repository opgenomen.
