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
## Endpoints
### `POST /sign-up`
#### Neste endpoint, é possível criar uma conta para acessar as funcionalidades do projeto. Para efetuar o registro, será necessário fornecer:
* Nome
* Email
* Senha
### `POST /login`
#### É necessário efetuar o login com: 
* Email
* Senha
### `GET /user`
#### Detalha a conta do usuário logado.

## (Projeto ainda em desenvolvimento...)

