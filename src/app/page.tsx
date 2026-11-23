import { productRoutes } from "@/config/products";

export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 760, margin: "64px auto", padding: 24 }}>
      <h1>NUTMED · RD Station → Kommo</h1>
      <p>Integração privada entre RD Station Marketing e Kommo.</p>
      <ul>
        {Object.entries(productRoutes).map(([event, route]) => (
          <li key={event}><strong>{route.product} · {route.source}:</strong> {event}</li>
        ))}
      </ul>
    </main>
  );
}
