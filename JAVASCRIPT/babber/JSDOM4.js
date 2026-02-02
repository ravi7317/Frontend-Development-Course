// let t1=performance.now()
// for(let i=0; i<=100; i++){
//     let newelement = document.createElement('p')
//     newelement.textContent='This is paragrapg '+i;


//     document.body.appendChild(newelement)
// }
// let t2= performance.now()
// console.log('taken time code 1 '+ (t2-t1) + 'ms')


//optimise bit
// let t3 = performance.now();
// let mydiv = document.createElement('div');
// for(let i=0; i<=100; i++){
//     let element = document.createElement('p')
//     element.textContent="this is a 2nd paragraph" + i
//     mydiv.appendChild(element)
// }
// document.body.appendChild( mydiv)
// let t4 = performance.now();
// console.log("taken time code 2 " +( t4-t3)+ "ms")

//document fregment 
let t5= performance.now()
let freJSgment = document.createDocumentFragment();
for( let i=0; i<=100; i++){
    let element = document.createElement('p')
    element.textContent="This is a paragraph "+ i;
    fregment.appendChild(element)
}
document.body.appendChild(fregment);
let t6 = performance.now();
console.log("the time taken " +(t6-t5)+" ms")