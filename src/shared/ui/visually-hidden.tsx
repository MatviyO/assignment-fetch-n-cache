import type { JSX, ReactNode } from 'react'

interface VisuallyHiddenProps {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div'
}

/**
 * A component that hides its children visually but keeps them accessible to screen readers and SEO bots.
 */
function VisuallyHidden({ children, as: Component = 'div' }: VisuallyHiddenProps): JSX.Element {
  return (
    <Component
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: '0',
      }}
    >
      {children}
    </Component>
  )
}

export { VisuallyHidden }
