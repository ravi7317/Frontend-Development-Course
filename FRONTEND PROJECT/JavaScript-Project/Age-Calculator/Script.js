const ageDate = document.getElementById('fromdate');
const inputButton = document.querySelector('.input');
const result = document.querySelector('.result');

function calculateAge(dobValue) {
  const dob = new Date(dobValue);
  const today = new Date();

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} Years ${months} Months ${days} Days`;
}

inputButton.addEventListener('click', () => {
  if (!ageDate.value) {
    result.textContent = "Please Enter Date Of Birth";
    return;
  }

  result.textContent = calculateAge(ageDate.value);
});
