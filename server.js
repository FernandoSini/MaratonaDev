//configurando o server
const express = require('express')
const server = express()
const port = 3000

/*// lista de doadores: array de objetos com nome e sangue
const donors = [
    {name: 'Fernando Sinigaglia', blood:'AB+'},
    {name: 'Cleiton Souzza', blood:'O+'},
    {name: 'Robson', blood:'A+'},
    {name: 'Irinéias', blood:'AB+'}

]*/


//configurando o servidor para apresentar arquivos estáticos
server.use(express.static("public"))//middleware

//habilitando o body/corpo do formulário
server.use(express.urlencoded({extended: true}))

//configurando a conexão com o banco de dados
const mySql = require('mysql')
const db = mySql.createConnection({
   host: 'localhost',
    user: 'root',
    password:'password',
    database: 'doe'

})

// //criando o  banco
// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     /*Create a database named "mydb":*/
//     db.query("CREATE DATABASE doe", function (err, result) {
//         if (err) throw err;
//         console.log("Database created");
//     });
// });
//
// criando a tabela do banco
// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "CREATE TABLE donors (id INTEGER(100) PRIMARY KEY NOT NULL AUTO_INCREMENT,name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, blood VARCHAR(255) NOT NULL)";
//     db.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Table created");
//     });
// });



//configurando a template engine
const nunjucks = require('nunjucks')
nunjucks.configure("./",{
    express:server,
    noCache: true, //boolean que aceita 2 valores verdadeiro ou falso, então ele não quer que faça um cache(inteligencia para não ficar buscando dados)
});

//rota do tipo get
//configurando a apresentação da página
server.get("/", function (req,res) {

    var sql = 'SELECT * FROM donors'
    db.query(sql, function (err, result, fields) {
            if (err) {
                throw err;
                console.log(err)
                console.log(result);

            }
            console.log('buscado no banco')
            const donors = result
            return res.render('index.html', {donors})
        });
})


// //rota do tipo post
// //receber os dados do formulário, o post é só pro formulário
server.post("/", function(req,res) {
    //pegando os dados do formulário
   const name = req.body.name;
   const email= req.body.email;
   const blood = req.body.blood;

   if(name == "" || email == "" || blood == ""){
       return res.send("Todos os campos são obrigatórios.")
   }
    const values = [name.toString(), email.toString(), blood.toString()] // name email e blood substitui os dollares
   //colocando valores dentro do banco de dados

        var sql = 'INSERT INTO donors (`name`, `email`, `blood`) VALUES (?,?,?)';
        db.query(sql,values, function (err) {
            //fluxo de erro
            if (err) {
                throw err;
                console.log(err)
            }
                console.log(" record inserted");

            //fluxo ideal
            return res.redirect("/") //não vai redirecionar pro post
        });


})
//ligar o servidor e permitir o acesso na porta 3000
server.listen(port, function() {
    console.log("Server iniciado na porta: ", port)
})
