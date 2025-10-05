// calc/static/js/calc.js
// Carmen Park and Jennifer Linea

let isDark = false;
let isFractionMode = localStorage.getItem('fractionMode');
console.log("Initial mode from localStorage ", isFractionMode);

// Use loadTheme function instead of duplicating code
$(document).ready(function() {
    //console.log("Document ready, init calc");

    loadTheme();

    let og_matrix = loadMatrix();
    let rows = og_matrix.size[0];
    //let cols = og_matrix.size[1];
    //console.log(og_matrix);

    if (isFractionMode){
        renderKatex(og_matrix);
    }

    $("#light-dark").click(function() {
        toggleLightDark(this);
    });

    //for swap button
    $('#swap').click(function() {
        //console.log("in swap button");
        //console.log(og_matrix.print());
        $('#btn-abt').text("swap two rows");
        
        $('#operation-input').html(`
            <label for="swap-factor">swap rows  </label>
            <input type="text" class="op-input" id="swap-box1"></input>
            <label for="swap-factor">  and  </label>
            <input type="text" class="op-input" id="swap-box2"></input>
            <button type="button" id="submit-op" class="btn btn-default">go</button>
            `); 

        $("#swap-box1").keyup(function() {
            let val = $(this).val();
            let row = validateRows(val, rows);
            console.log("validated row: ", row);
            $(this).val(row);
        });

        $("#swap-box2").keyup(function() {
            let val = $(this).val();
            let row = validateRows(val, rows);
            console.log("validated row: ", row);
            $(this).val(row);
        });

        $("#submit-op").click(function() {
            $("#error-message").text(""); // Clear previous error messages
            let row1 = $('#swap-box1').text(); 
            let row2 = $('#swap-box2').text();
            console.log("Rows to swap:", row1, row2);
            // then logic to perform the swap operation on the matrix
            og_matrix.swap(row1, row2);
            console.log("Matrix after swap:", og_matrix.print());
            renderMatrixTable(og_matrix);
        });
    });

    //for scale button
    $('#scale').click(function() {
        $('#btn-abt').text(" multiply or divide a row by some value");

        $('#operation-input').html(`
            <label for="scale-factor">scale row  </label>
            <input type="text" class="op-input" id="scale-box"></input>
            <label for="scale-factor">  by  </label>
            <input type="text" class="op-input" id="scale-factor"></input>
            <button type="button" id="submit-op" class="btn btn-default">go</button>
            `); 

        $("#scale-box").keyup(function() {
            let val = $(this).val();
            let row = validateRows(val, rows);
            console.log("validated row: ", row);
            $(this).val(row);
        });
        $("#scale-factor").keyup(function() {
            let val = $(this).val();
            validateInput(val);
        });
        
        $("#submit-op").click(function() {
            $("#error-message").text(""); // Clear previous error messages
            let row = $('#scale-box').text(); 
            assert
        });
    });

    //for add button
    $("#add").click(function() {
        $('#btn-abt').text("replace a row by adding or subtracting it to a multiple of another row");
        $('#operation-input').html(`
            <label for="add-factor">add row  </label>    
            <input type="text" class="op-input" id="add-box1"></input>
            <label for="add-factor">  to row  </label>
            <input type="text" class="op-input" id="add-box2"></input>
            <button type="button" id="submit-op" class="btn btn-default">go</button>
        `); 

        $("#add-box1").keyup(function() {
            let val = $(this).val();
            let row = validateRows(val, rows);
            console.log("validated row: ", row);
            $(this).val(row);
        });

        $("#add-box2").keyup(function() {
            let val = $(this).val();
            let row = validateRows(val, rows);
            console.log("validated row: ", row);
            $(this).val(row);
        });

        
        
        $("#submit-op").click(function() {
            $("#error-message").text(""); // Clear previous error messages
            let operation = $('#op-input').text();
            console.log("Operation to perform:", operation);
        });
    });

});

function validateRows(value, rows) {
    let num = value.replace(/[^0-9]/g, '');
    
    if (parseInt(num, 10) > rows) {
        num = (rows).toString();
    }
    else if (parseInt(num, 10) < 1) {
        num = "1";
    } 
    return num;
}

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

//loads matrix from localStorage and runs renderMatrixTable
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
        if (isFractionMode){
            console.log("page is fraction mode");
        }

        console.log("in loadmatrix:")
        console.log(matrix.print());
        return matrix;

    } catch (error) {
        console.error("Error loading matrix:", error);
        $("#matrix").html("<p>Error loading matrix data.</p>");
    }
}

//builds matrix html from matrix object
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
                console.log("final string for box ", rows, " ", cols, " is ", latexString);
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
    console.log("Matrix table should be done");
}

//renders latex if is fraction mode
function renderKatex(matrix) {
    const rows = matrix.size[0];
    const cols = matrix.size[1];
        
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            //console.log("Rendering LaTeX for cell:", i, j);
            //console.log("Matrix entry:", matrix.entries[i][j]);
            const latexId = `latex-display-${i}-${j}`;
            const element = document.getElementById(latexId);
            //console.log("Rendering LaTeX for element:", latexId, element);

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
    
    $("#light-dark").text(isDark ? "dark" : "light");
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