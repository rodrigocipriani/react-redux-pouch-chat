# React Redux Pouch Chat # 0.0.1

Example Chat App with:

- Webpack 3
- React
- Redux
- PouchDB
- ExpressJS
- CouchDB
- SequelizeJS
- Postgres

## Dependencies ##

- Nodejs [Download [https://nodejs.org](https://nodejs.org)]
- Npm [with node]
- nodemon [npm install -g nodemon]

## How to Development ##

- Clone this repository `git clone https://github.com/rodrigocipriani/condominio.git`
- Intall dependencies `npm i` or `yarn`
- Start desenv `yarn dev` ou `npm run dev`
- Open on browser `localhost:8080`

## How to deploy ##

- Execute o comando `npm run depoy`
- Acesse `rodrigocipriani.herokuapp.com`

## Scripts ##

- Build: `npm run build`

## Structure ##
**(in construction)**

    .
    ├── /server           # your server side code
    ├── /client           # your browser code
    │   ├── /build        # build files by webpack
    │   ├── /config       # configs to run your project
    │   ├── /public       # ... Coming soon
    │   ├── /src          # source files, where your modules will be located
    │   │   ├── /App      # working sample of App implementation. Fell free to change.
    │   │   ├── /assets   # images and files to compose your project (don't use for uploads files, etc)
    │   │   ├── /Modulo   # your module
    │   │   │   ├── moduloAction.js       # actions requests
    │   │   │   ├── moduloActionTypes.js  # action types constants 
    │   │   │   ├── moduloConnector.js    # connector reducers and actions to containers components
    │   │   │   ├── ModuloContainer.js    # main component in the module
    │   │   │   └── moduloReducer.js      # module reducer
    │   │   ├── /Module 1         # other module ...
    │   │   ├── /Module 2         # another module ...
    │   │   ├── _variables.scss   # Sass styles variables to use in another sass files
    │   │   ├── index.html        # html first page (don't handle this file). To change title see "appTitle" on config file
    │   │   ├── index.js          # init your app. Use to configure your initial component from app
    │   │   ├── index.scss        # global styles from sass
    │   │   ├── store.js          # configure your reducers
    │   │   └── Router.js         # router component, only works with routes and renderize them 
    │   ├── .babelrc              # babel config file (don't handle this file)
    │   ├── package.json          # npm config file (don't handle this file)
    │   ├── webpack.config.json   # webpack config file (don't handle this file)
    ├── .gitignore                # ignored files from git repo
    ├── gulpfile.js               # project tasks
    ├── package.json              # npm configs
    ├── README.md                 # project readme
    ├── ...
    └── ...

## Frontend ##

**Conection behind files:**

- Component > Container > Connector > Reducer e Action > Services 

**Tips:**

- Reducer: Is a ...
- Action: Is a ...
- Action Types: Is a ...

## Todo ##

- [ ] Fix Heroku deploy
- [ ] Apply those concepts:
    - https://github.com/JedWatson/classnames
    - https://github.com/cssinjs/react-jss#custom-setup
    - http://cssinjs.org/jss-preset-default/?v=v3.0.
    - http://cssinjs.org/plugins/?v=v8.1.0

