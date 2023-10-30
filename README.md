# Dragon Sheets 🐲
## O que é?
### Dragon Sheets é um projeto que você pode criar fichas de RPG online e armazená-las em um banco de dados.
## Instalação
### Build Docker image
```
docker build -t dragon-sheets:latest .
```
### Run Docker container
```
docker run -d -p8080:8080 --name dragon-sheets dragon-sheets:latest
```
### Após fazer o fork e clone do projeto, devemos instalar as bibliotecas com o npm:
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

