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
Voix : **Lucie — Sensuelle, Intime, Narration** (`LAUUUZAQpu1khF4zl6Vl`), modèle `eleven_v4`, 1 prise par ligne.
Fichiers : `assets/audio/vo1.mp3` … `vo6.mp3`, posés sur la piste 9, groupe `voiceover`.

| id | début | durée | texte |
|----|-------|-------|-------|
| vo1 | 0,9 s | 2,78 s | Il y a des soirs… qui méritent mieux. |
| vo2 | 5,0 s | 3,17 s | Un bouchon qui saute… et le temps s'arrête. (« s'arrête » ≈ 8,1 s) |
| vo3 | 9,4 s | 5,73 s | Des vins choisis un à un. Des spiritueux de caractère. Pour chaque célébration. |
| vo4 | 15,6 s | 5,73 s | Du dix-neuf septembre au vingt-quatre octobre, Cave soixante-et-onze ouvre le coin des bonnes affaires. |
| vo5 | 22,25 s | 2,05 s | Jusqu'à moins cinquante pour cent. (« cinquante » sur l'impact à 23,0 s) |
| vo6 | 26,0 s | 5,26 s | Cave soixante-et-onze. Soixante-et-onze, avenue de la Libération, à Rezé. |

Écarts avec le plan initial, assumés :
- **vo2 resserrée.** La copy d'origine (« Un bouchon qui saute. Un verre qui se remplit… et le temps s'arrête. ») durait 4,8 s pour une fenêtre image de 3,0 s (5,0 → 8,0) : « s'arrête » serait tombé à 9,8 s, bien après le figé. Le versement à 6,3 s porte déjà l'image du verre.
- **vo5 décalée** de 21,4 → 22,25 s pour que « cinquante » tombe sur l'impact à 23,0 s, comme demandé.
- **« Cave 71 » écrit « Cave soixante-et-onze »** dans le prompt TTS, sinon le modèle lit le nombre de travers.

## Mixage — voiceover carve (et non un duck de volume)
Le lit `#music` porte `data-fx-carve` (`sources: ["voiceover"]`, `strength: 0.8`) : 6 bandes creusées de 250 Hz à 2,5 kHz (−7,4 dB, −14,8 dB à 1,6 kHz) plus un étage de gain piloté par une enveloppe de 205 points, plancher −19,2 dB. Le creux suit la voix : la musique revient pleine entre les lignes au lieu de rester écrasée pendant 32 s, ce qu'aurait fait le duck 0,9 → 0,3 prévu au départ.
Re-carver : `node .claude/skills/hyperframes-audio/scripts/carve.mjs --comp index.html` — ça remplace le carve et laisse intacts les effets ou lanes posés à la main. `sources` pointe le **groupe**, donc une 7ᵉ ligne VO ajoutée plus tard est couverte sans retoucher l'attribut.

## Audio en place
Musique originale générée (numpy) : piano + battement de cœur, silence « le temps s'arrête » à 8,0 s, montage 120 bpm, révélation 15,3 s, riser, impact à 23,0 s, résolution.
Bruitages : bouchon (5,0 s), versement (6,3 s), whoosh, impacts, sparkle.
