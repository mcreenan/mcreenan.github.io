// A tiny generative lo-fi synthwave loop built entirely with Web Audio.

export const BPM = 84;
const STEP = 60 / BPM / 4; // sixteenth note
const LOOKAHEAD = 0.12;

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

// Am9 → Fmaj7 → Cmaj7 → Em7, one bar each.
const CHORDS = [
    { bass: 45, pad: [57, 60, 64, 67, 71] },
    { bass: 41, pad: [53, 57, 60, 64] },
    { bass: 48, pad: [55, 60, 64, 71] },
    { bass: 40, pad: [52, 55, 59, 62] },
];
const ARP = [0, 1, 2, 3, 2, 1, 3, 2];

export class Vibe {
    private ctx?: AudioContext;
    private out?: GainNode;
    private dest?: AudioNode;
    private echo?: DelayNode;
    private noise?: AudioBuffer;
    private timer?: number;
    private step = 0;
    private nextTime = 0;
    analyser?: AnalyserNode;
    playing = false;

    private setup() {
        const ctx = new AudioContext();
        this.ctx = ctx;

        const warmth = ctx.createBiquadFilter();
        warmth.type = "lowpass";
        warmth.frequency.value = 5200;

        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -18;
        comp.ratio.value = 4;

        this.out = ctx.createGain();
        this.out.gain.value = 0;

        this.analyser = ctx.createAnalyser();
        this.analyser.fftSize = 256;

        warmth.connect(comp).connect(this.out).connect(this.analyser).connect(ctx.destination);

        // Dotted-eighth echo for the arp.
        this.echo = ctx.createDelay(1);
        this.echo.delayTime.value = STEP * 3;
        const feedback = ctx.createGain();
        feedback.gain.value = 0.35;
        this.echo.connect(feedback).connect(this.echo);
        this.echo.connect(warmth);

        const len = ctx.sampleRate;
        this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = this.noise.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

        // Faint tape hiss under everything.
        const hiss = ctx.createBufferSource();
        hiss.buffer = this.noise;
        hiss.loop = true;
        const hissFilter = ctx.createBiquadFilter();
        hissFilter.type = "highpass";
        hissFilter.frequency.value = 6000;
        const hissGain = ctx.createGain();
        hissGain.gain.value = 0.012;
        hiss.connect(hissFilter).connect(hissGain).connect(warmth);
        hiss.start();

        this.dest = warmth;
    }

    private env(t: number, peak: number, attack: number, decay: number) {
        const g = this.ctx!.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(peak, t + attack);
        g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
        return g;
    }

    private pad(t: number, notes: number[]) {
        const ctx = this.ctx!;
        const bar = STEP * 16;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(600, t);
        filter.frequency.linearRampToValueAtTime(1500, t + bar * 0.5);
        filter.frequency.linearRampToValueAtTime(700, t + bar);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.05, t + 0.5);
        g.gain.setValueAtTime(0.05, t + bar - 0.4);
        g.gain.linearRampToValueAtTime(0.0001, t + bar + 0.3);
        filter.connect(g).connect(this.dest!);
        for (const n of notes) {
            for (const detune of [-9, 9]) {
                const o = ctx.createOscillator();
                o.type = "sawtooth";
                o.frequency.value = midi(n);
                o.detune.value = detune;
                o.connect(filter);
                o.start(t);
                o.stop(t + bar + 0.4);
            }
        }
    }

    private bass(t: number, note: number, len: number) {
        const ctx = this.ctx!;
        const o = ctx.createOscillator();
        o.type = "triangle";
        o.frequency.value = midi(note);
        const g = this.env(t, 0.32, 0.01, len);
        o.connect(g).connect(this.dest!);
        o.start(t);
        o.stop(t + len + 0.05);
    }

    private arp(t: number, note: number) {
        const ctx = this.ctx!;
        const o = ctx.createOscillator();
        o.type = "square";
        o.frequency.value = midi(note + 12);
        const f = ctx.createBiquadFilter();
        f.type = "lowpass";
        f.frequency.value = 1800;
        const g = this.env(t, 0.03, 0.005, STEP * 1.6);
        o.connect(f).connect(g);
        g.connect(this.dest!);
        g.connect(this.echo!);
        o.start(t);
        o.stop(t + STEP * 2);
    }

    private kick(t: number) {
        const ctx = this.ctx!;
        const o = ctx.createOscillator();
        o.frequency.setValueAtTime(130, t);
        o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
        const g = this.env(t, 0.7, 0.003, 0.3);
        o.connect(g).connect(this.dest!);
        o.start(t);
        o.stop(t + 0.35);
    }

    private hit(t: number, type: BiquadFilterType, freq: number, peak: number, decay: number) {
        const ctx = this.ctx!;
        const src = ctx.createBufferSource();
        src.buffer = this.noise!;
        const f = ctx.createBiquadFilter();
        f.type = type;
        f.frequency.value = freq;
        const g = this.env(t, peak, 0.002, decay);
        src.connect(f).connect(g).connect(this.dest!);
        src.start(t, Math.random() * 0.5);
        src.stop(t + decay + 0.05);
    }

    private schedule(t: number, step: number) {
        const s = step % 16;
        const chord = CHORDS[Math.floor(step / 16) % CHORDS.length];
        if (s === 0) this.pad(t, chord.pad);
        if (s === 0 || s === 7 || s === 10) this.bass(t, chord.bass, s === 0 ? STEP * 6 : STEP * 2.5);
        if (s % 2 === 0) this.arp(t, chord.pad[ARP[(s / 2) % ARP.length] % chord.pad.length]);
        if (s === 0 || s === 8 || (s === 11 && step % 32 > 16)) this.kick(t);
        if (s === 4 || s === 12) this.hit(t, "bandpass", 1800, 0.22, 0.18);
        // Lazy swung hats.
        const swing = s % 2 === 1 ? STEP * 0.18 : 0;
        this.hit(t + swing, "highpass", 8000, s % 4 === 2 ? 0.07 : 0.035, 0.05);
    }

    private tick = () => {
        const ctx = this.ctx!;
        while (this.nextTime < ctx.currentTime + LOOKAHEAD) {
            this.schedule(this.nextTime, this.step);
            this.nextTime += STEP;
            this.step++;
        }
    };

    async start() {
        if (!this.ctx) this.setup();
        const ctx = this.ctx!;
        await ctx.resume();
        this.step = 0;
        this.nextTime = ctx.currentTime + 0.08;
        this.out!.gain.cancelScheduledValues(ctx.currentTime);
        this.out!.gain.setTargetAtTime(0.55, ctx.currentTime, 0.3);
        this.timer = window.setInterval(this.tick, 25);
        this.playing = true;
    }

    stop() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        window.clearInterval(this.timer);
        this.out!.gain.cancelScheduledValues(ctx.currentTime);
        this.out!.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
        this.playing = false;
        window.setTimeout(() => {
            if (!this.playing) void ctx.suspend();
        }, 900);
    }

    async toggle() {
        if (this.playing) this.stop();
        else await this.start();
        return this.playing;
    }

    /** Rough 0..1 loudness of the low end, for driving visuals. */
    level() {
        if (!this.analyser || !this.playing) return 0;
        const bins = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(bins);
        let sum = 0;
        for (let i = 1; i < 10; i++) sum += bins[i];
        return sum / (9 * 255);
    }
}
