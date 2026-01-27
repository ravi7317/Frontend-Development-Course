//map filter and reduce 
//what is map 
// const nums = [1,2,3,4];
// const multiply = nums.map((nums,i,arr)=>{
//     return nums*3+i;
// });
// console.log(multiply)

//filter
// const nums = [1,2,3,4];
// const morethantwo = nums.filter((r,i,arr) =>{
//     return r > 2;
// });
// console.log(morethantwo);

// filter  method return new array that fulfil the condition pass through the filter method 


// reduce 

// const nums =[1,2,3,4];
// const sum = nums.reduce((acc ,cur ,i ,arr) =>{
//     return acc+cur;
// });
// console.log(sum);


/*Question 1: map
You are given an array of numbers: 
const numbers = [2, 4, 6, 8];
Write a JavaScript function using map to return a new array where each number is squared.
*/
/*const number = [2,4,6,8];
const squar = number.map((number,i,arr) => {
    return number**2
});
console.log(squar);
*/

/*Question 2: filter
Given an array of integers:
const values = [12, 5, 8, 20, 3, 15];
Use filter to create a new array containing only numbers greater than 10
Expected Output:
[12, 20, 15]
*/
/*
const value = [12,5,8,20,3,15];
const array = value.filter((num,i,arr) =>{
    return num>10;
});
console.log(array);
*/
/*
Question 3: reduce
You are given an array:
const prices = [100, 200, 300, 400];
Use reduce to calculate the total sum of all prices.
Expected Output:
1000
*/

/*
const prices= [100,200,300,400];
const sum = prices.reduce((acc, cur, i, arr)=> {
    return acc + cur;
})
console.log(sum)
*/

/*
Question 4: Combination of filter and map
Given an array of numbers:
const data = [1, 2, 3, 4, 5, 6];
First, filter out even numbers, then multiply each remaining number by 3 using map.
Expected Output:
[3, 9, 15]
*/

// const data = [1,2,3,4,5,6];
// const even = data.filter((num,i,arr) => {
//     return num %2 != 0;
    
// });
// const multi = even.map((even,i,arr) =>{
//     return even*3;
// });
// console.log(multi);

// const data = [1,2,3,4,5,6];

// const oddnumber= data.filter(num => num %2 !==0);
// const result = oddnumber.map(num => num*3);
// console.log(result);

/*
Question 5: Combination of map and reduce
You are given an array of objects:
const users = [
  { name: "Ravi", age: 21 },
  { name: "Amit", age: 25 },
  { name: "Neha", age: 19 }
];
Use map and reduce to calculate the average age of all users.
Expected Output:
21.67
*/
// const users = [
//     { name: "Ravi" , age:21},
//     {name : "Amit" , age: 25},
//     {name: "Neha", age:19},
// ];
// const age = users.map(user => user.age);

// const average = age.reduce((acc,curr,i,arr) =>{
//     return (acc+curr);
// })
// console.log(average/age.length);


// const nums =[1,2,3,4,5];
// const multi = nums.reduce((acc, cur, i,arr) => {
//     acc.push(cur*2);
//     return acc;
// },[]);
// console.log(multi)

// const nums =[1,2,3,4,5];
// const multi = nums.map((nums, i , arr)=>{
//     return nums*2
// })
// console.log(multi)

// diff bw map and forEach 
// const  num = [1,2,3,4,5,6];
// const arr = num.map((num1) => {
//     return num1+3;
// }); // here we can perform other method like filter reduce

// const arr1 = num.forEach((num1) =>{
//     return num1+2;
// }
    
// );

// console.log(arr,arr1)



let students = [
    { name: "piyush", rollno: 31 , marks: 80},
    {name: "Jenny" , rollno: 15, marks: 69},
    {name: "Kushal" , rollno: 16, marks: 35},
    {name: "Dilpreet", rollno: 7, marks: 55}
];
// let names =[];
// for(let i = 0; i<students.length; i++){
//     names.push(students[i].name.toLocaleUpperCase())
// };
// const names = students.map(students=> students.name.toUpperCase())
const markss = students.map(student => student.marks);
const ms = students.filter(students=> students.marks>50 && students.rollno>15)
const sum = markss.reduce((acc,curr)=> acc+curr,0);

console.log(markss,ms,sum/markss.length);




