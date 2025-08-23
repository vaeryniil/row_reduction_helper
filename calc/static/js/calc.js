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

  }
}

$(document).ready(function() {
    //let matrix;
    //console.log("trying to fix entries");
    if (localStorage.getItem('themePreference') === 'dark') {
        $('<link>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: "static/css/calc_dark.css",
            'data-theme': 'dark'
        }).appendTo('head');
        $("#light-dark").text("light");
    }
    else {
        $('<link>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: "static/css/calc_light.css",
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