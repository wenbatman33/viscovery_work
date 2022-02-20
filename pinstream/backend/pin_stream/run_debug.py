#!/usr/bin/python
# -*- utf-8 -*-
import sys
from flask_app import app

if __name__ == '__main__':
    is_debug = True

    if len(sys.argv) > 1:
        is_debug = bool(int(sys.argv[1]))
    app.run(host='0.0.0.0', port=8085, debug=is_debug)
