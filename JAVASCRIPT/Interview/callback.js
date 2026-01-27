// console.log("hii");

// setTimeout( ()=> {
//     console.log("Ravi")
// }, 5000);

// console.log("Good Morning")

// // for example a e comerce website 
// const cart = ["shoes" , " pants" , "kurta"]
// api.createorder (cart , function (){
//     api.proceedPayment (function(){
//         api.Showorder(function(){
//             api.update ()
//         })
//     })
// })

// inverson of cantrol 
// inversion of cantrol is like when you loss the control on code using call back hell

setTimeout(() => {
    setTimeout(() => {
        setTimeout(() => {
            console.log("Done");
        }, 1000);
    }, 1000);
}, 1000);
