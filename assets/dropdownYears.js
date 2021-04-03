let year = 2021;
let dropdown = document.getElementById('year');
while(year > 1873){
  dropdown.innerHTML += `<option value='${year}'>${year}</option>`;
  year --;
}