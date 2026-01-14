from __future__ import annotations

import http.server
import os
import socketserver
import argparse
from urllib.parse import urlparse


ROOT = os.path.join(os.path.dirname(__file__), "..", "site")
DEFAULT_PORT = 8000


class SpaHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:
        # Serve from /site
        parsed = urlparse(path)
        rel = parsed.path.lstrip("/")
        return os.path.join(ROOT, rel)

    def do_GET(self):
        parsed = urlparse(self.path)
        request_path = parsed.path

        # Serve existing files as-is
        fs_path = self.translate_path(request_path)
        if os.path.isdir(fs_path):
            index = os.path.join(fs_path, "index.html")
            if os.path.exists(index):
                self.path = request_path.rstrip("/") + "/index.html"
                return super().do_GET()

        if os.path.exists(fs_path) and not os.path.isdir(fs_path):
            return super().do_GET()

        # SPA fallback for clean URLs
        self.path = "/index.html"
        return super().do_GET()


def main(port: int) -> None:
    os.chdir(ROOT)
    with socketserver.TCPServer(("", port), SpaHandler) as httpd:
        print(f"Serving {ROOT} at http://localhost:{port}")
        httpd.serve_forever()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Dev server for the static SPA (clean URL fallback to /index.html).")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help=f"Port to listen on (default: {DEFAULT_PORT}).")
    args = parser.parse_args()
    main(args.port)
