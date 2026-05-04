export function SectionDivider({label}: {label: string}) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className="text-xs uppercase tracking-widest text-primary shrink-0 font-sans">
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-primary/60 to-transparent" />
    </div>
  );
}