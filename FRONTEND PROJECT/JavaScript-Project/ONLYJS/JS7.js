const user ={
    name: "Ravi",
    age: 22,
    email: "ravi@gmail.com",
    isLoggedIn: false
};
console.log(user.name);
// user.email = "admin@gmail.com";
user['email'] = "admin@gmail.com";
console.log(user.email);
console.log(user);

function togglelogin(userobj){
    userobj.isLoggedIn =!userobj.isLoggedIn
    console.log(`login status: ${userobj.isLoggedIn}`)
}

togglelogin(user)
togglelogin(user)