export const isMobile = () => window.location.href.includes("/mobile/")

export const waitDOMContentLoaded = () => {
    return new Promise((resolve) => {
        switch (document.readyState) {
            case "interactive":
            case "complete": {
                resolve(null)
                break
            }
            default: {
                window.addEventListener("DOMContentLoaded", () => resolve(null))
                break
            }
        }
    })
}

export const waitForSelector = (selector: string) => {
    return new Promise((resolve) => {
        const i = setInterval(() => {
            if (document.querySelectorAll(selector).length > 0) {
                clearInterval(i)
                resolve(null)
            }
        }, 300)
    })
}

export const wait = (ms: number) => {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms))
}
