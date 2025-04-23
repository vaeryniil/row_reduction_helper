import os
import sys
import logging
from flask import Flask, render_template, request

# Configure logging
logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)

# Instantiate the Flask app object
app = Flask(__name__)

# Symbols that raise a 403 error if found in the url
FORBIDDEN_SYMBOLS = ["//", "..", "~"]


@app.route("/")
def index():
    """Return the welcome message for the root URL, (http://127.0.0.1:<PORT>/)"""
    return "Welcome to rref helper!"


@app.route("/<path:arg>")
def main(arg):
    """
    Handle all file requests and return appropriate responses.

    Args:
        arg: URL path
    Returns:
        HTML file if it exists, otherwise appropriate error page, when
        for example,
        `return render_template("404.html"), 404` when the requested page does not exist.
    """
    log.debug("Request details:")
    log.debug("  Path: %s", arg)
    log.debug("  Method: %s", request.method)
    log.debug("  Headers: %s", dict(request.headers))
    log.debug("  Query params: %s", dict(request.args))

    # TODO: Replace this with your implementation that checks
    # for forbidden symbols in the URL, missing or non-HTML files
    # Hint/example: `render_template("404.html"), 404` returns
    # your 404.html page and the 404 error code
    for symbol in FORBIDDEN_SYMBOLS:
        if symbol in arg:
            log.debug("made it to forbidden 403")
            return render_template("403.html"), 403

    if not arg.endswith(".html"):
        log.debug("made it to not html 405")
        return render_template("405.html"), 405

    if arg == "index.html":
        return render_template("index.html")

    try:
        fp = os.path.join("templates", arg);
        log.debug("made it!")
        return render_template("/"), 200
    
    # TODO: replace this bogus return
    except:
        log.debug("made it to not found 404")
        return render_template("404.html"), 404


if __name__ == "__main__":
    # Use the port number from the command line argument if provided
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 6005
    log.debug("Starting web server on port %d", port)
    app.run(debug=True, host="0.0.0.0", port=port)