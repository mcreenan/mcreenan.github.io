import { currentRole, jobs, links, projects } from "../data/profile";
import type { SceneActions } from "./scene";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const esc = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Inline markup for command output: `cmd` → clickable command, #id → scroll link.
const cmd = (c: string, label = c) => `<button type="button" class="t-cmd" data-cmd="${esc(c)}">${esc(label)}</button>`;
const jump = (id: string, label: string) => `<a class="t-jump" href="#${id}">${esc(label)} ↓</a>`;
const ext = (href: string, label: string) => `<a href="${href}" target="_blank" rel="noopener">${esc(label)}</a>`;

const FILES: Record<string, string> = {
    "about.txt": "about",
    "now.txt": "now",
    "projects/": "projects",
    "work.log": "work",
    "contact.txt": "contact",
    "resume.pdf": "resume",
};

export function initTerminal(scene: SceneActions) {
    const out = document.getElementById("term-out")!;
    const form = document.getElementById("term-form") as HTMLFormElement;
    const input = document.getElementById("term-input") as HTMLInputElement;
    const screen = document.querySelector<HTMLElement>(".crt-screen")!;
    const history: string[] = [];
    let cursor = 0;
    let booting = true;

    const print = (html: string, cls = "") => {
        const line = document.createElement("div");
        line.className = `t-line ${cls}`;
        line.innerHTML = html;
        out.appendChild(line);
        out.scrollTop = out.scrollHeight;
        return line;
    };

    const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });

    const commands: Record<string, (args: string[]) => void | Promise<void>> = {
        help() {
            print("available commands:", "dim");
            const rows: [string, string][] = [
                ["about", "who is this guy"],
                ["now", "what I'm doing these days"],
                ["projects", "recent agentic coding work"],
                ["work", "where I've been"],
                ["contact", "say hi"],
                ["resume", "open the resume (pdf too)"],
                ["play", "press play on the boombox"],
                ["stars", "make a wish"],
                ["fireflies", "wake up the yard"],
                ["lights", "flip the ceiling light"],
                ["clear", "clean the glass"],
            ];
            for (const [c, d] of rows) print(`  <span class="t-col">${cmd(c)}</span><span class="dim">${d}</span>`);
            print(`<span class="dim">psst: there are a few more. try ${cmd("ls")}.</span>`);
        },
        about() {
            print("Matt Creenan — software builder, Buffalo, NY.");
            print("20+ years across full-stack, data engineering, and DevOps.");
            print("These days: agent harnesses, languages for agent-written");
            print("programs, and AI-native dev workflows.");
            print(jump("about", "read more"));
        },
        now() {
            print(`${esc(currentRole.title)} @ <b>${esc(currentRole.company)}</b>`);
            print(`<span class="dim">a ${esc(currentRole.parent)} company</span>`);
            print(jump("now", "more"));
        },
        projects() {
            projects.forEach((p, i) => print(`[${i + 1}] <b>${esc(p.name)}</b> <span class="dim">— ${esc(p.tagline)}</span>`));
            print(`<span class="dim">${cmd("open 1", "open <n>")} to view on github · </span>${jump("projects", "details")}`);
        },
        open([arg]) {
            if (!arg) return void print("usage: open <n|name>", "err");
            const n = Number(arg);
            const p = Number.isInteger(n)
                ? projects[n - 1]
                : projects.find((p) => p.slug === arg.toLowerCase() || p.name.toLowerCase() === arg.toLowerCase());
            if (!p) return void print(`open: no such project: ${esc(arg)}`, "err");
            print(`opening ${ext(p.url, p.url.replace("https://", ""))} …`);
            window.open(p.url, "_blank", "noopener");
        },
        work() {
            for (const j of jobs) print(`<span class="dim">${esc(j.dates.padEnd(15))}</span> ${esc(j.title)} <span class="dim">@</span> ${esc(j.company)}`);
            print(jump("experience", "details"));
        },
        contact() {
            print(`github   ${ext(links.github, "github.com/mcreenan")}`);
            print(`linkedin ${ext(links.linkedin, "linkedin.com/in/matt-creenan")}`);
            print(`bluesky  ${ext(links.bluesky, "@matt.creenan.me")}`);
            print(jump("contact", "more"));
        },
        resume() {
            print(`opening ${ext("/resume", "/resume")} … (${ext("/resume.pdf", "pdf")})`);
            window.open("/resume", "_blank", "noopener");
        },
        async play() {
            const playing = await scene.music();
            print(playing ? "♪ now playing: midnight_commit.wav" : "■ paused.", "dim");
        },
        stars() {
            scene.stars(10);
            print("✦ ✧ ✦  make a wish.", "dim");
        },
        lights() {
            print(scene.lights() ? "lights back on." : "lights off. better for stargazing.", "dim");
        },
        fireflies() {
            scene.fireflies();
            print("·  ✺  ·  the yard lights up.", "dim");
        },
        clear() {
            out.innerHTML = "";
        },
        ls() {
            print(Object.keys(FILES).map((f) => cmd(`cat ${f}`, f)).join("  "));
        },
        cat([file]) {
            const target = file && FILES[file];
            if (!target) return void print(`cat: ${esc(file ?? "")}: No such file or directory`, "err");
            return run(target, false);
        },
        whoami() {
            print("guest. but you seem cool.");
        },
        date() {
            print(new Date().toString());
        },
        echo(args) {
            print(esc(args.join(" ")));
        },
        history() {
            history.forEach((h, i) => print(`${String(i + 1).padStart(4)}  ${esc(h)}`));
        },
        bills() {
            scene.bills();
            print("🦬 GO BILLS! 🦬");
        },
        sabres() {
            print("…let's not talk about it.", "dim");
        },
        sudo() {
            print("nice try. this incident will be reported to the vibe police.", "err");
        },
        exit() {
            print("bye! (scrolling you down)", "dim");
            scrollTo("about");
        },
        rm() {
            print("lol, no.", "err");
        },
        vim() {
            print("you'll never get out. try again later.", "dim");
        },
        emacs() {
            commands.vim([]);
        },
        claude() {
            print("✻ already here. who do you think built this?", "dim");
        },
    };

    const aliases: Record<string, string> = {
        experience: "work",
        jobs: "work",
        music: "play",
        pause: "play",
        stop: "play",
        vibe: "play",
        wish: "stars",
        bugs: "fireflies",
        lamp: "lights",
        cls: "clear",
        "?": "help",
        man: "help",
        dir: "ls",
        codex: "claude",
    };

    async function run(raw: string, echo = true) {
        const line = raw.trim();
        if (echo) print(`<span class="ps1">guest@creenan:~$</span> ${esc(line)}`, "echo");
        if (!line) return;
        const [name, ...args] = line.split(/\s+/);
        const key = name.toLowerCase();
        const fn = commands[aliases[key] ?? key];
        if (fn) await fn(args);
        else print(`command not found: ${esc(name)}. try ${cmd("help")}.`, "err");
    }

    const exec = (raw: string) => {
        booting = false;
        if (raw.trim()) {
            history.push(raw.trim());
            cursor = history.length;
        }
        void run(raw);
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        exec(input.value);
        input.value = "";
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" && history.length) {
            e.preventDefault();
            cursor = Math.max(0, cursor - 1);
            input.value = history[cursor];
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            cursor = Math.min(history.length, cursor + 1);
            input.value = history[cursor] ?? "";
        } else if (e.key === "Tab") {
            e.preventDefault();
            const partial = input.value.toLowerCase();
            const match = Object.keys(commands).filter((c) => c.startsWith(partial));
            if (match.length === 1) input.value = match[0] + " ";
            else if (match.length > 1) print(match.join("  "), "dim");
        } else if (e.key === "l" && e.ctrlKey) {
            e.preventDefault();
            commands.clear([]);
        }
    });

    // Clickable commands in output and on the monitor's chin.
    document.addEventListener("click", (e) => {
        const btn = (e.target as Element).closest<HTMLElement>("[data-cmd]");
        if (!btn) return;
        exec(btn.dataset.cmd!);
        if (window.matchMedia("(pointer: fine)").matches) input.focus({ preventScroll: true });
    });

    screen.addEventListener("click", (e) => {
        if ((e.target as Element).closest("a, button")) return;
        if (window.getSelection()?.toString()) return;
        input.focus({ preventScroll: true });
    });

    // Typing anywhere on the hero goes to the terminal.
    window.addEventListener("keydown", (e) => {
        if (document.activeElement === input || e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.key.length !== 1 || e.key === " ") return;
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        if (window.scrollY > window.innerHeight * 0.5) return;
        input.focus({ preventScroll: true });
    });

    const boot = async () => {
        const lines: [string, string?][] = [
            ["CREENAN-BIOS v2.0  (c) 1994", "dim"],
            ["memory test ........ 640K OK", "dim"],
            ["detecting vibes .... OK", "dim"],
            ["mounting ~/projects  OK", "dim"],
            [""],
            ["hey, I'm <b>Matt</b>. I build software in Buffalo, NY."],
            [`type ${cmd("help")} — or hit a key below.`],
        ];
        for (const [html, cls] of lines) {
            if (!booting) break;
            if (!reducedMotion) await new Promise((r) => setTimeout(r, cls ? 260 : 420));
            print(html || "&nbsp;", cls);
        }
    };
    void boot();
}
