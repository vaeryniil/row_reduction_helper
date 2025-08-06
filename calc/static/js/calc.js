//initialization script for katex

document.addEventListener('DOMContentLoaded', function() {
  renderMathInElement(document.body, {
    delimiters: [
      {left: '\\[', right: '\\]', display: true},  // Block equations
      {left: '\\(', right: '\\)', display: false}  // Inline equations
    ],
    throwOnError: false,  // Silently fail on invalid LaTeX
    output: 'html'        // Preferred output format
  });
});