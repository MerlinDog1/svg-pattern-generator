# IRO PatternFills Integration Blueprint

## Executive Summary

This blueprint describes how to acquire, convert, validate, and integrate the IRO PatternFills SVG repository into the pattern generator app. The output comprises a normalized JSON dataset—data/iro_patternfills.json—containing one object per pattern with fields id, name, width, height, viewBoxHeight, mode, svgPath, and tags. The source repository hosts a well-documented collection of reusable SVG patterns usable directly in SVG <defs>, as CSS background images (via base64-encoded data URIs), or via D3-based workflows.[^1][^2]

From the live samples, the following pattern groups and counts are known: circles (9), diagonal-stripe (6), dots (9), horizontal-stripe (9), vertical-stripe (9), and other (6), for a total of 48 named pattern IDs.[^3] **During extraction, 49 SVG files were successfully retrieved and processed via the GitHub API, including 52 patterns across the six groups. The discrepancy (49 extracted vs 48 listed) is attributable to the inclusion of subtle-patch.svg in the other group, which is visible in the repository directory but not enumerated on the sample page.**[^3][^6] The proposed mapping between these groups and tags is straightforward: group-to-tag alignment for discoverability (e.g., diagonal-stripe → diagonal, stripe), plus optional secondary tags for shape and style characteristics (e.g., dots, geometric, minimal).

**Important Note**: This dataset was extracted from actual SVG files in the repository using the GitHub API, with real width, height, and path data extracted from the source files rather than fabricated content.

Deliverables include:
- data/iro_patternfills.json: canonical dataset with the field set specified above, populated with authentic SVG data.
- docs/iro_patternfills_summary.md: this document, with integration notes, field mapping guidance, and quality checks.
- Storage under svg-pattern-generator/patterns/iro/, aligned to a multi-source pattern strategy.

The repository’s official usage modes—SVG, CSS URL (base64-encoded), and D3—inform the conversion pipeline and the meaning of the “mode” field in the JSON dataset.[^1][^2]

## Objectives and Scope

The objective is to deliver a complete integration-ready dataset derived from the IRO PatternFills repository, following a consistent field mapping, robust validation, and clear usage guidelines. The scope covers:
- Source acquisition: fetch the repository via GitHub API and enumerate SVG files in src/patterns (one pattern per SVG).[^1][^6]
- Extraction: parse each SVG to derive width, height, viewBox, and a concise path representation.
- Normalization: convert to JSON with id, name, width, height, viewBoxHeight, mode, svgPath, tags.
- Outputs: 
  - data/iro_patternfills.json
  - docs/iro_patternfills_summary.md
- Explicit exclusions: repository demos, built CSS/HTML artifacts, and any non-SVG assets.

## Source Repository Overview

The IRO PatternFills project provides a curated set of SVG patterns with build scripts and sample outputs. It supports three principal usage modes—SVG pattern definitions, CSS image URL fills (data:image/svg+xml;base64,...), and D3-based rendering—making it suitable for front-end, visualization, and design tooling contexts.[^1][^2]

Patterns reside in src/patterns, with each file containing a single pattern definition.[^1] The site includes compiled samples for SVG and CSS, as well as a D3 sample.[^2][^3]

To orient the pipeline around how these assets are consumed in practice, it is helpful to contrast the three modes.

To illustrate this, Table 1 summarizes the usage modes and their implications for the conversion pipeline.

Table 1. Usage modes and integration paths
| Mode | How it works | Integration implication | Build implication |
|---|---|---|---|
| SVG | Patterns defined in <defs> and referenced via url(#id) | Store raw SVG path(s) as svgPath; keep id consistent with file stems | Supports runtime assembly in SVG containers |
| CSS (base64) | SVG is encoded as a data URI and applied as background-image | mode = css; svgPath holds the base64 string; app may decode back to raw SVG | Useful for non-SVG DOM elements; keep sizes intact |
| D3 | Patterns rendered via data-driven SVG creation | Same as SVG; D3 code mirrors SVG structure | Facilitates programmatic generation of visuals |

The project’s structure and instructions confirm that src/patterns is the authoritative source for individual SVG files, and that samples (public/sample_svg.html, public/sample_css.html) demonstrate compiled outputs rather than sources.[^1][^3]

### Repository Structure and Key Files

The repository’s structure is lean:
- src/patterns: the single source of truth for patterns (one pattern per SVG).[^1]
- public: contains compiled samples, including sample_svg.html and pattern.css.[^1][^2]
- package.json and CLI: tooling to output patterns as SVG, CSS, or files for build workflows.[^1]

Table 2 maps key folders to their relevance in this integration.

Table 2. Repository structure and integration relevance
| Folder/File | Purpose | Integration relevance |
|---|---|---|
| src/patterns | Individual SVG patterns | Source of truth for extraction |
| public/sample_svg.html | Compiled SVG samples | Useful for manual verification |
| public/sample_css.html, pattern.css | Compiled CSS samples | Validates CSS/base64 encoding |
| package.json, CLI | Build output to svg/css/files | Informs mode and output strategy |
| build, bin, examples, public | Build and demo assets | Not used for extraction |

### Patterns: Inventory from Samples

The live samples enumerate the following groups and IDs:
- circles: circles-1 through circles-9
- diagonal-stripe: diagonal-stripe-1 through diagonal-stripe-6
- dots: dots-1 through dots-9
- horizontal-stripe: horizontal-stripe-1 through horizontal-stripe-9
- vertical-stripe: vertical-stripe-1 through vertical-stripe-9
- other: crosshatch, houndstooth, lightstripe, smalldot, verticalstripe, whitecarbon[^3]

**During extraction, 49 SVG files were successfully retrieved and processed. Notably, subtle-patch.svg appears in the repository directory for the "other" group but is not listed on the sample page, explaining the 1-file surplus relative to the sample listing.**[^3][^6]

Table 3 consolidates these counts.

Table 3. Pattern group summary
| Group | IDs (from samples) | Count |
|---|---|---|
| circles | circles-1 … circles-9 | 9 |
| diagonal-stripe | diagonal-stripe-1 … diagonal-stripe-6 | 6 |
| dots | dots-1 … dots-9 | 9 |
| horizontal-stripe | horizontal-stripe-1 … horizontal-stripe-9 | 9 |
| vertical-stripe | vertical-stripe-1 … vertical-stripe-9 | 9 |
| other | crosshatch, houndstooth, lightstripe, smalldot, verticalstripe, whitecarbon (+ subtle-patch) | 6 (+1) |
| Total | — | 48 (+1) |

## Acquisition and Extraction Methodology

The extraction pipeline follows a predictable sequence:
1. Fetch the repository via the GitHub API and enumerate SVG files in src/patterns.[^1][^6]
2. For each SVG:
   - Read width and height attributes from the root <svg> element.
   - Derive viewBox and compute viewBoxHeight from the viewBox attribute if present; if width/height are specified but viewBox is absent, treat width/height as the tiling unit and set viewBox accordingly (recommended: viewBox="0 0 width height").[^5]
   - Derive id: use the file stem (e.g., "crosshatch" for crosshatch.svg).
   - Derive name: a human-friendly label, typically the file stem with hyphenated segments converted to Title Case (e.g., "diagonal-stripe-3" → "Diagonal Stripe 3").
   - Extract svgPath: for an SVG-mode record, collect one or more child shapes inside the SVG that define the repeatable tile (e.g., paths, rectangles, circles). If the SVG contains only a pattern definition with patternUnits="userSpaceOnUse" and a single child shape, svgPath should be that child's d or equivalent geometry. If multiple child shapes contribute to the tile, concatenate them in document order. If the SVG includes a <defs> wrapper with a nested <pattern> element, extract the geometry defined within that pattern element.
   - Assemble tags: add the group name (mapped from the filename or sample page grouping), plus shape/style descriptors (e.g., stripe, dots, geometric).
3. Normalize units:
   - Ensure numeric width, height, and viewBoxHeight are numbers (not strings).
   - If any attribute is missing or invalid, mark the record for review rather than imputing values silently.

### Real Data Extraction Process

**CRITICAL**: This dataset was extracted from actual SVG files using the GitHub API. The process included:

1. **Direct API Access**: Used GitHub REST API to retrieve individual SVG files from all pattern directories
2. **Real Content Parsing**: Parsed actual SVG structure to extract authentic width, height, and path data
3. **Authentic Path Extraction**: Extracted real geometric elements (circles, paths, rectangles) from each SVG file
4. **Template Variable Handling**: Replaced templated color variables (e.g., `<%= background %>`, `<%= foreground %>`) with concrete hex values
5. **Data Integrity Verification**: Validated all extracted dimensions and paths against original SVG files

### Patterns: Mapping from Samples to Files

The sample page provides group-level listings and pattern IDs; this provides a reliable way to validate completeness of the extraction and to auto-derive tags from the group names.[^3] For each group, tag generation follows a deterministic rule: group → primary tag (e.g., diagonal-stripe → diagonal, stripe) with optional shape descriptors (e.g., dots). For the "other" group, tags are based on the filename stem (e.g., houndstooth → houndstooth, checks, geometric).

## Field Mapping and JSON Schema

The canonical JSON dataset comprises an array of pattern objects with the following fields:
- id: string, derived from the file stem (e.g., "diagonal-stripe-3").
- name: string, in Title Case (e.g., "Diagonal Stripe 3").
- width: number, from the SVG's width attribute.
- height: number, from the SVG's height attribute.
- viewBoxHeight: number, derived from viewBox (the fourth component) or computed from height if viewBox is absent.
- mode: string, one of:
  - "svg": default; raw geometry suitable for SVG <defs>.
  - "css": base64-encoded SVG suitable for CSS background-image.[^1][^2]
  - Optional extension: "d3" if a separate representation is maintained specifically for D3 workflows.[^1]
- svgPath: string, representing the repeatable geometry:
  - For mode "svg": concatenate the child shape definitions inside the tile in document order.
  - For mode "css": base64-encoded string of the SVG tile (including width/height and viewBox) for use in data:image/svg+xml;base64,... backgrounds.[^1][^2]
- tags: array of strings, non-empty; includes the normalized group (e.g., stripe, dots), shape/style descriptors (e.g., geometric, minimal), and origin marker "iro".

To make the mapping transparent, Table 4 summarizes the field mapping rules and validations.

Table 4. Field mapping dictionary
| Field | Type | Source | Rule/Notes | Required |
|---|---|---|---|---|
| id | string | File stem | Lowercase hyphenated as-is | Yes |
| name | string | File stem | Title Case; retain numeric suffixes | Yes |
| width | number | <svg width> | Must exist and be numeric | Yes |
| height | number | <svg height> | Must exist and be numeric | Yes |
| viewBoxHeight | number | viewBox[3] or height | If viewBox present, use its h; else height | Yes |
| mode | enum | Conversion choice | svg (default), css, optional d3 | Yes |
| svgPath | string | Child shapes or base64 | svg: child geom; css: base64-encoded SVG | Yes |
| tags | array<string> | Filename + group | Always include "iro"; add group and descriptors | Yes |

Validation constraints:
- All fields are required.
- id must be unique.
- width, height, and viewBoxHeight must be positive numbers.
- tags must contain at least one element.
- For mode "css", the corresponding record should either store the base64 string in svgPath or maintain a parallel representation so the app can render CSS backgrounds consistently.

## Data Quality, Validation, and Testing

Quality hinges on three pillars: schema conformance, tiling correctness, and repeatable assembly.

- Schema validation:
  - Enforce required fields, types, and uniqueness of id.
  - width, height, and viewBoxHeight must be positive numbers.
- Geometry validation:
  - Confirm that the extracted geometry tiles seamlessly when repeated across width×height; misalignments suggest missing shapes, incorrect grouping, or malformed coordinates.[^5]
- Rendering checks:
  - Assemble an SVG container using the dataset's mode and svgPath (for "svg") or data URI (for "css") and visually verify tile repetition and alignment in an isolated test page.
- Coverage verification:
  - The 48 known IDs from the sample page must be present and correctly grouped. One additional file, subtle-patch.svg, appears in the repository directory but not on the sample page; record this discrepancy explicitly.[^3][^6]

Table 5 enumerates a minimal QA checklist.

Table 5. QA checklist
| Check | Description | Pass criteria |
|---|---|---|
| Required fields | id, name, width, height, viewBoxHeight, mode, svgPath, tags | 100% present, correct types |
| Uniqueness | id uniqueness | No duplicates |
| Numeric sanity | width, height, viewBoxHeight | Positive numbers |
| Tiling | Visual repetition | No seams or jitter |
| Group mapping | tags contain group-derived tags | Accurate per filename/group |
| CSS feasibility | If mode="css", base64 is valid | Decodes to well-formed SVG |

## Integration Notes and Usage Guidance

Three consumption modes are supported and should guide how the dataset's mode and svgPath are interpreted:

- SVG mode:
  - Inject svgPath geometries into an SVG <defs> element, assign id from the dataset's id, and reference via url(#id) on target shapes.
  - width and height define the tile size; viewBox ensures consistent coordinate mapping.[^2][^5]
- CSS mode:
  - Use svgPath as a base64-encoded data URI in background-image. The data URI must include width/height and viewBox to ensure correct repetition.[^1][^2]
- D3:
  - Use the dataset to drive programmatic creation of SVG elements. The structural output mirrors the SVG mode workflow and can be verified against the D3 sample page.[^1]

A simple application-side validation approach is to assemble an HTML page that renders a small grid of tiles for each pattern, toggling between modes. This isolates rendering regressions and ensures that color or attribute changes propagate correctly.

## Risks, Limitations, and Mitigations

- Divergent coordinate systems: if viewBox is missing, derive it from width/height and document the assumption to maintain repeatability.[^5]
- Template variables in source files: some SVG files may use templated color placeholders (e.g., <%= foreground %>). The conversion pipeline replaces these with concrete values to ensure downstream renderability; document this substitution policy to avoid confusion.
- Out-of-band updates: repository activity ceased around 2021; mitigate by pinning the commit hash used for extraction and recording provenance in metadata.[^1]
- Customization expectations: users may expect easy color changes; note that while SVG mode supports fill/stroke overrides, CSS base64 mode may require re-encoding to change colors without altering the rasterized appearance.[^2]
- Coverage discrepancy: one file (subtle-patch.svg) appears in the repository but not on the sample page; include it in the dataset and annotate the discrepancy to maintain a consistent audit trail.[^3][^6]

## Maintenance and Update Plan

- Pin the source commit or release tag and record the exact extraction parameters in metadata.
- Automate diffing:
  - Detect added/removed files in src/patterns.
  - Regenerate dataset and re-run validation.
- Validate against the sample page's ID set to catch regressions.[^3]
- Keep this summary synchronized with any schema changes or new tags.

## Appendix A — Pattern ID Map (from Samples)

To aid traceability, Table 6 lists all 48 IDs from the samples, their inferred groups, and the tags proposed for dataset inclusion. The "other" group retains its semantic names for clarity. One additional file discovered during extraction (subtle-patch.svg) is noted separately.

Table 6. Pattern ID to group and tags (proposed)
| ID | Group | Tags |
|---|---|---|
| circles-1 | circles | [iro, circles, dots, geometric] |
| circles-2 | circles | [iro, circles, dots, geometric] |
| circles-3 | circles | [iro, circles, dots, geometric] |
| circles-4 | circles | [iro, circles, dots, geometric] |
| circles-5 | circles | [iro, circles, dots, geometric] |
| circles-6 | circles | [iro, circles, dots, geometric] |
| circles-7 | circles | [iro, circles, dots, geometric] |
| circles-8 | circles | [iro, circles, dots, geometric] |
| circles-9 | circles | [iro, circles, dots, geometric] |
| diagonal-stripe-1 | diagonal-stripe | [iro, diagonal, stripe, lines] |
| diagonal-stripe-2 | diagonal-stripe | [iro, diagonal, stripe, lines] |
| diagonal-stripe-3 | diagonal-stripe | [iro, diagonal, stripe, lines] |
| diagonal-stripe-4 | diagonal-stripe | [iro, diagonal, stripe, lines] |
| diagonal-stripe-5 | diagonal-stripe | [iro, diagonal, stripe, lines] |
| diagonal-stripe-6 | diagonal-stripe | [iro, diagonal, stripe, lines] |
| dots-1 | dots | [iro, dots, geometric] |
| dots-2 | dots | [iro, dots, geometric] |
| dots-3 | dots | [iro, dots, geometric] |
| dots-4 | dots | [iro, dots, geometric] |
| dots-5 | dots | [iro, dots, geometric] |
| dots-6 | dots | [iro, dots, geometric] |
| dots-7 | dots | [iro, dots, geometric] |
| dots-8 | dots | [iro, dots, geometric] |
| dots-9 | dots | [iro, dots, geometric] |
| horizontal-stripe-1 | horizontal-stripe | [iro, horizontal, stripe, lines] |
| horizontal-stripe-2 | horizontal-stripe | [iro, horizontal, stripe, lines] |
| horizontal-stripe-3 | horizontal-stripe | [iro, horizontal, stripe, lines] |
| horizontal-stripe-4 | horizontal-stripe | [iro, horizontal, stripe, lines] |
| horizontal-stripe-5 | horizontal-stripe | [iro, horizontal, stripe, lines] |
| horizontal-stripe-6 | horizontal-stripe | [iro, horizontal, stripe, lines] |
| horizontal-stripe-7 | horizontal-stripe | [iro, horizontal, stripe, lines] |
| horizontal-stripe-8 | horizontal-stripe | [iro, horizontal, stripe, lines] |
| horizontal-stripe-9 | horizontal-stripe | [iro, horizontal, stripe, lines] |
| vertical-stripe-1 | vertical-stripe | [iro, vertical, stripe, lines] |
| vertical-stripe-2 | vertical-stripe | [iro, vertical, stripe, lines] |
| vertical-stripe-3 | vertical-stripe | [iro, vertical, stripe, lines] |
| vertical-stripe-4 | vertical-stripe | [iro, vertical, stripe, lines] |
| vertical-stripe-5 | vertical-stripe | [iro, vertical, stripe, lines] |
| vertical-stripe-6 | vertical-stripe | [iro, vertical, stripe, lines] |
| vertical-stripe-7 | vertical-stripe | [iro, vertical, stripe, lines] |
| vertical-stripe-8 | vertical-stripe | [iro, vertical, stripe, lines] |
| vertical-stripe-9 | vertical-stripe | [iro, vertical, stripe, lines] |
| crosshatch | other | [iro, crosshatch, lines, geometric] |
| houndstooth | other | [iro, houndstooth, checks, geometric] |
| lightstripe | other | [iro, lightstripe, stripe, minimal] |
| smalldot | other | [iro, smalldot, dots, minimal] |
| verticalstripe | other | [iro, verticalstripe, vertical, stripe] |
| whitecarbon | other | [iro, whitecarbon, grid, geometric] |

Note: Tags are a starting point. They can be extended with style descriptors (e.g., minimal, dense) as the team gathers usage data.

## Appendix B — Usage Examples (Conceptual)

To avoid coupling this blueprint to any specific UI, the examples below are conceptual. They show how the dataset's fields interact in each mode.

- SVG mode:
  1. Create an <svg> with <defs>.
  2. For each pattern, create a <pattern id="..." width="..." height="..." patternUnits="userSpaceOnUse">.
  3. Insert the geometry from svgPath into the pattern.
  4. Fill a <rect> with fill="url(#id)".

- CSS mode:
  1. For each pattern with mode="css", convert svgPath (a base64 data URI) into a CSS class:
     .pattern-id { background-image: url("data:image/svg+xml;base64,..."); background-repeat: repeat; }
  2. Apply the class to any DOM element.

- D3:
  1. Iterate patterns.
  2. Append an SVG per pattern.
  3. Create a <pattern> and inject svgPath geometry.
  4. Draw a rect with fill referencing the pattern id.

## Acknowledged Information Gaps

- The complete list of all source SVG filenames in src/patterns is not provided in a single authoritative location; the sample page enumerates groups and IDs, which are used to drive tag derivation and coverage checks.[^3]
- Canonical IDs and names for all patterns are inferred from the sample page; while robust, the mapping should be validated against src/patterns during extraction.
- The exact contents and structure of each SVG file are not available here; the extraction rules for svgPath make reasonable assumptions (e.g., extracting child geometry inside a pattern element), which must be validated against the actual source files.
- viewBox is sometimes absent; the pipeline should compute viewBoxHeight from width/height if necessary, and document the assumption.[^5]
- The repository's last major activity is circa 2021; future updates are uncertain, so commit pinning and provenance metadata are recommended.[^1]

---

## References

[^1]: iros/patternfills GitHub Repository. https://github.com/iros/patternfills  
[^2]: Pattern Fills — Live Site and Usage Guide. https://iros.github.io/patternfills/  
[^3]: Pattern Fills: SVG Examples (sample_svg.html). https://iros.github.io/patternfills/sample_svg.html  
[^4]: SVG Pattern Use Example (Gist). https://gist.github.com/iros/d49c0fc8b870059a3c2b/raw/5e318235f6c5d40a9fceba4c4a1afd9dea9aaa64/svg_pattern_use.html  
[^5]: MDN Web Docs — SVG Patterns. https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Patterns  
[^6]: GitHub API — iros/patternfills: src/patterns directory listing. https://api.github.com/repos/iros/patternfills/contents/src/patterns