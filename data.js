// DevSnippets data
const snippetsData = [
    {
        "id": "springy-scroll",
        "title": "Springy Scroll Effect",
        "description": "Just paste this code in your head tag to make your scroll with the lenis scroll effect or you can say it springy scroll or eco effect",
        "code": `{\n<script src="https://unpkg.com/lenis@latest/dist/lenis.min.js"></script>\n<script>const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });\nfunction raf(time) {\n    lenis.raf(time);\n    requestAnimationFrame(raf);\n}\nrequestAnimationFrame(raf);\n</script>\n`,
        "language": "css",
        "tags": ["css", "animation", "scroll", "html", "javascript"],
        "url": "tricks/springy-scroll.html"
    },
    {
        "id": "debounce-function",
        "title": "Debounce Function",
        "description": "A utility function to limit how often a function is called, useful for search inputs or resize events.",
        "code": "function debounce(func, delay = 300) {\n  let timeout;\n  \n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => {\n      func.apply(this, args);\n    }, delay);\n  };\n}\n\n// Usage\nconst debouncedSearch = debounce((query) => {\n  // Search implementation\n  console.log('Searching for:', query);\n}, 500);\n\nsearchInput.addEventListener('input', (e) => {\n  debouncedSearch(e.target.value);\n});",
        "language": "javascript",
        "tags": ["javascript", "performance", "utility"],
        "url": "tricks/debounce-function.html"
    },
    {
        "id": "async-error-handling",
        "title": "Async/Await Error Handling",
        "description": "A clean pattern for handling errors in async/await functions without try/catch blocks.",
        "code": "// Helper function to handle async operations\nconst asyncHandler = async (promise) => {\n  try {\n    const data = await promise;\n    return [data, null];\n  } catch (error) {\n    return [null, error];\n  }\n};\n\n// Usage\nasync function fetchUserData(userId) {\n  const [data, error] = await asyncHandler(fetch(`/api/users/${userId}`));\n  \n  if (error) {\n    console.error('Failed to fetch user:', error);\n    return null;\n  }\n  \n  return data.json();\n}",
        "language": "javascript",
        "tags": ["javascript", "async", "error-handling"],
        "url": "tricks/async-error-handling.html"
    },
    {
        "id": "css-grid-auto-fill",
        "title": "CSS Grid Auto-Fill",
        "description": "Create a responsive grid layout that automatically adjusts the number of columns based on available space.",
        "code": ".grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));\n  grid-gap: 20px;\n}\n\n.grid-item {\n  background-color: #f0f0f0;\n  padding: 20px;\n  border-radius: 4px;\n}",
        "language": "css",
        "tags": ["css", "grid", "responsive", "layout"],
        "url": "tricks/css-grid-auto-fill.html"
    }
]; 