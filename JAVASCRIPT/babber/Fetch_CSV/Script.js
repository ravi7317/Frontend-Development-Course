let openfile = document.querySelector('.csv')
let csv = "./Pizza Data/pizza_sales.csv"
let data = []



async function loadCsv(){
        const res = await fetch(csv)
        const csvTxt = await res.text()
        data = parseCSV(csvTxt)
        console.log('CSV Loaded:', data)
        displayData(data)
}


function parseCSV(csvText) {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const obj = {}
        headers.forEach((header, index) => {
            obj[header] = values[index]
        })
        return obj
    })
}





openfile.addEventListener('click', loadCsv)
