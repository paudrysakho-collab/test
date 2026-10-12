---
workflow: general-video
flow: automation
storyboard: no
format: 1080x1920 (9:16)
duration: 30s
---
# Cave 71 — « Victime de son succès : Prolongation des Bonnes Affaires »

Pub verticale premium, ambiance « vente VIP ». Fond bordeaux très sombre, particules dorées et confettis, action centrée avec safe zones pour recadrage multi-formats.

## Voix off — ElevenLabs
Voix : **David** (`7gKHR5GQwrXVcP4EfKew`), modèle `eleven_v4`, la seule du workspace décrite explicitement comme « voix grave », registre bande-annonce. Dirigée `[excited]` sur les quatre premiers segments et `[warmly]` sur la signature.

**Correction phonétique appliquée comme demandé** : « CAVE 71 » est toujours écrit `Kav soixante-et-onze` dans le générateur, jamais « Cave ». Le numéro de rue est également écrit en lettres (`soixante-et-onze avenue`), sinon le modèle lit le nombre de travers.

| id | début | durée | texte envoyé au modèle |
|----|-------|-------|------------------------|
| vo1 | 0,9 s | 1,84 s | `[excited] Victime de son succès !` |
| vo2 | 3,2 s | 4,00 s | `[excited] Le coin des bonnes affaires de la Kav soixante-et-onze... EST PROLONGÉ !` |
| vo3 | 8,2 s | 7,12 s | `[excited] Vins, champagnes, spiritueux et épicerie fine... Profitez de réductions incroyables allant jusqu'à moins cinquante pourcents !` |
| vo4 | 16,4 s | 8,08 s | `[excited] Dépêchez-vous, vous avez jusqu'au 17 octobre pour saisir votre dernière chance. Rendez-vous au soixante-et-onze avenue de la Libération, à Rezé !` |
| vo5 | 25,4 s | 3,28 s | `[warmly] Kav soixante-et-onze... l'excellence à prix doux.` |

**Les parenthèses du script sont des indications de jeu, pas du texte.** `(Pause courte)`, `(Beat musical)` et `(Rythme rapide)` ont été retirées du prompt — envoyées telles quelles, la voix aurait prononcé « Pause courte ». Elles sont traduites en silences : 0,4 s après vo1, 0,95 s avant vo3 (le beat musical), 1,0 s avant vo4.

Chaque ligne est normalisée à −18 LUFS / −1,5 dBTP. Originaux ElevenLabs intacts dans `assets/audio/raw/`.

## Musique
**Le connecteur ElevenLabs de cette session est la version restreinte : il ne génère ni image, ni vidéo, ni musique.** La piste est donc synthétisée (`numpy`), 30 s à 125 BPM : kick four-on-the-floor, claps sur 2 et 4, hats contretemps, basse sub en contretemps, nappe d'accords Am–F–C–G filtrée, plus deux risers et deux impacts calés sur 14,4 s (révélation −50 %) et 24,0 s (fin de l'adresse).
Le script est conservé : `scripts/music.py`. Pour une vraie piste électro-house produite, ajouter le connecteur ElevenLabs complet (`https://api.elevenlabs.io/v1/mcp`).

Le lit est carvé contre le groupe `voiceover` (`data-fx-carve`, strength 0.8, 6 bandes, enveloppe 165 points) plutôt que simplement ducké.

## Direction artistique
- **Safe zones** : `--safe-top: 300px` / `--safe-bottom: 380px`. Toute l'action vit dans `.stage`, entre les deux. Le fond, les particules et les confettis couvrent le cadre entier, donc un recadrage 1:1 ou 4:5 ne coupe aucun texte.
- **S1 (0→3,2 s)** « VICTIME DE SON SUCCÈS ! » en rouge vif, pop à l'échelle depuis un flou, micro-secousse déterministe sur le point d'exclamation.
- **S2 (3,1→8,1 s)** « PROLONGÉ » en or massif 3D : extrusion par pile de 15 ombres bronze dégradées, face avant en dégradé or, et un reflet qui traverse les glyphes.
- **S3 (8,0→13,1 s)** montage produits plein cadre, pan & zoom, voile sombre dégradé pour détacher les titres. **Aucun effet polaroïd** — fondus rapides et glissements, comme demandé.
- **S4 (12,9→16,4 s)** les remises. Le sac kraft **détouré** est au premier plan, en lévitation lente. Compteur −10 % → −50 % qui atterrit sur l'impact basse à 14,4 s, puis les pastilles −20/−30/−50 éclosent sur ce même impact.
- **S5 (16,3→24,9 s)** urgence, date, adresse.
- **S6 (24,8→30 s)** logo et signature.

## Détourage du sac kraft
`hyperframes remove-background` est câblé sur `u2net_human_seg` — un modèle de **segmentation humaine**, sans option de modèle. Appliqué à une photo de sacs il n'a rendu qu'un fantôme inutilisable.
Contourné en récupérant le modèle générique `u2net` et en l'exécutant via `onnxruntime` (déjà présent) : `scripts/cutout.py`. Résultat propre — les deux sacs, les poignées en corde, l'étiquette et le prix sont détachés du fond.

## Contrôle qualité
Frames capturées avec `hyperframes snapshot` puis **inspectées visuellement**. Trois défauts corrigés que la mesure seule n'aurait pas vus :
1. **Le reflet de « PROLONGÉ » laissait un rectangle gris.** C'était une div en `mix-blend-mode: screen` posée par-dessus le texte. Remplacée par un troisième calque de texte dont le dégradé est découpé par `background-clip: text` : le reflet ne vit plus que dans les glyphes.
2. **Les pastilles chevauchaient le sac kraft.** Plan réorganisé : nombre en haut, sac au centre, pastilles en rangée en bas.
3. **Contraste des pastilles à 2,96:1 (seuil 3:1).** Un test diagnostic (texte noir sur pastille blanche, warning disparu) a confirmé que le checker mesurait bien le texte sur la pastille et qu'il avait raison : le dégradé radial est nettement plus sombre sur les bords, là où tombent les glyphes. Dégradé éclairci. **Ce n'était pas un faux positif.**

`hyperframes check` : 0 erreur, 0 warning de layout, de contraste et de média. Les 12 warnings restants suggèrent de découper les scènes en sous-compositions — confort d'édition, pas un défaut.

## Écart avec le brief, à valider
Le script annonce « jusqu'au **17 octobre** » alors que le projet `cave71-pub-v2` annonce la promo **du 19 septembre au 24 octobre 2026**. Livré avec le 17 octobre comme demandé, mais les deux dates ne peuvent pas être vraies ensemble, et une « prolongation » qui raccourcit la période serait contradictoire.
