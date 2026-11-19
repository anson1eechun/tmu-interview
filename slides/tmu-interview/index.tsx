import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import { type CSSProperties, type ReactNode, useRef, useState } from 'react';
import awardCrossStrait from './assets/award-crossstrait.jpg';
import awardNational from './assets/award-national.jpg';
import clubTogether from './assets/club-together.jpg';
import plusrepPoster from './assets/plusrep-poster.jpg';
import appPoster from './assets/zaoxingzhe-poster.jpg';
import appQr from './assets/zaoxingzhe-qr.png';

const plusrepVideo = new URL('./assets/plusrep.mp4', import.meta.url).href;
const appVideo = new URL('./assets/zaoxingzhe.mp4', import.meta.url).href;

// ─── Design tokens ───────────────────────────────────────────────────────────

export const design: DesignSystem = {
  palette: { bg: '#060a12', text: '#e8eef6', accent: '#56d4f5' },
  fonts: {
    display: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif',
    body: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif',
  },
  typeScale: { hero: 168, body: 34 },
  radius: 16,
};

const MONO = '"JetBrains Mono", "SF Mono", Menlo, Consolas, "Noto Sans TC", monospace';
const muted = '#8fa3ba';
const dim = 'rgba(143, 163, 186, 0.62)';
const line = 'rgba(86, 212, 245, 0.28)';
const panel = 'rgba(12, 22, 36, 0.78)';
const amber = '#ffb454';
const PAD = 120;
const SITE = 'anson1eechun.github.io/tmu-interview';
const VIDEO_URL = 'https://youtu.be/RtDM5NUFBYw';
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// ─── Fonts + keyframes (injected once per document, create-or-update) ───────

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Noto+Sans+TC:wght@400;500;700;900&display=swap';
const FONT_LINK_ID = 'osd-webfont-tmu-interview';
const STYLE_ID = 'osd-styles-tmu-interview';
const css = `
@keyframes tmu-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes tmu-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes tmu-halo { 0%, 100% { opacity: 0.08; transform: scale(0.7); } 50% { opacity: 0.3; transform: scale(1.25); } }
@keyframes tmu-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes tmu-flow { to { stroke-dashoffset: -28; } }
@keyframes tmu-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
@media (prefers-reduced-motion: reduce) { .tmu-anim { animation: none !important; } }
`;
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== css) style.textContent = css;
}

// ─── Shared building blocks ──────────────────────────────────────────────────
// Entrances only play on the live page; thumbnails, the overview grid and
// print render the settled final state.

const Rise = ({
  delay = 0,
  style,
  children,
}: {
  delay?: number;
  style?: CSSProperties;
  children: ReactNode;
}) => {
  const live = useIsActivePage();
  return (
    <div
      className="tmu-anim"
      style={{ ...style, animation: live ? `tmu-rise 700ms ${EASE} ${delay}ms both` : undefined }}
    >
      {children}
    </div>
  );
};

const pad2 = (n: number) => String(n).padStart(2, '0');

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: PAD,
        right: PAD,
        bottom: 44,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontFamily: MONO,
        fontSize: 22,
        color: dim,
        letterSpacing: '0.04em',
      }}
    >
      <span>李鈞盛 · 臺北醫學大學 醫學資訊研究所 人工智慧數位醫療組</span>
      <span>
        <span style={{ color: 'var(--osd-accent)' }}>{pad2(current)}</span> / {pad2(total)}
      </span>
    </div>
  );
};

const backdrop = [
  'radial-gradient(1100px 640px at 88% 4%, rgba(86, 212, 245, 0.11), transparent 62%)',
  'radial-gradient(900px 600px at 0% 100%, rgba(86, 140, 245, 0.07), transparent 60%)',
  'linear-gradient(rgba(130, 175, 220, 0.045) 1px, transparent 1px) 0 0 / 80px 80px',
  'linear-gradient(90deg, rgba(130, 175, 220, 0.045) 1px, transparent 1px) 0 0 / 80px 80px',
  'var(--osd-bg)',
].join(', ');

const Frame = ({ children, footer = true }: { children: ReactNode; footer?: boolean }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: backdrop,
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    {children}
    {footer ? <Footer /> : null}
  </div>
);

const Kicker = ({ children }: { children: ReactNode }) => (
  <div style={{ fontFamily: MONO, fontSize: 24, color: 'var(--osd-accent)', letterSpacing: '0.16em' }}>
    {children}
  </div>
);

const Header = ({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) => (
  <Rise style={{ position: 'absolute', left: PAD, right: PAD, top: 104 }}>
    <Kicker>{kicker}</Kicker>
    <h2
      style={{
        margin: '16px 0 0',
        fontFamily: 'var(--osd-font-display)',
        fontSize: 68,
        fontWeight: 800,
        lineHeight: 1.2,
        letterSpacing: '0.01em',
      }}
    >
      {title}
    </h2>
    {sub ? <p style={{ margin: '12px 0 0', fontSize: 30, lineHeight: 1.5, color: muted }}>{sub}</p> : null}
  </Rise>
);

const Chip = ({ children, size = 26 }: { children: ReactNode; size?: number }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: size * 2.2,
      padding: `0 ${Math.round(size * 0.95)}px`,
      borderRadius: 999,
      border: `1.5px solid ${line}`,
      background: 'rgba(86, 212, 245, 0.08)',
      color: 'var(--osd-accent)',
      fontSize: size,
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

// ─── Video frame (倍伴練 + 造星者) ──────────────────────────────────────────
// The live page autoplays muted and loops; thumbnails, the overview grid and
// print show the poster. Both controls are <button>s, so the player's
// click-to-advance ignores them.

const VideoButton = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: '6px 16px',
      borderRadius: 999,
      border: `1.5px solid ${on ? 'var(--osd-accent)' : line}`,
      background: 'rgba(6, 10, 18, 0.82)',
      color: on ? 'var(--osd-accent)' : 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      fontSize: 20,
      cursor: 'pointer',
    }}
  >
    {children}
  </button>
);

const VideoFrame = ({
  src,
  poster,
  alt,
  label,
  width,
  height,
}: {
  src: string;
  poster: string;
  alt: string;
  label: string;
  width: number;
  height: number;
}) => {
  const live = useIsActivePage();
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  // Turning sound on restarts the video so the committee hears it from the top.
  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    if (muted) {
      v.currentTime = 0;
      v.muted = false;
      void v.play();
    } else {
      v.muted = true;
    }
    setMuted(!muted);
  };
  // Native controls only while the video itself is fullscreen; if the browser
  // refuses fullscreen, the frame stays as it was.
  const enlarge = () => {
    const v = ref.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    if (!v.requestFullscreen) {
      v.webkitEnterFullscreen?.();
      return;
    }
    const onChange = () => {
      const on = document.fullscreenElement === v;
      v.controls = on;
      if (!on) document.removeEventListener('fullscreenchange', onChange);
    };
    document.addEventListener('fullscreenchange', onChange);
    v.requestFullscreen().catch(() => document.removeEventListener('fullscreenchange', onChange));
  };
  const fill: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
  return (
    <div
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        width,
        height,
        borderRadius: 'var(--osd-radius)',
        border: `2px solid ${line}`,
        background: '#000',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0, 0, 0, 0.5)',
      }}
    >
      {live ? (
        <video ref={ref} src={src} poster={poster} autoPlay muted={muted} loop playsInline style={fill} />
      ) : (
        <img src={poster} alt={alt} style={fill} />
      )}
      <span
        style={{
          position: 'absolute',
          left: 16,
          top: 14,
          padding: '4px 12px',
          borderRadius: 8,
          background: 'rgba(6, 10, 18, 0.8)',
          fontFamily: MONO,
          fontSize: 20,
          color: 'var(--osd-accent)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          className="tmu-anim"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#ff6b6b',
            display: 'inline-block',
            animation: live ? 'tmu-blink 1.4s ease-in-out infinite' : undefined,
          }}
        />
        {label}
      </span>
      {live ? (
        <div style={{ position: 'absolute', right: 16, bottom: 14, display: 'flex', gap: 10 }}>
          <VideoButton on={!muted} onClick={toggleSound}>
            {muted ? '▶ 有聲播放' : '■ 靜音'}
          </VideoButton>
          <VideoButton on={false} onClick={enlarge}>
            ⛶ 放大
          </VideoButton>
        </div>
      ) : null}
    </div>
  );
};

// ─── BlazePose skeleton (33 keypoints, T-stretch, front view) ───────────────
// Index order follows BlazePose: 11 = left shoulder (viewer's right), etc.

const KP: [number, number][] = [
  [320, 118], [330, 106], [338, 105], [346, 106], [310, 106], [302, 105], [294, 106],
  [358, 114], [282, 114], [330, 136], [310, 136],
  [390, 210], [250, 210], [490, 214], [150, 214], [585, 218], [55, 218],
  [606, 234], [34, 234], [612, 216], [28, 216], [598, 202], [42, 202],
  [365, 470], [275, 470], [372, 640], [268, 640], [378, 800], [262, 800],
  [372, 826], [268, 826], [408, 836], [232, 836],
];
const BONES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10],
  [11, 12], [11, 23], [12, 24], [23, 24],
  [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
  [23, 25], [25, 27], [27, 29], [29, 31], [27, 31],
  [24, 26], [26, 28], [28, 30], [30, 32], [28, 32],
];
const MAJOR = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];

// Angle at the left shoulder between upper arm (→ elbow) and torso (→ hip): ≈ 93°.
const Skeleton = ({ width, showAngle = true }: { width: number; showAngle?: boolean }) => {
  const live = useIsActivePage();
  return (
    <svg
      viewBox="0 0 640 900"
      width={width}
      height={(width * 900) / 640}
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      <ellipse cx={320} cy={114} rx={50} ry={58} style={{ fill: 'none', stroke: line, strokeWidth: 2 }} />
      {BONES.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={KP[a][0]}
          y1={KP[a][1]}
          x2={KP[b][0]}
          y2={KP[b][1]}
          style={{
            stroke: 'var(--osd-accent)',
            strokeOpacity: a <= 10 ? 0.4 : 0.62,
            strokeWidth: a <= 10 ? 2.5 : 5,
            strokeLinecap: 'round',
          }}
        />
      ))}
      {MAJOR.map((i, n) => (
        <circle
          key={`halo-${i}`}
          className="tmu-anim"
          cx={KP[i][0]}
          cy={KP[i][1]}
          r={18}
          style={{
            fill: 'var(--osd-accent)',
            opacity: 0.16,
            transformBox: 'fill-box',
            transformOrigin: 'center',
            animation: live ? `tmu-halo 3.2s ease-in-out ${n * 160}ms infinite` : undefined,
          }}
        />
      ))}
      {KP.map(([x, y], i) => (
        <circle
          key={`kp-${x}-${y}`}
          cx={x}
          cy={y}
          r={i <= 10 ? 4.5 : 8.5}
          style={{ fill: 'var(--osd-bg)', stroke: 'var(--osd-accent)', strokeWidth: i <= 10 ? 2.5 : 3.5 }}
        />
      ))}
      {showAngle ? (
        <g>
          <path
            className="tmu-anim"
            d="M 449.95 212.4 A 60 60 0 0 1 384.26 269.72"
            pathLength={1}
            style={{
              fill: 'none',
              stroke: amber,
              strokeWidth: 5,
              strokeLinecap: 'round',
              strokeDasharray: 1,
              strokeDashoffset: 0,
              animation: live ? `tmu-draw 900ms ${EASE} 500ms both` : undefined,
            }}
          />
          <text
            className="tmu-anim"
            x={446}
            y={314}
            style={{
              fill: amber,
              fontFamily: MONO,
              fontSize: 36,
              fontWeight: 600,
              animation: live ? 'tmu-fade 500ms ease-out 1100ms both' : undefined,
            }}
          >
            93°
          </text>
        </g>
      ) : null}
    </svg>
  );
};

// ─── 1. Cover ────────────────────────────────────────────────────────────────

const Cover: Page = () => (
  <Frame footer={false}>
    <div style={{ position: 'absolute', left: PAD, top: 250, width: 1060 }}>
      <Rise>
        <Kicker>116 學年度碩士班甄試 · 自我介紹</Kicker>
      </Rise>
      <Rise delay={120}>
        <h1
          style={{
            margin: '28px 0 0',
            fontFamily: 'var(--osd-font-display)',
            fontSize: 'var(--osd-size-hero)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '0.06em',
          }}
        >
          李鈞盛
        </h1>
      </Rise>
      <Rise delay={240}>
        <p style={{ margin: '30px 0 0', fontSize: 40, fontWeight: 500, lineHeight: 1.5 }}>
          逢甲大學 資訊工程學系 四年級
        </p>
        <p style={{ margin: '10px 0 0', fontSize: 30, color: muted, lineHeight: 1.5 }}>
          報考　臺北醫學大學 醫學資訊研究所 · 人工智慧數位醫療組
        </p>
      </Rise>
      <Rise delay={360} style={{ display: 'flex', gap: 18, marginTop: 52 }}>
        <Chip>邊緣 AI</Chip>
        <Chip>電腦視覺</Chip>
        <Chip>居家照護</Chip>
      </Rise>
    </div>
    <div style={{ position: 'absolute', left: PAD, bottom: 64, fontFamily: MONO, fontSize: 22, color: dim }}>
      {SITE}
    </div>
    <div style={{ position: 'absolute', left: 1230, top: 110 }}>
      <Skeleton width={560} />
      <div
        style={{
          marginTop: 18,
          fontFamily: MONO,
          fontSize: 20,
          color: dim,
          textAlign: 'center',
          letterSpacing: '0.08em',
        }}
      >
        BlazePose · 33 keypoints · on-device
      </div>
    </div>
  </Frame>
);

// ─── 2. Competitions + club ──────────────────────────────────────────────────

const ColumnLabel = ({ children }: { children: ReactNode }) => (
  <div style={{ fontFamily: MONO, fontSize: 22, color: 'var(--osd-accent)', letterSpacing: '0.16em', marginBottom: 18 }}>
    {children}
  </div>
);

const AwardCard = ({
  src,
  rank,
  name,
  desc,
  delay,
}: {
  src: string;
  rank: string;
  name: string;
  desc: string;
  delay: number;
}) => (
  <Rise delay={delay} style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
    <img
      src={src}
      alt={name}
      style={{ width: 250, height: 188, flex: 'none', objectFit: 'cover', borderRadius: 12, border: `1.5px solid ${line}` }}
    />
    <div>
      <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.2, color: amber }}>{rank}</div>
      <div style={{ marginTop: 6, fontSize: 30, fontWeight: 700, lineHeight: 1.35 }}>{name}</div>
      <div style={{ marginTop: 6, fontSize: 24, color: muted, lineHeight: 1.5 }}>{desc}</div>
    </div>
  </Rise>
);

const ClubPoint = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, fontSize: 28, lineHeight: 1.5 }}>
    <span style={{ width: 10, height: 10, flex: 'none', borderRadius: 3, background: 'var(--osd-accent)', transform: 'translateY(-5px)' }} />
    <span>{children}</span>
  </div>
);

const Journey: Page = () => (
  <Frame>
    <Header
      kicker="01 · 競賽與社團"
      title="社團與競賽：和夥伴一起做出作品"
      sub="學長的一句話：「不用很厲害才開始，要開始才能很厲害！」"
    />
    <div style={{ position: 'absolute', left: PAD, top: 340, width: 820 }}>
      <Rise>
        <ColumnLabel>競賽</ColumnLabel>
      </Rise>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <AwardCard
          delay={120}
          src={awardNational}
          rank="季軍"
          name="全國電子設計創意競賽"
          desc="第一次參賽 · 33 支入圍隊伍"
        />
        <AwardCard
          delay={240}
          src={awardCrossStrait}
          rank="一等獎"
          name="海峽兩岸青少年創客大賽"
          desc="CareYou · 上海同濟大學總決賽"
        />
      </div>
      <Rise delay={360} style={{ marginTop: 32, fontSize: 26, color: muted, lineHeight: 1.5 }}>
        得獎後在新聞稿介紹社團，讓剛成立的社團被看見
      </Rise>
    </div>
    <div style={{ position: 'absolute', left: 1020, top: 340, width: 780 }}>
      <Rise delay={180}>
        <ColumnLabel>社團</ColumnLabel>
        <img
          src={clubTogether}
          alt="逢甲 GDG on Campus 社員於 DevFest 合影"
          style={{
            display: 'block',
            width: 780,
            height: 300,
            objectFit: 'cover',
            borderRadius: 'var(--osd-radius)',
            border: `2px solid ${line}`,
          }}
        />
      </Rise>
      <Rise delay={300} style={{ marginTop: 24 }}>
        <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.35 }}>GDG on Campus FCU 創社成員</div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ClubPoint>財務 · 兩次活動副召集人</ClubPoint>
          <ClubPoint>長期擔任社課助教、參與試教回饋</ClubPoint>
          <ClubPoint>上台分享：回收零件組電腦、跑本地模型</ClubPoint>
        </div>
      </Rise>
    </div>
  </Frame>
);

// ─── 3. Home rehab platform ──────────────────────────────────────────────────

const Stat =({ value, label, delay }: { value: string; label: string; delay: number }) => (
  <Rise delay={delay}>
    <div style={{ fontFamily: MONO, fontSize: 56, fontWeight: 600, color: 'var(--osd-accent)', lineHeight: 1.1 }}>
      {value}
    </div>
    <div style={{ marginTop: 4, fontSize: 28, color: muted, lineHeight: 1.4 }}>{label}</div>
  </Rise>
);

const Generation = ({ no, name, desc, delay }: { no: string; name: string; desc: string; delay: number }) => (
  <Rise delay={delay} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
    <span style={{ fontFamily: MONO, fontSize: 22, color: 'var(--osd-accent)' }}>{no}</span>
    <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.4, whiteSpace: 'nowrap' }}>{name}</span>
    <span style={{ fontSize: 24, color: muted, lineHeight: 1.4, whiteSpace: 'nowrap' }}>{desc}</span>
  </Rise>
);

const Rehab: Page = () => (
  <Frame>
    <Header
      kicker="02 · 代表作品"
      title="居家復健：一台平板，在家就能練"
      sub="我負責患者端 App、姿態辨識、小伴 AI 陪伴助手與國台客語語音"
    />
    <Rise delay={80} style={{ position: 'absolute', left: PAD, top: 340, width: 940 }}>
      <VideoFrame
        src={plusrepVideo}
        poster={plusrepPoster}
        alt="倍伴練 PlusRep 介紹影片"
        label="倍伴練 PlusRep · 介紹影片"
        width={940}
        height={529}
      />
      <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 20, color: dim }}>大學專題「倍伴練」· 1 分 14 秒</div>
    </Rise>
    <div style={{ position: 'absolute', left: 1130, top: 340, width: 670 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Stat delay={180} value="33" label="BlazePose 關鍵點，即時擷取人體骨架" />
        <Stat delay={280} value="18–25 ms" label="中階手機單幀推論，30 FPS 以上" />
        <Stat delay={380} value="< 0.5 s" label="從錯誤姿勢到語音糾正" />
      </div>
      <div style={{ height: 1, background: line, margin: '28px 0' }} />
      <Rise delay={440}>
        <div style={{ fontFamily: MONO, fontSize: 22, color: dim, letterSpacing: '0.1em', marginBottom: 14 }}>
          同一個題目，做了三代
        </div>
      </Rise>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Generation delay={500} no="01" name="電子設計競賽" desc="ML Kit 手機即時辨識" />
        <Generation delay={560} no="02" name="CareYou" desc="加入本地 LLM 與國台客語語音" />
        <Generation delay={620} no="03" name="大學專題「倍伴練」" desc="BlazePose · 本頁數據" />
      </div>
    </div>
  </Frame>
);

// ─── 4. Privacy + elderly-friendly design ───────────────────────────────────

const FlowNode = ({ left, width = 300, tag, title }: { left: number; width?: number; tag: string; title: string }) => (
  <div
    style={{
      position: 'absolute',
      left,
      top: 84,
      width,
      height: 160,
      borderRadius: 'var(--osd-radius)',
      background: panel,
      border: `1.5px solid ${line}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    }}
  >
    <div style={{ fontFamily: MONO, fontSize: 20, color: dim, letterSpacing: '0.12em' }}>{tag}</div>
    <div style={{ fontSize: 36, fontWeight: 700, whiteSpace: 'nowrap' }}>{title}</div>
  </div>
);

const Arrow = ({ x1, x2, y, color, dashed = false }: { x1: number; x2: number; y: number; color: string; dashed?: boolean }) => {
  const live = useIsActivePage();
  const dir = x2 > x1 ? 1 : -1;
  const tip = x2;
  return (
    <g>
      <line
        className="tmu-anim"
        x1={x1}
        y1={y}
        x2={tip - dir * 12}
        y2={y}
        style={{
          stroke: color,
          strokeWidth: 3,
          strokeDasharray: dashed ? '10 4' : undefined,
          animation: dashed && live ? 'tmu-flow 1.2s linear infinite' : undefined,
        }}
      />
      <polygon
        points={`${tip},${y} ${tip - dir * 16},${y - 8} ${tip - dir * 16},${y + 8}`}
        style={{ fill: color }}
      />
    </g>
  );
};

const Privacy: Page = () => (
  <Frame>
    <Header
      kicker="02 · 代表作品"
      title="影像不離開裝置，只同步數據"
      sub="醫師與家屬看得到復健成果，看不到病人的畫面"
    />
    <Rise delay={100} style={{ position: 'absolute', left: PAD, top: 350, width: 1680, height: 330 }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 1060,
          height: 330,
          borderRadius: 20,
          border: `2px dashed ${line}`,
          background: 'rgba(86, 212, 245, 0.035)',
        }}
      />
      <div style={{ position: 'absolute', left: 30, top: 24, fontFamily: MONO, fontSize: 22, color: 'var(--osd-accent)', letterSpacing: '0.1em' }}>
        平板裝置內 · ON-DEVICE
      </div>
      <FlowNode left={40} tag="CAMERA" title="鏡頭影像" />
      <FlowNode left={380} tag="BLAZEPOSE" title="33 個關鍵點" />
      <FlowNode left={720} tag="VECTOR ANGLE" title="關節角度・計次" />
      <div style={{ position: 'absolute', left: 40, top: 268, fontSize: 24, color: amber }}>
        原始影像只在裝置上處理，不上傳
      </div>
      <FlowNode left={1300} width={380} tag="CLOUD · FIREBASE" title="醫師・家屬" />
      <svg
        width={1680}
        height={330}
        viewBox="0 0 1680 330"
        style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
        aria-hidden="true"
      >
        <Arrow x1={344} x2={376} y={164} color="rgba(86, 212, 245, 0.7)" />
        <Arrow x1={684} x2={716} y={164} color="rgba(86, 212, 245, 0.7)" />
        <Arrow x1={1024} x2={1296} y={134} color="#56d4f5" dashed />
        <Arrow x1={1296} x2={1024} y={204} color={dim} dashed />
      </svg>
      <div style={{ position: 'absolute', left: 1024, width: 272, top: 90, textAlign: 'center', fontSize: 24, color: 'var(--osd-accent)' }}>
        只同步角度與次數
      </div>
      <div style={{ position: 'absolute', left: 1024, width: 272, top: 214, textAlign: 'center', fontSize: 24, color: muted }}>
        醫師遠端調整處方
      </div>
    </Rise>
    <Rise delay={300} style={{ position: 'absolute', left: PAD, top: 740 }}>
      <div style={{ fontFamily: MONO, fontSize: 24, color: dim, letterSpacing: '0.12em' }}>為高齡者設計</div>
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <Chip size={30}>高對比大字介面</Chip>
        <Chip size={30}>國台客語語音提醒</Chip>
        <Chip size={30}>本地 LLM 陪伴助手「小伴」</Chip>
      </div>
    </Rise>
  </Frame>
);

// ─── 5. 造星者: the lesson ───────────────────────────────────────────────────

const Point = ({ children, tone = 'accent' }: { children: ReactNode; tone?: 'accent' | 'amber' }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
    <span
      style={{
        width: 12,
        height: 12,
        flex: 'none',
        borderRadius: 3,
        background: tone === 'amber' ? amber : 'var(--osd-accent)',
        transform: 'translateY(-6px)',
      }}
    />
    <span style={{ fontSize: 30, lineHeight: 1.5, color: tone === 'amber' ? amber : 'var(--osd-text)' }}>
      {children}
    </span>
  </div>
);

const Lesson: Page = () => (
  <Frame>
    <Header
      kicker="03 · 學到的一課"
      title="做得完整，不等於證明有效"
      sub="造星者｜兒童專注力訓練 App · 2026 MAIC 行動應用創新賽作品"
    />
    <Rise delay={80} style={{ position: 'absolute', left: PAD, top: 340, width: 940 }}>
      <VideoFrame
        src={appVideo}
        poster={appPoster}
        alt="造星者介紹影片：iPad 前鏡頭視線追蹤、視線投影、五點校準"
        label="造星者 · 介紹影片"
        width={940}
        height={529}
      />
      <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 20, color: dim }}>2026 MAIC 參賽作品 · 54 秒</div>
    </Rise>
    <div style={{ position: 'absolute', left: 1130, top: 340, width: 670 }}>
      <Rise delay={180} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Point>iPad 前鏡頭追蹤視線，分心就提醒</Point>
        <Point tone="amber">初賽只審企劃書：缺少成效數據而落選</Point>
      </Rise>
      <Rise
        delay={320}
        style={{
          marginTop: 36,
          padding: '22px 28px',
          borderRadius: 12,
          background: panel,
          borderLeft: '4px solid var(--osd-accent)',
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.3 }}>之後做任何東西，先想好怎麼驗證</div>
        <div style={{ marginTop: 8, fontSize: 26, color: muted, lineHeight: 1.4 }}>
          復健專題：找受測者實測，與量角器對照角度
        </div>
      </Rise>
      <Rise delay={440} style={{ position: 'absolute', top: 360, left: 0, display: 'flex', alignItems: 'center', gap: 28 }}>
        <a
          href={VIDEO_URL}
          target="_blank"
          rel="noreferrer"
          style={{ display: 'block', padding: 12, background: '#ffffff', borderRadius: 14, lineHeight: 0 }}
        >
          <img src={appQr} alt="造星者 54 秒介紹影片 QR Code" style={{ width: 146, height: 146, imageRendering: 'pixelated' }} />
        </a>
        <div>
          <div style={{ fontSize: 26, color: muted, lineHeight: 1.4 }}>掃描觀看</div>
          <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.4 }}>54 秒介紹影片</div>
          <div style={{ marginTop: 4, fontFamily: MONO, fontSize: 20, color: dim }}>youtu.be/RtDM5NUFBYw</div>
        </div>
      </Rise>
    </div>
  </Frame>
);

// ─── 6. Why TMU ──────────────────────────────────────────────────────────────

const Reason = ({ no, title, desc, delay }: { no: string; title: string; desc: string; delay: number }) => (
  <Rise delay={delay} style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
    <div style={{ width: 110, flex: 'none', fontFamily: MONO, fontSize: 64, fontWeight: 600, lineHeight: 1, color: 'var(--osd-accent)', opacity: 0.85 }}>
      {no}
    </div>
    <div>
      <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.3 }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 30, color: muted, lineHeight: 1.5 }}>{desc}</div>
    </div>
  </Rise>
);

const WhyTmu: Page = () => (
  <Frame>
    <Header kicker="04 · 為什麼是北醫" title="把問題帶到離臨床最近的地方" />
    <div style={{ position: 'absolute', left: PAD, top: 330, display: 'flex', flexDirection: 'column', gap: 64 }}>
      <Reason delay={120} no="01" title="補足我最缺的一塊" desc="醫學與臨床知識：動作怎樣才算到位，需要治療師的專業" />
      <Reason delay={240} no="02" title="離照護現場很近" desc="北醫附設醫院、萬芳醫院、雙和醫院，有真實的使用情境" />
      <Reason delay={360} no="03" title="和醫療背景的同學互補" desc="學會和醫療人員溝通；我帶來邊緣 AI 與系統實作" />
    </div>
    <Rise delay={480} style={{ position: 'absolute', left: PAD, top: 852, fontSize: 34, fontWeight: 700, color: 'var(--osd-accent)' }}>
      目標：做出真正能用在照護現場的研究
    </Rise>
    <div style={{ position: 'absolute', left: 1450, top: 300, opacity: 0.32 }}>
      <Skeleton width={340} showAngle={false} />
    </div>
  </Frame>
);

// ─── 7. Thanks ───────────────────────────────────────────────────────────────

const Thanks: Page = () => (
  <Frame footer={false}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Rise>
        <Kicker>THANK YOU</Kicker>
      </Rise>
      <Rise delay={120}>
        <h1
          style={{
            margin: '24px 0 0',
            fontFamily: 'var(--osd-font-display)',
            fontSize: 'var(--osd-size-hero)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '0.08em',
          }}
        >
          謝謝教授
        </h1>
      </Rise>
      <Rise delay={240}>
        <p style={{ margin: '20px 0 0', fontSize: 44, color: muted, lineHeight: 1.5 }}>請多指教</p>
      </Rise>
      <Rise delay={360}>
        <p style={{ margin: '48px 0 0', fontSize: 32, lineHeight: 1.5 }}>李鈞盛 · 逢甲大學 資訊工程學系</p>
        <p style={{ margin: '12px 0 0', fontFamily: MONO, fontSize: 22, color: dim }}>{SITE}</p>
      </Rise>
    </div>
  </Frame>
);

// ─── Deck ────────────────────────────────────────────────────────────────────

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 260,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

export const meta: SlideMeta = {
  title: '李鈞盛｜北醫醫資所 自我介紹',
  createdAt: '2026-11-19T09:31:27.435Z',
};

export const notes: (string | undefined)[] = [
  `（約 8 秒）
各位教授好，我是逢甲大學資訊工程學系四年級的李鈞盛，研究興趣是邊緣 AI 和電腦視覺在居家照護上的應用。`,
  `（約 35 秒）
大三上，我成為逢甲 Google 開發者學生社團的創社成員，擔任財務，也當過兩次活動的副召集人，並長期擔任社課助教。社團剛成立，沒有前人經驗，流程都要從頭建立。
我也是在社團裡和夥伴開始參加競賽：第一次參賽，就在全國電子設計創意競賽 33 支入圍隊伍中拿到季軍；
接著帶著居家復健平台 CareYou 到上海同濟大學，拿到海峽兩岸青少年創客大賽一等獎。`,
  `（約 35 秒；影片會靜音自動播放，委員想看再按「有聲播放」或「放大」，看完再接著講）
這兩個作品都是居家復健平台，後來延伸成我的大學專題「倍伴練」，讓患者只要一台平板就能在家復健。
系統在裝置上用 BlazePose 擷取 33 個關鍵點，用向量夾角算關節角度，判斷動作有沒有到位並自動計次。
在中階手機上，單幀推論 18 到 25 毫秒、30 FPS 以上，從錯誤姿勢到語音糾正不到 0.5 秒。
我負責患者端 App、姿態辨識、陪伴助手和語音整合。`,
  `（約 15 秒）
影像不離開裝置，只把角度和次數同步給醫師與家屬。
考量高齡者，我們做了大字介面、國台客語語音，以及本地 LLM 陪伴助手「小伴」。`,
  `（約 20 秒；影片靜音自動播放，有聲版 54 秒）
另一個作品「造星者」是兒童專注力訓練 App，原型做得很完整，卻在只審企劃書的初賽落選，因為沒有數據證明它有效。
從那之後，我做任何東西都先想好怎麼驗證，復健專題的量角器對照實驗就是這樣來的。`,
  `（約 15 秒）
我最缺的是醫學和臨床知識。北醫離臨床場域很近，也有醫療背景的同學。
我希望在這裡學會和醫療人員溝通，讓居家復健系統能在照護現場被驗證、真正用得上。`,
  `謝謝教授。（停在這頁，等委員提問）`,
];

export default [Cover, Journey, Rehab, Privacy, Lesson, WhyTmu, Thanks] satisfies Page[];
