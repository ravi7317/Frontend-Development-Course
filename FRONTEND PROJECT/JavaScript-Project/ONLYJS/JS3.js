const loginbtn = document.getElementById("loginbtn");
const dashboard = document.getElementById("dashboard");
const message = document.getElementById("message");

loginbtn.addEventListener("click" , ()=>{
    const email =document.querySelector("#email").value
    const password = document.querySelector("#password").value

    if(!email || !password){
        message.textContent ="All fields required";
        message.classList.add("error");
        message.classList.remove("success");
        return;
    }
    if(email === "admin@gmail.com" && password ==="1234"){
        message.textContent = "Logi  successful";
        message.classList.add("success");
        message.classList.remove("error");
        dashboard.classList.remove("hidden");
    }else{
        message.textContent = "invalid credentials";
        message.classList.add("erorr");
        message.classList.remove("success");
    }
});