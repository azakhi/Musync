# Musync
Musync app

## Installation
`node.js` and `mongodb` are required.

After cloning the repository open command window in root directory of the project and install node modules:
```
npm install
```

You need to set environment variables. Those can be seen in `config.js` file.

Setup database:
```
npm run setup_db            Run script in environment currently set (if none, default is 'dev')
npm run setup_db:dev        Run script in 'dev' environment
npm run setup_db:test       Run script in 'test' environment
```
Use `clear` argument to clear existing collections:
```
npm run setup_db -- clear
```

## Running application
```
npm start                   Start application in environment currently set (if none, default is 'dev')
npm run start:dev           Start application in 'dev' environment
npm run start:test          Start application in 'test' environment
```
Run the application in 'dev' mode to hot reload the changes as you make.
