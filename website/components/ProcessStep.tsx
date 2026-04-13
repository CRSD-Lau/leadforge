interface ProcessStepProps {
  dayLabel: string
  title: string
  description: string
  details?: string[]
  isLast?: boolean
}

export default function ProcessStep({
  dayLabel,
  title,
  description,
  details,
  isLast = false,
}: ProcessStepProps) {
  return (
    <div className="flex gap-6 sm:gap-10">
      {/* Timeline column */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-16 h-16 bg-brand-dark border border-brand-gold/30 flex items-center justify-center flex-shrink-0">
          <span className="font-mono text-xs text-brand-gold font-semibold tracking-wide text-center leading-tight px-1">
            {dayLabel}
          </span>
        </div>
        {!isLast && (
          <div className="w-px flex-1 mt-2 bg-gradient-to-b from-brand-gold/40 to-transparent min-h-[3rem]" />
        )}
      </div>

      {/* Content */}
      <div className={`pb-10 ${isLast ? '' : ''}`}>
        <h3 className="font-serif text-2xl font-medium text-brand-dark mb-2">{title}</h3>
        <p className="font-sans text-sm text-neutral-600 leading-relaxed mb-3">{description}</p>
        {details && details.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-brand-gold flex-shrink-0" />
                <span className="font-sans text-sm text-neutral-500">{detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
