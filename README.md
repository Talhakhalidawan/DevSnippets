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
├── data.js                 # JSON file containing all code snippets
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── app.js              # Main JavaScript file
├── tricks/                 # Individual trick pages
│   └── detail.html         # Individual trick details page
└── images/                 # Images and favicon
```

## 🔧 How It Works

1. The homepage loads all snippets from `data.js`
2. Lunr.js creates a searchable index from the snippets
3. Users can search through titles, descriptions, and tags
4. Each snippet links to a dedicated page with more details and syntax-highlighted code

## 👥 Contributing

We welcome contributions! Here's how you can add a new programming trick:

### Option 1: Add to the JSON file

1. Fork this repository
2. Add your trick to the `data.js` file following this format:

```js
{
  "title": "Your Trick Title",
  "description": "A brief description of what the trick does",
  "code": "// Your code snippet here\nfunction example() {\n  // ...\n}",
  "language": "javascript", // Language for syntax highlighting
  "tags": ["javascript", "utility", "relevant-tags"],
}
```

3. Submit a pull request

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