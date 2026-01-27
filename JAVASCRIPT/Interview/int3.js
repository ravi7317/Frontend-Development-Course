// function in javaScript
// q1- what is Function Decleration 
// function fn(num){
//     return num*num
// }
// console.log(fn(5));

//q2- what is function Expression
// const express=function(num){
//     return num*num;
// }
// console.log(express(10))

// //q3- what are first class function 
//  function square(num){
//      return num*num;
//  }
//   function dispalay (fn){
//     console.log("Square of this fn " + fn(5))
//   }
  
//   dispalay(square);

//   q4- what is IIFE  immediatly invoke function expression
(function square(num){
console.log(num*num)
})(6);
