let logIn = document.getElementById('logIn')
let signUp = document.getElementById('signUp')
let logo = document.getElementById('logo')
let existing = document.getElementById('existing')
let newUser = document.getElementById('new')
let closeAuths = document.querySelectorAll('.closeAuth')

initActions();

for(let closeAuth of closeAuths){
  closeAuth.onclick = function() {
    initActions();
    logo.style.width = '15rem'
    signUp.style.display = 'initial'
    existing.style.maxHeight = '0rem'
    existing.style.transform = 'scale(0)'
    existing.style.opacity = '0'
    logIn.style.width = '80%'
    logIn.style.display = 'initial'
    newUser.style.maxHeight = '0rem'
    newUser.style.transform = 'scale(0)'
    newUser.style.opacity = '0'
    signUp.style.width = '80%'
    signUp.style.border = '2px solid #d82e2e'
    signUp.style.color = '#d82e2e'
    signUp.style.backgroundColor = 'initial'
  }
}

function initActions(){
  logIn.onclick = function () {
    logIn.onclick = function() {
      if(document.getElementById('existingPassword').value.trim().length)
        document.getElementById('existingPassword').value = CryptoJS.MD5(document.getElementById('existingPassword').value)
      logIn.setAttribute('type', 'submit')
      logIn.setAttribute('form', 'existing')
    }
    logo.style.width = '7.5rem'
    signUp.style.display = 'none'
    existing.style.maxHeight = '12.5rem'
    existing.style.transform = 'scale(1)'
    existing.style.opacity = '1'
    logIn.style.width = '15rem'
  }
  signUp.onclick = function() {
    signUp.onclick = function() {
      if(document.getElementById('newPassword').value !== document.getElementById('confirmPassword').value){
        infoFlash('The passwords do not match!', 'red')
        return;
      }
      if(document.getElementById('newPassword').value.trim().length)
        document.getElementById('newPassword').value = CryptoJS.MD5(document.getElementById('newPassword').value)
      if(document.getElementById('confirmPassword').value.trim().length)
        document.getElementById('confirmPassword').value = CryptoJS.MD5(document.getElementById('confirmPassword').value)
      signUp.setAttribute('type', 'submit')
      signUp.setAttribute('form', 'new')
    }
    logo.style.width = '7.5rem'
    logIn.style.display = 'none'
    newUser.style.maxHeight = '17rem'
    newUser.style.transform = 'scale(1)'
    newUser.style.opacity = '1'
    signUp.style.width = '15rem'
    signUp.style.border = 'none'
    signUp.style.color = '#191919'
    signUp.style.backgroundColor = '#d82e2e'
  }
}

newUser.onsubmit = function(err){
  if(document.getElementById('newPassword').value !== document.getElementById('confirmPassword').value){
    err.preventDefault();
    infoFlash('The passwords do not match!', 'red')
    return;
  }
  // if(document.getElementById('newPassword').value.trim().length)
  //   document.getElementById('newPassword').value = CryptoJS.MD5(document.getElementById('newPassword').value)
  // if(document.getElementById('confirmPassword').value.trim().length)
  //   document.getElementById('confirmPassword').value = CryptoJS.MD5(document.getElementById('confirmPassword').value)
}

// existing.onsubmit = function(err){
//   if(document.getElementById('existingPassword').value.trim().length)
//     document.getElementById('existingPassword').value = CryptoJS.MD5(document.getElementById('existingPassword').value)
// }

if(window.location.href.includes('?signUp=success'))
  infoFlash(`You've successfully registered!`)

if(window.location.href.includes('?auth=failedPassword'))
  infoFlash(`Incorrect password!`,'red')

if(window.location.href.includes('?auth=failedUsername'))
  infoFlash(`That username does not exist!`,'red')

if(window.location.href.includes('?signUp=failed'))
  infoFlash(`Username already taken!`,'red')

function infoFlash(status, color = '#fcecb3'){
  document.querySelector('#infoFlash>span').innerText = status;
  document.querySelector('#infoFlash>span').style.color = color;
  document.getElementById('infoFlash').style.display = 'block'
  document.getElementById('infoFlash').classList.add('animateNow')
  document.querySelector('.animateNow').addEventListener('animationend', function(){
    document.getElementById('infoFlash').style.display = 'none'
  })
}