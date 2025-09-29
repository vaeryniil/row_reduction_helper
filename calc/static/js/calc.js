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

function loadMatrix(){
  const raw_matrix = JSON.parse(localStorage.getItem('Matrix'));
  if (raw_matrix) {
    rows = raw_matrix.rows;
    cols = raw_matrix.cols;
    // Create a new Matrix instance and restore the data
    const matrix = new Matrix([rows, cols]);
    matrix.entries = raw_matrix.entries; // Restore the data
    
    // Now you can use the methods
    console.log(matrix.print()); 


    var table = "<table class='table table-not-bordered'>";
    // Build the table HTML
    
    for (var i = 0; i < rows; i++) {
        table += "<tr>";
        for (var j = 0; j < cols; j++) {
            const entry = matrix.entries[i][j];
            const numerator = entry[0];
            const denominator = entry[1];
            
            // Determine what to show in the input box
            let inputValue = '';
            if (denominator === 1) {
                inputValue = numerator; // Show integer
            } else {
                inputValue = `${numerator}/${denominator}`; // Show fraction
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
    
    // Now render the LaTeX for each cell
    renderMatrixLatex(matrix);
  }
}

function renderMatrixLatex(matrix) {
    const rows = matrix.rows;
    const cols = matrix.cols;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const entry = matrix.entries[i][j];
            const numerator = entry[0];
            const denominator = entry[1];
            const latexId = `latex-display-${i}-${j}`;
            
            try {
                if (denominator === 1) {
                    // Render as simple number
                    katex.render(
                        numerator.toString(),
                        document.getElementById(latexId),
                        { throwOnError: false }
                    );
                } else {
                    // Render as fraction
                    katex.render(
                        `\\frac{${numerator}}{${denominator}}`,
                        document.getElementById(latexId),
                        { throwOnError: false }
                    );
                }
            } catch (error) {
                console.error("KaTeX rendering error:", error);
                document.getElementById(latexId).innerHTML = 
                    '<span style="color:red">Error</span>';
            }
        }
    }
}

$(document).ready(function() {
    //let matrix;
    //console.log("trying to fix entries");
    if (localStorage.getItem('themePreference') === 'dark') {
        $('<link>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: "..static/css/calc_dark.css",
            'data-theme': 'dark'
        }).appendTo('head');
        $("#light-dark").text("light");
    }
    else {
        $('<link>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: "..static/css/calc_light.css",
            'data-theme': 'light'
        }).appendTo('head');
        $("#light-dark").text("dark");
    }

    loadMatrix();

});


function toggleLightDark(button){
    //this runs when the dark/light button is pressed
    isDark = !isDark;
    $(button).text(isDark ? "dark" : "light");

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
}