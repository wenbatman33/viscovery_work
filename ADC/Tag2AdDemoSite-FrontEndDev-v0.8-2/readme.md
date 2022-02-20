# Tag2Ad Demo Site FrontEnd Development Version (on Mac OS)

## Folder structure: 

```
.
+-- data/   # important creatives
+-- output/  # folder that saves finished tasks
+-- readme.md
+-- src/  # Source codes. 
```

## Preparation 

### Install All related Environment
1. Install Bash Version 4
```.sh
   # install bash by HomeBrew
   $ ruby -e “$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   $ brew update && brew install bash
   
   # Add the new shell to the list of allowed shells 
   $ sudo bash -c ‘echo /usr/local/bin/bash >> /etc/shells’
   
   # Change to the new shell
   $ chsh -s /usr/local/bin/bash
```
2. Install nodejs from website
```.sh
   https://nodejs.org/en/download/
```

### Install All dependencies (Tag2Ad, tag_infer, SSD)

```.sh
   cd Tag2AdDemoSite
   bash ./scripts/install_environment.sh
``` 

### Setup Config file

Make sure all the settings are OK in
```.sh
   vim ./src/web_demo/config.ini
```
Remember to modify the following settings in section `[CriticalSettings]` __based on your settings__ in the first step
```.sh
   # web page port INSIDE docker container
   Server_LocalPort: 8888
   # notifier port INSIDE docker container
   Notifier_LocalPort: 8889
   # please set the ExternPort same as LocalPort
   Notifier_ExternPort: 8889
   # choose between Lite Version or Demo Version (True or False)
   isLiteVersion: True
```

## Launch demo site 

```.sh
   bash ./scripts/launch_server.sh
```

## Shutdown demo site

```.sh
   bash ./scripts/shutdown_server.sh
```