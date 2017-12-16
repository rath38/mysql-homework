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
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
   questions();
  });

  

}

function questions() {

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
          message: "What item would you like to buy?"
        },
        {
          name: "amount",
          type: "input",
          message: "How many would you like to buy?"
        }
      ])
      .then(function(answer) {
     
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        if (chosenItem.stock_quantity > parseInt(answer.amount)) {

        var newQuantity = chosenItem.stock_quantity - parseInt(answer.amount);

       //console.log(newQuantity);

       //console.log(chosenItem.item_id);

 connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newQuantity
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(error) {
              if (error) throw err;
              //console.log("it works")
              var totalPrice = chosenItem.price * parseInt(answer.amount);
              console.log("Total price: $" + totalPrice);
            }
          );
        //updateQuantity();

        }	

        else {

        console.log("Insufficient quantity!!!")

    	start();

        }

    });
  });
}

//function updateQuantity() {



//}






