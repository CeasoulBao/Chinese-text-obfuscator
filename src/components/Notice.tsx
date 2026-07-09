import type { ReactNode } from 'react'

interface NoticeProps {
  tone?: 'info' | 'warning'
  children: ReactNode
}

export function Notice({ tone = 'info', children }: NoticeProps) {
  return (
    <div className={`notice notice--${tone}`} role={tone === 'warning' ? 'alert' : 'note'}>
      {children}
    </div>
  )
}
