// factory function 


// function createRactangle ( length,breadth){
//     return rectangle ={
//         length,
//         breadth,
//         draw (){
//             console.log('drawing');
//         }

//     }
// }
// let rectangleobj = createRactangle( 6,7);
// let obj2 = createRactangle(2,3);
// let obj3 = createRactangle(4,5);

// now create cunstructor function 

// function rectangle( length, breadth){
//     this.length=length
//     this.breadth=breadth
//     this.fun = function(){
//         console.log("drawing");
//     }
// }

// let obj1= new rectangle(8,9);
//this is  function cunstructor 


// let obj ={
//     ram:1,
//     shyam:2
// }

// now use for in loop to itrate 
// for(let key in obj){
//     console.log(obj[key])
// }

// let clon = {
//     a:10,
//     b:30,
//     c:40,
//     d:50
// }
// let clonobj = {};
//  for (let key in clon){
//     clonobj[key] = clon[key]
//  }

//  let clonobj=Object.assign({} ,clon)

// let clonobj = {...clon}
//  console.log(clonobj)

// function createRactangle (length,breadth){
//     return {
//         length,
//         breadth,
//         draw:function(){
//             console.log('drawing')
//         }

//     }
// }
// let newobj = createRactangle(7,8)
// console.log(newobj)

// using cunstructor 


function createRactangle(length,breadth){
    this.length=length,
    this.breadth=breadth,
    this.fun=function(){
        console.log('drawing')
    }
}
let obj = new createRactangle(7,8);
console.log(obj);
obj.draw()