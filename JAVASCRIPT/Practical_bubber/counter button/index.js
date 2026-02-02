let count = 0;

let incbtn = document.getElementById('increase')
let decbtn = document.getElementById('decrease')
let countbtn = document.getElementById('count')

incbtn.addEventListener('click' , function(){
    count++;
    countbtn.textContent= count;
})
decbtn.addEventListener('click' , function(){
    if(count ==0) return ;
    count--;
    countbtn.textContent=count;
    
    
})
