import type { AnchorHTMLAttributes, PropsWithChildren } from 'react'

type ButtonProps = PropsWithChildren<
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: 'primary' | 'secondary'
  }
>

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  return <a className={`button button--${variant} ${className}`.trim()} {...props}>{children}</a>
}
