console.log("=== CALC.JS LOADING ===");

let isDark = false;

// Initialize KaTeX when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '\\[', right: '\\]', display: true},
                {left: '\\(', right: '\\)', display: false}
            ],
            throwOnError: false,
            output: 'html'
        });
    }
});

function loadMatrix(){
    console.log("Loading matrix from localStorage...");
    const raw_matrix_data = localStorage.getItem('matrix-0-0');
    
    if (!raw_matrix_data) {
        console.error("No matrix data found in localStorage");
        $("#matrix").html("<p>No matrix data found. Please create a matrix first.</p>");
        return;
    }

    try {
        const raw_matrix = JSON.parse(raw_matrix_data);
        const rows = raw_matrix.rows;
        const cols = raw_matrix.cols;
        
        console.log(`Creating ${rows}x${cols} matrix`);
        
        // Check if Matrix class is available
        if (typeof Matrix === 'undefined') {
            console.error("Matrix class not found");
            $("#matrix").html("<p>Error: Matrix calculator not loaded properly.</p>");
            return;
        }
        
        // Create a new Matrix instance and restore the data
        const matrix = new Matrix([rows, cols]);
        matrix.entries = raw_matrix.entries;
        
        console.log("Matrix loaded:", matrix.print());
        renderMatrixTable(matrix);
        
    } catch (error) {
        console.error("Error loading matrix:", error);
        $("#matrix").html("<p>Error loading matrix data.</p>");
    }
}

function renderMatrixTable(matrix) {
    const rows = matrix.rows;
    const cols = matrix.cols;
    
    var table = "<table class='table table-not-bordered'>";
    
    for (var i = 0; i < rows; i++) {
        table += "<tr>";
        for (var j = 0; j < cols; j++) {
            const entry = matrix.entries[i][j];
            const numerator = entry[0];
            const denominator = entry[1];
            
            // Determine what to show in the input box
            let inputValue = '';
            if (denominator === 1) {
                inputValue = numerator.toString(); // Convert to string
            } else {
                inputValue = `${numerator}/${denominator}`;
            }
            
            table += `<td style='padding: 2px; margin: 2px;'>
                <div class="input-overlay-container">
                    <input type="text" 
                        class="matrix-box" 
                        id="matrix-input-${i}-${j}"
                        value="${inputValue}"
                        style="text-align: center;"
                        aria-label="Matrix cell ${i+1},${j+1}"/>
                    
                    <div id="latex-display-${i}-${j}" 
                         class="latex-overlay katex-render"></div>
                </div>
            </td>`;
        }
        table += "</tr>";
    }
    
    table += "</table>";
    $("#matrix").html(table);
    
    // Render LaTeX after a short delay to ensure DOM is updated
    setTimeout(() => {
        renderMatrixLatex(matrix);
    }, 100);
}

function renderMatrixLatex(matrix) {
    const rows = matrix.rows;
    const cols = matrix.cols;
    
    console.log("Rendering LaTeX for matrix...");
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const entry = matrix.entries[i][j];
            const numerator = entry[0];
            const denominator = entry[1];
            const latexId = `latex-display-${i}-${j}`;
            const element = document.getElementById(latexId);
            
            if (!element) {
                console.warn(`Element ${latexId} not found`);
                continue;
            }
            
            try {
                let latexString;
                if (denominator === 1) {
                    latexString = numerator.toString();
                } else {
                    latexString = `\\frac{${numerator}}{${denominator}}`;
                }
                
                katex.render(latexString, element, { 
                    throwOnError: false,
                    displayMode: false
                });
                
            } catch (error) {
                console.error("KaTeX rendering error:", error);
                element.innerHTML = '<span style="color:red">Error</span>';
            }
        }
    }
}

// Use loadTheme function instead of duplicating code
$(document).ready(function() {
    console.log("Document ready, initializing calculator...");
    loadTheme();
    loadMatrix();
    
    // Set up event listener for light/dark button
    $("#light-dark").click(function() {
        toggleLightDark(this);
    });
});

function loadTheme() {
    const themePreference = localStorage.getItem('themePreference') || 'light';
    isDark = themePreference === 'dark';
    
    $('link[data-theme]').remove();
    const theme_path = isDark ? "../static/css/calc_dark.css" : "../static/css/calc_light.css";
    
    $('<link>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: theme_path,
        'data-theme': isDark ? 'dark' : 'light'
    }).appendTo('head');
    
    $("#light-dark").text(isDark ? "light" : "dark");
    console.log("Theme loaded:", themePreference);
}

function toggleLightDark(button){
    isDark = !isDark;
    $(button).text(isDark ? "light" : "dark");

    $('link[data-theme]').remove();
    const theme_path = isDark ? "../static/css/calc_dark.css" : "../static/css/calc_light.css";
    
    $('<link>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: theme_path,
        'data-theme': isDark ? 'dark' : 'light'
    }).appendTo('head');

    localStorage.setItem('themePreference', isDark ? 'dark' : 'light');
    console.log("Mode changed to:", isDark ? "dark" : "light");
    
    // Re-render matrix to ensure proper styling
    loadMatrix();
}