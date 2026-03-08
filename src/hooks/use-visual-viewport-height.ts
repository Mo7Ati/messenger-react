import { useEffect, useState } from "react"

/**
 * Returns the visual viewport height in px. Updates when the keyboard opens/closes
 * on mobile, so the chat container can be constrained to the visible area.
 */
export function useVisualViewportHeight(): number | null {
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const update = () => setHeight(vv.height)
    update()
    vv.addEventListener("resize", update)
    vv.addEventListener("scroll", update)
    return () => {
      vv.removeEventListener("resize", update)
      vv.removeEventListener("scroll", update)
    }
  }, [])

  return height
}
