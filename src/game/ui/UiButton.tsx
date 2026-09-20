import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type UiButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  tone?: 'primary' | 'secondary' | 'quiet'
}

export function UiButton({ children, tone = 'primary', className = '', ...props }: UiButtonProps) {
  return <button className={`ui-button ui-button--${tone} ${className}`} {...props}>{children}</button>
}
