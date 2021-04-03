if(document.cookie === undefined || document.cookie.includes('expire') || document.cookie === ''){
  window.location = 'http://popcornd.tech/welcome'
}

let buttonOne = document.getElementById('buttonOne')
let activeSlide;
localStorage.setItem("userToken", JSON.stringify(document.cookie.split('=')[1]));
buttonOne.onclick = function(){
  activeSlide = document.getElementById('one')
  activeSlide.style.transform = 'translateX(-25vw)'
  activeSlide.style.opacity = '0'
  setTimeout(function(){
    activeSlide.style.display = 'none'
    document.getElementById('two').style.display = 'flex'
  }, 500)
  setTimeout(function(){
    activeSlide.style.display = 'none'
    document.getElementById('two').style.display = 'flex'
  }, 500)
  setTimeout(function(){
    document.getElementById('two').style.transform = 'translateX(0)'
    document.getElementById('two').style.opacity = '1'
  }, 550)
}

buttonTwo.onclick = function(){
  activeSlide = document.getElementById('two')
  activeSlide.style.transform = 'translateX(-25vw)'
  activeSlide.style.opacity = '0'
  setTimeout(function(){
    activeSlide.style.display = 'none'
    document.getElementById('three').style.display = 'flex'
  }, 500)
  setTimeout(function(){
    activeSlide.style.display = 'none'
    document.getElementById('three').style.display = 'flex'
  }, 500)
  setTimeout(function(){
    document.getElementById('three').style.transform = 'translateX(0)'
    document.getElementById('three').style.opacity = '1'
  }, 550)
}

buttonThree.onclick = function(){
  activeSlide = document.getElementById('three')
  activeSlide.style.transform = 'translateX(-25vw)'
  activeSlide.style.opacity = '0'
  setTimeout(function(){
    activeSlide.style.display = 'none'
    document.getElementById('four').style.display = 'flex'
  }, 500)
  setTimeout(function(){
    activeSlide.style.display = 'none'
    document.getElementById('four').style.display = 'flex'
  }, 500)
  setTimeout(function(){
    document.getElementById('four').style.transform = 'translateX(0)'
    document.getElementById('four').style.opacity = '1'
  }, 550)
  fetch(`http://popcornd.tech/onboarded`, {
    "method" : "POST",
    "redirect" : "follow",
    "headers" : {
      'Content-Type': 'application/json'
    },
    "body" : JSON.stringify({"picture" : document.getElementById('selectedAvatar').src})
  })
  .then(function(response){
    window.location = response.url
  })
}

let avatarChoices = document.querySelectorAll('.avatars')
for(let avatarChoice of avatarChoices){
  avatarChoice.onclick = function(){
    document.getElementById('selectedAvatar').removeAttribute('id')
    avatarChoice.id = 'selectedAvatar'
  }
}
