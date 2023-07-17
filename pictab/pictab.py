#!/usr/bin/env python3

from pathlib import Path
import socket, os, sys, threading
import random

from flask import Flask, send_file

class PicTabServer:
    def __init__(self, port: int, resources_base_dir: Path):
        self.resources_base_dir = resources_base_dir

        self.port = port

        self.app = Flask(__name__, static_url_path='', static_folder=resources_base_dir)

        self.app.config['ENV'] = 'development'

        self.app.register_error_handler(400, self.resp_bad_request)
        self.app.register_error_handler(403, self.resp_forbidden)
        self.app.register_error_handler(404, self.resp_not_found)

    def resp_bad_request(self, e):
        msg = f"Bad Request: {e}"
        print(msg)
        return msg, 400

    def resp_not_found(self, e):
        msg = f"Not Found: {e}"
        print(msg)
        return msg, 404

    def resp_forbidden(self, e):
        msg = f"Forbidden: {e}"
        print(msg)
        return msg, 403

    def start_server(self):
        self._start_server_pictab()

    def start_server_daemon(self):
        self.server_daemon = threading.Thread(name='daemon_server_pictab',
                                              target=self._start_server_pictab)
        self.server_daemon.setDaemon(True)
        self.server_daemon.start()

    def _start_server_pictab(self):
        print(f'Starting server on port {self.port}')
        os.environ["FLASK_ENV"] = "development"

        # Error in click.utils.echo() when console is unavailable
        # https://github.com/pallets/click/issues/2415
        if getattr(sys, 'frozen', False):
            f = open(os.devnull, 'w')
            sys.stdin = f
            sys.stdout = f

        self.app.run(host='127.0.0.1', port=self.port, debug=False, load_dotenv=False)

def find_available_port_html_resources() -> int:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind(('', 0))
    _, port = sock.getsockname()
    return port

USAGE = """
Photos dir must be provided in one of these ways:
- dir path as the first argument
- path to a .txt file, which contains one dir path per line
"""

PHOTO_DIRS = []

if len(sys.argv) >= 2:
    s = sys.argv[1]
    p = Path(s).expanduser()

    if p.is_dir():
        PHOTO_DIRS = [p]

    elif s.endswith(".txt"):
        with open(p, mode='r', encoding='utf-8') as f:
            for line in f:
                path = Path(line.strip())
                if path.exists() and path.is_dir():
                    PHOTO_DIRS.append(path)

        if len(PHOTO_DIRS) == 0:
            print(USAGE)
            sys.exit(2)

    else:
        print(USAGE)
        sys.exit(2)
else:
    print(USAGE)
    sys.exit(2)

PHOTOS = []

for d in PHOTO_DIRS:
    files = [d.joinpath(file) for file in os.listdir(d) if (file.endswith(".jpg") or file.endswith(".JPG"))]
    PHOTOS.extend(files)

random.shuffle(PHOTOS)

app = PicTabServer(5130, Path("assets"))

@app.app.route('/')
def index():
    return send_file(app.resources_base_dir.joinpath("index.html"), mimetype='text/html')

@app.app.route('/random_photo')
def random_photo():
    return send_file(random.choice(PHOTOS), mimetype='image/jpeg')

def main():
    app.start_server()
