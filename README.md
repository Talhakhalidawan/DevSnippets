# DevSnippets

A collection of useful, real-world programming tricks discovered during development—small lines of code or snippets that solve specific problems or enable cool behaviors.

## 🚀 Features

- Fully static website using only HTML, CSS, and JavaScript
- Client-side full-text search using Lunr.js
- Syntax highlighting with Prism.js
- Responsive design with dark mode
- Copyable code snippets

## 📂 Project Structure

```
devsnippets/
├── index.html              # Homepage with search functionality
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── app.js              # Main JavaScript file
├── data/
│   └── tricks.json         # JSON file containing all code snippets
├── tricks/                 # Individual trick pages
│   ├── template.html       # Template for trick pages
│   └── [trick-name].html   # Individual trick pages
└── images/                 # Images and favicon
```

## 🔧 How It Works

1. The homepage loads all snippets from `data/tricks.json`
2. Lunr.js creates a searchable index from the snippets
3. Users can search through titles, descriptions, and tags
4. Each snippet links to a dedicated page with more details and syntax-highlighted code

## 👥 Contributing

We welcome contributions! Here's how you can add a new programming trick:

### Option 1: Add to the JSON file

1. Fork this repository
2. Add your trick to the `data/tricks.json` file following this format:

```json
{
  "title": "Your Trick Title",
  "description": "A brief description of what the trick does",
  "code": "// Your code snippet here\nfunction example() {\n  // ...\n}",
  "language": "javascript", // Language for syntax highlighting
  "tags": ["javascript", "utility", "relevant-tags"],
  "url": "tricks/your-trick-name.html"
}
```

3. Create a corresponding HTML file in the `tricks/` directory using the template
4. Submit a pull request

### Option 2: Create a new trick page

1. Fork this repository
2. Create a new HTML file in the `tricks/` directory using `template.html` as a base
3. Add your trick to the `data/tricks.json` file
4. Submit a pull request

## 🛠️ Local Development

To run this project locally:

1. Clone the repository
2. Open `index.html` in your browser

Since this is a static site, no build process is required.

## 📝 License

MIT License

## 🙏 Acknowledgments

- [Lunr.js](https://lunrjs.com/) for search functionality
- [Prism.js](https://prismjs.com/) for syntax highlighting 