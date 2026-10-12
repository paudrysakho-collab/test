import sys
import numpy as np
import onnxruntime as ort
from PIL import Image

src, dst, model = sys.argv[1], sys.argv[2], sys.argv[3]

img = Image.open(src).convert("RGB")
W, H = img.size

# preprocessing u2net : 320x320, /max, puis normalisation ImageNet
x = np.array(img.resize((320, 320), Image.BILINEAR)).astype(np.float32)
x = x / max(x.max(), 1e-6)
mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
x = (x - mean) / std
x = x.transpose(2, 0, 1)[None].astype(np.float32)

sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
pred = sess.run(None, {sess.get_inputs()[0].name: x})[0][0, 0]
pred = (pred - pred.min()) / max(pred.max() - pred.min(), 1e-6)

alpha = Image.fromarray((pred * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)
out = img.convert("RGBA")
out.putalpha(alpha)
out.save(dst)

a = np.array(alpha)
print("alpha: %.1f%% opaque (>128), moyenne %.1f" % (100.0 * (a > 128).mean(), a.mean()))
