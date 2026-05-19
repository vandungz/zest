// Reusable Badge — category tag trên ProductCard
function Badge({ children, className = '' }) {
  return (
    <span className={`
      inline-block
      text-[10px] font-semibold tracking-[0.15em] uppercase
      text-[var(--color-text-secondary)]
      truncate max-w-full
      ${className}
    `}>
      {children}
    </span>
  )
}

export default Badge