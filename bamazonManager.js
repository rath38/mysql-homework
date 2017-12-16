var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,


  user: "root",

 
  password: "googie",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {

inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product"],
          message: "What command would you like to use?"
        }
      ])
      .then(function(answer) {

      	if (answer.choice === "View products for sale") {

      		 connection.query("SELECT * FROM products", function(err, res) {
    		 if (err) throw err;
    		console.log(res);
  			});

      	}

      	else if (answer.choice === "View low inventory") {

      		connection.query("SELECT * FROM products", function(err, results) {
    		 if (err) throw err;
    		
    		 for (var i = 0; i < results.length; i++) {
          if (results[i].stock_quantity < 5 ) {
            console.log(results[i]);
          }
        }


  			});




      	}

      	else if (answer.choice === "Add to inventory") {

      	connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          },
          message: "What item would you like to add inventory to?"
        },
        {
          name: "amount",
          type: "input",
          message: "How much would you like to add?"
        }
      ])
      .then(function(answer) {
        
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }
        var newQuantity = chosenItem.stock_quantity + parseInt(answer.amount);

        var name = chosenItem.product_name;

        connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newQuantity
      },
      {
        product_name: name
      }
    ],
    function(err, res) {
    	if (err) throw err;
      console.log("Thank you " + answer.amount + " more have been added.") ;
    });


        });

      	});

      }

      	else {

      		inquirer
      .prompt([
        {
          name: "name",
          type: "input",
          message: "What is the name of the product you like to add?"
        },
        {
          name: "department",
          type: "input",
          message: "What is the department of the product you like to add?"
        },
        {
          name: "price",
          type: "input",
          message: "What is the price of the product you like to add?"
        },
        {
          name: "stock",
          type: "input",
          message: "How much stock of the product you like to add?"
        }
      ])
      .then(function(answer) {
 
      	var newName = answer.name;

      	var newDepartment = answer.department;

      	var newPrice = parseFloat(answer.price);

      	var newStock = parseInt(answer.stock);

      	connection.query(
    "INSERT INTO products SET ?",
    {
      product_name: newName,
      department_name: newDepartment,
      price: newPrice,
      stock_quantity: newStock
    },
    function(err, res) {
    	if (err) throw err;
      console.log("The product " + answer.name + " has been added.");
      
    });


      });




      	}
 

      });





}