import { useEffect, useState } from "react"

export type VisualViewportRect = {
  height: number
  offsetTop: number
  width: number
  offsetLeft: number
}

/**
 * Returns the visual viewport size and offset. Updates when the keyboard opens/closes
 * on mobile, so the chat can be positioned and sized to stay in the visible area.
 */
export function useVisualViewportHeight(): VisualViewportRect | null {
  const [rect, setRect] = useState<VisualViewportRect | null>(null)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const update = () =>
      setRect({
        height: vv.height,
        offsetTop: vv.offsetTop,
        width: vv.width,
        offsetLeft: vv.offsetLeft,
      })
    update()
    vv.addEventListener("resize", update)
    vv.addEventListener("scroll", update)
    return () => {
      vv.removeEventListener("resize", update)
      vv.removeEventListener("scroll", update)
    }
  }, [])

  return rect
}
