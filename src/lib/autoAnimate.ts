import type { AutoAnimateOptions, AutoAnimationPlugin } from "@formkit/auto-animate"

export const makeAnimation: (options: Partial<AutoAnimateOptions>) => AutoAnimationPlugin =
    ({ duration = 120, easing = "ease-in-out" }) =>
    (el, action, oldCoords, newCoords) => {
        // eslint-disable-next-line functional/no-let
        let keyframes: Keyframe[] = []
        if (!oldCoords || !newCoords) {
            return new KeyframeEffect(el, keyframes, { duration, easing })
        }
        if (action === "add") {
            keyframes = []
        }
        if (action === "remove") {
            keyframes = []
        }
        if (action === "remain") {
            const deltaX = oldCoords.left - newCoords.left
            const deltaY = oldCoords.top - newCoords.top
            const start = { transform: `translate(${deltaX}px, ${deltaY}px)` }
            const mid = { transform: `translate(${deltaX * 0.5}px, ${deltaY * 0.5}px)` }
            const end = { transform: "translate(0, 0)" }
            keyframes = [start, mid, end]
        }
        return new KeyframeEffect(el, keyframes, { duration, easing })
    }

export const defaultAnimation = makeAnimation({ duration: 120, easing: "ease-in-out" })
