// let task =[];
// task.push("Java Script")
// task.push("ravi");
// task.push("Saurabh");
// task.pop();
// console.log(task);

//  const price = [100,200,300];
//  const withtax = price.map(price => price+18);
//  console.log(withtax);

//  const expencive = price.filter( price => price >150);
//  console.log(expencive)

//  const total = price.reduce((sum,price) => sum+price,0);
//  console.log(total);


let todo =[];

const addtodo = (task)=>{
    if(!task) return "Task can not be Empty";
    todo.push(task);
    return todo;
};

const removelasttod = () =>{
    todo.pop();
    return todo;
};

const filtertodo = (keyword) => {
    return todo.filter(todo => todo.includes(keyword));
};

const formattodo = () => {
    return todo.map(todo => ` ${todo}`);
};

const totaltodo =()=>{
    return todo.reduce( count => count +1,0);
};

addtodo("Learn JS");
addtodo("Practice Dom");
addtodo("Build Project");

console.log(formattodo());
console.log(filtertodo("JS"));
console.log("total:",totaltodo());
console.log(removelasttod());



const names = [1,2,3,4,5,6,7,8,9]
const count = names.reduce((sum,names) => sum+names,0);
console.log(count);
