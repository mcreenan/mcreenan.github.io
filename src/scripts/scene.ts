import { BPM, Vibe } from "./music";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;

export interface SceneActions {
    music(): Promise<boolean>;
    stars(count?: number): void;
    lights(): boolean;
    say(text: string): void;
    bills(): void;
}

/* ── Stars + shooting stars ─────────────────────────────── */

interface Star {
    x: number;
    y: number;
    r: number;
    phase: number;
    speed: number;
}
interface Meteor {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
}

function initSky(scene: HTMLElement) {
    const canvas = $<HTMLCanvasElement>("#stars");
    const ctx = canvas.getContext("2d")!;
    let stars: Star[] = [];
    const meteors: Meteor[] = [];
    let w = 0;
    let h = 0;
    let visible = true;

    const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.round((w * h) / 4200);
        stars = Array.from({ length: count }, () => ({
            x: Math.random() * w,
            y: Math.pow(Math.random(), 1.6) * h * 0.8,
            r: Math.random() < 0.08 ? 1.6 : Math.random() * 1.1 + 0.3,
            phase: Math.random() * Math.PI * 2,
            speed: 0.6 + Math.random() * 2,
        }));
        if (reducedMotion) draw(0);
    };

    const spawn = () => {
        meteors.push({
            x: w * (0.15 + Math.random() * 0.7),
            y: h * Math.random() * 0.3,
            vx: (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 4),
            vy: 2.2 + Math.random() * 2,
            life: 1,
        });
    };

    const draw = (t: number) => {
        ctx.clearRect(0, 0, w, h);
        for (const s of stars) {
            const a = 0.45 + 0.55 * Math.sin(s.phase + (t / 1000) * s.speed) ** 2;
            ctx.globalAlpha = reducedMotion ? 0.8 : a;
            ctx.fillStyle = s.r > 1.5 ? "#ffe9c4" : "#dfe6ff";
            ctx.fillRect(s.x, s.y, s.r, s.r);
        }
        ctx.globalAlpha = 1;
        for (let i = meteors.length - 1; i >= 0; i--) {
            const m = meteors[i];
            const tail = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14);
            tail.addColorStop(0, `rgba(255,255,255,${m.life})`);
            tail.addColorStop(1, "rgba(127,232,255,0)");
            ctx.strokeStyle = tail;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(m.x - m.vx * 14, m.y - m.vy * 14);
            ctx.stroke();
            m.x += m.vx;
            m.y += m.vy;
            m.life -= 0.012;
            if (m.life <= 0) meteors.splice(i, 1);
        }
    };

    const loop = (t: number) => {
        if (visible) draw(t);
        requestAnimationFrame(loop);
    };

    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(scene);
    resize();

    if (!reducedMotion) {
        requestAnimationFrame(loop);
        const ambient = () => {
            if (visible && document.visibilityState === "visible") spawn();
            window.setTimeout(ambient, 5000 + Math.random() * 9000);
        };
        window.setTimeout(ambient, 2500);
    }

    return (count = 6) => {
        if (reducedMotion) return;
        for (let i = 0; i < count; i++) window.setTimeout(spawn, i * 180 + Math.random() * 160);
    };
}

/* ── Parallax ───────────────────────────────────────────── */

function initParallax(scene: HTMLElement) {
    if (reducedMotion) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    scene.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        const r = scene.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    });
    scene.addEventListener("pointerleave", () => {
        tx = 0;
        ty = 0;
    });
    const step = () => {
        x += (tx - x) * 0.06;
        y += (ty - y) * 0.06;
        scene.style.setProperty("--px", x.toFixed(4));
        scene.style.setProperty("--py", y.toFixed(4));
        requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

/* ── City lights ────────────────────────────────────────── */

function initLights(scene: HTMLElement) {
    const windows = Array.from(scene.querySelectorAll<SVGRectElement>(".skyline .w"));
    let out = false;

    // Someone somewhere is always flipping a light on or off.
    if (!reducedMotion) {
        window.setInterval(() => {
            if (out) return;
            for (let i = 0; i < 3; i++) {
                windows[Math.floor(Math.random() * windows.length)].classList.toggle("on");
            }
        }, 900);
    }

    scene.querySelectorAll(".skyline-near").forEach((el) =>
        el.addEventListener("click", (e) => {
            const target = e.target as Element;
            const bldg = target.closest(".bldg");
            if (!bldg) return;
            bldg.querySelectorAll(".w").forEach((w) => w.classList.toggle("on", Math.random() < 0.6));
        }),
    );

    return () => {
        out = !out;
        scene.classList.toggle("blackout", out);
        return !out;
    };
}

/* ── Me: speech bubble, notes, music ────────────────────── */

const QUIPS = [
    "one more prompt…",
    "shipping vibes only",
    "it works on my machine ✨",
    "the agent wrote it. I reviewed it. mostly.",
    "go bills 🦬",
    "deterministic space > agent space",
    "have you tried turning the vibes off and on again?",
    "psst — press play on the boombox",
    "coffee count: yes",
];

function initMe(scene: HTMLElement, vibe: Vibe) {
    const me = $("#me");
    const bubble = $("#me-bubble");
    const notes = $("#me-notes");
    const boombox = $("#boombox");
    const lcd = $("#bb-lcd");
    let quip = 0;
    let bubbleTimer = 0;

    scene.style.setProperty("--beat", `${60 / BPM}s`);

    const say = (text: string) => {
        bubble.textContent = text;
        bubble.classList.add("show");
        window.clearTimeout(bubbleTimer);
        bubbleTimer = window.setTimeout(() => bubble.classList.remove("show"), 3200);
    };

    me.addEventListener("click", () => {
        say(QUIPS[quip++ % QUIPS.length]);
    });

    const spawnNote = () => {
        if (!vibe.playing || reducedMotion || document.visibilityState !== "visible") return;
        const n = document.createElement("span");
        n.textContent = ["♪", "♫", "♬", "♩"][Math.floor(Math.random() * 4)];
        n.style.left = `${10 + Math.random() * 70}%`;
        n.style.setProperty("--drift", `${(Math.random() - 0.5) * 60}px`);
        notes.appendChild(n);
        window.setTimeout(() => n.remove(), 3000);
    };
    window.setInterval(spawnNote, (60 / BPM) * 1000);

    const levelLoop = () => {
        scene.style.setProperty("--level", vibe.level().toFixed(3));
        if (vibe.playing) requestAnimationFrame(levelLoop);
        else scene.style.setProperty("--level", "0");
    };

    const music = async () => {
        const playing = await vibe.toggle();
        scene.classList.toggle("playing", playing);
        boombox.setAttribute("aria-pressed", String(playing));
        boombox.setAttribute("aria-label", playing ? "Pause music" : "Play music");
        lcd.innerHTML = playing ? "<span>♪ now playing: midnight_commit.wav</span>" : "▶ PLAY";
        if (playing) {
            requestAnimationFrame(levelLoop);
            say("ahh, that's the stuff");
        }
        return playing;
    };

    boombox.addEventListener("click", () => void music());
    return { say, music };
}

/* ── Wire it up ─────────────────────────────────────────── */

export function initScene(): SceneActions {
    const scene = $("#scene");
    const vibe = new Vibe();
    const stars = initSky(scene);
    const lights = initLights(scene);
    const { say, music } = initMe(scene, vibe);
    initParallax(scene);

    $("#moon").addEventListener("click", () => {
        stars(8);
        say("make a wish");
    });

    const bills = () => {
        scene.classList.remove("bills");
        void scene.offsetWidth;
        scene.classList.add("bills");
        stars(10);
        say("GO BILLS! 🦬");
    };

    return { music, stars, lights, say, bills };
}
