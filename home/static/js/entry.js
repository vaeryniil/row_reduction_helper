

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


// Function to validate and update input for rows and cols
function validateInput(inputId) {
    console.log("Validating input for:", inputId);
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



//this is setting all my functions to run with client interaction
$(document).ready(function() {
    console.log("trying to fix entries");
    
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
        console.log("pressed submit button");
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
        generateTable(rows, cols);
        //buildMatrix()

    });

    //this toggles the input type between fraction and decimal
    $("#toggleMode").click(function() {
        console.log("pressed toggle button");
        toggleInputType(this);
    });

    //reset from above clears the rows/cols initial input boxes and table
    $("#reset").click(function() {
        console.log("pressed reset button");
        resetDisplay();

    });
    
    $("#rows, #cols").on("input", function() {
        $("#error-message").html("");
    });

});


// function to bring up a matrix table given rows and cols
function generateTable(rows, cols) {
    console.log("Generating table with rows:", rows, "and cols:", cols);
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

    $("#toggleMode").show();
    // gets rid of other existing handlers if any
    $('#matrix').off('keyup', '.matrix-box');// .matrix-box means selecting all matrix-box elements

    // Then this adds the new live validation handler
    $('#matrix').on('keyup', '.matrix-box', function () {
        const id = $(this).attr('id');
        const latex_id = $(this).siblings('.latex-overlay').attr('id');
  
        console.log("Validating box with ID:", id , latex_id);
        console.log("matrix:", matrix.print());

        validateBox(id, latex_id, matrix);
    });


    // $('#matrix').on('keydown', '.matrix-box', function(e) {
    // if (e.key === 'Delete') {
    //     const id = $(this).attr('id').split('-');
    //     const [i, j] = [id[2], id[3]];
    //     $(this).val('');
    //     $(`#latex-display-${i}-${j}`).html('');
    //     matrix.entries[i][j] = [0, 1];
    // }
    // });



    //return matrix;
}

/*function validateBox(inputId, latexId, matrix) {

    const $input = $(`#${inputId}`);
    let value = $input.val();
    console.log("Validating input:", value);
    let num = value.replace(/[^-/0-9/./\/]/g, ''); // Allow negative sign and decimal point
    console.log("Cleaned input:", num);
    
    let row = matrix.size[0];
    let col = matrix.size[1];   

    const full_entry = matrix.get_entry(row, col);
    let numerator = full_entry[0];
    console.log("entry before is " + entry);

    if (num == "") {
        return;
    }

    if (num.includes('/') && num.includes('.')) {
        $(`#${inputId}`).val(""); // not valid input field
        $("#error-message").html('<div class="error-message">no dude</div>');
    }

        if (numerator === 0) {
            if (num.includes('/')) {//i only want to add numerator if they trigger this fraction pipeline
                    numerator = num.split('/');
                    console.log("numerator updated to " + numerator);
                    matrix.add_value(row, col, [parseInt(numerator[0],10), 1]);
                    denominator = ' ';
                    
            }
            else{
                 return;//still entering a fraction or sth so leave till above step is done
            }
           
        }
        else{
        let denominator = num;
        console.log("the numerator is " + numerator + " and denominator is " + denominator);
        if (denominator === 0) {
            $(`#${inputId}`).val('');
            return;
        }
        matrix.add_value(row, col, [numerator, parseInt(denominator,10)]);
        }

                    try {
                katex.render(
                    `\\frac{${numerator}}{${denominator}}`,
                    $(`#${latexId}`)[0],
                    { throwOnError: false }
                );

                $(`#${inputId}`).val(""); //here clears input box
                
                return;
                
                } catch (e) {//catch errors
                    $(`#${latexId}`).html('<span style="color:red">Invalid</span>');
                return;
                }

    $(`#${inputId}`).val(num.toString()); // Update input field
}*/


function validateBox(inputId, latexId, matrix) {
    const $input = $(`#${inputId}`);
    const value = $input.val().trim();
    
    // Extract row/col from ID (matrix-input-0-0 => row 0, col 0)
    const [i, j] = inputId.match(/\d+/g).map(Number); 
    
    if (value === "") {
        matrix.entries[i][j] = [0, 1]; // Reset to 0/1
        $(`#${latexId}`).html('');
        return;
    }

    const num = value.replace(/[^-/0-9.]/g, ''); // Clean input

    if (num.includes('/')) {
        const [n, d] = num.split('/').map(Number);
        if (!isNaN(n) && !isNaN(d) && d !== 0) {
            matrix.entries[i][j] = [n, d];
            katex.render(`\\frac{${n}}{${d}}`, $(`#${latexId}`)[0], { 
                throwOnError: false 
            });
            $input.val('');
        } else {
            $(`#${latexId}`).html('<span style="color:red">Invalid</span>');
        }
    } 
    else if (!isNaN(num)) {
        matrix.entries[i][j] = [Number(num), 1];
        katex.render(num, $(`#${latexId}`)[0], { throwOnError: false });
    }
}