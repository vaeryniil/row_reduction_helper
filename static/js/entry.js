



// Suppress normal form submission
$("#entry").submit( function(event) {
   event.validateInput();
  });

// Keep track of the current AJAX request
var currentRequest = null;

// Function to validate and update input
function validateInput(inputId) {
    var input = $(`#${inputId}`).val();
    var num = input.replace(/[^0-9]/g, '');
    
    if (parseInt(num, 10) > 25) {
        num = "24";
    }
    
    $(`#${inputId}`).val(num);
    return num;
}

// Function to reset the display
function resetDisplay() {
    $("#rows").val("");
    $("#cols").val("");
}

$("#reset").click(function() {
    resetDisplay();
});

