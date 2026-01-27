// var username= "RoadsiderCoder";
// //global function
// function local(){
//     //local scope
//     console.log(username);
// }
// local()

// // lexcial scope a variable define outside of the function can be accseable with inside function 
// // is calleld lexcial scope for example 

// var user = "ravi";
// function call(){
//     console.log(user)
// }
// call()


// qurstion on set timeout 

    for(var i=0; i<3; i++){
        function inner(i){
        setTimeout(function log (){
            console.log(i)
        }, i*1000)
    }
}

inner(i);

