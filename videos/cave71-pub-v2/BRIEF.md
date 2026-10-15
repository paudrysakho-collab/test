---
workflow: general-video
flow: automation
storyboard: no
format: 1080x1920 (9:16)
duration: 32s
---
# Cave 71 — « Le temps s'arrête » (v2)

Pub verticale Insta/TikTok, postée le vendredi et le samedi du dernier week-end de la promo « Le coin des bonnes affaires », jusqu'à -50 % sur une sélection.
**Aucune date affichée ni dite** (demande client du 15/10) : le message est « dernier week-end pour profiter du coin des bonnes affaires ». Les anciennes dates (19/09 → 24/10) ont été retirées de S4, de S6 et de la voix.
Mention Loi Évin visible en permanence.

## Voix off — Google Gemini, voix **Gacrux** (choisie par le client à l'audition)
Remplace Clémence (ElevenLabs), dont le compte refuse désormais toute génération. Prises Clémence conservées dans `assets/audio/raw/elevenlabs-clemence/`.

| id | début | durée | texte | modèle |
|----|-------|-------|-------|--------|
| vo1 | 0,9 s | 2,61 s | Il y a des soirs, qui méritent mieux. | gemini-3.8-flash-tts (la prise exacte de l'audition) |
| vo2 | 5,4 s | 3,34 s | Un bouchon qui saute, et le temps s'arrête. | gemini-3.8-flash-tts |
| vo3 | 9,25 s | 5,80 s | Des vins choisis un à un. Des spiritueux de caractère. Pour chaque célébration. | gemini-3.8-flash-tts |
| vo4 | 16,4 s | 4,23 s | Dernier week-end, pour profiter du coin des bonnes affaires. | gemini-3.1-flash-tts-preview |
| vo5 | 21,45 s | 2,69 s | Jusqu'à moins cinquante pour cent. | gemini-3.1-flash-tts-preview |
| vo6 | 25,75 s | 5,67 s | Cave soixante-et-onze. Soixante-et-onze, avenue de la Libération, à Rezé. | gemini-3.1-flash-tts-preview |

Consigne envoyée avant chaque texte : `Say warmly and with a smile, in French, like an elegant premium wine shop commercial:`.

Pièges Gemini, à refaire à chaque nouvelle prise :
- **gemini-3.8-flash-tts lit la consigne à voix haute** au lieu de l'appliquer (le ton est quand même joué sur la phrase). La consigne est coupée au silence qui précède le premier mot. gemini-3.1 l'applique sans la lire.
- **Chaque prise finit par ~0,2 s de grésillement** (« télé qui bug »), pic vers −12 dB au-dessus de 6 kHz, juste après le dernier silence. Coupé au début de ce silence + fondu de 80 ms.
- Quota gratuit : 3 requêtes/minute et **10 par jour et par modèle**, d'où le mélange 3.8 / 3.1 (même voix, validé à l'oreille par le client).
- Gacrux parle plus lentement que Clémence : dans vo3, les deux pauses entre les phrases ont été raccourcies (−0,25 s et −0,20 s) plutôt que d'accélérer la voix, pour finir avant l'impact du logo à 15,3 s.

Calages : « s'arrête » finit vers 8,35 s avec le mot à l'écran ; « Pour chaque célébration » démarre à 13,57 s, titre à 13,55 s ; « Dernier week-end » tombe sur le cartouche (16,9 s), « le coin des bonnes affaires » sur le titre (18,9 → 19,25 s) ; « cinquante » sur l'impact à 23,0 s.
Le carve a été rejoué sur les voix Gacrux.

## Niveaux voix — normalisation
Les fichiers ElevenLabs sortent très bas (−24 à −29 LUFS) face à une musique à −13,8 LUFS : sans correction la voix passe **sous** le lit. Chaque ligne est renormalisée à −18 LUFS / −1,5 dBTP (gain plat + limiteur true-peak là où le pic ne laisse pas la marge). Originaux intacts dans `assets/audio/raw/`.
Le carve est rejoué **après** la normalisation : son analyse doit mesurer la voix définitive.

## Mixage — voiceover carve (et non un duck de volume)
Le lit `#music` porte `data-fx-carve` (`sources: ["voiceover"]`, `strength: 0.8`) : 6 bandes creusées de 250 Hz à 2,5 kHz (−7,4 dB, −14,8 dB à 1,6 kHz) plus un étage de gain piloté par une enveloppe de 205 points, plancher −19,2 dB. Le creux suit la voix : la musique revient pleine entre les lignes au lieu de rester écrasée pendant 32 s, ce qu'aurait fait le duck 0,9 → 0,3 prévu au départ.
Re-carver : `node .claude/skills/hyperframes-audio/scripts/carve.mjs --comp index.html` — ça remplace le carve et laisse intacts les effets ou lanes posés à la main. `sources` pointe le **groupe**, donc une 7ᵉ ligne VO ajoutée plus tard est couverte sans retoucher l'attribut.

## Audio en place
Musique originale générée (numpy) : piano + battement de cœur, silence « le temps s'arrête » à 8,0 s, montage 120 bpm, révélation 15,3 s, riser, impact à 23,0 s, résolution.
Bruitages : bouchon (5,0 s), versement (6,3 s), whoosh, impacts, sparkle.

## Redesign — « Lumière & matière »
Direction choisie par le client parmi trois. Elle repose sur des **composants** du registre (pas des blocks) : les blocks sont tous écrits en 1920×1080 et il aurait fallu les réécrire en portrait, là où les composants s'adaptent nativement au 9:16.

**Passe de lumière** (technique de `light-sweep-pass`, collée dans la composition plutôt qu'imbriquée : le composant est bâti autour d'un slot où l'on reconstruit sa scène, ce qui aurait demandé de démonter les 6 scènes). Une seule propriété `--light-x` pilote tout, écrite dans `onUpdate` depuis un proxy numérique — jamais tweenée comme chaîne `var()`, donc déterministe et seek-safe. Pics : S1 0,42 / S4 0,16 / S6 0,20.

**Gloss spéculaire** sur les trois cartes de S3c, calé sur leur pose.

### Ce que l'inspection visuelle a corrigé
Les frames ont été capturées avec `hyperframes snapshot` et **regardées**, pas seulement mesurées. Quatre défauts que la mesure seule n'aurait pas trouvés :

1. **Première passe de lumière trop forte.** En `mix-blend-mode: screen` sur une scène déjà claire, elle relevait les noirs et lisait comme du brouillard laiteux. Dégradé resserré (44→56 % au lieu de 36→64 %) pour qu'elle lise comme un reflet, pics S4 et S6 divisés par ~2,5.
2. **`#leak-host` noyait S4.** Le light-leak du registre monte à 0,9 d'opacité en screen sur 14,9→18,9 s, pile sur la façade : le plan était un voile orange illisible. Tempéré à 0,3 **depuis l'hôte**, sans toucher au block du registre (pic effectif 0,27).
3. **L'écran affichait « jusqu'à -0% ».** Le compteur utilisait `power3.in`, qui stagne près de zéro au départ. Passé en linéaire : il lit −10 % → −27 % → −50 % et atterrit toujours pile sur l'impact à 23,0 s. La dramaturgie vient du punch d'échelle, du shake et du flash, pas de l'ease.
4. **Pastilles de remise en vert/jaune/bleu/rouge/rose** — registre catalogue discount, à l'opposé du brief. Restylées en échelle bordeaux → or : plus la remise est forte, plus la pastille est lumineuse, donc l'œil monte vers le −50 %.

### Contraste `#s5-up` : warning assumé
`check` signale 1,11:1 à 23,111 s et suggère `rgb(107,82,29)`. **Suivre cette suggestion dégraderait le plan.** L'or `#d9a63a` sur le bordeaux `#5c1424` est déjà à ~6:1 ; le 1,11:1 est mesuré pendant `#flash-host` (22,42→23,42 s), qui lave la frame à 0,92 d'opacité pendant ~0,2 s. L'or suggéré, plus sombre, tomberait à ~1,9:1 sur le bordeaux pendant les 4 s où le texte est réellement lu. Corrigé à la place par un **halo sombre** (`text-shadow`), qui aide l'œil sur le bordeaux comme à travers le flash. Le checker ne lit que la couleur, pas l'ombre portée, donc le warning reste — sciemment.

### Écartés
- `product-turntable` (la bouteille qui tourne sur socle studio) : demande un modèle 3D GLB, on n'a que des JPG.
- `svg-mask-reveal` : demande un wordmark SVG, le logo est un PNG.
- `camera-shake` : les plans concernés ont déjà des tweens GSAP sur `x`/`scale` ; ajouter une transform dessus serait entré en conflit. À faire via un wrapper si on y revient.
- `number-wheel`, `shimmer-sweep`, `grain-field`, `focus-blur-resolve`, `push-in` : la composition réimplémentait déjà ces effets à la main (compteur, shimmer par `backgroundPosition`, grain, flous de révélation). Les remplacer aurait été du bruit sans gain.

