@echo off
echo Starting My Props Backend...
set DB_HOST=az-my-props.database.windows.net
set DB_NAME=hma-my-props
set DB_USER=mypropsadmin
set DB_PASS=MyPr0psAdm
set DB_PORT=5432
set PORT=3000
node src/app.js
