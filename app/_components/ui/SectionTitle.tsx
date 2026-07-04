interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionTitle({ title, subtitle, centered = false }: SectionTitleProps) {
  return (
    <div className={`mb-10 ${centered ? "text-center" : ""}`}>
      <h2 className="text-3xl font-bold text-pgd-gray mb-3">{title}</h2>
      {subtitle && (
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div className={`mt-3 h-1 w-16 bg-pgd-red rounded ${centered ? "mx-auto" : ""}`} />
    </div>
  );
}
