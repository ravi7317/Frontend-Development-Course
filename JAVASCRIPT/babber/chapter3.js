// array insertion 

// let number = [1,2,3,4,5];
// end 
// number.push(6)
//start
//  number.unshift(0)
// middle 
// number.splice(2,0,5)
// console.log(number);


// find the numner
//  searching 
// console.log(number);

// if(number.indexOf(4) != -1){
//     console.log("present")
// }
// console.log(number.indexOf(4));

//  console.log(number.includes(3))

//  console.log(number.indexOf(2,5))

// let course =[
//     {no:1, naam:'love' },
//     {no:2, naam:'rahul'}
// ];
// console.log(course);
 
//  let couserss=course.find(function(course){
//     return course.naam= 'love'
// })
// let  couserss = course.find(course => course.naam ==='love')

// console.log(couserss)


// let number = [1,2,3,4,5,6,7];
// number.splice(3,2)
// console.log(number)
 //emplty array
// let number = [1,2,3,4,5,6,7];
// method 1
// let number2=number;
//number.length=0;

// method 2
// number.splice(0,number.length)
// console.log(number)
// console.log(number2)

// combine and slice array 
// let arr1 = [1,2,3,4,5]
// let arr2= [6,7,8,9]
// let combine= arr1.concat(arr2)
// console.log(combine)

// let slicee = combine.slice(2,4);
// console.log(slicee)

// let marks = [ 10,20,30,40,50,60,70,80]
// let sliced = marks.slice(2,6)
// console.log(sliced)

// iterate the value 
//  let num = [1,2,3,4,5,6]
//  for (let i of num){
// num.forEach(i =>console.log(i)
// );
// num.forEach(i=>console.log(i))

// ==============Join Array=========
// const joined = num.join("+")
// console.log(joined)

//=============split the array=========//
// let message = " this is a mango";
// let splitt = message.split(' ')
// console.log(splitt.length)

//=======sorting array====//
// let a = [1,9,5,7,3,2]
// let sorted = a.sort()
// console.log(sorted)
//  sorted.reverse()
//  console.log(sorted)

// let a = [5,10,4,40]
// a.sort();
// console.log(a);

//======sorting object ====//
// let arr = [
//     {id:3,name:"shyam"},
//     {id:1, name:"ravi"},
//     {id:2, name:"surya"}
//]
// arr.sort((a,b) => b.id-a.id)
// console.log(arr)
// arr.sort((a,b) => a.name.localeCompare(b.name));
// console.log(arr)
//==========filter=======
//  let number = [1,2,3,4,5,-6,-7,-8]
//  let filterd = number.filter(function(value){
//     return value>=0;
//  });
// let filterd= number.filter(value=> value>=0
// )
//  console.log(filterd)

//=============map=========

// let a= [1,2,3,4,5,6]
//let b= a.map(value=> 10+value); //using arrow function
// let b= a.map(function(value){/// using function
//     return "student_"+value
// })

// console.log(b)

// maping with object 
let number =  [ 1,2,3,4,5,6,-7,-8,-9]
// let filterd = number.filter(value => value>=0);
// let obj = filterd.map(num =>({value:num}))
// console.log(obj)
let item = number
.filter(value => value>=0)
.map(num => ({value:num}));
console.log(item);

 


