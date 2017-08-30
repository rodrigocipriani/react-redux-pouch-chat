# Condomínio # 0.0.1

Sistema teste

## Dependências ##

- Nodejs [Baixe aqui [https://nodejs.org](https://nodejs.org)]
- Npm [Vem junto com Node]
- nodemon [npm install -g nodemon]

## Como rodar o projeto ##

- Crie uma pasta workspace no seu diretório home
- Digite no console `git clone https://github.com/rodrigocipriani/condominio.git`
- Execute o comando `npm i`
- Execute o comando `npm start` ou `npm run dev` para o modo de desenvolvimento
- Acesso o endereço `localhost:8080` no navegador

## Como fazer deploy ##

- Execute o comando `npm run depoy`
- Acesse `rodrigocipriani.herokuapp.com`

## Scripts

- Build: `npm run build`

## Structure ##
**(in construction)**

    .
    ├── /server           # your server side code
    ├── /client           # your browser code
    │   ├── /build        # build files by webpack
    │   ├── /config       # configs to run your project
    │   ├── /fonts        # source Fonts to webpack load with your build
    │   ├── /public       # ... Coming soon
    │   ├── /src          # source files, where your modules will be located
    │   │   ├── /App      # working sample of App implementation. Fell free to change.
    │   │   ├── /assets   # images and files to compose your project (don't use for uploads files, etc)
    │   │   ├── /Auth     # working sample of Auth implementation. Fell free to change.
    │   │   ├── /config   # configs for your application, like urls api, etc
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

**Conexões entre os arquivos:**

- Component > Container > Connector > Reducer e Action > Services 

**Dicas:**

- A pasta /client/src/Auth guarda os componentes de autenticação implemente sua rotina de autenticação de acordo como
  for necessário.
- Reducer: É um ...
- Action: É um ...
- Action Types: É um ...

## Tarefas ##

Para as tarefas utilizar o Trello [trello.com](trello.com)

- [ ] Corrigir deploy para o heroku
- [ ] Aplicar os conceitos abaixo e remover Sass
    - https://github.com/JedWatson/classnames
    - https://github.com/cssinjs/react-jss#custom-setup
    - http://cssinjs.org/jss-preset-default/?v=v3.0.
    - http://cssinjs.org/plugins/?v=v8.1.0
- [X] Criar tarefas de deploy
- [ ] Alterar dependencia 
- [ ] Melhorar Container principal, menu lateral, etc
- [ ] Colocar os scripts do projeto para es2x
- [ ] Melhorar server
- [ ] Melhorar tamanho do build do client

