function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={`bg-gray-100 border border-gray-200 px-2 py-1 text-xs rounded-sm ${className}`}>
      {children}
    </div>
  )
}

export { Badge }
