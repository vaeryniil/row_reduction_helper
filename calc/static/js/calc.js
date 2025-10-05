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
            const row1 = $('#swap-box1').val(); 
            const row2 = $('#swap-box2').val();
            console.log("Rows to swap:", row1, row2);
            // then logic to perform the swap operation on the matrix
            og_matrix.swap(parseInt(row1, 10), parseInt(row2, 10));
            console.log("Matrix after swap:", og_matrix.print());
            //renderMatrixTable(og_matrix);
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
            console.log("validated input: ", val);//only accepts ints rn
            $(this).val(val);
        });
        
        $("#submit-op").click(function() {
            $("#error-message").text(""); // Clear previous error messages
            let row = $('#scale-box').val(); 
            let factor = $('#scale-factor').val();
            console.log("r0w in go is ", row, " and ", factor);
            //1 is mulitplication, 0 is division
            let operator = 1;
            let operand = [parseInt(factor, 10), 1];
            og_matrix.scale(parseInt(row, 10), operator, operand);
            console.log("Matrix after scale:", og_matrix.print());
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
            let row1 = $('#add-box1').val(); 
            let row2 = $('#add-box2').val();
            console.log("Rows to add:", row1, row2);
            //og_matrix.add(parseInt(row1, 10), parseInt(row2, 10), factor=1);
            //some things were up here i could not figure it out
            console.log(og_matrix.print());
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


function validateInput(value) {//will update to take fractions or decimals
    let num = value.replace(/[^0-9\/\-\.]/g, '');
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



//*********** */
//FROM ENTRY FOR SCALE and ADD if they want FRACTIONS
//*********** */




function deleteFraction(id, latex_id, matrix, flags){

    console.log("in delete");    
    const [i, j] = id.match(/\d+/g).map(Number); 
    let n = matrix.get_entry(i+1, j+1)[0];
    let d = matrix.get_entry(i+1, j+1)[1];
    //console.log("delete flag is " + flags.delete_flag);

            if (d !== 1){console.log("d is " , d);
                //delete denominator first
                if (d < 10){
                    matrix.add_value(i+1, j+1, n, 1); 
                    d = '';}
                else { 
                    let d_str = d.toString();
                    d_str = d_str.slice(0, -1);
                    d = parseInt(d_str);  
                    matrix.add_value(i+1, j+1, n, d);
                } 
                try {
                    katex.render(
                        `\\frac{${n}}{${d}}`,
                        $(`#${latex_id}`)[0],
                        { throwOnError: false }
                    );
                console.log("return from den");
                return;

                } catch (e) {//catch errors
                    $(`#${latex_id}`).html('<span style="color:red">Invalid</span>');
                console.log("return from error");
                return;
                }
            }

            else if(n !== 0){
                $(`#${latex_id}`).empty();
                $(`#${latex_id}`).hide();
                console.log("remaining numerator is " + n);
                matrix.add_value(i+1, j+1, n, 1); 

                $(`#${id}`).val(n.toString());
                flags.delete_flag = true;
                //console.log("DB and n!== 0\ndelete flag is " + flags.delete_flag);
                return flags.delete_flag;}


        console.log("n is ", n, "d is " , d);
        //console.log("DB delete flag is " + flags.delete_flag);
        return flags.delete_flag;
}



//validate box was misdleading because it only saves/validates fractions
function validateFraction(input_id, latex_id, matrix, flags) {

    const $input = $(`#${input_id}`);
    let value = $input.val();
    console.log("Validating input:", value);
    let num = value.replace(/[^-/0-9/./\/]/g, ''); // allows negative sign and decimal and fraction
    console.log("Cleaned input:", num);
    const [i, j] = input_id.match(/\d+/g).map(Number); 
    let numerator = matrix.get_entry(i+1, j+1)[0];
    let d = matrix.get_entry(i+1, j+1)[1];  // to sync latest denominator
    let denominator = 1;
    //console.log(" VB delete flag is " + flags.delete_flag);

    if (num == "") {
        $(`#${input_id}`).val(num.toString());
        return;
    }

    else if (num.includes('/') && num.includes('.')) {
        $(`#${input_id}`).val(""); // not valid input field
        $("#error-message").html('<div class="error-message">nope</div>');
    }

    if (numerator === 0 || (numerator !== 1 && flags.delete_flag)) {
        if (num.includes('/')) {//i only want to add numerator if they trigger this fraction pipeline
                flags.delete_flag = false;
                numerator = num.replace('/', '');
                //console.log("flags updated to " + flags.delete_flag); //^fixed getting a wierd comma here
                matrix.add_value(i+1, j+1, parseInt(numerator, 10), 1);
                denominator = ' ';}  
        else{
                $(`#${input_id}`).val(num.toString());return;}//still entering a fraction or sth so leave till above step is done    
    }

    else if (d === 1 && flags.delete_flag) {        
        $(`#${input_id}`).val(num.toString());return;}

    else {//numerator already entered/saved
        //num = num.replace(/[^-/0-9/./\/]/g, ''); // allows negative sign and decimal and fraction
        denominator = parseInt(num, 10);
        console.log("denominator is " + denominator, " d is ", d);

        if (denominator === 0 || !Number.isInteger(parseInt(denominator))) {
            console.log("deleting input");
            $(`#${input_id}`).val('');
            return;}
        
        if (d !== 1 || flags.tens_flag){
            //console.log(" check 2 denominator is " + denominator, " d is ", d);
            let d_str = d.toString();
            d_str += num.toString();
            //console.log("denominator is " + denominator, " dstr is ", d_str);
            denominator = parseInt(d_str, 10);
            if (flags.tens_flag){flags.tens_flag = false;}}
        

        matrix.add_value(i+1, j+1, numerator, denominator);
        if(denominator === 1){flags.tens_flag = true;}//trying to enter a tens place fraction
        //console.log("tens flag is " + flags.tens_flag);
    }
    //grrr

    console.log("for render\ndenominator is " + denominator, " numerator is ", numerator);
    try {
        katex.render(
        `\\frac{${numerator}}{${denominator}}`,
        $(`#${latex_id}`)[0],
        { throwOnError: false }
    );

    $(`#${latex_id}`).show();
    $(`#${input_id}`).val(""); //here clears input box
    return;
    
    } catch (e) {//catch errors
        $(`#${latex_id}`).html('<span style="color:red">Invalid</span>');
    return;
    }
}


