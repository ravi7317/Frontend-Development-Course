//addEventlistner

// let events = document.querySelector('h1');
// events.addEventListener('click', function(){
//     // console.log("I have clickd ")
//     events.style.background = 'red';
// })

// function eventlistner(){
//     console.log('I clicked')
// }

// document.addEventListener('click',eventlistner)
// //document.removeEventListener('click', eventlistner)

// const content = document.querySelector('#text')
// content.addEventListener('click',function(event){
//     console.log(event)
// })

let mydiv = document.createElement('div');
mydiv.textContent='hello ravi';
   

function put (event){
    if (event.target.nodeName === 'P'){
        console.log("i have clicked" + event.target.textContent)
    }
}
    mydiv.addEventListener('click' ,put ,true )

for(i=1; i<=100; i++){
    let newelement = document.createElement('p')
    newelement.textContent = 'this is paragraph ' + i;
    mydiv.appendChild(newelement)
    

}
document.body.appendChild(mydiv)


//removeaddEvent