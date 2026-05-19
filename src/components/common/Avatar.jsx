// Reusable Avatar — hiện initials từ displayName
function Avatar({ name, size = 'md', className = '' }) {
  const initial = name
    ? name.charAt(0).toUpperCase()
    : '?'

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  }

  return (
    <div className={`
      rounded-full flex-shrink-0
      bg-[var(--color-accent)]
      text-black font-bold
      flex items-center justify-center
      ${sizes[size]}
      ${className}
    `}>
      {initial}
    </div>
  )
}

export default Avatar