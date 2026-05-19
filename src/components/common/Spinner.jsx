// Reusable Spinner — loading state toàn trang
function Spinner({ message = 'Loading...' }) {
  return (
    <div className="
      min-h-screen flex flex-col items-center justify-center gap-4
      bg-[var(--color-bg-primary)]
    ">
      <div className="
        w-10 h-10 rounded-full
        border-2 border-[var(--color-border)]
        border-t-[var(--color-text-primary)]
        animate-spin
      "/>
      <p className="text-sm text-[var(--color-text-secondary)]">
        {message}
      </p>
    </div>
  )
}

export default Spinner