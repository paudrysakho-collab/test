"""Génère feed-4x5.html (fil Facebook / Instagram, 1080x1350) à partir de index.html (Reels, 1080x1920).

index.html reste la seule source : après toute retouche de la pub, relancer
    python3 scripts/make-feed-4x5.py
puis rendre avec
    npx hyperframes render -c feed-4x5.html --output renders/cave71-feed-4x5.mp4

Le 4:5 est un recadrage centré du 9:16 : la scène garde ses coordonnées 1920 px et
est remontée de 285 px, la fenêtre visible couvre donc y 285 -> 1635 du 9:16. Les
éléments qui en sortent, ou qui passent sous la mention légale, sont repositionnés
plus bas (coordonnées du 9:16, mesurées sur la mise en page).
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OFFSET = 285  # (1920 - 1350) / 2

FEED_CSS = f"""
      /* ===== format 4:5 (généré par scripts/make-feed-4x5.py) ===== */
      html,
      body {{
        height: 1350px;
      }}
      /* le runtime pose la taille déclarée (1350) en style inline sur la racine :
         la scène doit garder ses 1920 px, d'où les !important */
      #root {{
        position: absolute !important;
        top: -{OFFSET}px !important;
        left: 0 !important;
        width: 1080px !important;
        height: 1920px !important;
      }}
      /* bandes cinéma et mention légale ramenées dans la fenêtre visible */
      #lb-top {{ top: {OFFSET}px; height: 110px; }}
      #lb-bot {{ bottom: {OFFSET}px; height: 110px; }}
      #legal {{ bottom: {OFFSET}px; height: 110px; padding-bottom: 22px; font-size: 19px; }}
      /* éléments hors cadre ou sous la mention légale */
      #s2-t1 {{ top: 400px; }}                     /* 270 : sous la bande du haut ; 400 la garde au-dessus de la photo */
      #s6-logo {{ top: 330px; }}                   /* 220 : coupé en haut */
      #s3a-sub, #s3b-sub {{ top: 1430px; }}        /* 1524 : sous la mention légale */
      #s5-st4, #s5-st5 {{ top: 1270px !important; }} /* 1340 (style inline) : sous la mention légale */
"""

src = (ROOT / "index.html").read_text()

def swap(text, old, new):
    assert text.count(old) == 1, f"motif introuvable ou ambigu : {old!r}"
    return text.replace(old, new)

out = swap(src, "<!doctype html>", "<!doctype html>\n<!-- GÉNÉRÉ par scripts/make-feed-4x5.py depuis index.html : ne pas modifier à la main. -->")
out = swap(out, "    </style>\n  </head>", FEED_CSS + "    </style>\n  </head>")
out = swap(out, 'data-composition-id="main" data-start="0" data-duration="32" data-width="1080" data-height="1920"',
                'data-composition-id="main" data-start="0" data-duration="32" data-width="1080" data-height="1350"')
(ROOT / "feed-4x5.html").write_text(out)
print("feed-4x5.html écrit")
