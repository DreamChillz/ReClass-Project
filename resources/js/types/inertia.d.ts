// resources/js/inertia.d.ts
import '@inertiajs/inertia-react'

declare module '@inertiajs/inertia-react' {
  interface PageProps {
    flash: {
      success?: string
      error?: string
    }
  }
}
