let isLoggedIn = false;
let totalIncome =0;
let totalExpence =0;

const loginuser = (email,password) =>{
    if(email === "abc@gmail.com" && password ==="1234"){
        isLoggedIn=true;
        return "Login Succesful"
    }else{
        return "Invalldi creadentials"
    }
};

const addincome = (amount) =>{
    if(!isLoggedIn)
   return  "Please login First";

    totalIncome += amount;
    return `income added  ${amount}`
};
 
const addExpence = (amount) => {
    if(!isLoggedIn) 
       return "Please login First";
     totalExpence += amount
     return `Expence added ${amount}`
};

const calculateBalance =()=>{
    return totalIncome - totalExpence
};

console.log(loginuser("abc@gmail.com" , "1234"));


console.log(addincome(5000));
console.log(addincome(3000));


console.log(addExpence(1000));
console.log(addExpence(500));


console.log("Remaing Balance" ,  calculateBalance());