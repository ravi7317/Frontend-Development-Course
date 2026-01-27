var x=2;
var y=3;
var result = x+y*x**y;
console.log(result);


// Operator precedence
// 1. **(power)
// 2.* (Multiply)
// 3. + (add)

// step by step 
// x ** y--> 2**3=8
// y*(x ** y)---> 3*8 = 24
// x+..---> 2+24==26

// so final result = 26