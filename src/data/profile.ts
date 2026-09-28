export const SITE_TITLE = "Matt Creenan";
export const SITE_DESCRIPTION =
    "Matt Creenan — software builder in Buffalo, NY. 20+ years across full-stack, data, and DevOps; lately building agent harnesses, languages, and tools for agentic coding.";

export const links = {
    github: "https://github.com/mcreenan",
    linkedin: "https://www.linkedin.com/in/matt-creenan-60567756/",
    bluesky: "https://bsky.app/profile/matt.creenan.me",
    twitter: "https://twitter.com/mcreenan",
};

export const currentRole = {
    title: "Senior Staff Engineer",
    company: "Totality LMS",
    parent: "Valmar Holdings",
};

export interface Project {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    tags: string[];
    url: string;
}

export const projects: Project[] = [
    {
        name: "SHOUT",
        slug: "shout",
        tagline: "An agent harness where the runtime drives and the model judges.",
        description:
            "A local coding workspace: chat with an agent, review proposed changes, approve edits, and watch every model, tool, and VM event in an Inspector. Skills are small ALLEN programs run as slash commands — the VM owns the control flow and asks the model only for typed judgments.",
        tags: ["agent harness", "JavaScript", "Codex CLI"],
        url: "https://github.com/mcreenan/shout",
    },
    {
        name: "JOSH/ALLEN",
        slug: "josh-allen",
        tagline: "A programming language and runtime for agent-written programs.",
        description:
            "Instead of looping an agent through every shell command, the agent writes a small, typed ALLEN program up front. Rule-based work stays deterministic; the program makes typed, capability-scoped calls back into the agent only when it needs judgment.",
        tags: ["language design", "Rust", "VM"],
        url: "https://github.com/mcreenan/josh-allen",
    },
    {
        name: "palimpsest",
        slug: "palimpsest",
        tagline: "Build your org's engineering guide with agents.",
        description:
            "A starter kit and CLI (`pal`) for a living, single-file HTML engineering handbook: scrollspy ToC, zoomable Mermaid diagrams, linked code references, and an in-page \"Suggest a change\" flow. The tool does the scaffolding; an agent does the writing.",
        tags: ["TypeScript", "npm", "docs-as-code"],
        url: "https://github.com/mcreenan/palimpsest",
    },
    {
        name: "Frost",
        slug: "frost-design-system",
        tagline: "A bare-bones design system for agent-made HTML artifacts.",
        description:
            "A framework-agnostic visual system for the things agents write for you to read — briefs, decision records, research notes, and decks — with a token contract and usage guidance written for agents.",
        tags: ["CSS", "design system", "for agents"],
        url: "https://github.com/mcreenan/frost-design-system",
    },
    {
        name: "Apollo Codex Pet",
        slug: "apollo-codex-pet",
        tagline: "My dog, as an animated coding-agent companion.",
        description:
            "Apollo in three art styles for the Codex CLI and Orca. The base art came from the hatch-pet skill, and the animations were cut from Veo clips, then keyed, loop-matched, and assembled into spritesheets by a small script pipeline.",
        tags: ["Python", "image gen", "Codex"],
        url: "https://github.com/mcreenan/apollo-codex-pet",
    },
    {
        name: "TRMNL AI Usage",
        slug: "trmnl-ai-usage-plugin",
        tagline: "Claude Code + Codex rate limits on an e-ink display.",
        description:
            "A TRMNL private plugin that shows how much of the 5-hour and weekly Claude Code and Codex windows I have left, side by side on the e-ink screen on my desk.",
        tags: ["Python", "TRMNL", "e-ink"],
        url: "https://github.com/mcreenan/trmnl-ai-usage-plugin",
    },
];

export interface Job {
    dates: string;
    title: string;
    company: string;
    bullets?: string[];
    summary?: string;
}

export const jobs: Job[] = [
    {
        dates: "2026 — Present",
        title: currentRole.title,
        company: `${currentRole.company} (a ${currentRole.parent} company)`,
    },
    {
        dates: "2022 — 2026",
        title: "Senior Staff Engineer",
        company: "Torch",
        bullets: [
            "Designed and shipped a company-wide AI Slack agent that answers employee questions grounded in our help content, live operational data, and codebases — our sources of truth — with guardrails for safe, accurate responses.",
            "Built in-product LLM features — a coaching chat assistant, summarization, and light RAG over our content.",
            "Built AI-native development workflows — authoring custom agents, skills, and routines for support triage, QA testing, and a daily engineering brief.",
            "Led the team between engineering managers, providing technical direction and continuity through the transition.",
            "Built internal developer tools that streamline common tedious tasks.",
            "Led the greenfield rebuild of the frontend platform — new design system, monorepo, modern tooling — and migrated the coaching and participant experiences onto it.",
            "Overhauled the local development setup with automated provisioning so every system component can run end-to-end on a single machine.",
        ],
    },
    {
        dates: "2019 — 2022",
        title: "Engineering Manager, Data",
        company: "Delaware North",
        summary:
            "Managed 4 senior engineers across the data platform, integrations, and new solutions, stabilizing the legacy platform through the post-COVID transition to keep critical reporting flows live.",
    },
    {
        dates: "2014 — 2019",
        title: "Senior SOA Engineer, Senior Data Engineer",
        company: "Delaware North",
        summary:
            "Built a data platform from scratch for a critical BI project (99.9%+ API uptime through 2022), developed ETL processes including a custom serverless pipeline framework, and delivered multiple stand-alone solutions for business projects.",
    },
    {
        dates: "2013 — 2014",
        title: "Senior Programmer",
        company: "LocalNet / CoreComm / Exhibio LLC",
        summary:
            "Drove a stalled multi-tier web application to launch, built a new ISP billing system from scratch, and deployed a Haraka (Node.js) SMTP server with custom plugins integrating internal systems.",
    },
    {
        dates: "2006 — 2012",
        title: "Vendor Integrations Engineer, Lead Engineer",
        company: "Synacor — Williamsville, NY",
        summary:
            "Led design and development of a greenfield platform for internal and external tooling, drove the team's adoption of agile practices as Scrum Master, and mentored junior developers while introducing new technologies like Riak and Solr.",
    },
];
