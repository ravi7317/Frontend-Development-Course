// An object named 'user'
const user = {
    username: "Ravi",
    price: 999,

    // Method inside object
    welcomeMessage: function () {
        // 'this' refers to the CURRENT object (user)
        console.log(`${this.username} welcome to the website`);

        // Prints the entire 'user' object
        console.log(this);
    }
};

// user.welcomeMessage();             // Ravi welcome to the website
// user.username = "sam";             // change object property
// user.welcomeMessage();             // sam welcome to the website
// console.log(this);                 // In browser → window object, in Node → empty object

// Normal function (NOT inside an object)
function meggie() {
    let username = 'hitesh';

    // 'this' in normal function does NOT refer to local variables
    // In browser → window
    // In Node.js → undefined / empty object
    console.log(this.username); // undefined
}

// meggie();


// Function expression (regular function)
const arro = function () {
    let username = "mohan";

    // Regular functions have their own 'this'
    // But 'this.username' does NOT access local variables
    console.log(this.username); // undefined
};

// arro();

// Arrow function
const arro1 = () => {
    let username = "mohan";

    // Arrow functions DO NOT have their own 'this'
    // They inherit 'this' from their parent scope
    console.log(this.username); // undefined
};

// arro1();


// Arrow function with explicit return
const addtwo = (num1, num2) => {
    return num1 + num2;
};

// console.log(addtwo(5, 6)); // 11


// Arrow function with implicit return
// When there is a single expression, return is automatic
const addtwo2 = (num1, num2) => num1 + num2;

console.log(addtwo2(5, 6)); // 11


// Arrow function returning an object
// Parentheses are REQUIRED to return an object
const obj = () => ({ username: 'hitesh' });

console.log(obj()); // { username: "hitesh" }
