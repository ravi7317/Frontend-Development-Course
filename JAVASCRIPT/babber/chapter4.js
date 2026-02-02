//  function decleration 
//  run() ;
// function run(){
//     console.log("runing")
// }
//function assignment 

// let stand = function walk (){
//     console.log("walking")
// }
// stand();

// let think = stand; 
// think();

// Anonymous function assignment 
// let Anonymous = function (){
//     console.log('anonymous')
// }
// Anonymous()
 

// function add(a,b){
//     return a+b
// }
// console.log(add(4,4))

// function adds(a,b){
//     console.log(arguments)
//     return a+b
// }
// console.log(5,6,7,8,9)

// function adds (){
//     let total =0;
//     for(let i of arguments)
//         total  += i;
//     return total
// }
// let sum = adds(1,2,3,4,4,5);
// console.log(sum)

//rest operator 

// function sum(a,b, ...args){
//     console.log(a)
//     console.log(b)
//     console.log(args)
// }
// sum(1,2,3,4,5);

// default paramete 
// function intrest (p ,r,y=10){
//     return p*r*y/100
// }
// console.log(intrest(10,10))

//getter and setter

// let obj = {
//     fName: 'Ravi',
//     lName : 'Verma',
//     get fullname(){
//         return `${this.fName} ${this.lName}`
//     }, 
//     set fullname(value){
//         let parts = value.split(' ');
//         this.fName=parts[0];
//         this.lName=parts[1]
//     }
// };
// obj.fullname="Rahul kumar"
// console.log(obj.fullname)

// try{
// let result = x+10;
// console.log(result)
// }catch(err){
//     console.log("error occured" ,err.message)
// }

//======scope====
///we can call var outside the scope

// {
//     let b= 10;
// }
// console.log(b) let can not call outside of the function

// function walk(){
//     var a = 5
//}
// console.log(a) // if this var is not defind under a function it can be call out side scope

// function a(){
//     const ab =5;
// }

// function b(){
//     const ab =5; 
// }
let a =[23,45,67,89]
//  let total=0;
//  for(let i of a){
//      total += i;
//  }
//  console.log(total)

 let total = a.reduce((sum , value) =>sum+value,0)
 console.log(total)







