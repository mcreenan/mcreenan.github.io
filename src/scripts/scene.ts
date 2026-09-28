import { BPM, Vibe } from "./music";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;

export interface SceneActions {
    music(): Promise<boolean>;
    stars(count?: number): void;
    fireflies(): void;
    lights(): boolean;
    say(text: string): void;
    bills(): void;
}

/* ── Sky + yard: stars, shooting stars, fireflies ───────── */

// Positions are normalized (0..1) so resizing never reshuffles the sky.
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
interface Firefly {
    x: number;
    y: number;
    vx: number;
    vy: number;
    phase: number;
    life: number;
}

const YARD_TOP = 0.46;
const YARD_BOTTOM = 0.66;

function initSky() {
    const canvas = $<HTMLCanvasElement>("#stars");
    const ctx = canvas.getContext("2d")!;
    const stars: Star[] = Array.from({ length: 260 }, () => ({
        x: Math.random(),
        y: Math.pow(Math.random(), 1.4) * 0.5,
        r: Math.random() < 0.08 ? 1.6 : Math.random() * 1.1 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 2,
    }));
    const meteors: Meteor[] = [];
    const fireflies: Firefly[] = [];
    const firefly = (x = Math.random(), y = YARD_TOP + Math.random() * (YARD_BOTTOM - YARD_TOP), life = Infinity): Firefly => ({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.0006,
        vy: (Math.random() - 0.5) * 0.0004,
        phase: Math.random() * Math.PI * 2,
        life,
    });
    let w = 0;
    let h = 0;

    const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const want = Math.round(Math.max(14, w / 45));
        while (fireflies.filter((f) => f.life === Infinity).length < want) fireflies.push(firefly());
        if (reducedMotion) draw(0);
    };

    const draw = (t: number) => {
        ctx.clearRect(0, 0, w, h);
        const density = Math.min(1, (w * h) / 1_100_000);
        for (let i = 0; i < stars.length; i++) {
            if (i / stars.length > 0.35 + density * 0.65) break;
            const s = stars[i];
            ctx.globalAlpha = reducedMotion ? 0.8 : 0.45 + 0.55 * Math.sin(s.phase + (t / 1000) * s.speed) ** 2;
            ctx.fillStyle = s.r > 1.5 ? "#ffe9c4" : "#dfe6ff";
            ctx.fillRect(s.x * w, s.y * h, s.r, s.r);
        }
        ctx.globalAlpha = 1;

        for (let i = meteors.length - 1; i >= 0; i--) {
            const m = meteors[i];
            const x = m.x * w;
            const y = m.y * h;
            const tail = ctx.createLinearGradient(x, y, x - m.vx * 14, y - m.vy * 14);
            tail.addColorStop(0, `rgba(255,255,255,${m.life})`);
            tail.addColorStop(1, "rgba(127,232,255,0)");
            ctx.strokeStyle = tail;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - m.vx * 14, y - m.vy * 14);
            ctx.stroke();
            m.x += m.vx / w;
            m.y += m.vy / h;
            m.life -= 0.012;
            if (m.life <= 0) meteors.splice(i, 1);
        }

        for (let i = fireflies.length - 1; i >= 0; i--) {
            const f = fireflies[i];
            const glow = Math.max(0, Math.sin(f.phase + t / 700)) ** 3 * Math.min(1, f.life);
            if (glow > 0.02) {
                const x = f.x * w;
                const y = f.y * h;
                const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
                g.addColorStop(0, `rgba(230,255,140,${glow})`);
                g.addColorStop(0.25, `rgba(200,255,90,${glow * 0.5})`);
                g.addColorStop(1, "rgba(200,255,90,0)");
                ctx.fillStyle = g;
                ctx.fillRect(x - 9, y - 9, 18, 18);
            }
            if (reducedMotion) continue;
            f.vx += (Math.random() - 0.5) * 0.00008;
            f.vy += (Math.random() - 0.5) * 0.00006;
            f.vx *= 0.98;
            f.vy *= 0.98;
            f.x += f.vx;
            f.y += f.vy;
            if (f.y < YARD_TOP - 0.06 || f.y > YARD_BOTTOM) f.vy *= -1;
            if (f.x < 0) f.x += 1;
            if (f.x > 1) f.x -= 1;
            if (f.life !== Infinity && (f.life -= 0.004) <= 0) fireflies.splice(i, 1);
        }
    };

    const loop = (t: number) => {
        draw(t);
        requestAnimationFrame(loop);
    };

    new ResizeObserver(resize).observe(canvas);
    resize();

    const spawnMeteor = () =>
        meteors.push({
            x: 0.15 + Math.random() * 0.7,
            y: Math.random() * 0.2,
            vx: (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 4),
            vy: 2.2 + Math.random() * 2,
            life: 1,
        });

    if (!reducedMotion) {
        requestAnimationFrame(loop);
        const ambient = () => {
            if (document.visibilityState === "visible") spawnMeteor();
            window.setTimeout(ambient, 6000 + Math.random() * 10000);
        };
        window.setTimeout(ambient, 3000);
    }

    return {
        stars(count = 6) {
            if (reducedMotion) return;
            for (let i = 0; i < count; i++) window.setTimeout(spawnMeteor, i * 180 + Math.random() * 160);
        },
        fireflies(x = Math.random(), y = (YARD_TOP + YARD_BOTTOM) / 2) {
            if (reducedMotion) return;
            for (let i = 0; i < 14; i++) {
                const f = firefly(x + (Math.random() - 0.5) * 0.08, y + (Math.random() - 0.5) * 0.06, 2 + Math.random());
                f.phase = -Math.PI / 2 + Math.random();
                fireflies.push(f);
            }
        },
    };
}

/* ── Parallax ───────────────────────────────────────────── */

function initParallax(scene: HTMLElement) {
    if (reducedMotion) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    window.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        tx = (e.clientX / window.innerWidth) * 2 - 1;
        ty = (e.clientY / window.innerHeight) * 2 - 1;
    });
    document.documentElement.addEventListener("pointerleave", () => {
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

/* ── Room lights ────────────────────────────────────────── */

function initLights(scene: HTMLElement) {
    const lamp = $("#lamp");
    let on = true;
    const toggle = () => {
        on = !on;
        scene.classList.toggle("lights-off", !on);
        lamp.setAttribute("aria-pressed", String(on));
        return on;
    };
    lamp.addEventListener("click", toggle);
    return toggle;
}

/* ── Me: speech bubble, notes, music ────────────────────── */

const QUIPS = [
    "one more prompt…",
    "shipping vibes only",
    "it works on my machine ✨",
    "the agent wrote it. I reviewed it. mostly.",
    "go bills 🦬",
    "deterministic space > agent space",
    "listen… crickets.",
    "psst — press play on the boombox",
    "try clicking the trees",
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
    const sky = initSky();
    const lights = initLights(scene);
    const { say, music } = initMe(scene, vibe);
    initParallax(scene);

    $("#moon").addEventListener("click", () => {
        sky.stars(8);
        say("make a wish");
    });

    scene.querySelector(".yard-svg")!.addEventListener("click", (e) => {
        const { clientX, clientY } = e as MouseEvent;
        sky.fireflies(clientX / window.innerWidth, clientY / window.innerHeight);
    });

    const bills = () => {
        scene.classList.remove("bills");
        void scene.offsetWidth;
        scene.classList.add("bills");
        sky.stars(10);
        say("GO BILLS! 🦬");
    };

    return {
        music,
        stars: sky.stars,
        fireflies: () => sky.fireflies(),
        lights,
        say,
        bills,
    };
}
