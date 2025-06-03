// DevSnippets data
const snippetsData = [
    {
        "id": "Smooth-Springy-Scrolling",
        "title": "Smooth Springy Scrolling with Lenis.js",
        "description": "Just paste this code in your head tag to implement a buttery-smooth, springy scroll effect using Lenis.js. This creates a natural, inertia-based scrolling animation, giving your webpage a modern and fluid feel. Great for portfolio sites, landing pages, and creative scrolling experiences.",
        "code": `\n<script src="https://unpkg.com/lenis@latest/dist/lenis.min.js"></script>\n<script>\nconst lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });\nfunction raf(time) {\n    lenis.raf(time);\n    requestAnimationFrame(raf);\n}\nrequestAnimationFrame(raf);\n</script>\n`,
        "language": "css",
        "tags": ["css", "animation", "smooth-scroll", "scroll", "html", "lenis.js", "UX"],
    },
    {
        "id": "Scroll-Animation-Without-JavaScript",
        "title": "CSS-Only Scroll Animation",
        "description": "Use the view() function to achieve the scroll animation without using JavaScript, for more information see video on <a href='https://www.youtube.com/watch?v=pFtxR-O78sY&t=118s'>Youtube</a><br>💡 Note: This is currently a part of experimental CSS features (View Transitions). Ensure you're using a browser that supports it (like Chromium-based browsers).",
        "code": "/* Rotate on Scroll */\n.rotate-on-scroll {\n    animation: rotateOnScroll;\n    animation-timeline: view(); /*This makes the animation show as user scrolls*/ \n}\n\n@keyframes rotateOnScroll {\n    from {\n        transform: rotate(0deg);\n    }\n    to {\n        transform: rotate(360deg);\n    }\n}",
        "language": "css",
        "tags": ["css", "scroll-animation", "animation-timeline", "modern-css"],
    },
    {
        "id": "Scroll-Progress-Bar",
        "title": "Scroll Progress Bar Using CSS Scroll Timeline",
        "description": "Implement a scroll progress indicator that fills as the user scrolls through the page, using the animation-timeline: scroll(); property. This provides visual feedback on the user's scroll position without relying on JavaScript.",
        "code": "/* Scroll Progress Bar */\n#progress-bar {\n    position: fixed;\n    top: 0;\n    left: 0;\n    height: 4px;\n    width: 100%;\n    background: linear-gradient(to right, #4caf50 0%, #4caf50 100%);\n    transform: scaleX(0);\n    transform-origin: left;\n    animation: grow-progress linear forwards;\n    animation-timeline: scroll();\n}\n\n@keyframes grow-progress {\n    to {\n        transform: scaleX(1);\n    }\n}",
        "language": "css",
        "tags": ["css", "scroll-progress", "animation-timeline", "modern-css"],
    }
]; 