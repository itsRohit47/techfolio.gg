function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={`dark:bg-secondary bg-gray-50 border border-gray-100 px-3 py-1 text-sm rounded-sm ${className}`}>
      {children}
    </div>
  )
}

export { Badge }
