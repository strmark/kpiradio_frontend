# Pi Radio frontend

This part of the project was written with Angular and was generated with [angular-cli](https://github.com/angular/angular-cli).

## Installation

### Pre requisite

Install nodejs 17x 
``` bash
curl -sL https://deb.nodesource.com/setup_17.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```
Clone the project
``` bash
git clone https://github.com/strmark/kpiradio_frontend.git
```

Install Angular cli
``` bash
sudo npm install -g @angular/cli
```

Install dependencies
``` bash
cd kpiradio_frontend
npm install
```

### Run a development server

Run the development server
``` bash
ng serve --host 0.0.0.0
```
Navigate to `http://server_ip:4200/`. The app will automatically reload if you change any of the source files.

### Run a prod server

Install nginx web server
``` bash
sudo apt-get install nginx
```

Build the project to generate static files
``` bash
ng build --configuration production --aot
```

The last command wil generate a "dist" folder. Place it in the nginx web server and give all right to the nginx user
``` bash
sudo cp -R dist/piradio /var/www/piradio
sudo chown -R www-data: /var/www/piradio
```

``` bash
Edit the file default `sudo nano /etc/nginx/sites-available/default` and change the line
        root /var/www/html;
with the following content
        root /var/www/piradio;

And the line
    location / {
        try_files $uri $uri/ =404;
    }

with the following
    location / {
        try_files $uri $uri/ /index.html;
    }
```
Pi Radio is now available from the address IP of your Raspberry Pi.
