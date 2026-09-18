/**
 * Inline SVG icon set. Everything is stroked in `currentColor` so icons take
 * their colour from the brand tokens on the element around them — no new
 * colours are introduced, and nothing is fetched from a third party.
 */

type Props = { className?: string; size?: number }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
})

export function IconRetirement({ size = 24, className }: Props) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 20h18" />
      <path d="M5 20v-6a7 7 0 0 1 14 0v6" />
      <path d="M12 7V3" />
      <path d="M8.5 8.5 6 6" />
      <path d="m15.5 8.5 2.5-2.5" />
    </svg>
  )
}

export function IconInvestment({ size = 24, className }: Props) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 3v18h18" />
      <path d="m7 14 3.5-4 3 2.5L20 6" />
      <path d="M20 10V6h-4" />
    </svg>
  )
}

export function IconInsurance({ size = 24, className }: Props) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3 4.5 6v5.5c0 4.5 3.1 8.2 7.5 9.5 4.4-1.3 7.5-5 7.5-9.5V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export function IconSmsf({ size = 24, className }: Props) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 10 12 4l9 6" />
      <path d="M5 10v9h14v-9" />
      <path d="M9.5 19v-5h5v5" />
    </svg>
  )
}

export function IconEstate({ size = 24, className }: Props) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9.5 12.5h5" />
      <path d="M9.5 16h3" />
    </svg>
  )
}

export function IconAgedCare({ size = 24, className }: Props) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 20.5s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11.5c0 4.6-7 9-7 9z" />
    </svg>
  )
}

export function IconDocument({ size = 20, className }: Props) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3v11" />
      <path d="m8 11 4 4 4-4" />
      <path d="M5 18v2h14v-2" />
    </svg>
  )
}

export function IconArrow({ size = 14, className }: Props) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

export function IconChevronDown({ size = 16, className }: Props) {
  return (
    <svg {...base(size)} className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function IconArrowUp({ size = 18, className }: Props) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </svg>
  )
}

export function IconCheck({ size = 16, className }: Props) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 12.5 9 17.5 20 6.5" />
    </svg>
  )
}

export function IconAlert({ size = 18, className }: Props) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.2h.01" />
    </svg>
  )
}

export function IconClock({ size = 20, className }: Props) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.2 1.9" />
    </svg>
  )
}

/** Service id to icon. Falls back to the document mark for anything new. */
export const serviceIcons: Record<string, (p: Props) => React.JSX.Element> = {
  retirement: IconRetirement,
  investment: IconInvestment,
  insurance: IconInsurance,
  smsf: IconSmsf,
  'estate-planning': IconEstate,
  'aged-care': IconAgedCare,
}
