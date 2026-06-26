/**
 * SchemaScript — zero-dependency server component.
 * Renders a <script type="application/ld+json"> for any schema object or array.
 * • No 'use client' — pure server render, no hydration cost.
 * • Reference shared entities by @id instead of duplicating inline objects:
 *     { "@id": "https://dattasable.com/#person" }
 *     { "@id": "https://dattasable.com/#organization" }
 *     { "@id": "https://dattasable.com/#website" }
 */
export default function SchemaScript({ schema }: { schema: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
