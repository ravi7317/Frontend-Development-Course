//currying  is a function that take one argument at a time and return a new function expection a new argument
//it is conversion of function calable as f(a,b) into calable as this f(a)(b)
//and currying function are constructed by chaining closer by immeditaly return thier inner function
// // currying in javaScript
// function f(a){
//     return function(b){
//         return `${a} ${b}`
//     }
// }
// console.log(f(5))


// let a = [
//     {Name: "Ravi"},
//     {Rollno: 49 },
//     {class: 5},
//     {subject: "English"}
// ]
// let myobje = JSON.stringify(a);
// console.log(myobje);

// myobje = myobje.replace("Ravi", "Rohan");
// console.log(myobje);

// let b =JSON.parse(myobje);
// console.log(b);

let a = () =>{
    console.log("Good morning")
}
a()

// let b = ( )