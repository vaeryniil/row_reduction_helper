// calc/static/js/calc.js
// Carmen Park and Jennifer Linea

let isDark = false;
let isFractionMode = localStorage.getItem('fractionMode');

// Use loadTheme function instead of duplicating code
$(document).ready(function() {
    console.log("Document ready, init calc");

    loadTheme();

    loadMatrix();
    
    $("#light-dark").click(function() {
        toggleLightDark(this);
    });
});


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
        const rows = raw_matrix.size[0];
        const cols = raw_matrix.size[1];
        console.log("Raw matrix data:", raw_matrix);

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
    const rows = matrix.size[0];
    const cols = matrix.size[1];
    //console.log("rows:", rows, "cols:", cols);

    var table = "<table class='table table-not-bordered'>";
    
    for (var i = 0; i < rows; i++) {
        table += "<tr>";
        for (var j = 0; j < cols; j++) {
            const entry = matrix.entries[i][j];
            const numerator = entry[0];
            const denominator = entry[1];
            
            // Generate LaTeX directly
            let latexString;
            if (denominator === 1) {
                latexString = numerator.toString();
            } else {
                
                if (isFractionMode) {
                    latexString = `\\frac{${numerator}}{${denominator}}`;
                
                } else {
                    latexString = (numerator / denominator).toString();
                }
            }
            
            table += `<td style='padding: 2px; margin: 2px;'>
                <div class="matrix-box">
                    <div id="latex-display-${i}-${j}" 
                         class="latex-overlay katex-render">${latexString}</div>
                </div>
            </td>`;
        }
        table += "</tr>";
    }
    
    
    table += "</table>";
    console.log(table);
    $("#matrix").html(table);
    console.log("Matrix table maybe?");

    if (isFractionMode) {
    renderMatrixLateX(matrix);}
}

function renderMatrixLateX(matrix) {
    const rows = matrix.size[0];
    const cols = matrix.size[1];
        
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const latexId = `latex-display-${i}-${j}`;
            const element = document.getElementById(latexId);
            console.log("Rendering LaTeX for element:", latexId, element);

            if (!element) {
                console.warn(`Element ${latexId} not found`);
                continue;
            }
                        try {
                // Just render the LaTeX that's already in the element
                katex.render(element.textContent, element, { 
                    throwOnError: false,
                    displayMode: false
                });
                
            } catch (error) {
                console.error("KaTeX rendering error:", error);
                //element.innerHTML = '<span style="color:red">Error</span>';
            }


        }
    }
}


function loadTheme() {
    const themePreference = localStorage.getItem('themePreference') || 'light';
    isDark = themePreference === 'dark';
    
    $('link[data-theme]').remove();
    const theme_path = isDark ? "static/css/calc_dark.css" : "static/css/calc_light.css";
    
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
    const theme_path = isDark ? "static/css/calc_dark.css" : "static/css/calc_light.css";
    
    $('<link>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: theme_path,
        'data-theme': isDark ? 'dark' : 'light'
    }).appendTo('head');

    localStorage.setItem('themePreference', isDark ? 'dark' : 'light');
    console.log("Mode changed to:", isDark ? "dark" : "light");
}

// Toggle mode on button click
function toggleInputType(button){
    isFractionMode = !isFractionMode;
    $(button).text(isFractionMode ? "decimal" : "fraction");

    // Update button text
    $(".matrix-input").each(function () {
        $(this).attr("placeholder", isFractionMode ? "a/b" : "0.0");
    });

    console.log("Mode changed to:", isFractionMode ? "decimal" : "fraction");
}