import os
import logging
import configparser
from pathlib import Path
from typing import Dict, Optional, Union, cast

import flask
from flask import request





class rref_helper:
    """still learning what AJAX is"""

    def __init__(self, config_path: Union[str, Path]) -> None:
        """Initialize the application with configuration from app.ini."""
        self.config = self._load_config(config_path)
        self._setup_logging()
        self.app = flask.Flask(__name__)
        self._setup_app()
        self._setup_routes()
    
    def _load_config(self, config_path: Union[str, Path]) -> None:
        # Get configuration values
        config = configparser.ConfigParser()
        if Path(config_path).exists():
            config.read(config_path)
        return config
        
    def _setup_logging(self):
        """sets up logging config"""
        logging.basicConfig(
         #for varaibles we want to debug. example "format='[%(asctime)s] %(levelname)s in %(module)s: %(message)s",'"   
                   level=(
                logging.DEBUG
                if self.config.getboolean("DEFAULT", "DEBUG", fallback=True)
                else logging.INFO
            ),
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
            return flask.render_template("index.html"), 200


        @self.app.route("/enter_matrix")
        def enter_matrix(arg):
            """ somehow ajax the entry of rows cols and
            dynamically create html or js rows cols to enter values"""
            pass
        
        

    def run(self):
        self.app.logger.info("Starting web server on port %d", self.port)
        self.app.run(port=self.port, host="0.0.0.0", debug=self.app.debug)

if __name__ == "__main__":
        # Use the port number from the command line argument if provided
    config_path = Path(__file__).parent / "app.ini"
    app = rref_helper(config_path)
    app.run()