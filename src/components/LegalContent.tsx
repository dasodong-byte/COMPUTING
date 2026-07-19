export function LegalContent({
  sections,
}: {
  sections: { heading: string; body: string }[];
}) {
  return (
    <section className="container-cs section max-w-3xl">
      <div className="space-y-8">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-lg font-bold text-navy-800">{s.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
