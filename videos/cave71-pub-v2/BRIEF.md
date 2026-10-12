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
| vo2 | 5,2 s | 2,86 s | `[warmly] [happy] Un bouchon qui saute, et le temps s'arrête.` |
| vo3 | 9,4 s | 5,42 s | `[warmly] [happy] Des vins choisis un à un. Des spiritueux de caractère. Pour chaque célébration.` |
| vo4 | 15,6 s | 5,50 s | `[warmly] [happy] Du dix-neuf septembre au vingt-quatre octobre, Cave soixante-et-onze ouvre le coin des bonnes affaires.` |
| vo5 | 22,3 s | 2,29 s | `[warmly] [happy] Jusqu'à moins cinquante pour cent.` |
| vo6 | 26,0 s | 4,85 s | `[warmly] [happy] Cave soixante-et-onze. Soixante-et-onze, avenue de la Libération, à Rezé.` |

Calages : « s'arrête » tombe sur le figé à 8,0 s ; « cinquante » sur l'impact à 23,0 s ; vo6 finit à 30,85 s, juste avant le fondu de 30,9 s.
`vo1.mp3` est **la prise exacte validée à l'écoute** (audition D3), recopiée telle quelle plutôt que regénérée : une nouvelle génération aurait donné une prise différente de celle qui a été approuvée.
« Cave 71 » est écrit « Cave soixante-et-onze », sinon le modèle lit le nombre de travers.

Voix écartées à l'écoute : Lucie (trop sensuelle — mon premier choix, mauvais), Manon et Atma (trop monotones). Les prises Lucie sont conservées dans `assets/audio/raw/lucie/`, les auditions dans `renders/auditions/`.

## Niveaux voix — normalisation
Les fichiers ElevenLabs sortent très bas (−24 à −29 LUFS) face à une musique à −13,8 LUFS : sans correction la voix passe **sous** le lit. Chaque ligne est renormalisée à −18 LUFS / −1,5 dBTP (gain plat + limiteur true-peak là où le pic ne laisse pas la marge). Originaux intacts dans `assets/audio/raw/`.
Le carve est rejoué **après** la normalisation : son analyse doit mesurer la voix définitive.

## Mixage — voiceover carve (et non un duck de volume)
Le lit `#music` porte `data-fx-carve` (`sources: ["voiceover"]`, `strength: 0.8`) : 6 bandes creusées de 250 Hz à 2,5 kHz (−7,4 dB, −14,8 dB à 1,6 kHz) plus un étage de gain piloté par une enveloppe de 205 points, plancher −19,2 dB. Le creux suit la voix : la musique revient pleine entre les lignes au lieu de rester écrasée pendant 32 s, ce qu'aurait fait le duck 0,9 → 0,3 prévu au départ.
Re-carver : `node .claude/skills/hyperframes-audio/scripts/carve.mjs --comp index.html` — ça remplace le carve et laisse intacts les effets ou lanes posés à la main. `sources` pointe le **groupe**, donc une 7ᵉ ligne VO ajoutée plus tard est couverte sans retoucher l'attribut.

## Audio en place
Musique originale générée (numpy) : piano + battement de cœur, silence « le temps s'arrête » à 8,0 s, montage 120 bpm, révélation 15,3 s, riser, impact à 23,0 s, résolution.
Bruitages : bouchon (5,0 s), versement (6,3 s), whoosh, impacts, sparkle.
