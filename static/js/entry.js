



// Suppress normal form submission
$("#entry").submit( function(e) {
    console.log("in entry js");
   e.preventDefault();
  });

// Keep track of the current AJAX request
var currentRequest = null;

// Function to validate and update input
function validateInput(inputId) {
    console.log("Validating input for:", inputId);
    var input = $(`#${inputId}`).val();
    var num = input.replace(/[^0-9]/g, '');
    
    if (parseInt(num, 10) > 25) {
        num = "24";
    }
    
    $(`#${inputId}`).val(num);
    return num;
}

function generateTable(rows, cols) {
    console.log("Generating table with rows:", rows, "and cols:", cols);
    var table = "<table class='table table-bordered'>";
    
    for (var i = 0; i < rows; i++) {
        table += "<tr>";
        for (var j = 0; j < cols; j++) {
            table += `<td>Row ${i + 1}, Col ${j + 1}</td>`;
        }
        table += "</tr>";
    }
    
    table += "</table>";
    $("#display").html(table);
}

// Function to reset the display
function resetDisplay() {
    $("#rows").val("");
    $("#cols").val("");
}

$(document).ready(function() {
    console.log("trying to fix entries");
    
    //check the input fields
    $("#rows").on("input", function() {
        validateInput("rows");
    });

    $("#cols").on("input", function() {
        validateInput("cols");
    }); 
    
    $("#reset").click(function() {
        console.log("pressed reset button");
        resetDisplay();
    });
});


