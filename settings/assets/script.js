if(document.cookie === undefined || document.cookie.includes('expire') || document.cookie === ''){
  window.location = 'http://popcornd.tech/welcome'
}

showActions()
function showActions(){
    document.getElementById('userPhoto').onclick = function(){
    document.getElementById('acts').style.display = 'initial'
    setTimeout(function(){
      document.getElementById('acts').style.opacity = '1'
    }, 50)
    hideActions();
  }
}

function hideActions(){
  document.getElementById('userPhoto').onclick = function(){
    document.getElementById('acts').style.opacity = '0'
    showActions()
  }
}

document.getElementById('logOut').onclick = function(){
  window.location = 'http://popcornd.tech/logOut'
}

document.getElementById('accountDelete').onclick = function(){
  document.getElementById('accountDelete').className = 'settingNav activeNav' 
  document.getElementById('passwordChange').className = 'settingNav' 
  document.getElementById('changePassword').style.display = 'none'
  document.getElementById('deleteAccount').style.display = 'initial'
}

document.getElementById('passwordChange').onclick = function(){
  document.getElementById('passwordChange').className = 'settingNav activeNav' 
  document.getElementById('accountDelete').className = 'settingNav' 
  document.getElementById('deleteAccount').style.display = 'none'
  document.getElementById('changePassword').style.display = 'initial'
}

document.getElementById('deleteAccount').onsubmit = function(err){
  document.getElementById('password').value = CryptoJS.MD5(document.getElementById('password').value)
}

document.getElementById('changePassword').onsubmit = function(err){
  if(document.getElementById('newPassword').value !== document.getElementById('confirmNewPassword').value){
    err.preventDefault();
    infoFlash('The passwords do not match!', 'red')
    return;
  }
  document.getElementById('currentPassword').value = CryptoJS.MD5(document.getElementById('currentPassword').value)
  document.getElementById('newPassword').value = CryptoJS.MD5(document.getElementById('newPassword').value)
  document.getElementById('confirmNewPassword').value = CryptoJS.MD5(document.getElementById('confirmNewPassword').value)
}

if(window.location.href.includes('?auth=failedPassword'))
  infoFlash(`You've entered an invalid password!`, 'red')

  if(window.location.href.includes('?updatePassword=success'))
  infoFlash(`You've successfully updated your password!`)

function infoFlash(status, color = '#fcecb3'){
  document.querySelector('#infoFlash>span').innerText = status;
  document.querySelector('#infoFlash>span').style.color = color;
  document.getElementById('infoFlash').style.display = 'block'
  document.getElementById('infoFlash').classList.add('animateNow')
  document.querySelector('.animateNow').addEventListener('animationend', function(){
    document.getElementById('infoFlash').style.display = 'none'
  })
}