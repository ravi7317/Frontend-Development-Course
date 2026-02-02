// Update content
document.querySelector('#title').innerText = "Welcome";
document.querySelector('#text').style.color = 'green';

// Button click
document.querySelector('#btn').addEventListener('click', () => {
    document.querySelector('#msg').innerText = 'After';
});

// Create paragraph
let content = document.querySelector('.paraclass');
let newpara = document.createElement('p');
newpara.textContent = 'This is a paragraph';
content.appendChild(newpara);
