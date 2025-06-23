# ts-server

1. `npm init y`
2. `npm install -D typescript @types/node`
3. Create a `tsconfig.json` file
4. `npm i express` and `npm i -D @types/express`

start postgres server

`sudo service postgresql start`
then 
`sudo -u postgres psql`

`CREATE DATABASE chirpy;`

connect to chirpydb `\c chirpy`


set user pw once `ALTER USER postgres PASSWORD 'postgres';`


connection: `postgres://postgres:postgres@localhost:5432/chirpy?sslmode=disable`