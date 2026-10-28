/**
 * High-quality SVG design mockup generator for brand visual presentations.
 * Generates data URLs for SVG brand assets so that images always render crisply and work offline.
 */

export function generateUrbanForestSvg(
  type: 'logo-1' | 'logo-2' | 'logo-3' | 'cup-1' | 'cup-2' | 'cup-3' | 'menu-1' | 'menu-2' | 'menu-3',
  itemLabel: string,
  conceptLabel: string
): string {
  const width = 1200;
  const height = 800;

  let graphicSvg = '';

  switch (type) {
    case 'logo-1':
      // Bold Geometric Wordmark & Mono Symbol
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#FFFFFF" stroke="#18181B" stroke-width="2"/>
        <line x1="40" y1="120" x2="1160" y2="120" stroke="#18181B" stroke-width="1.5"/>
        <text x="80" y="85" font-family="'Pretendard', sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="#18181B">BRAND IDENTITY — CONCEPT 01</text>
        <text x="1120" y="85" font-family="monospace" font-size="13" font-weight="600" fill="#71717A" text-anchor="end">GEOMETRIC SANS / SYSTEM NO. 01</text>

        <!-- Central Symbol & Wordmark -->
        <g transform="translate(600, 390)">
          <!-- Geometric mill icon -->
          <circle cx="0" cy="-90" r="54" fill="none" stroke="#18181B" stroke-width="5"/>
          <rect x="-18" y="-108" width="36" height="36" fill="#18181B"/>
          <circle cx="0" cy="-90" r="6" fill="#FFFFFF"/>
          
          <text x="0" y="30" font-family="'Pretendard', 'Helvetica Neue', sans-serif" font-size="52" font-weight="900" letter-spacing="-1" fill="#18181B" text-anchor="middle">URBAN FOREST</text>
          <text x="0" y="70" font-family="'Pretendard', sans-serif" font-size="15" font-weight="600" letter-spacing="12" fill="#52525B" text-anchor="middle">SUSTAINABLE LIFESTYLE &amp; DESIGN</text>
        </g>

        <!-- Technical guidelines & palette swatches -->
        <g transform="translate(80, 680)">
          <rect x="0" y="0" width="40" height="20" fill="#09090B" stroke="#18181B" stroke-width="1"/>
          <text x="50" y="14" font-family="monospace" font-size="11" fill="#18181B">#09090B OBSIDIAN</text>

          <rect x="220" y="0" width="40" height="20" fill="#FFFFFF" stroke="#18181B" stroke-width="1"/>
          <text x="270" y="14" font-family="monospace" font-size="11" fill="#18181B">#FFFFFF PURE WHITE</text>

          <rect x="440" y="0" width="40" height="20" fill="#71717A" stroke="#18181B" stroke-width="1"/>
          <text x="490" y="14" font-family="monospace" font-size="11" fill="#18181B">#71717A NEUTRAL ZINC</text>
        </g>
      `;
      break;

    case 'logo-2':
      // Heritage Serif Monogram Emblem
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#FBFBF9" stroke="#18181B" stroke-width="2"/>
        <line x1="40" y1="120" x2="1160" y2="120" stroke="#18181B" stroke-width="1.5"/>
        <text x="80" y="85" font-family="'Pretendard', sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="#18181B">BRAND IDENTITY — CONCEPT 02</text>
        <text x="1120" y="85" font-family="monospace" font-size="13" font-weight="600" fill="#71717A" text-anchor="end">HERITAGE SERIF / ARCHIVE 02</text>

        <!-- Monogram stamp -->
        <g transform="translate(600, 390)">
          <circle cx="0" cy="-80" r="75" fill="none" stroke="#18181B" stroke-width="3"/>
          <circle cx="0" cy="-80" r="66" fill="none" stroke="#18181B" stroke-width="1" stroke-dasharray="4 3"/>
          <text x="0" y="-62" font-family="'Didot', 'Georgia', serif" font-size="54" font-style="italic" font-weight="700" fill="#18181B" text-anchor="middle">U·F</text>
          
          <text x="0" y="50" font-family="'Didot', 'Georgia', serif" font-size="46" font-weight="700" letter-spacing="8" fill="#18181B" text-anchor="middle">URBAN FOREST</text>
          <text x="0" y="88" font-family="'Cinzel', 'Georgia', serif" font-size="14" letter-spacing="14" fill="#78716C" text-anchor="middle">ESTABLISHED 2026 · NATURE ARCHIVE</text>
        </g>

        <!-- Palette swatches -->
        <g transform="translate(80, 680)">
          <rect x="0" y="0" width="40" height="20" fill="#1C1917" stroke="#18181B" stroke-width="1"/>
          <text x="50" y="14" font-family="monospace" font-size="11" fill="#18181B">#1C1917 DEEP FOREST</text>

          <rect x="220" y="0" width="40" height="20" fill="#1E392A" stroke="#18181B" stroke-width="1"/>
          <text x="270" y="14" font-family="monospace" font-size="11" fill="#18181B">#1E392A PINE GREEN</text>

          <rect x="440" y="0" width="40" height="20" fill="#F5F5F0" stroke="#18181B" stroke-width="1"/>
          <text x="490" y="14" font-family="monospace" font-size="11" fill="#18181B">#F5F5F0 ANTIQUE CREAM</text>
        </g>
      `;
      break;

    case 'logo-3':
      // Neo-Brutalist Typographic Identity
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        <line x1="40" y1="120" x2="1160" y2="120" stroke="#000000" stroke-width="2"/>
        <text x="80" y="85" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" letter-spacing="2" fill="#000000">CONTEMPORARY EDITORIAL — CONCEPT 03</text>
        <text x="1120" y="85" font-family="monospace" font-size="13" font-weight="700" fill="#000000" text-anchor="end">NEO-BRUTALISM // 03</text>

        <!-- Editorial Stack -->
        <g transform="translate(600, 370)">
          <rect x="-320" y="-140" width="640" height="180" fill="#000000"/>
          <text x="0" y="-20" font-family="'Pretendard', 'Inter', sans-serif" font-size="76" font-weight="900" letter-spacing="-3" fill="#FFFFFF" text-anchor="middle">URBAN FOREST</text>
          
          <rect x="-320" y="60" width="220" height="42" fill="#2563EB"/>
          <text x="-210" y="88" font-family="monospace" font-size="16" font-weight="800" fill="#FFFFFF" text-anchor="middle">ROASTERY № 03</text>
          
          <text x="320" y="90" font-family="'Pretendard', sans-serif" font-size="20" font-weight="700" letter-spacing="1" fill="#000000" text-anchor="end">SEUL · TOKYO · BERLIN</text>
        </g>

        <!-- Palette swatches -->
        <g transform="translate(80, 680)">
          <rect x="0" y="0" width="40" height="20" fill="#000000"/>
          <text x="50" y="14" font-family="monospace" font-size="11" fill="#000000">#000000 INK BLACK</text>

          <rect x="220" y="0" width="40" height="20" fill="#2563EB"/>
          <text x="270" y="14" font-family="monospace" font-size="11" fill="#000000">#2563EB COBALT ACCENT</text>

          <rect x="440" y="0" width="40" height="20" fill="#E4E4E7"/>
          <text x="490" y="14" font-family="monospace" font-size="11" fill="#000000">#E4E4E7 PALE GRAY</text>
        </g>
      `;
      break;

    case 'cup-1':
      // Kraft Vintage 2-Tone Sleeve
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#FFFFFF" stroke="#18181B" stroke-width="2"/>
        <line x1="40" y1="120" x2="1160" y2="120" stroke="#18181B" stroke-width="1.5"/>
        <text x="80" y="85" font-family="'Pretendard', sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="#18181B">PACKAGING DESIGN — 컵홀더 시안 01</text>
        <text x="1120" y="85" font-family="monospace" font-size="13" font-weight="600" fill="#71717A" text-anchor="end">13oz KRAFT SLEEVE</text>

        <!-- Sleeve graphic simulation -->
        <g transform="translate(600, 380)">
          <!-- Kraft Board Background with sharp shadow -->
          <rect x="-380" y="-120" width="760" height="240" fill="#D7C4A8" stroke="#18181B" stroke-width="2"/>
          <rect x="-360" y="-100" width="720" height="200" fill="none" stroke="#18181B" stroke-width="1.5" stroke-dasharray="6 4"/>

          <!-- Stamp emblem in Brick red & Charcoal -->
          <circle cx="-160" cy="0" r="60" fill="none" stroke="#8E2818" stroke-width="3"/>
          <circle cx="-160" cy="0" r="50" fill="none" stroke="#18181B" stroke-width="1"/>
          <text x="-160" y="-8" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" fill="#8E2818" text-anchor="middle">URBAN FOREST</text>
          <text x="-160" y="14" font-family="monospace" font-size="10" font-weight="700" fill="#18181B" text-anchor="middle">ECO LIFE</text>

          <text x="10" y="-20" font-family="'Didot', serif" font-size="36" font-weight="bold" fill="#18181B">ORIGINAL BLEND</text>
          <text x="10" y="15" font-family="'Pretendard', sans-serif" font-size="14" fill="#52525B">콜롬비아 게이샤 &amp; 과테말라 안티구아 밸런스</text>
          <text x="10" y="45" font-family="monospace" font-size="12" fill="#8E2818">100% ECO KRAFT PAPER / NON-BLEACHED</text>
        </g>

        <g transform="translate(80, 680)">
          <rect x="0" y="0" width="40" height="20" fill="#D7C4A8" stroke="#18181B" stroke-width="1"/>
          <text x="50" y="14" font-family="monospace" font-size="11" fill="#18181B">#D7C4A8 KRAFT RAW</text>
          <rect x="220" y="0" width="40" height="20" fill="#8E2818" stroke="#18181B" stroke-width="1"/>
          <text x="270" y="14" font-family="monospace" font-size="11" fill="#18181B">#8E2818 BRICK RED</text>
        </g>
      `;
      break;

    case 'cup-2':
      // Modern Grid Typo Sleeve
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#FFFFFF" stroke="#18181B" stroke-width="2"/>
        <line x1="40" y1="120" x2="1160" y2="120" stroke="#18181B" stroke-width="1.5"/>
        <text x="80" y="85" font-family="'Pretendard', sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="#18181B">PACKAGING DESIGN — 컵홀더 시안 02</text>
        <text x="1120" y="85" font-family="monospace" font-size="13" font-weight="600" fill="#71717A" text-anchor="end">16oz GRID TYPOGRAPHY</text>

        <!-- Grid Air Holder -->
        <g transform="translate(600, 380)">
          <rect x="-380" y="-120" width="760" height="240" fill="#18181B" stroke="#000000" stroke-width="2"/>
          
          <!-- Modern Swiss grid lines -->
          <line x1="-380" y1="-40" x2="380" y2="-40" stroke="#3F3F46" stroke-width="1"/>
          <line x1="-380" y1="40" x2="380" y2="40" stroke="#3F3F46" stroke-width="1"/>
          <line x1="-120" y1="-120" x2="-120" y2="120" stroke="#3F3F46" stroke-width="1"/>
          <line x1="140" y1="-120" x2="140" y2="120" stroke="#3F3F46" stroke-width="1"/>

          <text x="-350" y="-75" font-family="monospace" font-size="12" fill="#A1A1AA">PROJECT 02</text>
          <text x="-350" y="5" font-family="'Pretendard', sans-serif" font-size="32" font-weight="900" fill="#FFFFFF">URBAN</text>
          <text x="-350" y="85" font-family="'Pretendard', sans-serif" font-size="32" font-weight="900" fill="#FFFFFF">FOREST</text>

          <text x="-90" y="-75" font-family="monospace" font-size="12" fill="#A1A1AA">ECO COLLECTION</text>
          <text x="-90" y="5" font-family="'Pretendard', sans-serif" font-size="16" font-weight="600" fill="#E4E4E7">자연을 담은 친환경 패키지</text>
          <text x="-90" y="85" font-family="'Pretendard', sans-serif" font-size="13" fill="#A1A1AA">쇼룸 시그니처 텀블러</text>

          <rect x="170" y="-80" width="180" height="160" fill="#FFFFFF"/>
          <text x="260" y="-20" font-family="monospace" font-size="14" font-weight="bold" fill="#18181B" text-anchor="middle">U·F·C·O</text>
          <circle cx="260" cy="20" r="24" fill="#2563EB"/>
          <text x="260" y="26" font-family="sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF" text-anchor="middle">F</text>
        </g>
      `;
      break;

    case 'cup-3':
      // Minimal Line Architecture Sleeve
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#FFFFFF" stroke="#18181B" stroke-width="2"/>
        <line x1="40" y1="120" x2="1160" y2="120" stroke="#18181B" stroke-width="1.5"/>
        <text x="80" y="85" font-family="'Pretendard', sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="#18181B">PACKAGING DESIGN — 컵홀더 시안 03</text>
        <text x="1120" y="85" font-family="monospace" font-size="13" font-weight="600" fill="#71717A" text-anchor="end">MINIMAL ARCHITECTURAL SLEEVE</text>

        <!-- Clean Ivory minimal architectural sleeve -->
        <g transform="translate(600, 380)">
          <rect x="-380" y="-120" width="760" height="240" fill="#F4F4F5" stroke="#18181B" stroke-width="2"/>
          <line x1="-380" y1="0" x2="380" y2="0" stroke="#18181B" stroke-width="1"/>
          
          <text x="-340" y="-45" font-family="'Pretendard', sans-serif" font-size="28" font-weight="900" letter-spacing="6" fill="#18181B">URBAN FOREST</text>
          <text x="340" y="-45" font-family="monospace" font-size="14" font-weight="600" fill="#71717A" text-anchor="end">EDITION № 03</text>

          <text x="-340" y="45" font-family="'Pretendard', sans-serif" font-size="14" font-weight="500" fill="#52525B">일상 속에 스며드는 자연의 감각</text>
          <text x="340" y="45" font-family="monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">ECO EXCLUSIVE</text>
        </g>
      `;
      break;

    case 'menu-1':
      // Clear Acrylic Stand Board
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#FFFFFF" stroke="#18181B" stroke-width="2"/>
        <line x1="40" y1="120" x2="1160" y2="120" stroke="#18181B" stroke-width="1.5"/>
        <text x="80" y="85" font-family="'Pretendard', sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="#18181B">MENU BOARD — 메뉴판 시안 01</text>
        <text x="1120" y="85" font-family="monospace" font-size="13" font-weight="600" fill="#71717A" text-anchor="end">CLEAR ACRYLIC A4 STAND</text>

        <!-- Acrylic menu card with border and shadow -->
        <g transform="translate(600, 400)">
          <rect x="-240" y="-220" width="480" height="440" fill="#FFFFFF" stroke="#18181B" stroke-width="2"/>
          <line x1="-240" y1="-140" x2="240" y2="-140" stroke="#18181B" stroke-width="1.5"/>
          
          <text x="0" y="-175" font-family="'Pretendard', sans-serif" font-size="22" font-weight="900" letter-spacing="3" fill="#18181B" text-anchor="middle">URBAN FOREST — MENU</text>
          
          <!-- Category 1: Espresso -->
          <text x="-200" y="-95" font-family="'Pretendard', sans-serif" font-size="15" font-weight="800" fill="#18181B">ESPRESSO &amp; BLACK</text>
          <text x="-200" y="-65" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">에스프레소</text><text x="200" y="-65" font-family="monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">5.0</text>
          <text x="-200" y="-40" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">아메리카노 (Forest Blend)</text><text x="200" y="-40" font-family="monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">5.5</text>
          <text x="-200" y="-15" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">콜드브루</text><text x="200" y="-15" font-family="monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">6.0</text>

          <line x1="-200" y1="15" x2="200" y2="15" stroke="#E4E4E7" stroke-width="1"/>

          <!-- Category 2: White & Signature -->
          <text x="-200" y="50" font-family="'Pretendard', sans-serif" font-size="15" font-weight="800" fill="#18181B">WHITE &amp; SIGNATURE</text>
          <text x="-200" y="80" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">플랫화이트</text><text x="200" y="80" font-family="monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">6.0</text>
          <text x="-200" y="105" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700" fill="#2563EB">포레스트 시그니처 라떼 (Signature)</text><text x="200" y="105" font-family="monospace" font-size="13" font-weight="bold" fill="#2563EB" text-anchor="end">7.0</text>
          <text x="-200" y="130" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">오틀리 말차 라떼</text><text x="200" y="130" font-family="monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">6.5</text>
        </g>
      `;
      break;

    case 'menu-2':
      // Editorial Magazine Grid Menu Card
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#FFFFFF" stroke="#18181B" stroke-width="2"/>
        <line x1="40" y1="120" x2="1160" y2="120" stroke="#18181B" stroke-width="1.5"/>
        <text x="80" y="85" font-family="'Pretendard', sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="#18181B">MENU BOARD — 메뉴판 시안 02</text>
        <text x="1120" y="85" font-family="monospace" font-size="13" font-weight="600" fill="#71717A" text-anchor="end">EDITORIAL POSTCARD MENU</text>

        <!-- Editorial 2-column spread card -->
        <g transform="translate(600, 400)">
          <rect x="-360" y="-210" width="720" height="420" fill="#FBFBF9" stroke="#18181B" stroke-width="2"/>
          <line x1="0" y1="-210" x2="0" y2="210" stroke="#18181B" stroke-width="1.5"/>

          <!-- Left column -->
          <text x="-320" y="-160" font-family="'Didot', serif" font-size="28" font-weight="bold" fill="#18181B">URBAN ARCHIVE</text>
          <text x="-320" y="-130" font-family="monospace" font-size="12" fill="#78716C">LIFESTYLE &amp; OBJECT NOTES</text>

          <text x="-320" y="-70" font-family="'Pretendard', sans-serif" font-size="16" font-weight="bold" fill="#18181B">SINGLE ORIGIN DRIP</text>
          <text x="-320" y="-45" font-family="'Pretendard', sans-serif" font-size="13" fill="#52525B">에티오피아 예가체프 베르가못</text>
          <text x="-320" y="-25" font-family="monospace" font-size="12" fill="#1E392A">Washed / Jasmine, Peach / 7.5</text>

          <text x="-320" y="25" font-family="'Pretendard', sans-serif" font-size="13" fill="#52525B">콜롬비아 엘 파라이소 리치</text>
          <text x="-320" y="45" font-family="monospace" font-size="12" fill="#1E392A">Thermal Shock / Lychee, Rose / 8.5</text>

          <!-- Right column -->
          <text x="40" y="-160" font-family="'Pretendard', sans-serif" font-size="18" font-weight="900" fill="#18181B">SIGNATURE &amp; BAKE</text>
          <text x="40" y="-110" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">플랫화이트 / 6.0</text>
          <text x="40" y="-80" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">어반 클래식 아포가토 / 7.5</text>
          <text x="40" y="-50" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">클래식 까눌레 / 3.8</text>
          <text x="40" y="-20" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">바스크 치즈케이크 / 7.0</text>

          <rect x="40" y="50" width="280" height="90" fill="#18181B"/>
          <text x="180" y="90" font-family="'Pretendard', sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SEASONAL COLLECTION</text>
          <text x="180" y="115" font-family="monospace" font-size="12" fill="#A1A1AA" text-anchor="middle">LIMITED QUANTITY DAILY</text>
        </g>
      `;
      break;

    case 'menu-3':
      // Modern Monochrome Counter Display
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
        <line x1="40" y1="120" x2="1160" y2="120" stroke="#000000" stroke-width="1.5"/>
        <text x="80" y="85" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" letter-spacing="4" fill="#000000">MENU BOARD — 메뉴판 시안 03</text>
        <text x="1120" y="85" font-family="monospace" font-size="13" font-weight="700" fill="#71717A" text-anchor="end">MONOCHROME DISPLAY BOARD</text>

        <!-- Bold black & white minimalist counter plaque -->
        <g transform="translate(600, 400)">
          <rect x="-380" y="-200" width="760" height="400" fill="#09090B" stroke="#000000" stroke-width="2"/>
          
          <rect x="-340" y="-160" width="320" height="320" fill="#18181B"/>
          <text x="-180" y="-110" font-family="'Pretendard', sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle">COFFEE</text>
          <line x1="-310" y1="-85" x2="-50" y2="-85" stroke="#3F3F46" stroke-width="1"/>
          <text x="-310" y="-45" font-family="'Pretendard', sans-serif" font-size="14" fill="#E4E4E7">ESP / LONG BLACK</text><text x="-50" y="-45" font-family="monospace" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="end">5.5</text>
          <text x="-310" y="-10" font-family="'Pretendard', sans-serif" font-size="14" fill="#E4E4E7">WHITE (OAT +0.5)</text><text x="-50" y="-10" font-family="monospace" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="end">6.0</text>
          <text x="-310" y="25" font-family="'Pretendard', sans-serif" font-size="14" fill="#E4E4E7">FILTER SINGLE ORIGIN</text><text x="-50" y="25" font-family="monospace" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="end">7.0</text>
          <text x="-310" y="60" font-family="'Pretendard', sans-serif" font-size="14" font-weight="bold" fill="#60A5FA">UF SIGNATURE</text><text x="-50" y="60" font-family="monospace" font-size="14" font-weight="bold" fill="#60A5FA" text-anchor="end">7.5</text>

          <rect x="20" y="-160" width="320" height="320" fill="#18181B"/>
          <text x="180" y="-110" font-family="'Pretendard', sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle">OBJECT &amp; TEA</text>
          <line x1="50" y1="-85" x2="310" y2="-85" stroke="#3F3F46" stroke-width="1"/>
          <text x="50" y="-45" font-family="'Pretendard', sans-serif" font-size="14" fill="#E4E4E7">JEJU MATCHA LATTE</text><text x="310" y="-45" font-family="monospace" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="end">6.5</text>
          <text x="50" y="-10" font-family="'Pretendard', sans-serif" font-size="14" fill="#E4E4E7">EARL GREY PEACH TEA</text><text x="310" y="-10" font-family="monospace" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="end">6.5</text>
          <text x="50" y="25" font-family="'Pretendard', sans-serif" font-size="14" fill="#E4E4E7">VALRHONA CHOC CANELE</text><text x="310" y="25" font-family="monospace" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="end">3.8</text>
          <text x="50" y="60" font-family="'Pretendard', sans-serif" font-size="14" fill="#E4E4E7">LEMON POUND CAKE</text><text x="310" y="60" font-family="monospace" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="end">4.8</text>
        </g>
      `;
      break;
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <rect width="${width}" height="${height}" fill="#FAFAFA"/>
      ${graphicSvg}
      <!-- Technical stamp -->
      <g transform="translate(1120, 755)">
        <text x="0" y="0" font-family="monospace" font-size="11" font-weight="600" letter-spacing="1" fill="#71717A" text-anchor="end">SIANPICK PORTFOLIO ARCHIVE // 2026</text>
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

export function generateTattooSvg(
  type: 'flash-1' | 'flash-2' | 'flash-3' | 'body-1' | 'body-2' | 'body-3' | 'care-1' | 'care-2' | 'care-3',
  itemLabel: string,
  conceptLabel: string
): string {
  const width = 1200;
  const height = 800;

  let graphicSvg = '';

  switch (type) {
    case 'flash-1':
      // Botanical Serpent & Wild Rose - Fine-line Blackwork
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#121214" stroke="#27272A" stroke-width="1.5"/>
        <line x1="40" y1="110" x2="1160" y2="110" stroke="#27272A" stroke-width="1"/>
        <text x="80" y="80" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#E4E4E7">CUSTOM TATTOO FLASH // CONCEPT 01</text>
        <text x="1120" y="80" font-family="monospace" font-size="12" font-weight="500" fill="#71717A" text-anchor="end">FINE-LINE &amp; DOTWORK // 0803RL</text>

        <!-- Sacred Geometry & Serpent Rose Drawing -->
        <g transform="translate(600, 420)">
          <!-- Celestial Sacred Ring -->
          <circle cx="0" cy="-30" r="190" fill="none" stroke="#27272A" stroke-width="1" stroke-dasharray="4 4"/>
          <circle cx="0" cy="-30" r="150" fill="none" stroke="#3F3F46" stroke-width="1"/>
          <circle cx="0" cy="-30" r="70" fill="none" stroke="#52525B" stroke-width="1.5"/>

          <!-- Crosshair coordinate lines -->
          <line x1="-220" y1="-30" x2="220" y2="-30" stroke="#27272A" stroke-width="0.8"/>
          <line x1="0" y1="-250" x2="0" y2="190" stroke="#27272A" stroke-width="0.8"/>

          <!-- Serpent Path (Elegant S-curves) -->
          <path d="M 0 -210 C 60 -190 90 -140 40 -80 C -20 -20 -60 40 -10 100 C 40 160 30 200 0 220" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
          <path d="M 0 -210 C 60 -190 90 -140 40 -80 C -20 -20 -60 40 -10 100 C 40 160 30 200 0 220" fill="none" stroke="#A1A1AA" stroke-width="1.5" stroke-dasharray="2 3"/>

          <!-- Serpent Head & Eyes -->
          <path d="M 0 -210 C -15 -225 -10 -245 0 -255 C 10 -245 15 -225 0 -210 Z" fill="#FFFFFF"/>
          <circle cx="-4" cy="-238" r="1.5" fill="#121214"/>
          <circle cx="4" cy="-238" r="1.5" fill="#121214"/>
          <!-- Serpent Tongue -->
          <path d="M 0 -255 L 0 -270 M 0 -270 L -5 -278 M 0 -270 L 5 -278" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>

          <!-- Wild Rose Blooms & Leaves -->
          <!-- Rose 1 (Upper center) -->
          <g transform="translate(45, -70)">
            <circle cx="0" cy="0" r="32" fill="#18181B" stroke="#FFFFFF" stroke-width="2"/>
            <path d="M -15 -10 C -5 -25 15 -25 20 -10 C 25 10 0 25 -15 15 C -25 5 -20 -5 -15 -10" fill="none" stroke="#FFFFFF" stroke-width="1.8"/>
            <path d="M -8 -5 C 0 -15 10 -15 12 -5 C 15 5 0 15 -8 10 Z" fill="#27272A" stroke="#FFFFFF" stroke-width="1.2"/>
            <!-- Thorn Leaves -->
            <path d="M 28 -15 C 45 -30 60 -20 50 0 C 40 0 32 -5 28 -15 Z" fill="#18181B" stroke="#FFFFFF" stroke-width="1.5"/>
            <path d="M -25 15 C -45 30 -60 20 -50 0 C -40 0 -32 5 -25 15 Z" fill="#18181B" stroke="#FFFFFF" stroke-width="1.5"/>
          </g>

          <!-- Rose 2 (Lower left) -->
          <g transform="translate(-40, 60)">
            <circle cx="0" cy="0" r="28" fill="#18181B" stroke="#FFFFFF" stroke-width="1.8"/>
            <path d="M -12 -8 C -4 -20 12 -20 16 -8 C 20 8 0 20 -12 12 Z" fill="#27272A" stroke="#FFFFFF" stroke-width="1.2"/>
            <path d="M 24 -10 C 38 -22 50 -15 42 2 C 34 2 27 -3 24 -10 Z" fill="#18181B" stroke="#FFFFFF" stroke-width="1.5"/>
          </g>

          <!-- Stippling dotwork clouds & celestial stars -->
          <circle cx="-110" cy="-120" r="1.5" fill="#FFFFFF"/>
          <circle cx="-100" cy="-130" r="1" fill="#FFFFFF"/>
          <circle cx="120" cy="-140" r="1.5" fill="#FFFFFF"/>
          <circle cx="140" cy="80" r="1.5" fill="#FFFFFF"/>
          <circle cx="-130" cy="110" r="1.2" fill="#FFFFFF"/>
          <polygon points="110,-30 115,-32 110,-34 105,-32" fill="#FFFFFF"/>
          <polygon points="-110,30 -105,28 -110,26 -115,28" fill="#FFFFFF"/>

          <!-- Typography in graphic -->
          <text x="0" y="275" font-family="'Pretendard', sans-serif" font-size="22" font-weight="800" letter-spacing="8" fill="#FFFFFF" text-anchor="middle">SERPENT &amp; WILD ROSE</text>
          <text x="0" y="300" font-family="monospace" font-size="12" letter-spacing="4" fill="#71717A" text-anchor="middle">CUSTOM 1:1 FINE-LINE BLACKWORK // NOIR INK</text>
        </g>

        <!-- Spec Tags (Bottom) -->
        <g transform="translate(80, 715)">
          <text x="0" y="0" font-family="monospace" font-size="11" fill="#A1A1AA">DIMENSION: 13.5cm x 6.8cm</text>
          <text x="260" y="0" font-family="monospace" font-size="11" fill="#A1A1AA">RECOMMENDED PLACEMENT: FOREARM / CALF</text>
          <text x="640" y="0" font-family="monospace" font-size="11" fill="#A1A1AA">EST. DURATION: 2H 45M</text>
          <text x="940" y="0" font-family="monospace" font-size="11" fill="#D4AF37" text-anchor="end">ONE-OFF FLASH (1인 1도안)</text>
        </g>
      `;
      break;

    case 'flash-2':
      // Geometric Butterfly & Lunar Phases
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#121214" stroke="#27272A" stroke-width="1.5"/>
        <line x1="40" y1="110" x2="1160" y2="110" stroke="#27272A" stroke-width="1"/>
        <text x="80" y="80" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#E4E4E7">CUSTOM TATTOO FLASH // CONCEPT 02</text>
        <text x="1120" y="80" font-family="monospace" font-size="12" font-weight="500" fill="#71717A" text-anchor="end">GEOMETRIC LUNAR MOTH // 0803RL &amp; 1005RL</text>

        <!-- Center Sacred Moth & Moon Phases -->
        <g transform="translate(600, 410)">
          <!-- Vertical Dagger & Alignment Axis -->
          <line x1="0" y1="-260" x2="0" y2="230" stroke="#FFFFFF" stroke-width="1.2"/>
          <line x1="-240" y1="0" x2="240" y2="0" stroke="#27272A" stroke-width="0.8"/>

          <!-- Moon Phases on vertical axis -->
          <!-- Full Moon -->
          <circle cx="0" cy="-200" r="18" fill="none" stroke="#FFFFFF" stroke-width="1.8"/>
          <!-- Waxing Crescent -->
          <path d="M 0 -150 A 14 14 0 0 0 0 -122 A 10 14 0 0 1 0 -150 Z" fill="#FFFFFF"/>
          <!-- Waning Crescent -->
          <path d="M 0 150 A 14 14 0 0 1 0 178 A 10 14 0 0 0 0 150 Z" fill="#FFFFFF"/>
          <!-- New Moon Ring -->
          <circle cx="0" cy="205" r="10" fill="none" stroke="#71717A" stroke-width="1" stroke-dasharray="2 2"/>

          <!-- Moth Body (Sleek Dagger) -->
          <path d="M 0 -70 L 6 -10 L 4 60 L 0 90 L -4 60 L -6 -10 Z" fill="#FFFFFF"/>
          <circle cx="0" cy="-78" r="6" fill="#FFFFFF"/>
          <!-- Antennae -->
          <path d="M -3 -82 C -18 -105 -35 -115 -55 -110" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M 3 -82 C 18 -105 35 -115 55 -110" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="-55" cy="-110" r="2.5" fill="#FFFFFF"/>
          <circle cx="55" cy="-110" r="2.5" fill="#FFFFFF"/>

          <!-- Upper Wings (Sacred Geometry Linework) -->
          <!-- Right Upper Wing -->
          <path d="M 6 -20 C 60 -110 160 -130 210 -70 C 230 -20 190 40 20 20 Z" fill="none" stroke="#FFFFFF" stroke-width="2"/>
          <path d="M 20 -15 C 60 -75 140 -90 175 -50 C 190 -20 160 20 20 10 Z" fill="none" stroke="#A1A1AA" stroke-width="1"/>
          <!-- Sacred Inset Eye in Wing -->
          <circle cx="120" cy="-45" r="16" fill="none" stroke="#FFFFFF" stroke-width="1.2"/>
          <circle cx="120" cy="-45" r="6" fill="#FFFFFF"/>

          <!-- Left Upper Wing (Mirror) -->
          <path d="M -6 -20 C -60 -110 -160 -130 -210 -70 C -230 -20 -190 40 -20 20 Z" fill="none" stroke="#FFFFFF" stroke-width="2"/>
          <path d="M -20 -15 C -60 -75 -140 -90 -175 -50 C -190 -20 -160 20 -20 10 Z" fill="none" stroke="#A1A1AA" stroke-width="1"/>
          <!-- Inset Eye -->
          <circle cx="-120" cy="-45" r="16" fill="none" stroke="#FFFFFF" stroke-width="1.2"/>
          <circle cx="-120" cy="-45" r="6" fill="#FFFFFF"/>

          <!-- Lower Wings -->
          <path d="M 6 30 C 50 50 110 90 90 140 C 70 170 30 150 4 70 Z" fill="none" stroke="#FFFFFF" stroke-width="1.8"/>
          <path d="M -6 30 C -50 50 -110 90 -90 140 C -70 170 -30 150 -4 70 Z" fill="none" stroke="#FFFFFF" stroke-width="1.8"/>

          <!-- Geometric concentric aura rings -->
          <circle cx="0" cy="0" r="120" fill="none" stroke="#27272A" stroke-width="1"/>
          <circle cx="0" cy="0" r="180" fill="none" stroke="#3F3F46" stroke-width="0.8" stroke-dasharray="3 4"/>

          <!-- Typography in graphic -->
          <text x="0" y="275" font-family="'Pretendard', sans-serif" font-size="22" font-weight="800" letter-spacing="8" fill="#FFFFFF" text-anchor="middle">LUNAR MOTH &amp; SACRED EYE</text>
          <text x="0" y="300" font-family="monospace" font-size="12" letter-spacing="4" fill="#71717A" text-anchor="middle">SYMMETRIC FINE-LINE GEOMETRY // NOIR INK</text>
        </g>

        <!-- Spec Tags (Bottom) -->
        <g transform="translate(80, 715)">
          <text x="0" y="0" font-family="monospace" font-size="11" fill="#A1A1AA">DIMENSION: 11.0cm x 9.5cm</text>
          <text x="260" y="0" font-family="monospace" font-size="11" fill="#A1A1AA">RECOMMENDED PLACEMENT: CHEST / BACK / THIGH</text>
          <text x="660" y="0" font-family="monospace" font-size="11" fill="#A1A1AA">EST. DURATION: 3H 00M</text>
          <text x="940" y="0" font-family="monospace" font-size="11" fill="#D4AF37" text-anchor="end">ONE-OFF FLASH (1인 1도안)</text>
        </g>
      `;
      break;

    case 'flash-3':
      // Minimal Origami Crane & Starlight Coordinates
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#121214" stroke="#27272A" stroke-width="1.5"/>
        <line x1="40" y1="110" x2="1160" y2="110" stroke="#27272A" stroke-width="1"/>
        <text x="80" y="80" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#E4E4E7">CUSTOM TATTOO FLASH // CONCEPT 03</text>
        <text x="1120" y="80" font-family="monospace" font-size="12" font-weight="500" fill="#71717A" text-anchor="end">FACETED ORIGAMI &amp; CELESTIAL // SINGLE NEEDLE</text>

        <!-- Origami Crane Vector -->
        <g transform="translate(600, 395)">
          <!-- Starlight constellation lines -->
          <circle cx="0" cy="0" r="160" fill="none" stroke="#27272A" stroke-width="1"/>
          
          <!-- Origami Faceted Polygons -->
          <!-- Main Wing Left -->
          <polygon points="0,-40 -170,-110 -60,-10" fill="#1F1F23" stroke="#FFFFFF" stroke-width="1.8"/>
          <!-- Main Wing Right -->
          <polygon points="0,-40 160,-95 40,-15" fill="#2E2E33" stroke="#FFFFFF" stroke-width="1.8"/>
          <!-- Body Central Fold -->
          <polygon points="0,-40 -30,60 0,90 30,60" fill="#18181B" stroke="#FFFFFF" stroke-width="1.8"/>
          <!-- Neck & Head -->
          <polygon points="0,-40 -20,-140 -35,-155 -25,-155 -10,-130" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="1.5"/>
          <!-- Tail -->
          <polygon points="0,90 40,165 15,100" fill="#27272A" stroke="#FFFFFF" stroke-width="1.8"/>

          <!-- Micro Coordinates & Lettering -->
          <text x="0" y="145" font-family="monospace" font-size="13" font-weight="600" letter-spacing="5" fill="#A1A1AA" text-anchor="middle">37°31'45"N  127°01'18"E</text>
          <text x="0" y="170" font-family="'Pretendard', sans-serif" font-size="11" font-weight="500" letter-spacing="6" fill="#71717A" text-anchor="middle">SEOUL // ETERNAL FREEDOM</text>

          <!-- Constellation twinkling stars -->
          <g fill="#FFFFFF">
            <circle cx="-130" cy="-60" r="2"/>
            <circle cx="120" cy="-40" r="2.5"/>
            <circle cx="-90" cy="110" r="1.5"/>
            <circle cx="100" cy="90" r="2"/>
            <circle cx="0" cy="-195" r="2"/>
          </g>

          <text x="0" y="275" font-family="'Pretendard', sans-serif" font-size="22" font-weight="800" letter-spacing="8" fill="#FFFFFF" text-anchor="middle">ORIGAMI CRANE &amp; CELESTIAL</text>
          <text x="0" y="300" font-family="monospace" font-size="12" letter-spacing="4" fill="#71717A" text-anchor="middle">MICRO-REALISM &amp; GEOMETRIC // NOIR INK</text>
        </g>

        <!-- Spec Tags (Bottom) -->
        <g transform="translate(80, 715)">
          <text x="0" y="0" font-family="monospace" font-size="11" fill="#A1A1AA">DIMENSION: 9.0cm x 7.5cm</text>
          <text x="260" y="0" font-family="monospace" font-size="11" fill="#A1A1AA">RECOMMENDED PLACEMENT: WRIST / ANKLE / COLLARBONE</text>
          <text x="680" y="0" font-family="monospace" font-size="11" fill="#A1A1AA">EST. DURATION: 1H 45M</text>
          <text x="940" y="0" font-family="monospace" font-size="11" fill="#D4AF37" text-anchor="end">ONE-OFF FLASH (1인 1도안)</text>
        </g>
      `;
      break;

    case 'body-1':
      // Forearm Inner Placement Mockup
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#18181B" stroke="#27272A" stroke-width="1.5"/>
        <line x1="40" y1="110" x2="1160" y2="110" stroke="#27272A" stroke-width="1"/>
        <text x="80" y="80" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#E4E4E7">BODY PLACEMENT PREVIEW // FOREARM INNER (전완근 안쪽)</text>
        <text x="1120" y="80" font-family="monospace" font-size="12" font-weight="500" fill="#A1A1AA" text-anchor="end">SCALE RATIO 1:1 VIRTUAL STENCIL</text>

        <!-- Forearm Contour Silhouette Canvas -->
        <g transform="translate(600, 420)">
          <!-- Forearm Silhouette Shape -->
          <path d="M -110 -270 C -120 -150 -105 80 -85 240 L 85 240 C 105 80 120 -150 110 -270 Z" fill="#27272A" stroke="#3F3F46" stroke-width="2"/>
          
          <!-- Wrist Crease Lines (Top) -->
          <line x1="-80" y1="-230" x2="80" y2="-230" stroke="#3F3F46" stroke-width="1" stroke-dasharray="2 3"/>
          <text x="0" y="-242" font-family="monospace" font-size="10" fill="#71717A" text-anchor="middle">WRIST LINE (손목 접힘선)</text>

          <!-- Elbow Line (Bottom) -->
          <line x1="-75" y1="210" x2="75" y2="210" stroke="#3F3F46" stroke-width="1" stroke-dasharray="2 3"/>
          <text x="0" y="228" font-family="monospace" font-size="10" fill="#71717A" text-anchor="middle">INNER ELBOW (팔꿈치 안쪽)</text>

          <!-- Tattoo Stencil Placed on Forearm (Serpent & Rose) -->
          <g transform="translate(0, -10)">
            <circle cx="0" cy="-10" r="65" fill="none" stroke="#52525B" stroke-width="0.8" stroke-dasharray="2 2"/>
            <path d="M 0 -90 C 25 -75 40 -50 15 -25 C -10 0 -25 25 -5 50 C 15 75 10 90 0 100" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
            <!-- Inset Roses -->
            <circle cx="16" cy="-25" r="14" fill="#18181B" stroke="#FFFFFF" stroke-width="1.5"/>
            <circle cx="-14" cy="25" r="11" fill="#18181B" stroke="#FFFFFF" stroke-width="1.2"/>
          </g>

          <!-- Measurement Dimension Lines (Left Side) -->
          <g transform="translate(-150, 0)">
            <line x1="0" y1="-100" x2="0" y2="90" stroke="#D4AF37" stroke-width="1.2"/>
            <line x1="-8" y1="-100" x2="8" y2="-100" stroke="#D4AF37" stroke-width="1.2"/>
            <line x1="-8" y1="90" x2="8" y2="90" stroke="#D4AF37" stroke-width="1.2"/>
            <text x="-12" y="0" font-family="monospace" font-size="12" font-weight="700" fill="#D4AF37" text-anchor="end">13.5 cm</text>
          </g>

          <!-- Measurement Dimension Lines (Bottom) -->
          <g transform="translate(0, 125)">
            <line x1="-40" y1="0" x2="40" y2="0" stroke="#D4AF37" stroke-width="1.2"/>
            <line x1="-40" y1="-6" x2="-40" y2="6" stroke="#D4AF37" stroke-width="1.2"/>
            <line x1="40" y1="-6" x2="40" y2="6" stroke="#D4AF37" stroke-width="1.2"/>
            <text x="0" y="20" font-family="monospace" font-size="12" font-weight="700" fill="#D4AF37" text-anchor="middle">6.8 cm</text>
          </g>
        </g>

        <!-- Anatomical Fitting Notes -->
        <g transform="translate(80, 715)">
          <text x="0" y="0" font-family="'Pretendard', sans-serif" font-size="12" fill="#A1A1AA">체형 및 근육 굴곡 분석: 손목을 회전할 때 도안이 왜곡되지 않는 전완 중심축 황금비율 배치</text>
          <text x="1040" y="0" font-family="monospace" font-size="11" fill="#D4AF37" text-anchor="end">FIT CONFIRMED</text>
        </g>
      `;
      break;

    case 'body-2':
      // Upper Shoulder & Arm Placement Mockup
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#18181B" stroke="#27272A" stroke-width="1.5"/>
        <line x1="40" y1="110" x2="1160" y2="110" stroke="#27272A" stroke-width="1"/>
        <text x="80" y="80" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#E4E4E7">BODY PLACEMENT PREVIEW // UPPER SHOULDER (상완 외측)</text>
        <text x="1120" y="80" font-family="monospace" font-size="12" font-weight="500" fill="#A1A1AA" text-anchor="end">DELTOID CURVATURE ALIGNMENT</text>

        <!-- Shoulder / Upper Arm Silhouette Canvas -->
        <g transform="translate(600, 420)">
          <!-- Shoulder Curve Contour -->
          <path d="M -180 -200 C -90 -240 60 -210 140 -160 C 210 -110 200 60 170 230 L 10 230 C 30 70 10 -40 -180 -160 Z" fill="#27272A" stroke="#3F3F46" stroke-width="2"/>

          <!-- Deltoid Muscle Center Indicator -->
          <circle cx="105" cy="15" r="75" fill="none" stroke="#52525B" stroke-width="0.8" stroke-dasharray="3 3"/>
          <text x="105" y="-70" font-family="monospace" font-size="10" fill="#71717A" text-anchor="middle">DELTOID APEX (삼각근 중심)</text>

          <!-- Tattoo Stencil Placed on Upper Arm -->
          <g transform="translate(105, 15)">
            <!-- Butterfly Stencil -->
            <path d="M 0 -35 L 3 -5 L 0 35 L -3 -5 Z" fill="#FFFFFF"/>
            <path d="M 3 -10 C 30 -50 75 -60 100 -30 C 110 -5 90 20 10 10 Z" fill="none" stroke="#FFFFFF" stroke-width="1.8"/>
            <path d="M -3 -10 C -30 -50 -75 -60 -100 -30 C -110 -5 -90 20 -10 10 Z" fill="none" stroke="#FFFFFF" stroke-width="1.8"/>
            <circle cx="0" cy="-60" r="8" fill="none" stroke="#FFFFFF" stroke-width="1.2"/>
            <circle cx="0" cy="55" r="5" fill="#FFFFFF"/>
          </g>

          <!-- Dimension Lines -->
          <g transform="translate(250, 15)">
            <line x1="0" y1="-65" x2="0" y2="65" stroke="#D4AF37" stroke-width="1.2"/>
            <line x1="-6" y1="-65" x2="6" y2="-65" stroke="#D4AF37" stroke-width="1.2"/>
            <line x1="-6" y1="65" x2="6" y2="65" stroke="#D4AF37" stroke-width="1.2"/>
            <text x="15" y="4" font-family="monospace" font-size="12" font-weight="700" fill="#D4AF37">11.0 cm</text>
          </g>
        </g>

        <!-- Fitting Notes -->
        <g transform="translate(80, 715)">
          <text x="0" y="0" font-family="'Pretendard', sans-serif" font-size="12" fill="#A1A1AA">어깨선 흐름과 반소매 티셔츠 착용 시 살짝 노출되는 감각적인 위치로 설계</text>
          <text x="1040" y="0" font-family="monospace" font-size="11" fill="#D4AF37" text-anchor="end">FIT CONFIRMED</text>
        </g>
      `;
      break;

    case 'body-3':
      // Collarbone Curve Placement Mockup
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#18181B" stroke="#27272A" stroke-width="1.5"/>
        <line x1="40" y1="110" x2="1160" y2="110" stroke="#27272A" stroke-width="1"/>
        <text x="80" y="80" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#E4E4E7">BODY PLACEMENT PREVIEW // COLLARBONE (쇄골 하단 곡선)</text>
        <text x="1120" y="80" font-family="monospace" font-size="12" font-weight="500" fill="#A1A1AA" text-anchor="end">HORIZONTAL CLAVICLE BALANCE</text>

        <!-- Collarbone Silhouette Canvas -->
        <g transform="translate(600, 420)">
          <!-- Neck & Collarbone Curve Outline -->
          <path d="M -260 -190 C -120 -150 -70 -70 0 -70 C 70 -70 120 -150 260 -190 L 290 190 C 180 180 -180 180 -290 190 Z" fill="#27272A" stroke="#3F3F46" stroke-width="2"/>
          
          <!-- Clavicle Bone Line -->
          <path d="M -180 -40 C -80 -15 -20 -30 0 -45 C 20 -30 80 -15 180 -40" fill="none" stroke="#52525B" stroke-width="1.5" stroke-dasharray="3 3"/>
          <text x="0" y="-80" font-family="monospace" font-size="10" fill="#71717A" text-anchor="middle">SUPRASTERNAL NOTCH (쇄골 중심점)</text>

          <!-- Tattoo Stencil under right collarbone -->
          <g transform="translate(75, 10)">
            <!-- Origami Crane Stencil with fine coordinates -->
            <polygon points="0,-15 -55,-45 -20,-5" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
            <polygon points="0,-15 50,-40 15,-8" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
            <polygon points="0,-15 -10,20 0,32 10,20" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
            <text x="0" y="55" font-family="monospace" font-size="9" fill="#E4E4E7" text-anchor="middle">37°31'45"N 127°01'18"E</text>
          </g>

          <!-- Dimension Lines -->
          <g transform="translate(75, 80)">
            <line x1="-50" y1="0" x2="50" y2="0" stroke="#D4AF37" stroke-width="1.2"/>
            <line x1="-50" y1="-5" x2="-50" y2="5" stroke="#D4AF37" stroke-width="1.2"/>
            <line x1="50" y1="-5" x2="50" y2="5" stroke="#D4AF37" stroke-width="1.2"/>
            <text x="0" y="16" font-family="monospace" font-size="11" font-weight="700" fill="#D4AF37" text-anchor="middle">9.0 cm</text>
          </g>
        </g>

        <!-- Fitting Notes -->
        <g transform="translate(80, 715)">
          <text x="0" y="0" font-family="'Pretendard', sans-serif" font-size="12" fill="#A1A1AA">쇄골 뼈 바로 아래 1.5cm 지점으로 목걸이나 셔츠 칼라에 닿지 않는 완벽한 밸런스</text>
          <text x="1040" y="0" font-family="monospace" font-size="11" fill="#D4AF37" text-anchor="end">FIT CONFIRMED</text>
        </g>
      `;
      break;

    case 'care-1':
      // Tattoo Aftercare Timeline & Protocol
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#121214" stroke="#27272A" stroke-width="1.5"/>
        <line x1="40" y1="110" x2="1160" y2="110" stroke="#27272A" stroke-width="1"/>
        <text x="80" y="80" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#E4E4E7">TATTOO AFTERCARE &amp; HEALING GUIDE (시술 후 관리 지침서)</text>
        <text x="1120" y="80" font-family="monospace" font-size="12" font-weight="500" fill="#A1A1AA" text-anchor="end">PROTOCOL 1-14 DAYS</text>

        <!-- 4 Step Protocol Cards -->
        <g transform="translate(70, 160)">
          <!-- Step 1 -->
          <rect x="0" y="0" width="235" height="420" fill="#18181B" stroke="#27272A" stroke-width="1"/>
          <rect x="0" y="0" width="235" height="4" fill="#D4AF37"/>
          <text x="24" y="45" font-family="monospace" font-size="11" font-weight="700" fill="#D4AF37">STAGE 01 // DAY 1-3</text>
          <text x="24" y="80" font-family="'Pretendard', sans-serif" font-size="18" font-weight="800" fill="#FFFFFF">방수 필름 보호</text>
          <line x1="24" y1="100" x2="210" y2="100" stroke="#27272A" stroke-width="1"/>
          <text x="24" y="135" font-family="'Pretendard', sans-serif" font-size="13" fill="#A1A1AA" line-height="1.6">
            <tspan x="24" dy="0">- 부착된 더마패치는</tspan>
            <tspan x="24" dy="22">  최대 3일까지 유지</tspan>
            <tspan x="24" dy="30">- 내부 진물/잉크 고임은</tspan>
            <tspan x="24" dy="22">  자연스러운 치유 과정</tspan>
            <tspan x="24" dy="30">- 가벼운 샤워 가능</tspan>
            <tspan x="24" dy="22">  (사우나/입욕 금지)</tspan>
          </text>

          <!-- Step 2 -->
          <rect x="260" y="0" width="235" height="420" fill="#18181B" stroke="#27272A" stroke-width="1"/>
          <rect x="260" y="0" width="235" height="4" fill="#FFFFFF"/>
          <text x="284" y="45" font-family="monospace" font-size="11" font-weight="700" fill="#FFFFFF">STAGE 02 // DAY 4-7</text>
          <text x="284" y="80" font-family="'Pretendard', sans-serif" font-size="18" font-weight="800" fill="#FFFFFF">연고 극소량 도포</text>
          <line x1="284" y1="100" x2="470" y2="100" stroke="#27272A" stroke-width="1"/>
          <text x="284" y="135" font-family="'Pretendard', sans-serif" font-size="13" fill="#A1A1AA">
            <tspan x="284" dy="0">- 미온수로 필름 부드럽게 제거</tspan>
            <tspan x="284" dy="22">- 무향 비누 세정 후 자연 건조</tspan>
            <tspan x="284" dy="30">- 비판텐 또는 전용 연고</tspan>
            <tspan x="284" dy="22">  쌀알 크기로 얇게 도포</tspan>
            <tspan x="284" dy="30">- 하루 2~3회 건조 방지</tspan>
          </text>

          <!-- Step 3 -->
          <rect x="520" y="0" width="235" height="420" fill="#18181B" stroke="#27272A" stroke-width="1"/>
          <rect x="520" y="0" width="235" height="4" fill="#A1A1AA"/>
          <text x="544" y="45" font-family="monospace" font-size="11" font-weight="700" fill="#A1A1AA">STAGE 03 // DAY 8-14</text>
          <text x="544" y="80" font-family="'Pretendard', sans-serif" font-size="18" font-weight="800" fill="#FFFFFF">탈각 &amp; 보습 케어</text>
          <line x1="544" y1="100" x2="730" y2="100" stroke="#27272A" stroke-width="1"/>
          <text x="544" y="135" font-family="'Pretendard', sans-serif" font-size="13" fill="#A1A1AA">
            <tspan x="544" dy="0">- 얇은 딱지(각질) 발생</tspan>
            <tspan x="544" dy="22">- 억지로 떼지 말고</tspan>
            <tspan x="544" dy="22">  자연 탈락 유도</tspan>
            <tspan x="544" dy="30">- 가려울 땐 긁지 말고</tspan>
            <tspan x="544" dy="22">  손바닥으로 가볍게 톡톡</tspan>
            <tspan x="544" dy="30">- 무향 보습로션 전환</tspan>
          </text>

          <!-- Step 4 -->
          <rect x="780" y="0" width="245" height="420" fill="#18181B" stroke="#27272A" stroke-width="1"/>
          <rect x="780" y="0" width="245" height="4" fill="#D4AF37"/>
          <text x="804" y="45" font-family="monospace" font-size="11" font-weight="700" fill="#D4AF37">STAGE 04 // DAY 30-90</text>
          <text x="804" y="80" font-family="'Pretendard', sans-serif" font-size="18" font-weight="800" fill="#FFFFFF">발색 안정 &amp; 리터치</text>
          <line x1="804" y1="100" x2="1000" y2="100" stroke="#27272A" stroke-width="1"/>
          <text x="804" y="135" font-family="'Pretendard', sans-serif" font-size="13" fill="#A1A1AA">
            <tspan x="804" dy="0">- 표피 재생 완료 및</tspan>
            <tspan x="804" dy="22">  최종 본발색 정착</tspan>
            <tspan x="804" dy="30">- 자외선 차단제 필수</tspan>
            <tspan x="804" dy="22">  (SPF 50+ 변색 방지)</tspan>
            <tspan x="804" dy="30">- 3개월 이내 무상 리터치</tspan>
            <tspan x="804" dy="22">  1회 보증 서비스 제공</tspan>
          </text>
        </g>

        <!-- Caution Banner -->
        <g transform="translate(70, 620)">
          <rect x="0" y="0" width="1055" height="60" fill="#18181B" stroke="#D4AF37" stroke-width="1"/>
          <text x="30" y="36" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700" fill="#D4AF37">주의사항:</text>
          <text x="100" y="36" font-family="'Pretendard', sans-serif" font-size="13" fill="#E4E4E7">시술 후 2주간 음주, 격렬한 땀 흘리는 운동, 수영장, 직사광선 태닝은 잉크 번짐과 염증을 유발하므로 절대 피해주세요.</text>
        </g>
      `;
      break;

    case 'care-2':
      // Technical Specification & Needle Mapping
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#121214" stroke="#27272A" stroke-width="1.5"/>
        <line x1="40" y1="110" x2="1160" y2="110" stroke="#27272A" stroke-width="1"/>
        <text x="80" y="80" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#E4E4E7">TATTOO TECHNICAL SPECIFICATION (시술 사양 &amp; 멸균 보증)</text>
        <text x="1120" y="80" font-family="monospace" font-size="12" font-weight="500" fill="#A1A1AA" text-anchor="end">MEDICAL GRADE STERILIZATION</text>

        <!-- Spec Data Tables -->
        <g transform="translate(80, 160)">
          <!-- Left: Needle & Ink Spec -->
          <rect x="0" y="0" width="500" height="420" fill="#18181B" stroke="#27272A" stroke-width="1"/>
          <text x="30" y="45" font-family="'Pretendard', sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">사용 니들 &amp; 잉크 스펙</text>
          <line x1="30" y1="65" x2="470" y2="65" stroke="#27272A" stroke-width="1"/>

          <g transform="translate(30, 95)" font-family="'Pretendard', sans-serif" font-size="13">
            <text x="0" y="0" font-weight="700" fill="#D4AF37">01. 외곽 윤곽 라인 (Outlines)</text>
            <text x="0" y="22" fill="#A1A1AA">Kwang 0803RL (0.25mm 극미세 3라이너 니들)</text>

            <text x="0" y="65" font-weight="700" fill="#D4AF37">02. 잎맥 &amp; 비늘 세부 묘사 (Details)</text>
            <text x="0" y="87" fill="#A1A1AA">Cheyenne 1001RL (0.30mm 싱글 니들 정밀 터치)</text>

            <text x="0" y="130" font-weight="700" fill="#D4AF37">03. 명암 &amp; 도트워크 (Shading &amp; Dots)</text>
            <text x="0" y="152" fill="#A1A1AA">Dynamic Black 3단계 그레이워시 (Dark 60% / Mid 30% / Light 10%)</text>

            <text x="0" y="195" font-weight="700" fill="#D4AF37">04. 잉크 안전성 인증</text>
            <text x="0" y="217" fill="#A1A1AA">EU REACH 및 FDA 인증 천연 비건 피그먼트 100%</text>
          </g>

          <!-- Right: Hygiene & Safety System -->
          <rect x="540" y="0" width="500" height="420" fill="#18181B" stroke="#27272A" stroke-width="1"/>
          <text x="570" y="45" font-family="'Pretendard', sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">위생 &amp; 감염 예방 프로세스</text>
          <line x1="570" y1="65" x2="1010" y2="65" stroke="#27272A" stroke-width="1"/>

          <g transform="translate(570, 95)" font-family="'Pretendard', sans-serif" font-size="13">
            <text x="0" y="0" font-weight="700" fill="#FFFFFF">100% 1회용 멸균 카트리지</text>
            <text x="0" y="22" fill="#A1A1AA">고객 입회 하 즉석 밀봉 개봉 및 시술 직후 전용 폐기함 폐기</text>

            <text x="0" y="65" font-weight="700" fill="#FFFFFF">병원용 고압증기 멸균(Autoclave) 완료</text>
            <text x="0" y="87" fill="#A1A1AA">스테인리스 그립 및 보조기구 134°C 가압멸균 매회 실시</text>

            <text x="0" y="130" font-weight="700" fill="#FFFFFF">교차오염 원천 차단 랩핑</text>
            <text x="0" y="152" fill="#A1A1AA">시술 베드, 조명, 머신, 전원선 전체 일회용 배리어 필름 시공</text>

            <text x="0" y="195" font-weight="700" fill="#FFFFFF">의료용 스킨 소독</text>
            <text x="0" y="217" fill="#A1A1AA">시술 전후 클로르헥시딘 &amp; 그린솝 피부 살균 정화</text>
          </g>
        </g>

        <g transform="translate(80, 715)">
          <text x="0" y="0" font-family="monospace" font-size="11" fill="#A1A1AA">CERTIFICATE: ISO 9001 HYGIENE STANDARD COMPLIANT</text>
          <text x="1040" y="0" font-family="monospace" font-size="11" fill="#D4AF37" text-anchor="end">NOIR INK SANITATION</text>
        </g>
      `;
      break;

    case 'care-3':
      // 1 of 1 Custom Authenticity Certificate
      graphicSvg = `
        <rect x="40" y="40" width="1120" height="720" fill="#121214" stroke="#27272A" stroke-width="1.5"/>
        <line x1="40" y1="110" x2="1160" y2="110" stroke="#27272A" stroke-width="1"/>
        <text x="80" y="80" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#E4E4E7">TATTOO AUTHENTICITY CERTIFICATE (1인 1도안 독점 보증서)</text>
        <text x="1120" y="80" font-family="monospace" font-size="12" font-weight="500" fill="#D4AF37" text-anchor="end">1 OF 1 UNIQUE PIECE</text>

        <!-- Certificate Frame Inside -->
        <g transform="translate(600, 420)">
          <rect x="-420" y="-230" width="840" height="440" fill="#18181B" stroke="#D4AF37" stroke-width="1.5"/>
          <rect x="-412" y="-222" width="824" height="424" fill="none" stroke="#27272A" stroke-width="1"/>

          <!-- Seal Icon -->
          <circle cx="0" cy="-145" r="32" fill="#121214" stroke="#D4AF37" stroke-width="2"/>
          <text x="0" y="-140" font-family="'Pretendard', sans-serif" font-size="11" font-weight="900" fill="#D4AF37" text-anchor="middle">NOIR</text>

          <text x="0" y="-85" font-family="'Pretendard', serif" font-size="24" font-weight="800" letter-spacing="6" fill="#FFFFFF" text-anchor="middle">커스텀 도안 영구 독점 보증서</text>
          <text x="0" y="-55" font-family="monospace" font-size="12" letter-spacing="4" fill="#A1A1AA" text-anchor="middle">CERTIFICATE OF ARTWORK AUTHENTICITY</text>
          
          <line x1="-280" y1="-30" x2="280" y2="-30" stroke="#27272A" stroke-width="1"/>

          <!-- Certificate Text -->
          <text x="0" y="15" font-family="'Pretendard', sans-serif" font-size="14" fill="#E4E4E7" text-anchor="middle" line-height="1.8">
            본 도안은 의뢰인 [ 한소희 ] 님만을 위해 1:1 맞춤 창작된 오리지널 커스텀 아트워크이며,
          </text>
          <text x="0" y="45" font-family="'Pretendard', sans-serif" font-size="14" fill="#E4E4E7" text-anchor="middle">
            느와르 잉크 아틀리에의 '1인 1도안 원칙'에 따라 타인에게 절대 중복 시술되지 않음을 보증합니다.
          </text>

          <!-- Signature Block -->
          <g transform="translate(0, 120)">
            <line x1="-240" y1="0" x2="-40" y2="0" stroke="#71717A" stroke-width="1"/>
            <text x="-140" y="24" font-family="'Pretendard', sans-serif" font-size="12" fill="#A1A1AA" text-anchor="middle">의뢰인: 한소희 님</text>

            <line x1="40" y1="0" x2="240" y2="0" stroke="#D4AF37" stroke-width="1"/>
            <text x="140" y="24" font-family="'Pretendard', sans-serif" font-size="12" font-weight="700" fill="#D4AF37" text-anchor="middle">타투이스트: 로아 (Roa)</text>
          </g>

          <text x="0" y="185" font-family="monospace" font-size="10" letter-spacing="2" fill="#71717A" text-anchor="middle">EDITION NO. NIR-2026-0881 // ARCHIVED PERMANENTLY</text>
        </g>

        <g transform="translate(80, 715)">
          <text x="0" y="0" font-family="monospace" font-size="11" fill="#A1A1AA">NOIR INK ATELIER — SEOUL, HANNAM</text>
          <text x="1040" y="0" font-family="monospace" font-size="11" fill="#D4AF37" text-anchor="end">OFFICIAL GUARANTEE</text>
        </g>
      `;
      break;
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <rect width="${width}" height="${height}" fill="#09090B"/>
      ${graphicSvg}
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

export function generateBrandMockupSvg(
  variant: 'classic' | 'minimal' | 'vintage' | 'modern' | 'custom',
  title: string,
  subtitle: string,
  palette: { primary: string; secondary: string; accent: string; bg: string; text: string }
): string {
  const width = 1200;
  const height = 800;

  let graphicSvg = `
    <rect x="40" y="40" width="1120" height="720" fill="#FFFFFF" stroke="#18181B" stroke-width="2"/>
    <line x1="40" y1="120" x2="1160" y2="120" stroke="#18181B" stroke-width="1.5"/>
    <text x="80" y="85" font-family="'Pretendard', sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="#18181B">${title.toUpperCase()}</text>
    <text x="1120" y="85" font-family="monospace" font-size="13" font-weight="600" fill="#71717A" text-anchor="end">${subtitle}</text>

    <g transform="translate(600, 390)">
      <circle cx="0" cy="-80" r="50" fill="none" stroke="${palette.primary}" stroke-width="4"/>
      <text x="0" y="30" font-family="'Pretendard', sans-serif" font-size="48" font-weight="900" fill="${palette.primary}" text-anchor="middle">${title}</text>
      <text x="0" y="70" font-family="'Pretendard', sans-serif" font-size="16" letter-spacing="8" fill="${palette.secondary}" text-anchor="middle">${subtitle}</text>
    </g>
  `;

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <rect width="${width}" height="${height}" fill="#FAFAFA"/>
      ${graphicSvg}
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}
