/**
 * Server Component: Injects FAQPage JSON-LD for SEO
 * Pass concise question/answer pairs that mirror on-page FAQ content.
 */
export default function FaqJsonLd({
  items = [],
}: {
  items?: { question: string; answer: string }[]
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      // Safe because we fully control the JSON serialization here
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
