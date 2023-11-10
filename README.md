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

### Criar uma ficha do sistema 3D&T - `POST /new-sheet-3det`
#### Podemos criar uma ficha com base no sistema 3D&T, que possui os seguintes campos:
* Nome do personagem, Pontos, Classe, Raça, Pontos de Força, Pontos de Habilidade, Pontos de Resistência
Pontos de Armadura, Pontos de Poder de Fogo, Vantagens, Desvantagens, HP, MP , Pontos de Experiência
Tipos de Dano, Magias Conhecidas, Inventário e História.

### Exibir suas fichas - `GET /main`

### Exibir ficha completa - `GET /my-sheet/:sheetNumber`

### Editar ficha - `POST /my-sheet/:sheetNumber/update`

### Deletar ficha - `GET /my-sheet/:sheetNumber/delete`

### Fazer logout - `GET /user/logout`

### Criar uma ficha no sistema Terra Devastada - `POST /new-sheet-terra-devastada`
#### Podemos criar uma ficha com base no sistema Terra Devastada, que possui os seguintes campos:
* Nome do Personagem, Pontos de Horror, Aparência, Conceito, Características, Condições, Convicção, Trunfos e Inventário.

## (Projeto ainda em desenvolvimento...)

