export function SectionDivider({label, as: Tag = 'h2'}: {label: string; as?: 'h2' | 'span'}) {
  return (
    <div className="flex items-center gap-4 mb-10" aria-hidden={Tag === 'span' || undefined}>
      <Tag className="text-xs uppercase tracking-widest text-primary shrink-0 font-sans">
        {label}
      </Tag>
      <div className="flex-1 h-px bg-gradient-to-r from-primary/60 to-transparent" />
    </div>
  );
}
