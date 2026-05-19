function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) {
  const sizes = {
    sm:   'px-3 py-1.5 text-xs',
    md:   'px-4 py-3   text-xs',
    lg:   'px-6 py-3.5 text-sm',
    icon: 'p-2',
  }

  // Map variant → global CSS class từ index.css
  const variantClass = {
    primary:   'btn-primary',
    outline:   'btn-outline',
    secondary: 'btn-secondary',
    ghost:     'btn-ghost',
    danger:    'btn-danger',
    accent:    'btn-primary', // accent dùng chung primary style
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        font-semibold tracking-wide
        ${variantClass[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button