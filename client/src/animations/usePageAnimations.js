import { useLayoutEffect } from "react"
import { useLocation } from "react-router-dom"
import { gsap } from "gsap"

function usePageAnimations() {
  const location = useLocation()

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (reduceMotion) {
      return undefined
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".page-shell",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: "power3.out" }
      )

      gsap.fromTo(
        ".reveal-item",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          delay: 0.12,
          ease: "power2.out",
        }
      )

      gsap.fromTo(
        ".recipe-card",
        { autoAlpha: 0, y: 30, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.18,
          ease: "back.out(1.2)",
        }
      )
    })

    return () => context.revert()
  }, [location.pathname])
}

export default usePageAnimations
