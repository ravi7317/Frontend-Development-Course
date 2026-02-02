const user = {
    id: 101,
    name: "Ravi Verma",
    email: "ravi@gmail.com",
    isloggedin: false,
    address: {
        city: "Delhi",
        pincode: 110001
    }
};

function displayUser(){
    const info= 
    `<strong>Name:</strong> ${user.name} <br>
     <strong>Email:</strong> ${user.email} <br>
     <strong>Login status:</strong> ${user.isLoggedIn ? "Logged In" : "Logged Out"}`;

     document.getElementById("info").innerHTML=info;

}

function togglelogin(){
    user.isLoggedIn = !user.isLoggedIn;
    displayUser();
}

function updateEmail(){
    user.email = "newmail@gmail.com";
    displayUser();
}

function showCity(){
    alert( "City" + user.address.city);
}

displayUser();