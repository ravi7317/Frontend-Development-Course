// let menu = document.querySelector('#btn')

// menu.addEventListener('click' , (e)=>{
//     console.log(e.target);
//     console.log(e.currentTarget)
// })

// let list = document.querySelector(".list")
// .addEventListener('click' , (e)=>{
//     if(e.target.tagName==="LI"){
//         console.log(e.target.innerText)
//     }
// })

// function secondLargest (arr){
//     let highest = -Infinity
//     let secondHighest = -Infinity
//     for(let num of arr){
//         if(num>highest){
//             secondHighest = highest;
//             highest = num
//         }else
//             if(num<highest || num>secondHighest){
//                 secondHighest = num;
//             }
//         }
//         return secondHighest === -Infinity? undefined:secondHighest;
//     }
//     let arr = [10,20,20]
//     console.log(secondLargest(arr))

const arr = [1, 2, 3];

arr.forEach((num) => {
  if (num === 2) {
    return;
  }
  console.log(num);
});

