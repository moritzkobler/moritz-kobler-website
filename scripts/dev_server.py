from __future__ import annotations

import http.server
import os
import socketserver
from urllib.parse import urlparse


ROOT = os.path.join(os.path.dirname(__file__), "..", "site")
PORT = 8000


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


def main() -> None:
    os.chdir(ROOT)
    with socketserver.TCPServer(("", PORT), SpaHandler) as httpd:
        print(f"Serving {ROOT} at http://localhost:{PORT}")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
