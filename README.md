# AI Code Review Bot

An AI-powered code review environment inspired by VS Code, featuring a code editor and terminal-style review panel that provides instant, structured feedback on your code.

## Features

- **Code Editor**: Syntax-highlighted editor with support for multiple programming languages
- **AI Code Review**: Instant feedback on syntax errors, runtime issues, readability, performance, and security
- **Terminal-Style Panel**: VS Code-inspired review panel that slides up from the bottom
- **Multiple Languages**: Support for JavaScript, Python, Java, C++, TypeScript, Go, and Rust
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Analysis**: Get immediate feedback as you type

## Getting Started

1. **Clone or Download** the project files
2. **Open** `index.html` in your web browser
3. **Paste your code** in the editor
4. **Click "Review Code"** to get AI-powered feedback
5. **View results** in the terminal-style review panel

## Usage

### Basic Workflow

1. Select your programming language from the dropdown
2. Paste or type your code in the editor
3. Click the "Review Code" button
4. Review the feedback in the sliding panel
5. Use the "Clear" button to start over

### Supported Languages

- JavaScript
- Python
- Java
- C++
- TypeScript
- Go
- Rust

### Review Features

The AI reviewer analyzes your code for:

- **Syntax Errors**: Missing semicolons, brackets, etc.
- **Runtime Issues**: Potential crashes, undefined variables
- **Readability**: Code structure, naming conventions
- **Performance**: Optimization opportunities
- **Security**: Vulnerabilities and best practices
- **Best Practices**: Modern coding standards

## AI Integration

### Current Implementation

The current version includes a mock AI reviewer that demonstrates the interface. To integrate with a real AI service:

1. **Open** `script.js`
2. **Find** the `AIReviewService` class
3. **Set** your API key in the constructor
4. **Update** the API URL to your preferred service
5. **Replace** the `simulateAIReview` method with actual API calls

### Supported AI Services

- OpenAI GPT-4
- Claude (Anthropic)
- Custom AI endpoints
- Local AI models

### API Configuration

```javascript
// In script.js, update the AIReviewService constructor
constructor() {
    this.apiKey = 'your-api-key-here';
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
}
```

## Customization

### Styling

- **Colors**: Modify the CSS variables in `styles.css`**
- **Layout**: Adjust the panel sizes and positioning
- **Themes**: Change the CodeMirror theme in `script.js`

### Review Logic

- **Custom Rules**: Add your own code analysis rules in `generateMockReview`
- **Severity Levels**: Modify the comment types (error, warning, info, success)
- **Output Format**: Customize the terminal-style output format

## File Structure

```
ai-code-review-bot/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- **CodeMirror**: For syntax highlighting and code editing
- **Modern Browser**: For ES6+ features and CSS Grid/Flexbox

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify for your projects.

## Support

For issues or questions:
1. Check the browser console for errors
2. Ensure all files are in the same directory
3. Verify your internet connection for CDN resources
4. Try refreshing the page

## Future Enhancements

- [ ] Real-time AI integration
- [ ] Multiple AI providers
- [ ] Code diff visualization
- [ ] Export review results
- [ ] Custom review templates
- [ ] Team collaboration features
- [ ] Plugin system for custom rules
