---
workflow: general-video
flow: automation
storyboard: no
format: 1080x1920 (9:16)
duration: 32s
---
# Cave 71 — « Le temps s'arrête » (v2)

Pub verticale Insta/TikTok. Promo « Le coin des bonnes affaires », du 19 septembre au 24 octobre 2026, jusqu'à -50 % sur une sélection.
Mention Loi Évin visible en permanence.

## Voix off — EN PLACE (ElevenLabs)
Voix : **Clémence — Advertising** (`LFo5X4P9PhYaOLBA9Hyh`), modèle `eleven_v4`.
Direction de jeu : **`[warmly] [happy]`** sur chaque ligne, et **virgule au lieu des points de suspension**.

Pourquoi la virgule : la première version sonnait érotique, et ce n'était pas la voix mais la ponctuation. « Il y a des soirs… qui méritent mieux » impose une pause suspendue au milieu d'une phrase confidentielle, que le modèle joue en souffle. La virgule enlève la suspension, les balises `[warmly] [happy]` ramènent le sourire.

| id | début | durée | texte envoyé au modèle |
|----|-------|-------|------------------------|
| vo1 | 0,9 s | 2,44 s | `[warmly] [happy] Il y a des soirs, qui méritent mieux.` |
| vo2 | 5,65 s | 2,86 s | `[warmly] [happy] Un bouchon qui saute, et le temps s'arrête.` |
| vo3 | 9,4 s | 5,42 s | `[warmly] [happy] Des vins choisis un à un. Des spiritueux de caractère. Pour chaque célébration.` |
| vo4 | 15,6 s | 5,50 s | `[warmly] [happy] Du dix-neuf septembre au vingt-quatre octobre, Cave soixante-et-onze ouvre le coin des bonnes affaires.` |
| vo5 | 22,3 s | 2,29 s | `[warmly] [happy] Jusqu'à moins cinquante pour cent.` |
| vo6 | 26,0 s | 4,85 s | `[warmly] [happy] Cave soixante-et-onze. Soixante-et-onze, avenue de la Libération, à Rezé.` |

Calages : « s'arrête » finit à 8,3 s, pile quand le mot s'affiche (8,35 s) ; « cinquante » sur l'impact à 23,0 s ; vo6 finit à 30,85 s, juste avant le fondu de 30,9 s.
`vo1.mp3` est **la prise exacte validée à l'écoute** (audition D3), recopiée telle quelle plutôt que regénérée : une nouvelle génération aurait donné une prise différente de celle qui a été approuvée.
« Cave 71 » est écrit « Cave soixante-et-onze », sinon le modèle lit le nombre de travers.

Voix écartées à l'écoute : Lucie (trop sensuelle — mon premier choix, mauvais), Manon et Atma (trop monotones). Les prises Lucie sont conservées dans `assets/audio/raw/lucie/`, les auditions dans `renders/auditions/`.

### Recalage voix ↔ image (relecture du 15/10)
Mesuré sur les silences de chaque prise, pas à l'oreille :
- **vo2** démarrait à 5,2 s : « et le temps s'arrête » était fini à 7,87 s, avant même que le texte apparaisse (8,0 / 8,35 s). Décalé à **5,65 s**. Le bouchon (5,0 s) part maintenant juste avant « Un bouchon qui saute ».
- **S3c** : « Pour chaque célébration » est dit à 13,44 s mais le titre n'arrivait qu'à 14,0 s. Titre avancé à **13,45 s**.
- **S4** : la voix dit les **dates d'abord** (15,8 → 18,05 s) puis « Cave 71 ouvre le coin des bonnes affaires » (18,2 → 20,9 s), alors que l'écran montrait l'inverse (titre 17,7 s, dates 19,0 s) : chaque info s'affichait pendant que la voix disait l'autre. L'ordre de l'image suit maintenant la voix : logo monte à 16,6 s, cartouche dates à **17,0 s**, « LE COIN DES BONNES AFFAIRES » à **18,9 → 19,25 s**.
  La solution propre aurait été de regénérer vo4 dans l'ordre de l'image, mais ElevenLabs refuse toute génération depuis cette session (« Free Tier access has been disabled »).
- Le carve a été rejoué après le déplacement de vo2.

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

