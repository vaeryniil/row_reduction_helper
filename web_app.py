import os
import logging
import configparser
from pathlib import Path
from typing import Dict, Optional, Union, cast

import flask
from flask import request


# Configure logging
logging.basicConfig(format="%(levelname)s:%(message)s", level=logging.DEBUG)
log = logging.getLogger(__name__)

#this is a type alias for better readability
JsonResponse = Dict[str, Dict[str, bool]]


# Symbols that raise a 403 error if found in the url
FORBIDDEN_SYMBOLS = ["//", "..", "~"]
class rref_helper:
    """still learning what AJAX is"""

    def __init__(self, config_path: Union[str, Path]) -> None:
        """Initialize the application with configuration from app.ini."""
        self.config = configparser.ConfigParser()
        self.config.read(config_path)

        # Initialize Flask app
        self._setup_logging()
        self.app = flask.Flask(__name__)
        self._setup_app()
        self._setup_routes()
        #self.app.debug = self.config.getboolean("DEFAULT", "DEBUG", fallback=True)

        # Get configuration values
        #self.port = self.config.getint("DEFAULT", "PORT", fallback=5005)

        
    def _setup_logging(self):
        """sets up logging config"""
        logging.basicConfig(
         #for varaibles we want to debug. example "format='[%(asctime)s] %(levelname)s in %(module)s: %(message)s",'"   
        )
        
    def _setup_app(self):
        """Set up the Flask application configuration."""
        self.app.secret_key = self.config.get("DEFAULT", "SECRET_KEY")
        self.app.debug = self.config.getboolean("DEFAULT", "DEBUG")
        self.port = self.config.getint("DEFAULT", "PORT")
        
    def _setup_routes(self):

        @self.app.route("/")
        def index():
            """Return the welcome message for the root URL, (http://127.0.0.1:<PORT>/)"""
            return "Welcome to rref helper!"


        @self.app.route("/<path:arg>")
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
            
            # TODO: Replace this with your implementation that checks
            # for forbidden symbols in the URL, missing or non-HTML files
            # Hint/example: `render_template("404.html"), 404` returns
            # your 404.html page and the 404 error code
            for symbol in FORBIDDEN_SYMBOLS:
                if symbol in arg:
                    log.debug("made it to forbidden 403")
                    return flask.render_template("403.html"), 403

            if not arg.endswith(".html"):
                log.debug("made it to not html 405")
                return flask.render_template("405.html"), 405

            if arg == "index.html":
                return flask.render_template("index.html")

            try:
                fp = os.path.join("templates", arg);
                log.debug("made it!")
                return flask.render_template("/"), 200
            
            # TODO: replace this bogus return
            except:
                log.debug("made it to not found 404")
                return flask.render_template("404.html"), 404
    
    def run(self):
        log.info("Starting web server on port %d", self.port)
        self.app.run(port=self.port, host="0.0.0.0", debug=self.app.debug)

if __name__ == "__main__":
        # Use the port number from the command line argument if provided
    config_path = Path(__file__).parent / "app.ini"
    app = rref_helper(config_path)
    app.run()