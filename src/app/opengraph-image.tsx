import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Vignette de partage (WhatsApp, Instagram, LinkedIn, Google).
 *
 * Sans elle, un lien partagé s'affiche en texte nu — le premier contact
 * avec la marque se joue souvent là. On la compose ici plutôt que de
 * l'exporter à la main : elle reste alignée sur les couleurs du site et
 * sur la vraie photo de la bouteille.
 *
 * 1200 × 630 est le format attendu par les principaux réseaux ; en
 * dessous de 600 px de large, certains refusent d'afficher un aperçu.
 */

export const alt =
  "Elisira — liqueur de mandarines siciliennes, élaborée à Genève";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  /* La photo est lue depuis le disque et intégrée en base64 : le
     générateur n'a pas accès au serveur HTTP pendant le build. */
  let bouteille: string | null = null;
  try {
    const fichier = await readFile(
      join(process.cwd(), "public/images/bouteille-hero.png")
    );
    bouteille = `data:image/png;base64,${fichier.toString("base64")}`;
  } catch {
    /* Image absente : on garde la composition typographique seule. */
  }

  /* Le serif du site. Sans lui, le générateur retombe sur un sans-serif
     générique et la vignette ne ressemble plus à la marque. */
  let cormorant: Buffer | null = null;
  try {
    cormorant = await readFile(join(process.cwd(), "src/app/_og/cormorant-400.ttf"));
  } catch {
    /* Police absente : composition lisible malgré tout. */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f4ece0",
          position: "relative",
        }}
      >
        {/* Halo chaud, écho du hero du site */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(217,161,132,0.55) 0%, rgba(244,236,224,0) 70%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 9,
              textTransform: "uppercase",
              color: "#c06843",
              display: "flex",
            }}
          >
            H&H Spirits · Genève
          </div>

          <div
            style={{
              fontSize: 104,
              fontFamily: "Cormorant",
              color: "#2e2620",
              marginTop: 28,
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            Elisira
          </div>

          <div
            style={{
              fontSize: 44,
              fontFamily: "Cormorant",
              color: "#2e2620",
              marginTop: 14,
              lineHeight: 1.25,
              display: "flex",
              maxWidth: 560,
            }}
          >
            Liqueur de mandarines siciliennes
          </div>

          <div
            style={{
              fontSize: 26,
              color: "#6b6157",
              marginTop: 26,
              display: "flex",
            }}
          >
            Recette de famille · 28 % vol. · Mandarines bio
          </div>
        </div>

        {bouteille && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 430,
              paddingRight: 56,
            }}
          >
            {/* `next/image` n'existe pas dans le générateur : ImageResponse
                rend du HTML/CSS autonome, pas une page React. */}
            <img src={bouteille} alt="" height={512} />
          </div>
        )}
      </div>
    ),
    {
      ...size,
      ...(cormorant
        ? {
            fonts: [
              {
                name: "Cormorant",
                data: cormorant as unknown as ArrayBuffer,
                style: "normal" as const,
                weight: 400 as const,
              },
            ],
          }
        : {}),
    }
  );
}
