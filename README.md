# homebridge-http-motion

a litte helper to control a Scene from a another Device like a Andriod Phone 

## Installation
Login as root
```bash
git clone https://github.com/svonbentzel/homebridge-http-motion.git
cd homebridge-http-motion
npm install -g
```

## Config
```json
 "accessories": [
    {
      "accessory": "http-motion-sensor",
      "name": "Remote-Switch-on",
      "port": 18000
    },
    {
      "accessory": "http-motion-sensor",
      "name": "Remote-Switch-off",
      "port": 18001
    }
  ]

```
## Usage
http://localhost:18000 to activate motion and trigger a Scene
http://xxx.xxx.xxx.xxx.18000  to activate motion and trigger a Scene

http://localhost:18001 to activate motion and trigger a Scene
http://xxx.xxx.xxx.xxx.18001  to activate motion and trigger a Scene

and so on ;-) 

litte Android Bridge ;-) 







 
