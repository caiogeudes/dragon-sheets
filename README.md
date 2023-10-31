# Dragon Sheets 🐲
## O que é?
### Dragon Sheets é um projeto que você pode criar fichas de RPG online e armazená-las em um banco de dados.
## Instalação
### Inicialmente devemos criar nosso banco de dados, e rodar a query do dump para criarmos as tabelas. Este dump está em um arquivo chamado "*dump.sql*" 
### Com o banco de dados criado, devemos definir as variáveis de ambiente. Para isso, deixei no código um arquivo chamado "*.env.example*", nele, você deve informar os dados da sua aplicação.
### Após estas etapas, devemos instalar as bibliotecas com o npm:
```
    npm i
``` 
### Em seguida, devemos inicializar o nosso servidor:
```
    npm run dev
```
## Funcionalidades
### Cadastrar novo usuário - `POST /sign-up`
#### Neste endpoint, é possível criar uma conta para acessar as funcionalidades do projeto. Para efetuar o registro, será necessário fornecer:
* Nome
* Email
* Senha
### Fazer login - `POST /login`
#### Podemos fazer login com: 
* Email
* Senha

### Exibir perfil do usuário logado - `GET /user`

### Criar uma ficha - `GET /new-sheet`

### Exibir suas fichas - `GET /main`

## (Projeto ainda em desenvolvimento...)

