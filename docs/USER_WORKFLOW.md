# AI Investment Advisor — User Workflow

This document describes the intended real-world journey for a user. It marks which steps are
available now and which are still being built, so the product direction is visible without
presenting planned functionality as complete.

## 1. Start a research workspace

The user signs in to a private workspace for companies, documents, analysis runs, and reports.

### Available now

- Create a local user at `/register`.
- Log in at `/login`.
- Refresh the browser without losing the session.
- Log out from the application shell.

### Planned

- Password reset and account recovery.
- User profile and role administration.
- Production secret management.

## 2. Add a company

The user opens **Companies** and creates the company they want to research.

```text
Company name: Commercial Bank of Ceylon
Ticker:       COMB.N0000
Exchange:     CSE
Sector:       Banking
Industry:     Commercial Banking
Country:      Sri Lanka
Currency:     LKR
```

The company becomes the anchor for later documents, facts, financial periods, market data,
analysis, and reports.

### Available now

- Create a company.
- Search the company list.
- Open a company detail page.
- Edit company metadata.
- Keep records scoped to the signed-in user.

### Planned

- Company identity resolution against supported exchanges.
- Exchange and ticker validation.
- Company aliases and listed security identifiers.
- Automatic company profile enrichment.

## 3. Collect source documents

The user adds source material to the company workspace. The preferred evidence order is:

1. CSE filings and announcements.
2. Official company annual and interim reports.
3. Investor presentations.
4. Credit-rating and sustainability reports.
5. Other trusted public sources.

The user should always be able to upload documents manually when automated discovery is incomplete.

### Planned Phase 2 flow

```text
Choose company
      |
      v
Upload or discover document
      |
      v
Validate file and calculate SHA-256 hash
      |
      v
Extract metadata and store original
      |
      v
Queue processing
```

The first processing target is PDF. The planned MVP also supports DOCX, XLSX, CSV, and TXT.

## 4. Process documents into evidence

The system should retain the original document and produce traceable extracted content:

```text
Original document
      |
      +-- file hash
      +-- source URL
      +-- retrieval date
      +-- reporting period
      +-- document type
      +-- page count
      |
      v
Text and table extraction
      |
      v
Page/section chunks
      |
      v
Evidence references
```

Important numbers and factual claims should eventually link to a document, page or section,
reporting period, source URL, and retrieval date where available.

### Planned

- PDF text extraction and OCR for scanned documents.
- Table extraction and section classification.
- Duplicate detection.
- Document viewer with page references.
- Evidence panel beside AI-generated text.

## 5. Review financial facts

After processing, the user reviews extracted facts before analysis. The system must distinguish:

| Type | Meaning |
| --- | --- |
| Fact | Directly supported by a source document or market-data snapshot |
| Calculation | Derived from stored facts using a known formula |
| Interpretation | AI-assisted explanation of evidence |
| Assumption | User or model input that is not a historical fact |
| Scenario | Conditional future case, such as base, upside, or downside |
| Unknown | Information unavailable or not reliable enough to state |

The user should be able to correct an extraction, view the source page, and see when data was last
updated.

## 6. Run fundamental analysis

The user selects a company, source set, and reporting periods. The system evaluates evidence using
transparent formulas and explains both the calculation and its sources.

Expected areas include revenue and earnings growth, margins, cash-flow quality, balance-sheet
strength, debt, liquidity, and dividends. Banking-specific indicators can be added for relevant
companies.

```text
Select company and periods
      |
      v
Review source facts
      |
      v
Run deterministic calculations
      |
      v
Ask AI to explain and challenge findings
      |
      v
Review evidence, risks, and unknowns
```

## 7. Run valuation and technical analysis

Valuation should be scenario-based. The user reviews assumptions such as growth, margins, discount
rate, terminal assumptions, multiples, or dividends. The system presents base, upside, downside,
sensitivity, and invalidating risks.

When market data is available, the user reviews price, volume, trend, volatility, and technical
indicators with timestamps and source information.

Both capabilities are planned. AI may challenge assumptions and explain tradeoffs, but should not
turn the result into an objective BUY/SELL instruction.

## 8. Compare companies

The user selects two or more companies and compares business model, growth, profitability,
financial health, valuation, dividends, risks, and technical picture. The system must call out
non-comparable periods, currencies, fiscal years, and business models.

## 9. Generate a research report

The user chooses the company, evidence set, analysis runs, market-data snapshot, AI provider/model,
and report template. The report should record enough information to reproduce it:

```text
Research configuration
+ source documents
+ market-data snapshot
+ AI provider and model
+ prompt/template version
+ calculation version
```

The planned report includes an executive summary, business overview, financial analysis, valuation
scenarios, technical analysis, risks, catalysts, evidence references, assumptions, methodology,
and generation timestamp.

## 10. Repeat and monitor

Research is historical and reproducible. New reports, announcements, or market snapshots should
create new research runs rather than silently overwriting old work:

```text
Existing company workspace
        |
        v
New source or market-data snapshot
        |
        v
New extraction and analysis run
        |
        v
Compare with prior research
        |
        v
Generate a dated report
```

## Current product boundary

At the current checkpoint, users can authenticate and manage company workspaces. Document
processing, financial analysis, market data, valuation, comparison, and reporting are being built
in controlled steps. A screen, API route, or data type should not be treated as available until its
corresponding task has been implemented and verified.

The product is an evidence-first research assistant. It is not an autonomous investment advisor,
broker, trading system, or financial guarantee.

