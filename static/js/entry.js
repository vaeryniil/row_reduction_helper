



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

// Function to validate and update input for rows and cols
function validateInput(inputId) {
    console.log("Validating input for:", inputId);
    var input = $(`#${inputId}`).val();
    var num = input.replace(/[^0-9]/g, '');
    
    if (parseInt(num, 10) > 25) {
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
    var table = "<table class='table table-bordered'>";
    
    for (var i = 0; i < rows; i++) {
        table += "<tr>";
        for (var j = 0; j < cols; j++) {
            //this initializes the table with input text boxes
            table += `<td><input type="text" 
                         style="width: 40px; text-align: center;" /></td>`;
        }
        table += "</tr>";
    }
    
    table += "</table>";
    $("#matrix").html(table);
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
        console.log("Rows:", rows, "Cols:", cols);
        generateTable(rows, cols);
    });

    //reset from above clears the rows/cols initial input boxes and table
    $("#reset").click(function() {
        console.log("pressed reset button");
        resetDisplay();
    });
});


