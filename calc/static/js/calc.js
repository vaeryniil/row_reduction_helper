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
  const matrix = localStorage.getItem("Matrix");
  console.log(matrix.print());
  console.print("in loadMatrix()")
  

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