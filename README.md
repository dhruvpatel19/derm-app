# DermEd - Dermatology Education Platform

A web-based dermatology learning platform for medical students, built for observation-first learning with real clinical datasets. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

> **For educational purposes only. Not for clinical use, patient care, or clinical decision support.**

## Features

### Learning Modules
- **Condition Explorer** — Browse 10+ dermatology conditions with clinical features, differentials, management, red flags, linked cases, and image assets
- **Morphology Glossary** — 30 morphology terms across 6 categories with definitions, confusion points, mnemonics, and related terms
- **Rapid-fire Trainer** — Image-specific observation quiz with 20+ items, chip-select/single-select/differential-rank question types, deterministic scoring, forbidden-assumption detection, and detailed feedback
- **Interactive Case Engine** — 5 multi-step clinical cases with single/multi-select, differential ranking, ordered steps, dangerous answer detection
- **Compare Mode** — Side-by-side comparison of look-alike conditions (psoriasis vs eczema, BCC vs SCC vs SK, tinea vs nummular eczema)
- **Simulation Lab** — 6 procedural reasoning simulations: biopsy choice trainer (3), SVG-based target selector (2), procedure sequencing (1)

### Data Infrastructure
- **Multi-dataset architecture** — SCIN and PAD-UFES-20 ingestion adapters with normalized taxonomy mapping
- **Image annotation system** — Provenance-tracked annotations (dataset_native, human_curated, model_proposed, model_verified, condition_prior_only)
- **VLM annotation pipeline** — Provider-abstracted annotation proposal generator with observation-first prompting
- **Asset license registry** — Per-image provenance, license tracking, and redistribution flags

### Progress & Review
- **Progress Dashboard** — Quiz accuracy, case completions, simulation scores, weak concept tracking
- **Learning History** — Timeline of all attempts with exportable data
- **Annotation Review Queue** — Accept/reject model-proposed annotations

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** + **shadcn/ui** components
- **Zod** for 49 domain schemas with inferred types
- **Deterministic scoring** — Two scoring engines (legacy morphology + new quiz scorer) with synonym support, partial credit, forbidden assumption penalties, and dangerous mimic detection

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Dataset Setup

### SCIN Dataset
1. Download the SCIN dataset and place it in `data/datasets/scin/`
2. Expected structure: metadata CSV + `images/` directory
3. Run the import:
```bash
npx tsx scripts/import-scin.ts --data-dir data/datasets/scin
# Or generate sample data for testing:
npx tsx scripts/import-scin.ts --generate-sample
```

### PAD-UFES-20 Dataset
1. Download PAD-UFES-20 and place it in `data/datasets/pad-ufes-20/`
2. Expected structure: metadata CSV + image files
3. Run the import:
```bash
npx tsx scripts/import-pad-ufes-20.ts --data-dir data/datasets/pad-ufes-20
# Or generate sample data:
npx tsx scripts/import-pad-ufes-20.ts --generate-sample
```

### Generate Quiz Items from Datasets
```bash
npx tsx scripts/build-quiz-seeds.ts
```

### Validate Asset Registry
```bash
npx tsx scripts/validate-asset-registry.ts
# Strict mode (fails on errors):
npx tsx scripts/validate-asset-registry.ts --strict
```

### Generate VLM Annotation Proposals
```bash
# Mock provider (for testing):
npx tsx scripts/generate-annotation-proposals.ts --provider mock
# With limit:
npx tsx scripts/generate-annotation-proposals.ts --provider mock --limit 10
```

## Project Structure

```
src/
  app/                        # Next.js App Router pages (15 routes)
    explorer/                 # Condition browser + detail pages
    glossary/                 # Morphology term glossary
    trainer/                  # Rapid-fire observation quiz
    cases/                    # Interactive case engine
    compare/                  # Look-alike comparison modules
    simulation/               # Procedural reasoning simulations
    dashboard/                # Learner progress dashboard
    history/                  # Learning history timeline
    review/                   # Annotation review queue
  components/
    ui/                       # shadcn/ui components (12)
    layout/                   # Header, footer
    explorer/                 # Condition filter
    glossary/                 # Glossary content
    trainer/                  # Trainer client (chip-select, radio, ranking)
    cases/                    # Case engine client
    compare/                  # Compare detail view
    simulation/               # Biopsy choice, target selector, procedure sequence
    dashboard/                # Dashboard client
    review/                   # Review queue client
    history/                  # History client
  data/                       # Seed data
    generated/                # Script-generated JSON outputs
    conditions.ts             # 10 conditions
    cases.ts                  # 5 clinical cases
    quiz-items-v2.ts          # 20 image-specific quiz items
    morphology-terms.ts       # 30 glossary terms
    compare-modules.ts        # 3 comparison modules
    simulation-modules.ts     # 6 simulation modules
    image-assets.ts           # Image asset registry
    license-records.ts        # License records
  lib/
    domain/schemas.ts         # 49 Zod schemas + TypeScript types
    datasets/                 # Dataset adapters + taxonomy
      taxonomy.ts             # SCIN (38 labels) + PAD (6 labels) mapping
      body-site-map.ts        # 130+ body site normalizations
      scin-adapter.ts         # SCIN normalization
      pad-adapter.ts          # PAD-UFES-20 normalization
      types.ts                # Common normalized types
    scoring/
      morphology-scorer.ts    # Legacy scoring engine (16 tests)
      quiz-scorer.ts          # New image-specific scoring engine
    use-progress.ts           # localStorage progress hook
    session.ts                # Anonymous session tracking
scripts/
  import-scin.ts              # SCIN dataset import
  import-pad-ufes-20.ts       # PAD-UFES-20 import
  build-quiz-seeds.ts         # Quiz generation from imported data
  validate-asset-registry.ts  # Asset validation
  generate-annotation-proposals.ts  # VLM annotation pipeline
```

## Scoring Philosophy

### Image-Specific Truth
Quiz scoring is based on what is **visible in the specific image**, not disease-level textbook facts. The system enforces this through:
- **requiredConcepts**: Features confirmed as visible in this image
- **forbiddenAssumptions**: Disease-typical features NOT confirmed for this image (selecting these is penalized with feedback: "This is typical of [condition] but not clearly visible in this image")
- **optionalConcepts**: Bonus features that may be visible

### Annotation Provenance
Only annotations with provenance `dataset_native`, `human_curated`, or `model_verified` may be used as scored answer keys. `model_proposed` annotations appear in the review queue but never in scoring. `condition_prior_only` annotations may appear in explanations and teaching content but never as image-specific quiz truth.

### Scoring Weights
- Core morphology: 40%
- Secondary features: 15%
- Body site / distribution: 15%
- Differential quality: 20%
- Management pearl: 10%

All grading is deterministic — no LLM dependency.

## Running Tests

```bash
# Scoring engine tests (16 tests)
node --import tsx --test src/lib/scoring/__tests__/morphology-scorer.test.ts
```

## Content Summary

| Category | Count | Source |
|----------|-------|--------|
| Conditions | 10 | Manually authored |
| Glossary terms | 30 | Manually authored |
| Quiz items (v2) | 20 | Image-specific, 4 question types |
| Clinical cases | 5 | Manually authored, 3-5 questions each |
| Compare modules | 3 | Psoriasis/eczema, BCC/SCC/SK, tinea/nummular |
| Simulation modules | 6 | 3 biopsy choice, 2 target selector, 1 procedure |
| Image assets | 20 | Demo placeholders (replace with real datasets) |
| Taxonomy mappings | 44 | SCIN (38) + PAD (6) |
| Body site mappings | 130+ | Cross-dataset normalization |

## Known Gaps & Future Work

### Dataset Coverage
SCIN + PAD-UFES-20 cover common inflammatory/infectious dermatology and skin cancer/lesion conditions well. These areas have LIMITED or NO coverage:
- Procedures, burns, ulcers — require custom illustrations
- Rare genodermatoses — require specialized datasets
- Autoimmune blistering diseases — limited representation
- Hair/nail disorders — scattered across datasets

### Roadmap
- [ ] Prisma + SQLite for persistent progress
- [ ] Authentication (NextAuth) for per-user tracking
- [ ] Admin content management UI
- [ ] R2/S3 image storage for production
- [ ] Spaced repetition scheduler
- [ ] Treatment builder / prescription trainer
- [ ] Additional datasets (DDI, ISIC/HAM10000)
- [ ] Dense segmentation overlays for advanced simulation

## Environment Variables

See `.env.example` for all configuration options.

## GitHub And Vercel Publishing

For a normal GitHub and Vercel test deployment, commit the application code and the generated seed data in `src/data/generated`, but do not commit the raw dataset downloads in `data/datasets`.

Why:
- The raw PAD and SCIN dataset folders are large and can exceed GitHub upload limits.
- Some raw files are local-only assets that are better kept out of source control.
- The app will still build and deploy without those raw folders.

Important deployment note:
- SCIN images use remote URLs and work on Vercel.
- PAD images can run in either mode:
  - local development fallback through `/api/image/...`
  - public cloud storage via `NEXT_PUBLIC_PAD_DATASET_BASE_URL`
- For a real hosted test environment, upload `data/datasets/pad-ufes-20/images` to a public bucket and set `NEXT_PUBLIC_PAD_DATASET_BASE_URL` in Vercel.
- The resolver strips the local prefix `data/datasets/pad-ufes-20/images/`, so a local path like `data/datasets/pad-ufes-20/images/imgs_part_1/imgs_part_1/PAT_330_695_296.png` becomes `https://storage.googleapis.com/your-bucket/imgs_part_1/imgs_part_1/PAT_330_695_296.png`.

Example PAD asset flow:

```bash
# Upload the PAD images folder to GCS
npm run upload:pad:gcs -- gs://your-bucket
```

Then set this in Vercel:

```bash
NEXT_PUBLIC_PAD_DATASET_BASE_URL=https://storage.googleapis.com/your-bucket
```

Recommended Vercel setup:
- If the GitHub repository root is this `derm-app` folder, import it directly.
- If the GitHub repository root is the parent project folder, set the Vercel Root Directory to `derm-app`.

Typical first publish flow:

```bash
npm install
npm run lint
npm run build
git add .
git commit -m "feat: publish DermEd app"
git push origin master
```

The bucket must allow public reads for the image paths you want to serve in the app. The current resolver dynamically converts PAD local storage paths into cloud URLs, so you do not need to rewrite the generated JSON files just to switch hosting.

## License

Private - educational use only. Image datasets retain their original licenses.
