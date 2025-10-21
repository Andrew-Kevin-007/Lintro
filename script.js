// AI Code Review Bot - Main JavaScript File
// 
// SETUP INSTRUCTIONS:
// 1. Get your FREE Google Gemini API key from: https://aistudio.google.com/
// 2. Replace 'YOUR_GEMINI_API_KEY_HERE' in the AIReviewService constructor with your actual key
// 3. Save the file and open index.html in your browser
// 4. No credit card required - completely free!

class CodeReviewBot {
    constructor() {
        this.editor = null;
        this.reviewPanel = null;
        this.isReviewPanelOpen = false;
        this.currentLanguage = 'javascript';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeEditor();
        this.setupReviewPanel();
        this.loadPreferences();
    }

    loadPreferences() {
        // Load saved theme
        const savedTheme = localStorage.getItem('editor-theme');
        if (savedTheme) {
            document.getElementById('theme-selector').value = savedTheme;
            this.changeTheme(savedTheme);
        }

        // Load saved language
        const savedLanguage = localStorage.getItem('editor-language');
        if (savedLanguage) {
            document.getElementById('language-selector').value = savedLanguage;
            this.changeLanguage(savedLanguage);
        }
    }

    setupEventListeners() {
        // Review button
        document.getElementById('review-btn').addEventListener('click', () => {
            this.reviewCode();
        });

        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearEditor();
        });

        // Toggle review panel (using the new button in editor actions)
        document.querySelector('.editor-action-btn[title*="Review Panel"]').addEventListener('click', () => {
            this.toggleReviewPanel();
        });

        // Close review panel
        document.getElementById('close-review').addEventListener('click', () => {
            this.closeReviewPanel();
        });

        // Language selector
        document.getElementById('language-selector').addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        // Theme selector
        document.getElementById('theme-selector').addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });

        // Format button
        document.getElementById('format-btn').addEventListener('click', () => {
            this.formatCode();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    initializeEditor() {
        const textarea = document.getElementById('code-editor');
        
        // Initialize CodeMirror with advanced features
        this.editor = CodeMirror.fromTextArea(textarea, {
            mode: 'javascript',
            theme: 'monokai',
            lineNumbers: true,
            autoCloseBrackets: true,
            autoCloseQuotes: true,
            matchBrackets: true,
            indentUnit: 4,
            tabSize: 4,
            lineWrapping: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
            lint: true,
            smartIndent: true,
            electricChars: true,
            indentWithTabs: false,
            showTrailingSpace: true,
            showCursorWhenSelecting: true,
            cursorBlinkRate: 530,
            cursorHeight: 1,
            extraKeys: {
                'Ctrl-Space': 'autocomplete',
                'Ctrl-Enter': () => this.reviewCode(),
                'Ctrl-/': 'toggleComment',
                'Ctrl-D': 'selectNextOccurrence',
                'Ctrl-F': 'find',
                'Ctrl-H': 'replace',
                'Ctrl-G': 'goToLine',
                'Ctrl-L': 'selectLine',
                'Ctrl-K': 'deleteLine',
                'Ctrl-U': 'undo',
                'Ctrl-R': 'redo',
                'Ctrl-A': 'selectAll',
                'Ctrl-Z': 'undo',
                'Ctrl-Y': 'redo',
                'F11': function(cm) {
                    cm.setOption('fullScreen', !cm.getOption('fullScreen'));
                },
                'Esc': function(cm) {
                    if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
                },
                'Tab': 'indentMore',
                'Shift-Tab': 'indentLess',
                'Ctrl-[': 'indentLess',
                'Ctrl-]': 'indentMore'
            }
        });

        // Set initial content with better examples
        this.editor.setValue(`// Welcome to AI Code Review Bot!
// Professional code analysis powered by AI

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);

console.log('Hello, World!');`);

        // Auto-resize editor
        this.editor.setSize('100%', '100%');
        
        // Add event listeners for editor features
        this.setupEditorEvents();
    }

    setupEditorEvents() {
        // Update stats on content change
        this.editor.on('change', () => {
            this.updateEditorStats();
        });

        // Update file extension based on language
        this.editor.on('change', () => {
            this.updateFileExtension();
        });

        // Add bracket matching
        this.editor.on('cursorActivity', () => {
            this.highlightMatchingBrackets();
        });

        // Auto-indent on new line
        this.editor.on('beforeSelectionChange', (cm, obj) => {
            if (obj.origin === '+input' && obj.text[0] === '\n') {
                const line = cm.getLine(obj.from.line);
                const indent = line.match(/^\s*/)[0];
                if (indent.length > 0) {
                    setTimeout(() => {
                        cm.replaceSelection(indent);
                    }, 0);
                }
            }
        });
    }

    updateEditorStats() {
        const content = this.editor.getValue();
        const lines = content.split('\n').length;
        const chars = content.length;
        
        document.getElementById('line-count').textContent = lines;
        document.getElementById('char-count').textContent = chars;
    }

    updateFileExtension() {
        const extension = this.getFileExtension(this.currentLanguage);
        const fileExtension = document.querySelector('.file-extension');
        if (fileExtension) {
            fileExtension.textContent = extension;
        }
    }

    getFileExtension(language) {
        const extensions = {
            'javascript': '.js',
            'python': '.py',
            'java': '.java',
            'cpp': '.cpp',
            'typescript': '.ts',
            'go': '.go',
            'rust': '.rs',
            'html': '.html',
            'css': '.css',
            'php': '.php'
        };
        return extensions[language] || '.txt';
    }

    highlightMatchingBrackets() {
        const cursor = this.editor.getCursor();
        const line = this.editor.getLine(cursor.line);
        const char = line[cursor.ch];
        
        if (['(', ')', '[', ']', '{', '}'].includes(char)) {
            // CodeMirror automatically handles bracket matching
            // This is just for additional visual feedback
        }
    }

    setupReviewPanel() {
        this.reviewPanel = document.getElementById('review-panel');
    }

    toggleReviewPanel() {
        if (this.isReviewPanelOpen) {
            this.closeReviewPanel();
        } else {
            this.openReviewPanel();
        }
    }

    openReviewPanel() {
        this.reviewPanel.classList.add('open');
        this.isReviewPanelOpen = true;
        // Update the button title
        const toggleBtn = document.querySelector('.editor-action-btn[title*="Review Panel"]');
        toggleBtn.title = 'Hide Review Panel (F9)';
    }

    closeReviewPanel() {
        this.reviewPanel.classList.remove('open');
        this.isReviewPanelOpen = false;
        // Update the button title
        const toggleBtn = document.querySelector('.editor-action-btn[title*="Review Panel"]');
        toggleBtn.title = 'Toggle Review Panel (F9)';
    }

    changeLanguage(language) {
        this.currentLanguage = language;
        
        const modeMap = {
            'javascript': 'javascript',
            'python': 'python',
            'java': 'text/x-java',
            'cpp': 'text/x-c++src',
            'typescript': 'javascript',
            'go': 'go',
            'rust': 'rust',
            'html': 'htmlmixed',
            'css': 'css',
            'php': 'php'
        };

        this.editor.setOption('mode', modeMap[language] || 'javascript');
        this.updateFileExtension();
        
        // Save language preference
        localStorage.setItem('editor-language', language);
    }

    changeTheme(theme) {
        this.editor.setOption('theme', theme);
        // Store theme preference
        localStorage.setItem('editor-theme', theme);
    }

    formatCode() {
        const content = this.editor.getValue();
        if (!content.trim()) return;

        // Basic formatting for different languages
        let formatted = content;
        
        if (this.currentLanguage === 'javascript' || this.currentLanguage === 'typescript') {
            formatted = this.formatJavaScript(content);
        } else if (this.currentLanguage === 'python') {
            formatted = this.formatPython(content);
        } else if (this.currentLanguage === 'html') {
            formatted = this.formatHTML(content);
        }

        this.editor.setValue(formatted);
        this.editor.focus();
    }

    formatJavaScript(code) {
        // Basic JavaScript formatting
        return code
            .replace(/;\s*\n/g, ';\n')
            .replace(/{\s*\n/g, ' {\n')
            .replace(/\n\s*}/g, '\n}')
            .replace(/,\s*\n/g, ',\n')
            .replace(/\(\s*/g, '(')
            .replace(/\s*\)/g, ')');
    }

    formatPython(code) {
        // Basic Python formatting
        return code
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .replace(/:\s*\n/g, ':\n');
    }

    formatHTML(code) {
        // Basic HTML formatting
        return code
            .replace(/></g, '>\n<')
            .replace(/^\s*</gm, '<')
            .replace(/>\s*$/gm, '>');
    }

    handleKeyboardShortcuts(e) {
        // Global keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    this.reviewCode();
                    break;
                case 's':
                    e.preventDefault();
                    this.saveCode();
                    break;
                case 'n':
                    e.preventDefault();
                    this.clearEditor();
                    break;
                case 'f':
                    e.preventDefault();
                    this.findInEditor();
                    break;
                case 'h':
                    e.preventDefault();
                    this.replaceInEditor();
                    break;
            }
        }

        // Toggle review panel with F9
        if (e.key === 'F9') {
            e.preventDefault();
            this.toggleReviewPanel();
        }
    }

    saveCode() {
        const content = this.editor.getValue();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `code.${this.getFileExtension(this.currentLanguage).substring(1)}`;
        a.click();
        URL.revokeObjectURL(url);
    }

    findInEditor() {
        // Simple find functionality
        const searchTerm = prompt('Find:');
        if (searchTerm) {
            const content = this.editor.getValue();
            const index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
            if (index !== -1) {
                this.editor.setSelection(
                    this.editor.posFromIndex(index),
                    this.editor.posFromIndex(index + searchTerm.length)
                );
                this.editor.focus();
            }
        }
    }

    replaceInEditor() {
        // Simple replace functionality
        const searchTerm = prompt('Find:');
        if (searchTerm) {
            const replaceTerm = prompt('Replace with:');
            if (replaceTerm !== null) {
                const content = this.editor.getValue();
                const newContent = content.replace(new RegExp(searchTerm, 'g'), replaceTerm);
                this.editor.setValue(newContent);
            }
        }
    }

    async reviewCode() {
        const code = this.editor.getValue().trim();
        
        if (!code) {
            this.showError('Please enter some code to review.');
            return;
        }

        this.showLoading();
        this.openReviewPanel();

        try {
            // Use real AI review with Gemini
            const aiService = new AIReviewService();
            const review = await aiService.reviewCode(code, this.currentLanguage);
            this.displayReview(review);
        } catch (error) {
            console.error('Review error:', error);
            // Fallback to mock review if API fails
            this.showError('API failed, using mock review. Check console for details.');
            const mockReview = this.generateMockReview(code);
            this.displayReview(mockReview);
        } finally {
            this.hideLoading();
        }
    }

    generateMockReview(code) {
        const lines = code.split('\n');
        const comments = [];
        
        // Analyze code for common issues
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            
            // Check for common issues
            if (line.includes('var ') && !line.includes('var ' + line.split('var ')[1].split(' ')[0])) {
                comments.push({
                    line: lineNum,
                    type: 'warning',
                    issue: 'Consider using let or const instead of var for better block scoping.'
                });
            }
            
            if (line.includes('==') && !line.includes('===')) {
                comments.push({
                    line: lineNum,
                    type: 'warning',
                    issue: 'Use strict equality (===) instead of loose equality (==) to avoid type coercion.'
                });
            }
            
            if (line.includes('console.log')) {
                comments.push({
                    line: lineNum,
                    type: 'info',
                    issue: 'Remove console.log statements before production deployment.'
                });
            }
            
            if (line.trim().startsWith('//') && line.trim().length > 80) {
                comments.push({
                    line: lineNum,
                    type: 'info',
                    issue: 'Consider breaking long comments into multiple lines for better readability.'
                });
            }
            
            if (line.includes('function') && !line.includes('=>') && !line.includes('function ')) {
                comments.push({
                    line: lineNum,
                    type: 'info',
                    issue: 'Consider using arrow functions for cleaner syntax in modern JavaScript.'
                });
            }
        });

        // Add some general suggestions
        if (code.length > 200) {
            comments.push({
                line: 0,
                type: 'info',
                issue: 'Consider breaking this code into smaller, more focused functions.'
            });
        }

        if (!code.includes('function') && !code.includes('class') && !code.includes('const') && !code.includes('let')) {
            comments.push({
                line: 0,
                type: 'warning',
                issue: 'This appears to be a script without any functions or variables. Consider adding proper structure.'
            });
        }

        return {
            comments: comments,
            refactoredSnippet: this.generateRefactoredSnippet(code)
        };
    }

    generateRefactoredSnippet(code) {
        // Simple refactoring example
        let refactored = code
            .replace(/var /g, 'const ')
            .replace(/==/g, '===')
            .replace(/function\s+(\w+)\s*\(/g, 'const $1 = (')
            .replace(/\)\s*{/g, ') => {');

        return refactored;
    }

    displayReview(review) {
        const output = document.getElementById('review-output');
        
        if (review.comments.length === 0) {
            output.innerHTML = `
                <div class="review-comment success">
                    <div class="comment-line">[No Issues Found]</div>
                    <div class="comment-issue">Great job! No issues detected in your code.</div>
                </div>
            `;
            return;
        }

        let html = '';
        
        review.comments.forEach(comment => {
            const lineText = comment.line > 0 ? `[Line ${comment.line}]` : '[General]';
            html += `
                <div class="review-comment ${comment.type}">
                    <div class="comment-line">${lineText}</div>
                    <div class="comment-issue">${comment.issue}</div>
                </div>
            `;
        });

        if (review.refactoredSnippet) {
            html += `
                <div class="refactored-snippet">
                    <strong>Refactored Snippet:</strong>
                    <pre>${this.escapeHtml(review.refactoredSnippet)}</pre>
                </div>
            `;
        }

        output.innerHTML = html;
    }

    showError(message) {
        const output = document.getElementById('review-output');
        output.innerHTML = `
            <div class="review-comment error">
                <div class="comment-line">[Error]</div>
                <div class="comment-issue">${message}</div>
            </div>
        `;
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');
    }

    clearEditor() {
        this.editor.setValue('');
        this.editor.focus();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// AI Integration Functions - Google Gemini API (FREE)
class AIReviewService {
    constructor() {
        // Get your free API key from: https://aistudio.google.com/
        this.apiKey = 'AIzaSyBah9AOFiVMMksbUiat7m2-mgpsQOKRptc'; // Replace with your actual key
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    }

    async reviewCode(code, language = 'javascript') {
        const prompt = this.createReviewPrompt(code, language);
        
        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 2000,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Response:', errorData);
                throw new Error(`Gemini API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            console.log('API Response:', data); // Debug log
            
            // Handle different response structures
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                return this.parseAIResponse(data.candidates[0].content.parts[0].text);
            } else if (data.candidates && data.candidates[0] && data.candidates[0].text) {
                return this.parseAIResponse(data.candidates[0].text);
            } else {
                console.error('Unexpected API response structure:', data);
                throw new Error('Unexpected response format from Gemini API');
            }
        } catch (error) {
            console.error('Gemini Review Error:', error);
            throw error;
        }
    }

    getSystemPrompt() {
        return `You are a senior software engineer and expert code reviewer. 
Review the provided code for syntax errors, runtime issues, readability, structure, performance optimization, security issues, and best practices.
Respond in a terminal-style format with line numbers and concise actionable comments:
[Line X]: Issue or suggestion
[Line Y]: Issue or suggestion
If necessary, provide a short refactored code snippet at the end.`;
    }

    createReviewPrompt(code, language) {
        return `Please review the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide feedback in the format:
[Line X]: Description of issue or suggestion
[Line Y]: Description of issue or suggestion
...
Refactored snippet (if applicable):
<code here>`;
    }

    parseAIResponse(response) {
        const lines = response.split('\n');
        const comments = [];
        let refactoredSnippet = '';
        let inRefactoredSection = false;

        lines.forEach(line => {
            line = line.trim();
            
            if (line.startsWith('[Line ') || line.startsWith('[General]')) {
                const match = line.match(/\[(?:Line (\d+)|General)\]:\s*(.+)/);
                if (match) {
                    const lineNum = match[1] ? parseInt(match[1]) : 0;
                    const issue = match[2];
                    comments.push({
                        line: lineNum,
                        type: this.determineCommentType(issue),
                        issue: issue
                    });
                }
            } else if (line.toLowerCase().includes('refactored') || line.toLowerCase().includes('snippet')) {
                inRefactoredSection = true;
            } else if (inRefactoredSection && line) {
                refactoredSnippet += line + '\n';
            }
        });

        return {
            comments: comments,
            refactoredSnippet: refactoredSnippet.trim()
        };
    }

    determineCommentType(issue) {
        const lowerIssue = issue.toLowerCase();
        if (lowerIssue.includes('error') || lowerIssue.includes('syntax') || lowerIssue.includes('runtime')) {
            return 'error';
        } else if (lowerIssue.includes('warning') || lowerIssue.includes('consider') || lowerIssue.includes('should')) {
            return 'warning';
        } else if (lowerIssue.includes('good') || lowerIssue.includes('excellent') || lowerIssue.includes('well')) {
            return 'success';
        }
        return 'info';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new CodeReviewBot();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CodeReviewBot, AIReviewService };
}
