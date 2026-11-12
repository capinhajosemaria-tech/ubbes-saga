// Ubbe's Saga — music renderer with recorded instruments (VSCO-2 CE, public domain).
// Each piece = rules + seed, rendered offline to a file. Run through render2.html.
(function (global) {
  const MODES = { ionian: [0, 2, 4, 5, 7, 9, 11], dorian: [0, 2, 3, 5, 7, 9, 10], phrygian: [0, 1, 3, 5, 7, 8, 10], mixolydian: [0, 2, 4, 5, 7, 9, 10], aeolian: [0, 2, 3, 5, 7, 8, 10] };
  function rngFrom(seed) { let s = seed | 0; return () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const pick = (r, a) => a[Math.floor(r() * a.length)], clamp = (v, a, b) => Math.max(a, Math.min(b, v)), mod7 = (d) => ((d % 7) + 7) % 7;
  const deg2m = (root, mode, deg) => root + 12 * Math.floor(deg / 7) + MODES[mode][mod7(deg)];

  // per-instrument defaults: gain, attack, release, pan, reverb send
  const INST = {
    harp: { g: 0.5, att: 0.003, rel: 1.2, pan: -0.3, send: 0.35 }, flute: { g: 0.42, att: 0.07, rel: 0.3, pan: 0.25, send: 0.4 },
    violin: { g: 0.36, att: 0.1, rel: 0.35, pan: 0.15, send: 0.38 }, violinf: { g: 0.34, att: 0.06, rel: 0.3, pan: 0.15, send: 0.35 },
    cello: { g: 0.3, att: 0.5, rel: 1.2, pan: -0.15, send: 0.45 }, viola: { g: 0.26, att: 0.6, rel: 1.2, pan: 0.2, send: 0.5 },
    violins: { g: 0.22, att: 0.7, rel: 1.3, pan: 0.35, send: 0.55 }, bass: { g: 0.32, att: 0.3, rel: 0.9, pan: 0, send: 0.3 },
    horn: { g: 0.42, att: 0.12, rel: 0.45, pan: -0.1, send: 0.45 }, hornf: { g: 0.45, att: 0.07, rel: 0.4, pan: -0.15, send: 0.42 },
    trombone: { g: 0.34, att: 0.08, rel: 0.4, pan: 0.25, send: 0.4 },
  };
  const PERC = { gdrum: { g: 0.8, pan: -0.05, send: 0.25 }, gdrumsoft: { g: 0.9, pan: -0.05, send: 0.3 }, congo: { g: 0.45, pan: 0.25, send: 0.22 }, congohi: { g: 0.35, pan: 0.35, send: 0.22 },
    bdrum: { g: 0.75, pan: 0, send: 0.3 }, tenor: { g: 0.45, pan: -0.25, send: 0.25 }, tumba: { g: 0.45, pan: -0.3, send: 0.2 }, conga: { g: 0.42, pan: 0.1, send: 0.2 },
    quinto: { g: 0.38, pan: 0.3, send: 0.2 }, tap: { g: 0.3, pan: 0.2, send: 0.18 }, tamb: { g: 0.18, pan: 0.45, send: 0.25, lp: 9000 }, shake: { g: 0.11, pan: 0.5, send: 0.2, lp: 8000 },
    timp: { g: 0.8, pan: 0, send: 0.4 }, frame: { g: 0.7, pan: -0.15, send: 0.3 } };

  class Studio {
    constructor(ctx, seed, lib) {
      this.ctx = ctx; this.sr = ctx.sampleRate; this.rng = rngFrom(seed); this.lib = lib; const c = ctx;
      this.comp = c.createDynamicsCompressor(); Object.assign(this.comp, {}); this.comp.threshold.value = -16; this.comp.ratio.value = 2.5; this.comp.knee.value = 12; this.comp.attack.value = 0.03; this.comp.release.value = 0.4;
      this.master = c.createGain(); this.master.gain.value = 0.9; this.master.connect(this.comp); this.comp.connect(c.destination);
      this.verb = c.createConvolver(); this.verb.buffer = this.makeIR(3.2); const vh = c.createBiquadFilter(); vh.type = 'highpass'; vh.frequency.value = 180; this.verb.connect(vh); vh.connect(this.master);
      this.noise = this.makeNoise(6); this.strips = {};
    }
    makeIR(sec) {
      const r = this.rng, sr = this.sr, n = Math.floor(sr * sec), b = this.ctx.createBuffer(2, n, sr);
      for (let ch = 0; ch < 2; ch++) {
        const d = b.getChannelData(ch); let lp = 0;
        for (let i = 0; i < n; i++) { const t = i / sr, a = 0.75 * Math.exp(-t * 1.6) + 0.06; lp += a * ((r() * 2 - 1) - lp); d[i] = t < 0.022 ? 0 : lp * Math.exp(-t * (6.9 / sec)) * 0.55; }
        for (let k = 0; k < 14; k++) { const i = Math.floor(sr * (0.022 + r() * 0.09)); d[i] += (r() - 0.5) * 0.7 * Math.exp(-k * 0.12); }
      }
      return b;
    }
    makeNoise(sec) { const n = Math.floor(this.sr * sec), b = this.ctx.createBuffer(1, n, this.sr), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = this.rng() * 2 - 1; return b; }
    strip(name, o = {}) {
      if (this.strips[name]) return this.strips[name];
      const c = this.ctx, inp = c.createGain(); inp.gain.value = o.g ?? 1; let node = inp;
      if (o.lp) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; node.connect(f); node = f; }
      const p = c.createStereoPanner(); p.pan.value = o.pan ?? 0; node.connect(p);
      const dg = c.createGain(); dg.gain.value = o.dry ?? 1; p.connect(dg); dg.connect(this.master);
      const s = c.createGain(); s.gain.value = o.send ?? 0.3; p.connect(s); s.connect(this.verb);
      this.strips[name] = inp; return inp;
    }
    // pitched note from the nearest recorded sample
    note(inst, t, m, dur, vel = 0.7, o = {}) {
      const L = this.lib[inst]; if (!L) throw new Error('no inst ' + inst);
      let best = null, bd = 99; for (const k of L.keys) { const d = Math.abs(k - m) + (k < m ? 0.01 : 0); if (d < bd) { bd = d; best = k; } }
      const buf = L.buf[best], rate = Math.pow(2, (m - best) / 12), D = INST[inst], att = o.att ?? D.att, rel = o.rel ?? D.rel;
      const st = this.strip(o.strip || inst, Object.assign({}, D, o.stripOpt || {}));
      const len = buf.duration / rate, segs = [];
      if (dur + rel < len - 0.05 || o.oneShot) segs.push([t, dur]);
      else { // long note: overlap copies with crossfades
        const seg = Math.max(1.5, len - 1.6); let tt = t, left = dur;
        while (left > 0) { const d0 = Math.min(seg, left); segs.push([tt, d0 + (left > seg ? 1.2 : 0)]); tt += seg; left -= seg; }
      }
      segs.forEach(([t0, d0], i) => {
        const s = this.ctx.createBufferSource(); s.buffer = buf; s.playbackRate.value = rate * (1 + (this.rng() - 0.5) * 0.002);
        const g = this.ctx.createGain(), a = i ? 1.0 : att, end = t0 + d0;
        g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vel, t0 + a);
        if (i < segs.length - 1) { g.gain.setValueAtTime(vel, end - 1.2); g.gain.linearRampToValueAtTime(0, end); }
        else { g.gain.setValueAtTime(vel, Math.max(t0 + a, end)); g.gain.setTargetAtTime(0, Math.max(t0 + a, end), rel / 3); }
        s.connect(g); g.connect(st);
        // start a little into the sample for later segments, so the attack is not heard again
        s.start(t0, i ? Math.min(0.8, buf.duration * 0.2) : 0); s.stop(end + rel * 2 + 0.1);
      });
    }
    chord(inst, t, ms, dur, vel, o = {}) { ms.forEach((m, i) => this.note(inst, t + (o.spread || 0) * i, m, dur, vel * (0.9 + this.rng() * 0.15), o)); }
    hit(kind, t, vel = 0.7, o = {}) {
      const L = this.lib[kind]; const arr = o.idx != null ? [L.buf[o.idx % L.buf.length]] : L.buf; const buf = arr[Math.floor(this.rng() * arr.length)];
      const s = this.ctx.createBufferSource(); s.buffer = buf; s.playbackRate.value = (o.rate || 1) * (1 + (this.rng() - 0.5) * 0.02);
      const g = this.ctx.createGain(); g.gain.value = vel * (0.92 + this.rng() * 0.16); s.connect(g);
      g.connect(this.strip(o.strip || kind, Object.assign({}, PERC[kind], o.stripOpt || {}))); s.start(Math.max(0, t));
    }
    wind(t0, t1, vel) {
      const c = this.ctx;
      [-0.6, 0.6].forEach((pan, k) => {
        const n = c.createBufferSource(); n.buffer = this.noise; n.loop = true; const bp = c.createBiquadFilter(), g = c.createGain();
        bp.type = 'bandpass'; bp.Q.value = 1.8; bp.frequency.setValueAtTime(500, t0); g.gain.setValueAtTime(0, t0);
        for (let t = t0 + 1; t < t1; t += 1.8 + this.rng() * 2) { bp.frequency.linearRampToValueAtTime(280 + this.rng() * 700, t); g.gain.linearRampToValueAtTime(vel * (0.3 + this.rng() * 0.7), t); }
        g.gain.linearRampToValueAtTime(0, t1); n.connect(bp); bp.connect(g); g.connect(this.strip('wind' + k, { pan, send: 0.2 })); n.start(t0, this.rng() * 4); n.stop(t1);
      });
    }
    sea(t0, t1, vel) {
      const c = this.ctx, n = c.createBufferSource(); n.buffer = this.noise; n.loop = true; const lp = c.createBiquadFilter(), g = c.createGain();
      lp.type = 'lowpass'; lp.frequency.value = 380; n.connect(lp); lp.connect(g); g.gain.setValueAtTime(0, t0);
      for (let t = t0; t < t1; t += 6 + this.rng() * 4) { g.gain.linearRampToValueAtTime(vel * (0.6 + this.rng() * 0.5), t + 2.6); g.gain.linearRampToValueAtTime(vel * 0.2, t + 5.6); }
      g.connect(this.strip('sea', { send: 0.1 })); n.start(t0); n.stop(t1);
    }
    fades(len, fin = 1.5, fout = 5) { const g = this.master.gain; g.setValueAtTime(0, 0); g.linearRampToValueAtTime(0.9, fin); g.setValueAtTime(0.9, len - fout); g.linearRampToValueAtTime(0, len); }
  }

  // ---------- composition helpers ----------
  const chordTones = (r) => [r, r + 2, r + 4];
  function nearestChordTone(r, d, rng, lo, hi) { let best = d, bd = 99; for (let c = lo; c <= hi; c++) { if (![0, 2, 4].includes(mod7(c - r))) continue; const dd = Math.abs(c - d) + rng() * 0.5; if (dd < bd) { bd = dd; best = c; } } return best; }
  function phrase(seed, o) {
    const r = rngFrom(seed), notes = []; let b = 0, d = o.d0; const [lo, hi] = o.range;
    while (b < o.len - 0.01) {
      const cell = pick(r, o.cells);
      for (const du of cell) {
        if (b >= o.len - 0.01) break; const chord = o.chordAt(o.start + b);
        if (o.strong(b)) d = nearestChordTone(chord, d, r, lo, hi);
        notes.push({ b, dur: Math.min(du, o.len - b), deg: d }); b += du;
        const x = r(); d += x < 0.34 ? 1 : x < 0.68 ? -1 : x < 0.8 ? 2 : x < 0.92 ? -2 : 0; d = clamp(d, lo, hi);
      }
    }
    const last = notes[notes.length - 1], rr = o.chordAt(o.start + last.b);
    last.deg = nearestChordTone(rr, last.deg, r, lo, hi);
    if (o.endOnRoot) { const dir = last.deg < (lo + hi) / 2 ? 1 : -1; let k = 0; while (mod7(last.deg - rr) !== 0 && k++ < 7) last.deg += dir; }
    return notes;
  }
  function melody(seedBase, n, o) {
    const form = ['A', 'B', 'A2', 'C', 'A', 'B2', 'A2', 'D'], out = [];
    for (let i = 0; i < n; i++) {
      const f = form[i % form.length], s = seedBase * 31 + f.charCodeAt(0) * 7, start = o.start + i * o.len;
      let ns = phrase(s, { ...o, start, endOnRoot: i === n - 1 || i % 4 === 3 });
      if (f.length > 1) { const v = phrase(s + 999, { ...o, start }); ns = ns.map((x, k) => (k >= ns.length - 2 && v[k] ? { ...x, deg: v[k].deg } : x)); }
      ns.forEach((x) => out.push({ ...x, b: x.b + start }));
    }
    // leave a breath at the end of each phrase
    return out.filter((x) => (x.b - o.start) % o.len < o.len - (o.rest ?? 1) + 1e-6).map((x) => { const end = Math.floor((x.b - o.start) / o.len) * o.len + o.start + o.len - (o.rest ?? 1); return { ...x, dur: Math.min(x.dur, end - x.b) }; });
  }
  function voice(root, mode, r, center, extra) { const ds = extra ? [r, r + 2, r + 4, r + 7] : chordTones(r); return ds.map((d) => { let m = deg2m(root, mode, d); while (m < center - 6) m += 12; while (m > center + 6) m -= 12; return m; }).sort((a, b) => a - b); }
  // a groove: per-instrument 16-step strings, 0-9 = velocity tenths, '.' = rest; optional swing
  function groove(st, t0, bar, nBars, pat, o = {}) {
    const steps = o.steps || 16, sw = o.swing || 0, r = st.rng;
    for (let i = 0; i < nBars; i++) for (const k in pat) {
      const p = pat[k]; if (typeof p === 'function') continue;
      for (let s = 0; s < steps; s++) {
        const c = p[s % p.length]; if (c === '.' || c === undefined) continue; let v = (+c) / 9;
        if (o.prob && o.prob[k] && r() > o.prob[k]) continue;
        const tt = t0 + i * bar + (s + (s % 2 ? sw : 0)) * bar / steps + (r() - 0.5) * 0.012;
        st.hit(k.replace(/\d$/, ''), tt, v * (o.vel || 1), o.opt && o.opt[k]);
      }
      if (o.fill && (i % 4 === 3)) o.fill(t0 + i * bar, bar);
    }
  }

  const T = {};
  // ================= SUMMER =================
  T.s1 = { title: 'Morning on the Bay', seed: 11, build(st) {
    const r = st.rng, root = 62, mode = 'dorian', B = 60 / 84, bar = 4 * B, prog = [0, 0, -1, -1, 3, 3, 4, 4], ch = (b) => prog[Math.floor(b / 4) % 8];
    const nb = 52, len = nb * bar + 6; st.sea(0, len, 0.08);
    const arp = [0, 2, 4, 7, 9, 7, 4, 2];
    for (let i = 0; i < nb - 2; i++) { const c = prog[i % 8], tones = [c, c + 2, c + 4, c + 7, c + 9, c + 11].map((d) => deg2m(root - 12, mode, d));
      for (let k = 0; k < 8; k++) { if (k && r() < 0.07) continue; st.note('harp', i * bar + k * B / 2 + (r() - 0.5) * 0.01, tones[[0, 2, 3, 1, 4, 3, 2, 1][k]], 2.2, k % 2 ? 0.45 : 0.62); }
      st.note('bass', i * bar, deg2m(root - 24, mode, c), bar * 0.95, 0.45, { att: 0.15 });
      if (i >= 20 && i < 36 && i % 2 === 0) st.chord('cello', i * bar, voice(root - 12, mode, c, 52), 2 * bar, 0.4); }
    // groove: grows in two steps
    const g1 = { gdrum: '6.........4.....', tap: '...2...2...2...2', congo: '......4.......3.' };
    const g2 = { gdrum: '7.....3...5.....', tap: '..2..2...2.2..2.', congo: '......5..3....4.', shake: '3.2.3.2.3.2.3.2.', quinto: '..............3.' };
    const fill = (t, b) => { for (const [s, v] of [[12, 0.4], [13, 0.45], [14, 0.5], [15, 0.6]]) st.hit('tumba', t + s * b / 16, v); };
    groove(st, 4 * bar, bar, 16, g1, { swing: 0.12 });
    groove(st, 20 * bar, bar, 28, g2, { swing: 0.12, fill });
    groove(st, 48 * bar, bar, 2, g1, { swing: 0.12 });
    const ml = { len: 8, range: [4, 12], d0: 7, chordAt: ch, strong: (b) => b % 2 === 0, cells: [[2], [1, 1], [1.5, 0.5], [0.5, 0.5, 1], [1, 0.5, 0.5], [3, 1]], rest: 1 };
    melody(1, 8, { ...ml, start: 16 }).forEach((n) => st.note('flute', n.b * B, deg2m(root, mode, n.deg), n.dur * B * 0.95, 0.6));
    melody(2, 8, { ...ml, range: [0, 9], d0: 4, start: 80 }).forEach((n) => st.note('violin', n.b * B, deg2m(root, mode, n.deg), n.dur * B, 0.62));
    melody(1, 4, { ...ml, start: 144 }).forEach((n) => { st.note('flute', n.b * B, deg2m(root, mode, n.deg), n.dur * B * 0.95, 0.55); st.note('violin', n.b * B, deg2m(root, mode, n.deg - 2), n.dur * B, 0.4); });
    st.chord('harp', (nb - 2) * bar, voice(root - 12, mode, 0, 55, true).concat([root, root + 7]), 6, 0.6, { spread: 0.06 });
    st.chord('cello', (nb - 2) * bar, [root - 24, root - 17], 6, 0.35); st.fades(len, 1, 5); return len; } };

  T.s2 = { title: 'Harvest Dance', seed: 22, build(st) {
    const r = st.rng, root = 67, mode = 'mixolydian', E = 60 / (78 * 3), bar = 6 * E, prog = [0, 0, -1, -1, 3, 3, 0, 4], ch = (b) => prog[Math.floor(b / 6) % 8];
    const nb = 84, len = nb * bar + 6;
    for (let i = 0; i < nb - 2; i++) { const c = prog[i % 8], tones = [c, c + 2, c + 4, c + 7].map((d) => deg2m(root - 12, mode, d));
      [0, 2, 1, 3, 2, 1].forEach((x, k) => { if (k && r() < 0.06) return; st.note('harp', i * bar + k * E, tones[x], 1.6, k % 3 ? 0.42 : 0.58); });
      st.note('bass', i * bar, deg2m(root - 24, mode, c), bar * 0.9, 0.5, { att: 0.1 });
      if (i >= 28 && i % 2 === 0) st.chord('viola', i * bar, voice(root - 12, mode, c, 58), 2 * bar, 0.32); }
    const g = { gdrum: '7..5..', tamb: '..4..5', congo: '.3..3.', shake: '322322' }, g0 = { gdrum: '6..4..', congo: '.3..3.' };
    const fill = (t, b) => { for (let k = 0; k < 6; k++) st.hit(k < 3 ? 'conga' : 'tumba', t + k * b / 6, 0.3 + k * 0.07); };
    groove(st, 2 * bar, bar, 6, g0, { steps: 6 }); groove(st, 8 * bar, bar, nb - 10, g, { steps: 6, fill, prob: { shake: 0.85 } });
    const ml = { len: 12, range: [2, 11], d0: 4, chordAt: ch, strong: (b) => b % 3 === 0, cells: [[3], [2, 1], [1, 1, 1], [1, 2], [2, 1, 3]], rest: 1 };
    melody(7, 12, { ...ml, start: 48 }).forEach((n) => st.note('violinf', n.b * E, deg2m(root, mode, n.deg), n.dur * E, 0.65, { att: 0.03 }));
    melody(8, 8, { ...ml, start: 192 }).forEach((n) => st.note('flute', n.b * E, deg2m(root, mode, n.deg), n.dur * E * 0.95, 0.62));
    melody(7, 8, { ...ml, start: 288 }).forEach((n) => { st.note('violinf', n.b * E, deg2m(root, mode, n.deg), n.dur * E, 0.6, { att: 0.03 }); st.note('flute', n.b * E, deg2m(root, mode, n.deg + 7), n.dur * E * 0.95, 0.45); });
    st.chord('harp', (nb - 2) * bar, voice(root - 12, mode, 0, 58, true).concat([root, root + 4, root + 7]), 5, 0.6, { spread: 0.05 }); st.hit('gdrum', (nb - 2) * bar, 0.8);
    st.fades(len, 0.5, 4); return len; } };

  T.s3 = { title: 'A Long Summer Day', seed: 33, build(st) {
    const r = st.rng, root = 57, mode = 'ionian', B = 60 / 92, bar = 4 * B, prog = [0, 0, 4, 4, 5, 5, 3, 3], ch = (b) => prog[Math.floor(b / 4) % 8];
    const nb = 58, len = nb * bar + 6; st.sea(0, len, 0.06);
    for (let i = 0; i < nb - 2; i++) { const c = prog[i % 8], tones = [c, c + 4, c + 7, c + 9, c + 11].map((d) => deg2m(root, mode, d));
      for (let k = 0; k < 8; k++) { if (k && r() < 0.08) continue; st.note('harp', i * bar + k * B / 2, tones[[0, 1, 2, 1, 3, 2, 4, 2][k]], 1.8, k % 2 ? 0.4 : 0.55); }
      st.note('cello', i * bar, deg2m(root - 12, mode, c), B * 1.6, 0.5, { att: 0.08, rel: 0.4 }); st.note('cello', i * bar + 2.5 * B, deg2m(root - 12, mode, c + 4), B * 1.2, 0.38, { att: 0.08, rel: 0.4 }); }
    const g = { tumba: '5......3..4.....', quinto: '....4.......4...', tap: '.2.2..2..2.2..2.', shake: '2121212121212121', gdrum: '6.......4.......' };
    const fill = (t, b) => { for (const [s, k, v] of [[10, 'quinto', 0.4], [11, 'quinto', 0.4], [12, 'conga', 0.45], [13, 'conga', 0.5], [14, 'tumba', 0.55], [15, 'tumba', 0.6]]) st.hit(k, t + s * b / 16, v); };
    groove(st, 8 * bar, bar, nb - 12, g, { swing: 0.08, fill, prob: { shake: 0.8 } });
    const ml = { len: 8, range: [2, 11], d0: 4, chordAt: ch, strong: (b) => b % 2 === 0, cells: [[2], [1, 1], [1.5, 0.5], [3, 1], [1, 1, 2]], rest: 1 };
    melody(3, 8, { ...ml, start: 16 }).forEach((n) => st.note('flute', n.b * B, deg2m(root + 12, mode, n.deg), n.dur * B * 0.95, 0.58));
    melody(4, 8, { ...ml, range: [-2, 7], start: 80 }).forEach((n) => st.note('violin', n.b * B, deg2m(root + 12, mode, n.deg), n.dur * B, 0.6));
    melody(3, 6, { ...ml, start: 160 }).forEach((n) => { st.note('flute', n.b * B, deg2m(root + 12, mode, n.deg), n.dur * B * 0.95, 0.55); st.note('violin', n.b * B, deg2m(root + 12, mode, n.deg - 2), n.dur * B, 0.42); });
    st.chord('harp', (nb - 2) * bar, voice(root, mode, 0, 64, true).concat([root - 12]), 6, 0.6, { spread: 0.06 }); st.fades(len, 1, 5); return len; } };

  T.s4 = { title: 'Fair Winds', seed: 44, build(st) {
    const r = st.rng, root = 64, mode = 'dorian', B = 60 / 100, bar = 4 * B, prog = [0, 0, -1, -1, 3, 3, 0, 0], ch = (b) => prog[Math.floor(b / 4) % 8];
    const nb = 60, len = nb * bar + 6;
    for (let i = 0; i < nb - 2; i++) { const c = prog[i % 8], tones = [c, c + 2, c + 4, c + 7].map((d) => deg2m(root - 12, mode, d));
      [0, 1, 2, 3, 2, 1, 2, 3].forEach((x, k) => { if (i < 2 && k % 2) return; st.note('harp', i * bar + k * B / 2, tones[x], 1.4, k % 2 ? 0.38 : 0.5); });
      st.note('bass', i * bar, deg2m(root - 24, mode, c), B * 1.8, 0.5, { att: 0.1 }); st.note('bass', i * bar + 2 * B, deg2m(root - 24, mode, c + 4), B * 1.8, 0.42, { att: 0.1 });
      if (i >= 8 && i % 2 === 0) st.chord('violins', i * bar, voice(root, mode, c, 66), 2 * bar, 0.3); }
    const g = { gdrum: '7.....5.7.......', tenor: '....5.......5...', tamb: '....4.......4...', tap: '..2...2...2.2.2.', shake: '3232323232323232' };
    const fill = (t, b) => { for (let s = 8; s < 16; s++) st.hit('tenor', t + s * b / 16, 0.25 + (s - 8) * 0.06); };
    groove(st, 4 * bar, bar, nb - 6, g, { swing: 0.06, fill, prob: { shake: 0.85 } });
    const ml = { len: 8, range: [0, 9], d0: 4, chordAt: ch, strong: (b) => b % 2 === 0, cells: [[2], [1, 1], [3, 1], [1.5, 0.5], [2, 2]], rest: 1 };
    melody(5, 8, { ...ml, start: 32 }).forEach((n) => st.note('horn', n.b * B, deg2m(root - 12, mode, n.deg), n.dur * B, 0.62));
    melody(6, 8, { ...ml, range: [4, 13], d0: 9, start: 96 }).forEach((n) => st.note('flute', n.b * B, deg2m(root, mode, n.deg), n.dur * B * 0.95, 0.58));
    melody(5, 6, { ...ml, start: 168 }).forEach((n) => { st.note('horn', n.b * B, deg2m(root - 12, mode, n.deg), n.dur * B, 0.6); st.note('violin', n.b * B, deg2m(root, mode, n.deg), n.dur * B, 0.45); });
    st.chord('harp', (nb - 2) * bar, voice(root - 12, mode, 0, 58, true).concat([root]), 5, 0.6, { spread: 0.05 }); st.hit('gdrum', (nb - 2) * bar, 0.8); st.chord('violins', (nb - 2) * bar, voice(root, mode, 0, 66), 5, 0.3);
    st.fades(len, 0.8, 4); return len; } };

  // ================= WINTER =================
  T.w1 = { title: 'The Long Night', seed: 55, build(st) {
    const r = st.rng, root = 57, mode = 'aeolian', B = 60 / 54, bar = 4 * B, prog = [0, 0, 5, 5, 6, 6, 0, 0], ch = (b) => prog[Math.floor(b / 4) % 8];
    const nb = 34, len = nb * bar + 7; st.wind(0, len, 0.07);
    st.note('bass', 0.2, root - 24, nb * bar, 0.4, { att: 3 });
    for (let i = 2; i < nb - 2; i += 2) { const c = prog[i % 8]; st.chord('cello', i * bar, voice(root - 12, mode, c, 52), 2 * bar + 0.5, 0.42); if (i >= 6) st.chord('viola', i * bar, voice(root, mode, c, 62), 2 * bar + 0.5, 0.35); }
    for (let i = 0; i < nb - 2; i++) { const c = prog[i % 8], n = 1 + Math.floor(r() * 3);
      for (let k = 0; k < n; k++) st.note('harp', i * bar + Math.floor(r() * 8) * B / 2, deg2m(root, mode, pick(r, chordTones(c)) + 7 * (r() < 0.5 ? 0 : 1)), 4, 0.42 + r() * 0.15);
      if (i >= 8 && i < nb - 4) { st.hit('gdrumsoft', i * bar, 0.8); st.hit('gdrumsoft', i * bar + 0.45 * B, 0.55); } }
    [6, 22].forEach((i) => st.hit('timp', i * bar - 0.05, 0.6, { idx: 0 }));
    const ml = { len: 8, range: [3, 11], d0: 7, chordAt: ch, strong: (b) => b % 4 === 0, cells: [[4], [2, 2], [3, 1], [2, 1, 1]], rest: 1.5 };
    melody(9, 8, { ...ml, start: 40 }).forEach((n) => st.note('violin', n.b * B, deg2m(root, mode, n.deg), n.dur * B, 0.6, { att: 0.25 }));
    st.chord('cello', (nb - 2) * bar, [root - 24, root - 12, root - 5], 6, 0.4); st.fades(len, 3, 7); return len; } };

  T.w2 = { title: 'Frost on the Fjord', seed: 66, build(st) {
    const r = st.rng, root = 52, mode = 'phrygian', B = 60 / 52, bar = 4 * B, prog = [0, 0, 1, 1, 0, 0, -1, -1], ch = (b) => prog[Math.floor(b / 4) % 8];
    const nb = 34, len = nb * bar + 7; st.wind(0, len, 0.1);
    st.note('bass', 0.2, root - 24 + 12, nb * bar, 0.42, { att: 3 });
    for (let i = 0; i < nb - 2; i += 2) st.chord('cello', i * bar, [root - 12, root - 5], 2 * bar + 0.5, 0.36);
    for (let i = 4; i < nb - 3; i++) { st.hit('frame', i * bar, 0.7); for (let k = 1; k < 4; k++) st.hit('frame', i * bar + k * B, 0.28); }
    for (let i = 8; i < nb - 3; i++) [0, 1.5, 2.5].forEach((b) => { if (r() < 0.75) st.note('harp', i * bar + b * B, root + 12 + pick(r, [0, 7, 12, 1]), 3, 0.38); });
    const ml = { len: 8, range: [-2, 7], d0: 2, chordAt: ch, strong: (b) => b % 2 === 0, cells: [[2], [1, 1], [3, 1], [4]], rest: 1.5 };
    melody(10, 8, { ...ml, start: 24 }).forEach((n) => st.note('horn', n.b * B, deg2m(root, mode, n.deg), n.dur * B, 0.6, { att: 0.2 }));
    for (let i = 20; i < nb - 2; i += 2) st.chord('violins', i * bar, voice(root + 12, mode, prog[i % 8], 70), 2 * bar + 0.4, 0.3);
    st.hit('timp', (nb - 2) * bar, 0.7, { idx: 0 }); st.chord('cello', (nb - 2) * bar, [root - 12, root - 5, root], 6, 0.38); st.fades(len, 3, 7); return len; } };

  T.w3 = { title: 'Snow over Kaldstrand', seed: 77, build(st) {
    const r = st.rng, root = 62, mode = 'aeolian', B = 60 / 66, bar = 4 * B, prog = [0, 0, 5, 5, 2, 2, 6, 6], ch = (b) => prog[Math.floor(b / 4) % 8];
    const nb = 42, len = nb * bar + 7; st.wind(0, len, 0.05);
    for (let i = 0; i < nb - 2; i++) { const c = prog[i % 8], tones = [c, c + 4, c + 7, c + 9].map((d) => deg2m(root - 12, mode, d));
      [0, 1, 2, 3, 2, 1, 2, 1].forEach((x, k) => st.note('harp', i * bar + k * B / 2, tones[x], 2.4, k % 2 ? 0.34 : 0.46));
      if (i % 2 === 0) { st.note('cello', i * bar, deg2m(root - 24, mode, c), 2 * bar, 0.42); if (i >= 8) st.chord('violins', i * bar, voice(root, mode, c, 69), 2 * bar + 0.4, 0.26); }
      if (i >= 16 && i < 32 && i % 2 === 0) st.hit('gdrumsoft', i * bar, 0.6); }
    const ml = { len: 8, range: [0, 9], d0: 4, chordAt: ch, strong: (b) => b % 2 === 0, cells: [[2], [1, 1], [3, 1], [2, 2], [1.5, 0.5]], rest: 1 };
    melody(11, 8, { ...ml, start: 32 }).forEach((n) => st.note('flute', n.b * B, deg2m(root, mode, n.deg), n.dur * B * 0.95, 0.55));
    melody(11, 4, { ...ml, start: 112 }).forEach((n) => st.note('viola', n.b * B, deg2m(root - 12, mode, n.deg), n.dur * B, 0.45, { att: 0.2 }));
    st.chord('harp', (nb - 2) * bar, voice(root - 12, mode, 0, 55, true).concat([root]), 6, 0.55, { spread: 0.08 }); st.fades(len, 2, 7); return len; } };

  T.w4 = { title: 'Wolves at the Gate', seed: 88, build(st) {
    const r = st.rng, root = 60, mode = 'aeolian', B = 60 / 76, bar = 4 * B, prog = [0, 0, 5, 6, 0, 0, 5, 4], ch = (b) => prog[Math.floor(b / 4) % 8];
    const nb = 48, len = nb * bar + 7; st.wind(0, len, 0.08);
    for (let i = 0; i < nb - 2; i++) { const c = prog[i % 8], lo = deg2m(root - 24, mode, c);
      for (let k = 0; k < 8; k++) st.note('cello', i * bar + k * B / 2, lo + (k === 3 || k === 7 ? 7 : 0), B * 0.42, k % 2 ? 0.45 : 0.62, { att: 0.02, rel: 0.15 });
      if (i >= 8) st.note('bass', i * bar, lo - 12, bar, 0.42, { att: 0.2 });
      if (i >= 8 && i % 2 === 0) st.chord('viola', i * bar, voice(root - 12, mode, c, 60), 2 * bar + 0.3, 0.32);
      if (i >= 16) { st.hit('bdrum', i * bar, 0.6); st.hit('tenor', i * bar + 1.5 * B, 0.35); st.hit('bdrum', i * bar + 2.5 * B, 0.4); st.hit('tenor', i * bar + 3 * B, 0.3); }
      if (i >= 32) st.chord('violins', i * bar, voice(root, mode, c, 72), bar + 0.3, 0.28); }
    [8, 16, 32, 40].forEach((i) => st.hit('timp', i * bar - 0.04, 0.85, { idx: 1 }));
    const ml = { len: 8, range: [0, 8], d0: 4, chordAt: ch, strong: (b) => b % 2 === 0, cells: [[2], [1, 1], [3, 1], [1.5, 0.5], [4]], rest: 1 };
    melody(12, 8, { ...ml, start: 64 }).forEach((n) => st.note('horn', n.b * B, deg2m(root - 12, mode, n.deg), n.dur * B, 0.62));
    melody(12, 4, { ...ml, start: 128 }).forEach((n) => { st.note('hornf', n.b * B, deg2m(root - 12, mode, n.deg), n.dur * B, 0.6); st.note('trombone', n.b * B, deg2m(root - 24, mode, n.deg), n.dur * B, 0.55); });
    const e = (nb - 2) * bar; st.hit('timp', e, 1, { idx: 1 }); st.hit('bdrum', e, 0.9); st.chord('cello', e, [root - 24, root - 12, root - 5], 6, 0.5); st.chord('hornf', e, [root - 12, root - 5, root], 4, 0.5);
    st.fades(len, 1.5, 6); return len; } };

  // ================= SPECIAL MOMENTS =================
  T.raid_depart = { title: 'The Fleet Sails', seed: 101, build(st) {
    const root = 62, mode = 'aeolian', B = 60 / 96, bar = 4 * B, prog = [0, 0, 5, 6, 0, 0, 3, 4], nb = 18, len = nb * bar + 5;
    st.note('horn', 0.2, root - 12, 1.6, 0.6, { stripOpt: { send: 0.8 } }); st.note('horn', 1.9, root - 5, 0.8, 0.6, { stripOpt: { send: 0.8 } }); st.note('horn', 2.8, root, 2.6, 0.65, { stripOpt: { send: 0.8 } });
    const t0 = 5.5;
    for (let i = 0; i < nb - 2; i++) { const T0 = t0 + i * bar, c = prog[i % 8], lo = deg2m(root - 24, mode, c);
      for (let k = 0; k < 8; k++) st.note('cello', T0 + k * B / 2, lo + (k % 4 === 3 ? 7 : 0), B * 0.42, k % 2 ? 0.45 : 0.6, { att: 0.02, rel: 0.15 });
      st.hit('bdrum', T0, 0.75); st.hit('gdrum', T0 + 2 * B, 0.6); st.hit('tenor', T0 + 1.5 * B, 0.4); st.hit('tenor', T0 + 3.5 * B, 0.45); if (i >= 4) st.hit('gdrum', T0 + 3 * B, 0.45);
      if (i >= 4 && i % 2 === 0) st.chord('hornf', T0, voice(root - 12, mode, c, 57), 2 * bar - 0.2, 0.42); if (i >= 8) st.chord('trombone', T0, [lo, lo + 7], bar - 0.1, 0.45); }
    const e = t0 + (nb - 2) * bar; st.hit('timp', e, 1, { idx: 1 }); st.hit('bdrum', e, 0.9); st.chord('hornf', e, [root - 12, root - 5, root], 3.5, 0.6); st.chord('cello', e, [root - 24, root - 17], 4, 0.55);
    st.fades(len, 0.1, 4); return len; } };

  T.raid_return = { title: 'The Ships Come Home', seed: 102, build(st) {
    const root = 62, mode = 'mixolydian', B = 60 / 92, bar = 4 * B, prog = [0, 0, -1, -1, 3, 3, 4, 0], ch = (b) => prog[Math.floor(b / 4) % 8], r = st.rng;
    const far = { strip: 'hornFar', stripOpt: { send: 1, dry: 0.3, lp: 1600, pan: -0.4 } };
    const call = (t, o, v) => { st.note('horn', t, root - 12, 1.2, v, o); st.note('horn', t + 1.3, root - 5, 0.6, v, o); st.note('horn', t + 2.0, root, 2.2, v, o); };
    call(0.3, far, 0.55); call(4.4, {}, 0.65); st.sea(0, 12, 0.12);
    const t0 = 8, nb = 22, len = t0 + nb * bar + 6;
    for (let i = 0; i < nb - 3; i++) { const T0 = t0 + i * bar, c = prog[i % 8];
      st.hit('gdrum', T0, 0.75); st.hit('gdrum', T0 + 2 * B, 0.6); if (i >= 2) { st.hit('congo', T0 + B, 0.4); st.hit('congo', T0 + 3 * B, 0.45); st.hit('tamb', T0 + B, 0.5); st.hit('tamb', T0 + 3 * B, 0.5); }
      if (i >= 6) for (let k = 0; k < 8; k++) st.hit('shake', T0 + k * B / 2, k % 2 ? 0.3 : 0.45);
      if (i >= 2) for (let k = 0; k < 4; k++) st.chord('harp', T0 + k * B, voice(root - 12, mode, c, 60), 1.2, k ? 0.42 : 0.55, { spread: 0.012 });
      st.note('bass', T0, deg2m(root - 24, mode, c), bar, 0.5, { att: 0.1 });
      if (i >= 6 && i % 2 === 0) st.chord('violins', T0, voice(root, mode, c, 66), 2 * bar, 0.32); }
    const ml = { len: 8, range: [0, 9], d0: 4, chordAt: ch, strong: (b) => b % 2 === 0, cells: [[2], [1, 1], [3, 1], [1, 1, 2], [1.5, 0.5]], rest: 1 };
    melody(13, 6, { ...ml, start: 16 }).forEach((n) => { const t = t0 + n.b * B; st.note('hornf', t, deg2m(root - 12, mode, n.deg), n.dur * B, 0.62); if (n.b >= 40) st.note('violinf', t, deg2m(root, mode, n.deg), n.dur * B, 0.5); });
    for (let k = 0; k < 16; k++) st.hit('tenor', t0 + 18 * bar + 2 * B + k * B / 8, 0.25 + k * 0.035);
    const e = t0 + 19 * bar; st.hit('timp', e, 1, { idx: 1 }); st.hit('gdrum', e, 0.9);
    st.chord('harp', e, voice(root - 12, mode, 0, 58, true).concat([root, root + 4, root + 7]), 6, 0.65, { spread: 0.03 });
    st.chord('hornf', e, [root - 12, root - 5, root - 8 + 12], 3 * bar, 0.6); st.chord('violins', e, [root, root + 4, root + 7], 3 * bar, 0.4); st.note('trombone', e, root - 24, 3 * bar, 0.55);
    st.fades(len, 0.2, 5); return len; } };

  T.festival = { title: 'Feast in the Hall', seed: 103, build(st) {
    const r = st.rng, root = 69, mode = 'mixolydian', E = 60 / (92 * 3), bar = 6 * E, prog = [0, 0, -1, -1, 3, 3, 4, 0], ch = (b) => prog[Math.floor(b / 6) % 8];
    const nb = 44, len = nb * bar + 5;
    for (let i = 0; i < nb - 2; i++) { const c = prog[i % 8], tones = [c, c + 2, c + 4, c + 7].map((d) => deg2m(root - 12, mode, d));
      [0, 2, 1, 3, 2, 1].forEach((x, k) => st.note('harp', i * bar + k * E, tones[x], 1.2, k % 3 ? 0.4 : 0.55)); st.note('bass', i * bar, deg2m(root - 24, mode, c), bar * 0.9, 0.5, { att: 0.08 }); }
    groove(st, 0, bar, nb - 2, { gdrum: '7..5..', tamb: '..5..5', congo: '.3..4.', shake: '433433' }, { steps: 6, fill: (t, b) => { for (let k = 3; k < 6; k++) st.hit('tumba', t + k * b / 6, 0.4 + k * 0.05); } });
    const ml = { len: 12, range: [2, 11], d0: 4, chordAt: ch, strong: (b) => b % 3 === 0, cells: [[1, 1, 1], [2, 1], [1, 2], [3]], rest: 1 };
    melody(14, 8, { ...ml, start: 24 }).forEach((n) => st.note('violinf', n.b * E, deg2m(root - 12, mode, n.deg), n.dur * E, 0.65, { att: 0.02 }));
    melody(14, 6, { ...ml, start: 120 }).forEach((n) => { st.note('violinf', n.b * E, deg2m(root - 12, mode, n.deg), n.dur * E, 0.6, { att: 0.02 }); st.note('flute', n.b * E, deg2m(root, mode, n.deg), n.dur * E * 0.9, 0.5); });
    st.chord('harp', (nb - 2) * bar, voice(root - 12, mode, 0, 64, true), 4, 0.6, { spread: 0.03 }); st.hit('gdrum', (nb - 2) * bar, 0.9); st.fades(len, 0.3, 3); return len; } };

  T.townhall = { title: 'A Greater Hall', seed: 104, build(st) {
    const root = 62, B = 60 / 80; for (let k = 0; k < 20; k++) st.hit('timp', k * 0.07, 0.25 + k * 0.03, { idx: 1 });
    const t = 1.5; st.note('hornf', t, root - 12, B, 0.6); st.note('hornf', t + B, root - 8, B * 0.5, 0.6); st.note('hornf', t + 1.5 * B, root - 5, B * 0.5, 0.6); st.note('hornf', t + 2 * B, root, 4 * B, 0.7);
    st.note('trombone', t, root - 24, 6 * B, 0.5); st.note('trombone', t + 2 * B, root - 17, 4 * B, 0.5);
    st.hit('timp', t + 2 * B, 1, { idx: 1 }); st.hit('bdrum', t + 2 * B, 0.8); st.chord('violins', t + 2 * B, [root, root + 4, root + 7, root + 12], 5 * B, 0.45);
    st.chord('harp', t + 2 * B, [root - 12, root - 5, root, root + 4, root + 7, root + 12, root + 16], 5, 0.6, { spread: 0.04 }); const len = t + 7 * B + 5; st.fades(len, 0.05, 4); return len; } };

  T.funeral = { title: 'Ashes to the Sea', seed: 105, build(st) {
    const root = 62, mode = 'aeolian', B = 60 / 50, bar = 4 * B, prog = [0, 5, 3, 4, 0, 5, 6, 0], ch = (b) => prog[Math.floor(b / 4) % 8], nb = 12, len = nb * bar + 7;
    st.wind(0, len, 0.06);
    for (let i = 0; i < nb - 1; i++) { const c = prog[i % 8]; st.chord('cello', i * bar, voice(root - 12, mode, c, 52), bar + 0.4, 0.42); st.chord('viola', i * bar, voice(root, mode, c, 62), bar + 0.4, 0.3); if (i % 2 === 0) st.hit('gdrumsoft', i * bar, 0.7); }
    const ml = { len: 8, range: [0, 8], d0: 4, chordAt: ch, strong: (b) => b % 4 === 0, cells: [[4], [2, 2], [3, 1]], rest: 1.5 };
    melody(15, 5, { ...ml, start: 4 }).forEach((n) => st.note('horn', n.b * B, deg2m(root - 12, mode, n.deg), n.dur * B, 0.55, { att: 0.25 }));
    const e = (nb - 1) * bar; st.hit('timp', e, 0.7, { idx: 0 }); st.chord('cello', e, [root - 24, root - 12, root - 5], 6, 0.42); st.fades(len, 2, 6); return len; } };

  global.UM2 = { Studio, T };
})(typeof window !== 'undefined' ? window : globalThis);
