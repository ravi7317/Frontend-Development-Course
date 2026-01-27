let isLoggedIn = false;
let roll = null;
let totalincome = 0;
let totalExpence = 0;


const userlogin = (Email , Password) =>{
    if(!Email || !Password){
        return "Email and Password required";
    }

    if(Email === "ravi@gmail.com" && Password === "12345"){
        isLoggedIn=true;
        roll = "admin"
        return "Admin login successful";
    }
    else if(Email ==="saurabh@gmail.com" && Password ==="4321"){
        isLoggedIn = true;
        roll = "user";
        return "User login Successful";
    }else{
        return "Invalid credentials";
    }
};

const addIncome = (amount) => {
    if(!isLoggedIn){
        return "Please login First"
}

if(roll !=="admin"){
    return "Only admin can add income"
}
if(amount<=0){
    return "Invalid Amount"
}
totalincome +=amount;
return `income added ${amount}`
};

const addincome = (amount) =>{
    if(!isLoggedIn){
        return " Please login first";
    }
    if(roll !=="admin"){
        return "only admin can add income"
    }
    if(amount <=0 ){
        return "Invalid income amount"
    }
    totalincome+=amount;
    return `Amount added; ${amount}`
};

const addExpense = (amount) => {
  if (!isLoggedIn) {
    return "Please login first";
  }

  if (amount <= 0) {
    return "Invalid expense amount";
  }

  if (totalExpence + amount > totalincome) {
    return "Expense exceeds available balance";
  }

  totalExpence += amount;
  return `Expense added: ₹${amount}`;
};

const showDashboard = ()=>{
    if(!isLoggedIn){
        return "Redirect to login"
    }

    if(roll === "admin"){
        return"show admin dashborad";
    }else {
        return "Show user dashboard";
    }
};

const getBalance = ()=> {
    return totalincome-totalExpence;
};

console.log(userlogin("ravi@gmail.com", "12345"));

console.log(addIncome(100000));

console.log(addExpense(3000));
console.log(addExpense(7000)); // should fail

console.log(showDashboard());
console.log("Balance:", getBalance());
