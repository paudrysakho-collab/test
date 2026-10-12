import numpy as np, sys, wave

SR, BPM, DUR = 44100, 125.0, 30.0
beat = 60.0 / BPM            # 0.48 s
bar  = 4 * beat              # 1.92 s
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(71)
mix = np.zeros(N)

def put(buf, start, sig, gain=1.0):
    i = int(start * SR)
    n = min(len(sig), len(buf) - i)
    if n > 0 and i >= 0:
        buf[i:i+n] += sig[:n] * gain

def env(n, a, d, s=0.0, r=0.0, sus=0.0):
    e = np.zeros(n)
    ai, di, ri = int(a*SR), int(d*SR), int(r*SR)
    ai = min(ai, n); e[:ai] = np.linspace(0, 1, ai) if ai else 0
    de = min(ai+di, n)
    if de > ai: e[ai:de] = np.linspace(1, sus, de-ai)
    if r and de < n:
        rs = max(n-ri, de); e[de:rs] = sus
        e[rs:] = np.linspace(sus, 0, n-rs)
    else:
        e[de:] = sus
    return e

def kick(dur=0.34):
    n = int(dur*SR); x = np.arange(n)/SR
    f = 150*np.exp(-x*28) + 48
    body = np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-x*7.5)
    click = rng.normal(0, 1, n) * np.exp(-x*220) * 0.25
    return np.tanh((body + click) * 1.5) * 0.95

def clap(dur=0.26):
    n = int(dur*SR); x = np.arange(n)/SR
    nz = rng.normal(0, 1, n)
    b, out = 0.0, np.zeros(n)                       # bandpass ~1.6k
    for i in range(1, n):
        b += (nz[i] - b) * 0.30
        out[i] = nz[i] - b
    return out * np.exp(-x*22) * 0.45

def hat(dur=0.07, g=1.0):
    n = int(dur*SR); x = np.arange(n)/SR
    nz = rng.normal(0, 1, n); hp = np.diff(np.concatenate([[0], nz]))
    return hp * np.exp(-x*70) * 0.22 * g

def saw(freq, n, det=0.0):
    x = np.arange(n)/SR; s = np.zeros(n)
    for h in range(1, 14):
        s += np.sin(2*np.pi*freq*h*x + det*h) / h
    return s * 0.3

def lp(sig, cut):                                    # one-pole lowpass
    a = np.exp(-2*np.pi*cut/SR); y = np.zeros_like(sig); prev = 0.0
    for i in range(len(sig)):
        prev = (1-a)*sig[i] + a*prev; y[i] = prev
    return y

NOTE = {"A2":110.00,"C3":130.81,"E3":164.81,"F2":87.31,"A3":220.00,
        "C4":261.63,"E4":329.63,"F3":174.61,"G2":98.00,"G3":196.00,
        "B3":246.94,"D4":293.66}
PROG = [("A2",["A3","C4","E4"]), ("F2",["F3","A3","C4"]),
        ("C3",["C4","E4","G3"]), ("G2",["G3","B3","D4"])]

bars_total = int(DUR/bar) + 1
for b in range(bars_total):
    t0 = b*bar
    if t0 >= DUR: break
    root, chord = PROG[b % 4]
    heavy = 2 <= b < 7 or 8 <= b < 12 or 13 <= b
    # pad / chords on every bar, filtered open in the heavy sections
    n = int(bar*SR)
    pad = sum(saw(NOTE[c], n, det=0.02*i) for i, c in enumerate(chord)) / 3
    pad = lp(pad, 900 if not heavy else 2600) * env(n, 0.05, 0.25, r=0.5, sus=0.55)
    put(mix, t0, pad, 0.16)
    if not heavy:
        continue
    # four on the floor + offbeat hats + claps on 2 & 4
    for s in range(4):
        put(mix, t0 + s*beat, kick(), 0.9)
        put(mix, t0 + s*beat + beat/2, hat(g=0.9), 0.8)
        if s % 2 == 1:
            put(mix, t0 + s*beat, clap(), 0.7)
    # offbeat sub bass
    for s in range(8):
        ts = t0 + s*beat/2
        nb = int(beat*0.42*SR); x = np.arange(nb)/SR
        sub = np.sin(2*np.pi*NOTE[root]*x) * env(nb, 0.004, 0.10, r=0.08, sus=0.7)
        put(mix, ts + beat/4, sub, 0.34)

# riser into the discount drop (~14.4) and into the close (~24.0)
for target in (14.40, 24.00):
    rl = 1.6; n = int(rl*SR); x = np.arange(n)/SR
    sweep = np.sin(2*np.pi*np.cumsum(260 + 1500*(x/rl)**2)/SR)
    nz = rng.normal(0, 1, n) * (x/rl)**2
    put(mix, target-rl, (sweep*0.25 + nz*0.18) * (x/rl)**1.6, 0.5)

# impacts
for ti in (14.40, 24.00):
    n = int(1.1*SR); x = np.arange(n)/SR
    boom = np.sin(2*np.pi*(70*np.exp(-x*9)+36)*x) * np.exp(-x*3.2)
    put(mix, ti, boom, 0.85)

# master: gentle fade in/out, soft clip, normalise
fi, fo = int(0.25*SR), int(1.6*SR)
mix[:fi] *= np.linspace(0, 1, fi)
mix[-fo:] *= np.linspace(1, 0, fo)
mix = np.tanh(mix * 1.1)
mix /= max(np.abs(mix).max(), 1e-9)
mix *= 0.89

st = np.stack([mix, mix], axis=1)
pcm = (st * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ecrit %s : %.1fs, %d BPM" % (sys.argv[1], DUR, BPM))
