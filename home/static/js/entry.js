

document.addEventListener('DOMContentLoaded', function() {
  renderMathInElement(document.body, {
    delimiters: [
      {left: '\\[', right: '\\]', display: true},
      {left: '\\(', right: '\\)', display: false}
    ],
    throwOnError: false
  });
});

// Suppress normal form submission
// ie when you press enter it doesnt reload the page
$(document).ready(function () {

    $("#entry").on( "submit", function(e) {
    e.preventDefault();
        $("#submit").click();         // Simulates the submit button
    });
});
// Keep track of the current AJAX request
var currentRequest = null;
var isFractionMode = true; // Default mode is fraction
var isDark = false; 

// Function to validate and update input for rows and cols
function validateInput(inputId) {
    //console.log("Validating input for:", inputId);
    var input = $(`#${inputId}`).val();
    var num = input.replace(/[^0-9]/g, '');
    
    if (parseInt(num, 10) > 24) {
        num = "24";
    }
    else if (parseInt(num, 10) < 1) {
        num = "1";
    } 

    $(`#${inputId}`).val(num);
    return num;
}



// Function to reset the display
function resetDisplay() {
    $("#rows").val("");
    $("#cols").val("");
    $("#matrix").html("");        
    $("#error-message").html("");  
    $("#toggleMode").hide();
    $("#submit-matrix").hide();

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

function toggleLightDark(button){
    isDark = !isDark;
    $(button).text(isDark ? "dark" : "light");

    $('link[data-theme]').remove();
    const theme_path = isDark ? "static/css/simple_dark.css" : "static/css/simple_light.css";
    
    $('<link>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: theme_path,
        'data-theme': isDark ? 'dark' : 'light'
    }).appendTo('head');

    localStorage.setItem('themePreference', isDark ? 'dark' : 'light');

    console.log("Mode changed to:", isDark ? "dark" : "light");
}


//this is setting all my functions to run with client interaction
$(document).ready(function() {
    let matrix = null;
    //console.log("trying to fix entries");
    if (localStorage.getItem('themePreference') === 'dark') {
        $('<link>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: "static/css/simple_dark.css",
            'data-theme': 'dark'
        }).appendTo('head');
        $("#light-dark").text("light");
    }
    else {
        $('<link>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: "static/css/simple_light.css",
            'data-theme': 'light'
        }).appendTo('head');
        $("#light-dark").text("dark");
    }
    
    //check the input on rows
    $("#rows").on("keyup", function() {
        validateInput("rows");
    });

    //checks the input on cols
    $("#cols").on("keyup", function() {
        validateInput("cols");
    }); 
    
    //this makes a table when the submit button is pressed
    $("#submit").click(function() {
        //console.log("pressed submit button");
        var rows = $("#rows").val();
        var cols = $("#cols").val();
        $("#error-message").html("");  

        if (rows === "" && cols === "") {
            $("#matrix").html("");
            $("#error-message").html('<div class="error-message">please enter row and collumn values</div>');
            return;    
        }

        else if (rows === "") {
            $("#matrix").html("");
            $("#error-message").html('<div class="error-message">please enter row value</div>');
            return;    
        }
        else if (cols === "") {
            $("#matrix").html("");
            $("#error-message").html('<div class="error-message">please enter collumn value</div>');
            return;  
        }

        console.log("rows:", rows, "cols:", cols);
        matrix = generateTable(rows, cols);

    });

            //save with local storage
    $("#submit-matrix").click(function() {
                
            console.log("pressed go rref button");
            matrix = finalValidate(matrix);
            console.log("matrix is " + matrix.print());
            
            localStorage.setItem('Matrix', JSON.stringify(matrix));

            $.ajax({
                url: "../calc/calc.html",
                success: function(data) {
                    // Replace the entire page content with calc.html content
                    $("html").html(data);
                    // Re-initialize any scripts
                    //initializeCalcScripts();
                },
                error: function() {
                    console.error("Failed to load calc.html");
                }    });

    });

    //this toggles the input type between fraction and decimal
    $("#toggleMode").click(function() {
        //console.log("pressed toggle button");
        toggleInputType(this);
    });

    $("#light-dark").click(function() {
        //console.log("pressed toggle button");
        toggleLightDark(this);
    });

    //reset from above clears the rows/cols initial input boxes and table
    $("#reset").click(function() {
        //console.log("pressed reset button");
        resetDisplay();

    });

    
    
    $("#rows, #cols").on("input", function() {
        $("#error-message").html("");
    });

});


// function to bring up a matrix table given rows and cols
function generateTable(rows, cols) {
    //console.log("Generating table with rows:", rows, "and cols:", cols);
    var table = "<table class='table table-not-bordered'>";
    
    for (var i = 0; i < rows; i++) {
        table += "<tr>";
        for (var j = 0; j < cols; j++) {
            //this initializes the table with input text boxes
            table += `<td style='padding: 2px; margin: 2px;'>
                <div class="input-overlay-container">
                        <input type="text" 
                        class="matrix-box" 
                        id="matrix-input-${i}-${j}"
                        style="text-align: center;"
                        aria-label="Matrix cell ${i+1},${j+1}"/>
                    
                        <div id="latex-display-${i}-${j}" 
                         class="latex-overlay katex-render"></div>
                    </div>
                </td>`;
                        //this is the html latex renderer since input does not.
        }
        table += "</tr>";
    }
    
    table += "</table>";
    $("#matrix").html(table);

    const matrix = new Matrix([rows,cols]);
    matrix.init_entries();
    const flags = { delete_flag: false, tens_flag: false };
    $("#toggleMode").show();
    $("#submit-matrix").show();

    // gets rid of other existing handlers if any
    $('#matrix').off('keyup', '.matrix-box');// .matrix-box means selecting all matrix-box elements
    
    // Then this adds the new live validation handler
    $('#matrix').on('keyup', '.matrix-box', function () {
        const id = $(this).attr('id');
        const latex_id = $(this).siblings('.latex-overlay').attr('id');
        //console.log("Validating box with ID:", id , latex_id);
        validateFraction(id, latex_id, matrix, flags);
    
    });

    $('#matrix').off('keydown', '.matrix-box');

    $('#matrix').on('keydown', '.matrix-box', function(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
        const id = $(this).attr('id');
        const latex_id = $(this).siblings('.latex-overlay').attr('id');
        //console.log("Validating box with ID:", id , latex_id);
        flags.delete_flag = deleteFraction(id, latex_id, matrix, flags);
        }
    });

    return matrix;
}

function finalValidate(matrix){
    console.log("in final validate")
    let size = matrix.size;
    rows = size[0];
    cols = size[1];
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < cols; j++){
            const inputId = `matrix-input-${i}-${j}`;
            const $input = $(`#${inputId}`);
            const curr_val = matrix.entries[i][j];
            console.log("input is " + $input.val(), " matrix has " + curr_val);

            if ($input.val() === ''){$input.val(0);}//they put nothing, assume zero
            
            else if (parseFloat($input.val()) !== curr_val[0]){
                let numerator = parseFloat($input.val());
                //for ints, come back and do this for decimal vals with gcd
                matrix.add_value(i + 1, j + 1, parseInt(numerator), 1);
            }
        
        } 
    }
    return matrix;

};

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
        console.log("tens flag is " + flags.tens_flag);
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


