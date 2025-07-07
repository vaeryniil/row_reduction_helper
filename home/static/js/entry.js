



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

// function to bring up a matrix table given rows and cols
function generateTable(rows, cols) {
    console.log("Generating table with rows:", rows, "and cols:", cols);
    var table = "<table class='table table-not-bordered text-center'>";
    
    for (var i = 0; i < rows; i++) {
        table += "<tr>";
        for (var j = 0; j < cols; j++) {
            //this initializes the table with input text boxes
            table += `<td style='padding: 2px; margin: 2px;'>
                        <input type="text" 
                        class="matrix-box" 
                        style="text-align: center;" /></td>`;
        }
        table += "</tr>";
    }
    
    table += "</table>";
    $("#matrix").html(table);

    $("#toggleMode").show();

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


// Function to reset the display
function resetDisplay() {
    $("#rows").val("");
    $("#cols").val("");
    $("#matrix").html("");
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
            $("#error-message").html('<div class="error-message">please enter row and collumn values</div>');
            return;    
        }

        if (rows === "") {
            $("#error-message").html('<div class="error-message">please enter row value</div>');
            return;    
        }
        if (cols === "") {
            $("#error-message").html('<div class="error-message">please enter collumn value</div>');
            return;  
        }
        console.log("rows:", rows, "cols:", cols);
        generateTable(rows, cols);
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


