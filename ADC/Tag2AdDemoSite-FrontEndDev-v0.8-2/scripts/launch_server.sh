#!/bin/bash

# load the  INI file to current BASH - quoted to preserve line breaks
eval "$(cat ./src/web_demo/config.ini | ./src/web_demo/ini2arr.py)"

# start server
python src/web_demo/server.py &

# start notifier
node src/web_demo/notifier.js ${CriticalSettings[notifier_localport]} &