// console.log('good morning');
// setTimeout(function(){
//     console.log('A')
// }, 3000)

// function sync(){
//     console.log("B")
// }
// sync();

// console.log('heloo dostoo')

// this is the asynchronous code example

//Api what is api api is an interface that conect the frontent to the server it
// it is act like a interface
// for featching api we use fetch()

// Promise

// let Promises = new Promise(function(resolve,reject){
//     setTimeout(function(){
//         console.log("Hello")
//     },5000)
//     resolve("task resolve");
//     reject(new Error ('error is coming'));
// });
// console.log('hello world');

// Promises.then((value) =>{console.log(value)})

// let Promises = new Promise (function(resolve,reject){
//     let success = true;

//     if(success){
//         resolve("Task completed");
//     }else{
//         reject("Task not Completed")
//     }
// });
// console.log(Promises)

// let p= new Promise(function(resolve,reject){
//     resolve("sucess")
// })
// p.then(result =>{console.log(result)});

// let R = new Promise(function(resolve,reject){
//     reject('rejected')
// })
// R.catch(error => {console.log(error)});

// let wadda1 = new Promise(function (resolve, reject) {
//   setTimeout(() => {
//     console.log("Settime1 out started");
//   }, 2000);
//   resolve(true);
// });

// let output = wadda1.then(() => {
//   let wadda2 = new Promise(function (resolve, reject) {
//     setTimeout(() => {
//       console.log("settime2 out starded");
//     }, 3000);
//     resolve("wadda2 is resolved ");
//   });
//   return wadda2;
// });
// output.then((value) => {console.log(value);
// });

// creating async function 

// async function abc(){
//     return 'helo ravi kaese ho';
// }
// async function utility(){
// let delhimausam = new Promise(function (resolve,reject){
//     setTimeout(() => {
//         resolve("delhi me bhut garmi hai")
//     }, 2000);
// })

// let gurgavmausam = new Promise(function(resolve,reject){
//     setTimeout(() => {
//         resolve("gurgav me bhut barish ho rhi hai")
//     }, 5000);
// })

// let DM = await delhimausam;
// let GM = await gurgavmausam;
// return [DM,GM]
// }
// async function abc(){
//     let content = await fetch('https://fakestoreapi.com/products')
//     let output = content.json();
//     console.log(output)
// }
// abc()

//=======put method===========
// async function abc() {
// let option ={
//     method: 'POST',
//     body:JSON.stringify({
//         title: 'foo',
//         body: 'bar',
//         userId:1,
//     }),
//     headers: {
//         'content-type' : 'application/json; charset=UTF-8',
//     },
// };

// let content = await fetch('https://jsonplaceholder.typicode.com/todos',option)
// let output = content.json()
// return output;
// }
// abc().then((value)=> {console.log(value)});

//=========closer==========
// let name = 'sher';
// function init(){
//     let name = 'Mozila';
//     function display(){
//         let name = 'bubber'
//         console.log(name)
//     }
//     display()
// }
// init();

function outer (){
    let A = 'Rahul';
    function inner (){
        console.log(A)
    }
    return inner;
}
let fn = outer();
fn();
