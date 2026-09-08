'use client'

export default function Footer() {
  return (
    <div className="w-full text-midnight/70 dark:text-white/70 text-xs flex flex-col gap-3">

      {/* Copyright */}
      <div className="flex flex-col gap-2 pt-1">
        <p className="text-[10px] text-midnight/80 dark:text-white/60 mt-0.5">
          © {new Date().getFullYear()} doba
        </p>
      </div>
    </div>
  )
}
