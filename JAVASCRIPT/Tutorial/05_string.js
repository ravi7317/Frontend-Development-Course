const name = "ravi"
const repoCount = 50
//console.log(name + repoCount + " Value");
console.log(`Hello my name is ${name} and repo count is ${repoCount}`);
const gameName = new String ('raviverma')
console.log (gameName);
console.log(gameName[0])
console.log(gameName[1])
console.log(gameName[2])
console.log(gameName[3])
console.log(gameName[4])
console.log(gameName[5])
console.log(gameName[6])
console.log(gameName[7])
console.log(gameName[8])
/*PS D:\FULL STACK\FRONTEND\JAVASCRIPT> node "d:\FULL STACK\FRONTEND\JAVASCRIPT\05_string.js"
Hello my name is ravi and repo count is 50
[String: 'raviverma']
r
a
v
i
v
e
r
m
a*/
console.log(gameName.__proto__)
// it will print type  object
console.log(gameName.length)
// it will print length of string =9
console.log(gameName.toUpperCase())
// it will print the string to upper case = RAVIVERMA
console.log(gameName.charAt(6))
// this program will tell which charater have which index number 
console.log(gameName.indexOf('v'));
// it will tell us char in which index
const newString = gameName.substring(1,4)
console.log(newString)
// it will print the sub part of the string
const otherString= gameName.slice(-9,5)
console.log(otherString)
//it will print from end 
const newStringone= "  Ravi  "
console.log(newStringone)
console.log(newStringone.trim());
// it will trim extra spaces 
const url = "https:ravi.com/ravi20%verma"
console.log(url.replace('20%',"-"))
// it will replace the things 
console.log(url.includes('verma'))
// it will show the presence of keyword in string
console.log(gameName.split('-'))
// it will seprate the string according to the given value