console.log("This is 8th tutorial");

/* =====================================================
   FUNCTIONS IN JAVASCRIPT (BEGINNER NOTES)
   ===================================================== */

/*
Function:
- A function is a block of reusable code
- It runs only when it is called
- Functions reduce code repetition
- Functions are called the "building blocks" of JavaScript
*/

// Global scope variables (accessible anywhere)
let message  = "Harry ";
let message1 = "Ravi ";
let message2 = "Saurabh ";
let message3 = "Shubham ";

let greetText = "Good Morning";

/*
Function with parameters:
- message → value passed while calling function
- greetText → default parameter
- If greetText is NOT passed while calling,
  it will automatically take default value
*/

function greet(message, greetText = "This is a greet text") {

    // Function scope variable
    // This variable exists ONLY inside this function
    let message1 = "message1";

    // Printing message
    console.log(greetText + " " + message + message + "is a good boy");

    // Empty console line (just for spacing)
    console.log();
}

/*
Function calls:
- Arguments are passed here
- Order of arguments matters
*/

greet(message, greetText);   // Uses provided greetText
greet(message1, greetText);
greet(message2, greetText);
greet(message3);             // greetText not passed → default value used

/* =====================================================
   RETURN STATEMENT
   ===================================================== */

/*
Return:
- Sends a value back from function
- Stops function execution
- Returned value can be stored in variable
*/

function sum(a, b, c) {

    // Local variable
    let d = a + b + c;

    // Return result
    return d;
}

// Function call with return value
let returnval = sum(1, 2, 3);

// Print returned value
console.log(returnval);

/* =====================================================
   IMPORTANT INTERVIEW & EXAM POINTS
   ===================================================== */

/*
1. Function Scope:
   - Variables declared inside function are NOT accessible outside

2. Global Scope:
   - Variables declared outside function can be accessed inside

3. Default Parameters:
   - Used when argument is missing

4. return keyword:
   - Returns value from function
   - Ends function execution

5. Why use functions?
   - Code reusability
   - Clean & readable code
   - Easy debugging
*/
