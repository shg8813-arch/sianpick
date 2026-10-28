/**
 * High-quality SVG design mockup generator for brand visual presentations.
 * Generates data URLs for SVG brand assets so that images always render crisply and work offline.
 */

export function generateRunOfTheMillSvg(
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
          
          <text x="0" y="30" font-family="'Pretendard', 'Helvetica Neue', sans-serif" font-size="52" font-weight="900" letter-spacing="-1" fill="#18181B" text-anchor="middle">RUN OF THE MILL</text>
          <text x="0" y="70" font-family="'Pretendard', sans-serif" font-size="15" font-weight="600" letter-spacing="12" fill="#52525B" text-anchor="middle">SPECIALTY COFFEE &amp; LIFESTYLE</text>
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
          <text x="0" y="-62" font-family="'Didot', 'Georgia', serif" font-size="54" font-style="italic" font-weight="700" fill="#18181B" text-anchor="middle">R·M</text>
          
          <text x="0" y="50" font-family="'Didot', 'Georgia', serif" font-size="46" font-weight="700" letter-spacing="8" fill="#18181B" text-anchor="middle">RUN OF THE MILL</text>
          <text x="0" y="88" font-family="'Cinzel', 'Georgia', serif" font-size="14" letter-spacing="14" fill="#78716C" text-anchor="middle">ESTABLISHED 2024 · ARTISAN ROASTERS</text>
        </g>

        <!-- Palette swatches -->
        <g transform="translate(80, 680)">
          <rect x="0" y="0" width="40" height="20" fill="#1C1917" stroke="#18181B" stroke-width="1"/>
          <text x="50" y="14" font-family="monospace" font-size="11" fill="#18181B">#1C1917 ESPRESSO</text>

          <rect x="220" y="0" width="40" height="20" fill="#D97706" stroke="#18181B" stroke-width="1"/>
          <text x="270" y="14" font-family="monospace" font-size="11" fill="#18181B">#D97706 WARM OCHRE</text>

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
          <text x="0" y="-20" font-family="'Pretendard', 'Inter', sans-serif" font-size="76" font-weight="900" letter-spacing="-3" fill="#FFFFFF" text-anchor="middle">RUN OF THE MILL</text>
          
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
          <text x="-160" y="-8" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" fill="#8E2818" text-anchor="middle">RUN OF THE MILL</text>
          <text x="-160" y="14" font-family="monospace" font-size="10" font-weight="700" fill="#18181B" text-anchor="middle">ROASTERS</text>

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
          <text x="-350" y="5" font-family="'Pretendard', sans-serif" font-size="32" font-weight="900" fill="#FFFFFF">RUN OF</text>
          <text x="-350" y="85" font-family="'Pretendard', sans-serif" font-size="32" font-weight="900" fill="#FFFFFF">THE MILL</text>

          <text x="-90" y="-75" font-family="monospace" font-size="12" fill="#A1A1AA">HOT &amp; ICED CAUTION</text>
          <text x="-90" y="5" font-family="'Pretendard', sans-serif" font-size="16" font-weight="600" fill="#E4E4E7">당일 로스팅 스페셜티</text>
          <text x="-90" y="85" font-family="'Pretendard', sans-serif" font-size="13" fill="#A1A1AA">플래그십 카페 시그니처 컵</text>

          <rect x="170" y="-80" width="180" height="160" fill="#FFFFFF"/>
          <text x="260" y="-20" font-family="monospace" font-size="14" font-weight="bold" fill="#18181B" text-anchor="middle">R·O·T·M</text>
          <circle cx="260" cy="20" r="24" fill="#2563EB"/>
          <text x="260" y="26" font-family="sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF" text-anchor="middle">M</text>
        </g>

        <g transform="translate(80, 680)">
          <rect x="0" y="0" width="40" height="20" fill="#18181B" stroke="#000000" stroke-width="1"/>
          <text x="50" y="14" font-family="monospace" font-size="11" fill="#18181B">#18181B MATTE BLACK</text>
          <rect x="220" y="0" width="40" height="20" fill="#2563EB" stroke="#18181B" stroke-width="1"/>
          <text x="270" y="14" font-family="monospace" font-size="11" fill="#18181B">#2563EB COBALT BLUE</text>
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
          
          <text x="-340" y="-45" font-family="'Pretendard', sans-serif" font-size="28" font-weight="900" letter-spacing="6" fill="#18181B">RUN OF THE MILL</text>
          <text x="340" y="-45" font-family="monospace" font-size="14" font-weight="600" fill="#71717A" text-anchor="end">EDITION № 03</text>

          <text x="-340" y="45" font-family="'Pretendard', sans-serif" font-size="14" font-weight="500" fill="#52525B">일상의 평범함 속에 깃든 특별한 한 잔의 커피</text>
          <text x="340" y="45" font-family="monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">TAKE-OUT EXCLUSIVE</text>
        </g>

        <g transform="translate(80, 680)">
          <rect x="0" y="0" width="40" height="20" fill="#F4F4F5" stroke="#18181B" stroke-width="1"/>
          <text x="50" y="14" font-family="monospace" font-size="11" fill="#18181B">#F4F4F5 ARCHITECTURAL GRAY</text>
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
          
          <text x="0" y="-175" font-family="'Pretendard', sans-serif" font-size="22" font-weight="900" letter-spacing="3" fill="#18181B" text-anchor="middle">RUN OF THE MILL — MENU</text>
          
          <!-- Category 1: Espresso -->
          <text x="-200" y="-95" font-family="'Pretendard', sans-serif" font-size="15" font-weight="800" fill="#18181B">ESPRESSO &amp; BLACK</text>
          <text x="-200" y="-65" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">에스프레소</text><text x="200" y="-65" font-family="monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">5.0</text>
          <text x="-200" y="-40" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">아메리카노 (House Blend)</text><text x="200" y="-40" font-family="monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">5.5</text>
          <text x="-200" y="-15" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">콜드브루</text><text x="200" y="-15" font-family="monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">6.0</text>

          <line x1="-200" y1="15" x2="200" y2="15" stroke="#E4E4E7" stroke-width="1"/>

          <!-- Category 2: White & Signature -->
          <text x="-200" y="50" font-family="'Pretendard', sans-serif" font-size="15" font-weight="800" fill="#18181B">WHITE &amp; SIGNATURE</text>
          <text x="-200" y="80" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">플랫화이트</text><text x="200" y="80" font-family="monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">6.0</text>
          <text x="-200" y="105" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700" fill="#2563EB">런오브더밀 크림 라떼 (Signature)</text><text x="200" y="105" font-family="monospace" font-size="13" font-weight="bold" fill="#2563EB" text-anchor="end">7.0</text>
          <text x="-200" y="130" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">바닐라 빈 라떼</text><text x="200" y="130" font-family="monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">6.5</text>
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
          <text x="-320" y="-160" font-family="'Didot', serif" font-size="28" font-weight="bold" fill="#18181B">THE JOURNAL</text>
          <text x="-320" y="-130" font-family="monospace" font-size="12" fill="#78716C">COFFEE CURATION &amp; NOTES</text>

          <text x="-320" y="-70" font-family="'Pretendard', sans-serif" font-size="16" font-weight="bold" fill="#18181B">SINGLE ORIGIN DRIP</text>
          <text x="-320" y="-45" font-family="'Pretendard', sans-serif" font-size="13" fill="#52525B">에티오피아 예가체프 베르가못</text>
          <text x="-320" y="-25" font-family="monospace" font-size="12" fill="#D97706">Washed / Jasmine, Peach / 7.5</text>

          <text x="-320" y="25" font-family="'Pretendard', sans-serif" font-size="13" fill="#52525B">콜롬비아 엘 파라이소 리치</text>
          <text x="-320" y="45" font-family="monospace" font-size="12" fill="#D97706">Thermal Shock / Lychee, Rose / 8.5</text>

          <!-- Right column -->
          <text x="40" y="-160" font-family="'Pretendard', sans-serif" font-size="18" font-weight="900" fill="#18181B">COFFEE &amp; DESSERT</text>
          <text x="40" y="-110" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">플랫화이트 / 6.0</text>
          <text x="40" y="-80" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">런오브더밀 아포가토 / 7.5</text>
          <text x="40" y="-50" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">클래식 까눌레 / 3.8</text>
          <text x="40" y="-20" font-family="'Pretendard', sans-serif" font-size="13" fill="#3F3F46">바스크 치즈케이크 / 7.0</text>

          <rect x="40" y="50" width="280" height="90" fill="#18181B"/>
          <text x="180" y="90" font-family="'Pretendard', sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SEASONAL SPECIAL ROAST</text>
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
          <text x="-310" y="60" font-family="'Pretendard', sans-serif" font-size="14" font-weight="bold" fill="#60A5FA">ROTM SIGNATURE</text><text x="-50" y="60" font-family="monospace" font-size="14" font-weight="bold" fill="#60A5FA" text-anchor="end">7.5</text>

          <rect x="20" y="-160" width="320" height="320" fill="#18181B"/>
          <text x="180" y="-110" font-family="'Pretendard', sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle">NON-COFFEE &amp; BAKE</text>
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
