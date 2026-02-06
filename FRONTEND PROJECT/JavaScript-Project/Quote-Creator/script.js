const quotee= document.querySelector(".quote")
const author = document.querySelector(".author");
const newBtn = document.querySelector(".new")



const api_url = "https://dummyjson.com/quotes/random"

async function quote(url) {
    let response = await fetch(api_url)
    let data = await response.json()
    quotee.textContent = `"${data.quote}"`;
    author.textContent = `— ${data.author}`;
}
quote()

newBtn.addEventListener('click' , ()=>{
    quote()
})

const copy = document.querySelector('.copy');

copy.addEventListener("click", ()=>{
    navigator.clipboard.writeText(quotee.textContent)
    .then(()=>{
        copy.textContent ="Copied"
        setTimeout(() => {
            copy.textContent='copy'
        }, 500);
    })
    .catch(err => cansole.error("Error" ,err))
})



