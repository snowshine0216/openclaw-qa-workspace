import fs from 'fs';
import axios from 'axios';

// put your openAI API key here:
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set.');
    process.exit(1);
}

const OPENAI_API_ENDPOINT =
    'https://mstr-ax-openai-eastus2-4d7ma7a3t3go2.openai.azure.com/openai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview';


/**
 * Convert image to Base64 format
 * @param {string} imagePath - Path to the image file
 * @returns {string} - Base64 encoded image
 */
function encodeImage(imagePath) {
    if (!fs.existsSync(imagePath)) {
        console.error(`Error: File not found -> ${imagePath}`);
        return null;
    }
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
}

/**
 *
 * @param {string} promptText - subjective or self questions
 * @param {string} imagePaths - single or multiple page images
 * @returns {string} - yes or no and reasoning
 */
export async function validateAutoDash2Page(promptText, imagePaths) {
    const imageArray = Array.isArray(imagePaths) ? imagePaths : [imagePaths]

    const prompt = `
    You are an AI validator for Auto Dashboard features in business intelligence platforms.

    You will be given:
    - A user command (e.g., “Create a new page with a pie chart showing sales by region and a filter on year”).
    - A screenshot of the dashboard canvas that was generated in response to this command.

    Important context:
    In Auto Dashboard, open ended commands like “Suggest a page” or “Suggest a chapter” instruct the AI to **automatically generate** a new, meaningful dashboard layout using the dataset.  
    These prompts are not asking for a textual idea or written proposal.  
    A correct response may include one or more new pages, chapters, or visualizations that look coherent and data-driven — even if their exact composition varies between runs.

    Your task:
    1. Carefully read and understand the user's prompt and the intent behind it.
    2. Visually analyze the dashboard screenshot to check whether the key components requested by the user have been implemented.

    ### Key evaluation rules:

    **1. Visual components**
    - Check that expected chart types (e.g., pie, bar, line, grid, KPI, etc.) appear **exactly as requested**.
    - Do not substitute one chart type for another (for example, a histogram or area chart is **not** equivalent to a line chart).
    - If the prompt explicitly asks for specific chart types (e.g., “1 bar chart and 1 line chart”), every requested type must appear at least once.
    - A visualization **must contain data** — if any chart or container displays placeholder text such as:
        - “Add attributes or metrics”
        - “Add 1 or more attributes and 1 metric”
        - “No data available”
        - Or visibly blank chart areas with no plotted content
        → this **must be treated as a test failure**.
    - Verify that all visual areas display data or valid visual marks (bars, points, shapes, etc.), not configuration prompts.


    **2. Data topics**
    - Confirm that the visualizations appear to reference the correct attributes or metrics from the prompt (e.g., “Hire Date”, “Customer Retention Rating”, “Profit”, etc.).

    **3. Filters**
    - If filters are requested (e.g., “City”, “Year”, “Department”), check that dropdowns or selectors are present on the page.

    **4. Styling**
    - If the prompt requests a page color or theme (e.g., “make the page as green”, “use shades of purple”, “dark background”), interpret this as referring to:
        - The **page background**, **container background**, or **text box background**.
        - **NOT** the data-driven colors inside charts, maps, or KPIs — those depend on dataset values.
    - A page should be considered correctly styled if the overall dashboard canvas or containers reflect the requested color tone or theme, even if chart elements vary.
    - **Beautification rule:** When the user command creates a *new page or chapter* (e.g., “Suggest a page”, “Create a chapter”), the generated result **must apply beautification styling**.  
        This means:
        - The page background should not be plain white.
        - If the entire dashboard (canvas + containers) is plain white with no color formatting, **the result should be considered incorrect**.


    **5. Layout & structure**
    - The arrangement of charts or filters does not need to be exact — as long as the composition is coherent and logically represents the user's intent.
    - However, the layout should follow a **visually balanced and readable structure**:
        - Charts and KPIs should be properly sized and visible.
        - No charts should appear **too narrow**, **cut off**, **overlapping**, or **compressed** such that axis labels or data are unreadable.
        - The layout should maintain adequate spacing and alignment across the dashboard canvas.
        - If a major visualization is rendered too small to interpret, **the layout should be considered suboptimal** and the test should fail.

    ### Do NOT penalize for:
    - Minor variations in chart titles, labels, or wording.
    - Differences in chart placement or visual layout as long as the content is logically present.
    - Extra visualizations or filters unless they contradict the request.

    ### DO penalize if:
    - Any requested chart type is **missing or substituted** (e.g., a histogram shown instead of a line chart).
    - A chart or filter clearly requested in the prompt is **missing**.
    - The chart type is **wrong** (e.g., a line chart instead of a pie chart).
    - A requested background or styling change is **not reflected** at all.
    - **The generated page/chapter lacks beautification** — i.e., the entire dashboard (background and containers) is plain white.
    - **The layout is visually poor** — e.g., charts are too narrow, cut off, or overlapping.
    - **Any visualization shows placeholder or “Add attributes/metrics” text** — this indicates the chart failed to render data and should be considered incorrect.
    - The page looks unrelated to the prompt.

    ### Response Format:
    - Is the dashboard page aligned with the user prompt?: [Yes/No]
    - Reasoning: [1-2 sentence explanation]
    - Missing or Incorrect Elements (if any): [List items, or "None" if everything looks good]
    `;

    const payload = {
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    { type: 'text', text: `User question: ${promptText}` },
                    ...imageArray.map((imgPath) => ({
                        type: 'image_url',
                        image_url: { url: `data:image/png;base64,${encodeImage(imgPath)}` },
                    })),
                ]
            },
        ],
        max_tokens: 1000,
    };

    try {
        const response = await axios.post(OPENAI_API_ENDPOINT, payload, {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('✅ Auto Dash Validation Result:', response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('❌ Auto Dash validation failed:', error.response ? error.response.data : error.message);
        return 'Validation failed.';
    }
}

/**
 *
 * @param {string} originalImagePath - user uploaded image
 * @param {string} generatedImagePath - generated dashboard page screenshot
 * @returns {string} - PASS / FAIL with AI summary
 */
export async function validateImageUploadPageLayoutAndVizType(
    originalImagePath,
    generatedImagePath
) {
    const prompt = `
    You are a strict visual QA validator for an Auto Dashboard "upload image to generate page" feature.

    You are given two images:
    - Image A: the original image provided by the user.
    - Image B: the dashboard page automatically generated from Image A.

    Your task:
    Determine whether Image B correctly preserves the **visualization TYPES and high-level layout STRUCTURE** from Image A.

    IMPORTANT SCOPE LIMITATIONS (MUST FOLLOW):
    - This validation focuses ONLY on visualization types and coarse layout structure.
    - Do NOT evaluate data correctness, values, labels, titles, or styling.
    - Do NOT reason about business meaning or metric semantics.
    - Do NOT infer intent or importance of metrics.

    ────────────────────────────────────────────────────────────
    SECTION 1 — VISUALIZATION TYPE IDENTIFICATION (CRITICAL)
    ────────────────────────────────────────────────────────────

    Classify visualizations ONLY by their PRIMARY visual mark type.

    ────────────────────────────────────────────────────────────
    GLOBAL CLASSIFICATION ORDER (MUST FOLLOW STRICTLY)
    ────────────────────────────────────────────────────────────

    When classifying ANY visualization, you MUST apply the following order:

    1. CIRCULAR CHECK  
    If the visualization contains a circular / ring / pie / donut-shaped chart occupying a substantial portion of the tile:
    → classify as DONUT
    → UNLESS a clear, explicit needle/pointer is visible.

    2. GAUGE CHECK  
    ONLY IF you are 100% certain that:
    - a radial scale is present AND
    - a thin, needle-like pointer explicitly indicates a value  
    → classify as GAUGE.

    3. KPI CHECK  
    ONLY IF:
    - the tile contains NO chart marks (no bars, lines, areas, donuts, gauges), AND
    - the primary purpose is displaying a single numeric value  
    → classify as KPI CARD.

    This order OVERRIDES all other heuristics or impressions.

    A visualization may belong to ONLY ONE category.

    ────────────────────────────────────────────────────────────
    DETAILED TYPE RULES
    ────────────────────────────────────────────────────────────

    LINE vs AREA (TREND CHARTS)

    - LINE and AREA are both trend charts.
    - AREA chart:
    - filled region under the line is visually dominant AND
    - magnitude is communicated primarily via filled area.
    - LINE chart:
    - thin line trajectories are visually dominant AND
    - any fill is secondary or decorative.

    Tie-breaker:
    - If BOTH a visible line AND a clearly filled region are present,
    and neither is purely decorative → classify as AREA.

    IMPORTANT:
    - Light fills, gradients, shadows, or glow alone MUST NOT cause AREA classification.

    AREA vs BAR IMMUNITY RULE (CRITICAL):

    - If a visualization has:
    - a continuous x-axis (time, ordered sequence, or smooth progression), AND
    - a filled region that follows a continuous curve or line,

    THEN it MUST be classified as LINE or AREA, and MUST NEVER be classified as a BAR chart.

    - The following do NOT indicate a BAR chart:
    - wide filled shapes
    - vertical-looking edges caused by area boundaries
    - stacked-looking color regions inside an area
    - category labels along a continuous axis

    - Bar charts require DISCRETE, SEPARATE rectangular bars with clear gaps or independent columns.
    Continuous filled regions are NOT bars.

    ────────────────────────────────────────────────────────────
    BAR CHART RULE (VERY IMPORTANT)
    ────────────────────────────────────────────────────────────
    - This rule applies ONLY IF the visualization is NOT already classified as LINE or AREA.
    - If the visualization shows a continuous trend with connected shapes or filled regions, it MUST NOT be classified as a BAR chart.
    - ALL bar-based visuals are BAR CHARTS.
    - Do NOT distinguish between:
    - stacked
    - grouped
    - segmented
    - aligned or unaligned bars
    - If rectangular bars exist (horizontal or vertical) → BAR CHART.
    - NEVER fail due to stacked vs grouped differences.
    - Bar internal structure MUST NOT be treated as a layout mismatch.
    - This rule applies ONLY IF the visualization is NOT already classified as LINE or AREA.
    - If the visualization shows a continuous trend with connected shapes or filled regions, it MUST NOT be classified as a BAR chart.

    ────────────────────────────────────────────────────────────
    COMBO CHART
    ────────────────────────────────────────────────────────────

    - A COMBO CHART MUST contain:
    - at least one bar/column series AND
    - at least one line series.
    - If no bars are present → NOT a combo chart.

    ────────────────────────────────────────────────────────────
    KPI CARD RULES (CRITICAL)
    ────────────────────────────────────────────────────────────

    KPI COUNTING — ABSOLUTE PRE-STEP (CRITICAL)

    KPI tiles are counted in a dedicated pre-step BEFORE any chart classification. KPI COUNT is FINAL and MUST NEVER be revised later.

    Definition (KPI TILE):
    - A visually bounded rectangular tile/card (clear tile boundary)
    - Displays a numeric value as the dominant element (big number is the main focus)
    - May include labels, icons, arrows, colors, and background sparklines/area shadows

    KPI COUNTING RULES (NO EXCEPTIONS):
    1) KPI counting is a PURE VISUAL TILE COUNT.
    2) Each visually distinct numeric tile counts as EXACTLY ONE KPI.
    3) KPI tiles are counted by physical presence ONLY.
    4) Duplicates (same number/label) STILL count as separate KPIs if they are separate tiles.
    5) KPI COUNT must be computed ONLY from tile boundaries + dominant number.
    You MUST NOT use any chart evidence to reduce KPI COUNT.

    DO NOT:
    - deduplicate by value
    - deduplicate by label
    - deduplicate by metric meaning
    - deduplicate by similarity
    - infer breakdowns or summaries
    - exclude tiles because they contain background trends

    Embedded sparklines / micro trends / shaded areas inside KPI tiles:
    - MUST be ignored
    - MUST NOT affect KPI COUNT

    KPI numbers inside chart tiles (e.g., donut centers) NEVER count as KPIs.

    ────────────────────────────────────────────────────────────
    KPI COUNT OUTPUT REQUIREMENT (MANDATORY)
    ────────────────────────────────────────────────────────────

    You MUST explicitly enumerate KPI tiles as follows:

    Image A KPI tiles:
    1) ...
    2) ...
    3) ...
    (final count = N)

    Image B KPI tiles:
    1) ...
    2) ...
    3) ...
    (final count = M)

    Then compare ONLY N vs M.

    ────────────────────────────────────────────────────────────
    KPI COUNT TERMINATION RULE (ABSOLUTE — HARD STOP)
    ────────────────────────────────────────────────────────────

    HARD STOP — NO FURTHER KPI REASONING ALLOWED

    Once the KPI card COUNT comparison is completed:

    - If N == M:
    → KPI VALIDATION PASSES BY DEFINITION.
    - If N ≠ M:
    → KPI VALIDATION FAILS BY DEFINITION.

    After this point:

    You MUST IMMEDIATELY STOP all KPI-related reasoning.

    You MUST NOT:
    - evaluate KPI distinctness
    - reason about duplicated vs unique KPIs
    - compare KPI labels, meanings, or identities
    - reason about break-by vs standalone KPIs
    - introduce any KPI-related failure reasons
    - use phrases such as:
    - "while total count matches"
    - "duplicate KPI"
    - "distinct KPI"
    - "same metric appears twice"
    - "break-by causes extra KPI"
    - "visual pattern does not match"

    If KPI counts match, ANY KPI-related criticism is a RULE VIOLATION.

    ────────────────────────────────────────────────────────────
    KPI vs CHART DISAMBIGUATION
    (FOR TYPE LIST ONLY — NOT FOR KPI COUNT)
    ────────────────────────────────────────────────────────────

    This section affects ONLY whether a tile is ALSO classified as a chart type later. It MUST NOT change KPI COUNT and MUST NOT re-open KPI reasoning.

    A KPI tile may be additionally classified as a chart tile ONLY IF there is clear standalone chart evidence:

    - visible axes with tick labels, OR
    - legend, OR
    - a plot region that dominates the tile AND the KPI number is small/subordinate, OR
    - a donut/pie/ring dominates the tile

    ANTI-HALLUCINATION:
    If you are not 100% sure axes/ticks/legend exist, assume they DO NOT exist.

    ────────────────────────────────────────────────────────────
    BREAK-BY KPI EXPANSION RULE (STRICT)
    ────────────────────────────────────────────────────────────

    Break-by expansion applies ONLY WITHIN A SINGLE TILE.

    If (and only if) ONE KPI tile contains MULTIPLE peer-level, primary numeric values (e.g., "this month / today / yesterday" shown together inside the SAME tile),
    then count EACH primary numeric value as ONE KPI.

    If the numeric values are in DIFFERENT tiles/cards:
    - DO NOT treat them as break-by
    - They are simply multiple KPI tiles
    - Count = number of tiles

    ANTI-BREAKBY-FROM-DUPLICATES (ABSOLUTE):

    You MUST NEVER claim "extra KPI due to break-by" when the extra KPI comes from duplicated KPI tiles.

    Two separate tiles with the same label/value are NOT break-by.
    They are TWO KPI tiles (count = 2).

    Break-by exists ONLY when multiple primary numbers appear INSIDE ONE tile.

    ────────────────────────────────────────────────────────────
    DONUT / PIE / RING (CRITICAL)
    ────────────────────────────────────────────────────────────

    - Pie, ring, and donut charts are the SAME type: DONUT.
    - Differences in:
    - hole size
    - styling
    - labels
    - central numbers  
    MUST NOT cause a mismatch.

    If a card contains a donut chart:
    → classify as DONUT, NOT KPI.

    ────────────────────────────────────────────────────────────
    GAUGE RULE (EXTREMELY IMPORTANT)
    ────────────────────────────────────────────────────────────

    A visualization is a GAUGE ONLY IF:
    - a clear radial scale is present AND
    - a thin, explicit needle/pointer is visible.

    ANTI-HALLUCINATION SAFETY CHECK (FINAL):

    - If you are NOT 100% certain a needle exists → classify as DONUT.
    - The following DO NOT count as a needle:
    - thick arcs
    - highlighted segments
    - gradient fills
    - gaps in a ring
    - rounded arc endpoints
    - shadows or glow
    - numeric labels inside the ring

    Gauge cards are NOT KPI cards.

    ────────────────────────────────────────────────────────────
    OTHER TYPES
    ────────────────────────────────────────────────────────────

    - Scatter and bubble charts → SCATTER
    - Any geographic visualization → MAP
    - Heatmaps, box plots → classify normally

    ────────────────────────────────────────────────────────────
    ALLOWED VISUALIZATION TYPES
    ────────────────────────────────────────────────────────────

    Count ONLY:
    - Tables / grids
    - Bar charts
    - Area charts
    - Line charts
    - Donut charts
    - Maps
    - Scatter / bubble charts
    - Combo charts
    - Heatmaps
    - Box plots
    - Gauges

    Ignore completely:
    - Images, icons, logos
    - Text-only blocks
    - Decorative shapes or backgrounds
    - Containers
    - Filters

    ────────────────────────────────────────────────────────────
    SECTION 2 — LAYOUT STRUCTURE (COARSE ONLY)
    ────────────────────────────────────────────────────────────

    IMPORTANT MODE SWITCH:
    Layout evaluation is performed ONLY AFTER visualization types have been fully and correctly classified.
    DO NOT reclassify visualization types during layout comparison.

    Compare ONLY coarse layout regions:
    - top vs middle vs bottom
    - left vs right

    DO NOT consider:
    - container size
    - exact alignment
    - chart width/height
    - emphasis
    - grid span differences
    - logical grouping assumptions

    Layout is mismatched ONLY IF:
    - a visualization moves from top half → bottom half (or vice versa), OR
    - a visualization moves from left side → right side (or vice versa), OR
    - a visualization is missing entirely.

    Minor shifts MUST NOT cause FAIL.

    ────────────────────────────────────────────────────────────
    SECTION 3 — PASS / FAIL DECISION
    ────────────────────────────────────────────────────────────

    ABSOLUTE DECISION RULES (CRITICAL)

    KPI CARD DECISION (HARD RULE):

    - If the KPI card COUNT in Image B equals the KPI card COUNT in Image A:
    → KPI validation PASSES.
    - NO other KPI-related reasoning is allowed after count comparison.

    You MUST NOT FAIL due to:
    - KPI repetition
    - duplicated metrics
    - different metric names
    - different metric meanings
    - different KPI ordering
    - different KPI visual emphasis
    - different KPI internal styling
    - different KPI background sparklines

    Once KPI counts match, KPI structure is considered PRESERVED by definition.

    VISUALIZATION TYPE & LAYOUT DECISION:

    PASS if ALL of the following are true:
    1) KPI card counts match exactly.
    2) Image B contains the same non-KPI visualization TYPES as Image A.
    3) Coarse layout regions (top/middle/bottom, left/right) are preserved.

    FAIL ONLY if:
    - KPI card counts differ, OR
    - a non-KPI visualization type from Image A is missing or substituted, OR
    - a visualization moves across coarse layout regions, OR
    - a major visualization area is missing.

    You MUST NOT introduce new failure reasons beyond the rules above.

    FINAL OVERRIDE (ABSOLUTE):

    If ALL PASS conditions are satisfied, you MUST output:
    Result: PASS

    You are FORBIDDEN from outputting FAIL based on subjective judgment, intuition or perceived "reasonableness".

    ────────────────────────────────────────────────────────────
    RESPONSE FORMAT (STRICT)
    ────────────────────────────────────────────────────────────

    Result: PASS or FAIL
    Summary: 1-2 sentences explaining the decision
    Issues (only if FAIL): brief bullet list of type or layout mismatches
    `;


    const payload = {
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    {
                        type: 'image_url',
                        image_url: { url: `data:image/png;base64,${encodeImage(originalImagePath)}` },
                    },
                    {
                        type: 'image_url',
                        image_url: { url: `data:image/png;base64,${encodeImage(generatedImagePath)}` },
                    },
                ],
            },
        ],
        max_tokens: 1000,
    };

    try {
        const response = await axios.post(OPENAI_API_ENDPOINT, payload, {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const result = response.data.choices[0].message.content;
        console.log('✅ Layout & Viz Type Validation Result:\n', result);
        return result;
    } catch (error) {
        console.error(
            '❌ Layout & Viz Type validation failed:',
            error.response ? error.response.data : error.message
        );
        return 'Result: FAIL\nSummary: Validation could not be completed due to an AI error.';
    }
}

/**
 *
 * @param {string} originalImagePath - user uploaded image
 * @param {string} generatedImagePath - generated dashboard page screenshot
 * @returns {string} - PASS / FAIL with AI summary
 */
export async function validateImageUploadVizColor(
    originalImagePath,
    generatedImagePath
) {
    const prompt = `
    You are a visual QA evaluator focusing on COLOR CONSISTENCY at the INDIVIDUAL VISUALIZATION level 
    for an Auto Dashboard "upload image to generate page" feature.

    You are given two images:
    - Image A: the original image provided by the user.
    - Image B: the dashboard page automatically generated from Image A.

    Your task:
    Evaluate whether the generated visualizations in Image B preserve color themes similar to Image A at the visualization level.

    IMPORTANT:
    - This is a qualitative, perceptual comparison.
    - Exact color matching is NOT required.

    ### 1. How to compare colors (CRITICAL)

    - Focus ONLY on the OVERALL COLOR PALETTE FAMILY of each visualization,
    not on individual series colors or semantic indicator colors.

    - Semantic colors such as red/green used to indicate increase/decrease,
    alerts, or status MUST be ignored and MUST NOT be considered dominant colors.

    - Axis lines, labels, gridlines, or default black/gray rendering
    MUST be ignored for color comparison.

    - For charts with multiple series:
    - Compare the collective color family (e.g., warm palette, cool palette, pastel tones),
      NOT exact line-by-line color matching.

   ### 2. What is acceptable

    - It is acceptable for a visualization in Image B to use FEWER colors than the corresponding visualization in Image A,
    as long as the dominant colors in Image B belong to the same color families present in Image A.

    - Differences in the number of series, slices, or categories (e.g., fewer lines, bars, or segments) are acceptable
    if no new or unrelated color families are introduced.

    - Slight variations in shade, brightness, or saturation are acceptable across all visualization types.

    - Minor differences in secondary, background, or accent colors are acceptable and should not be treated as failures.

    - Changes in individual series colors within the same general color family (e.g., orange → pink, teal → blue-green) are acceptable and should NOT be treated as failures.

    ### 3. PASS / FAIL criteria

    PASS if:
    - MOST corresponding visualizations (at least 80%) have similar color themes between Image A and Image B.
    - No major visualization uses a completely unrelated color family.

    FAIL if:
    - A significant portion of visualizations introduce dominant color families not present in Image A.
    - The generated page appears visually inconsistent compared to the original image at the visualization level.

    ### Response format (STRICT)

    Result: PASS or FAIL  
    Color Similarity Summary: 2-3 sentences describing similarity by visualization  
    Notable Differences (optional): list visualizations with noticeable color differences
    `;


    const payload = {
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    {
                        type: 'image_url',
                        image_url: { url: `data:image/png;base64,${encodeImage(originalImagePath)}` },
                    },
                    {
                        type: 'image_url',
                        image_url: { url: `data:image/png;base64,${encodeImage(generatedImagePath)}` },
                    },
                ],
            },
        ],
        max_tokens: 1000,
    };

    try {
        const response = await axios.post(OPENAI_API_ENDPOINT, payload, {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const result = response.data.choices[0].message.content;
        console.log('✅ Viz Color Validation Result:\n', result);
        return result;
    } catch (error) {
        console.error(
            '❌ Viz Color Validation failed:',
            error.response ? error.response.data : error.message
        );
        return 'Result: FAIL\nSummary: Validation could not be completed due to an AI error.';
    }
}

