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

// document.getElementById('accountDelete').onclick = function(){
//   document.getElementById('accountDelete').className = 'settingNav activeNav' 
//   document.getElementById('passwordChange').className = 'settingNav' 
//   document.getElementById('changePassword').style.display = 'none'
//   document.getElementById('deleteAccount').style.display = 'initial'
// }

// document.getElementById('passwordChange').onclick = function(){
//   document.getElementById('passwordChange').className = 'settingNav activeNav' 
//   document.getElementById('accountDelete').className = 'settingNav' 
//   document.getElementById('deleteAccount').style.display = 'none'
//   document.getElementById('changePassword').style.display = 'initial'
// }

fetch(`http://popcornd.tech/recentReviews`)
.then(response => {
  return response.json()
})
.then(function(data){
  let myReviewsList = data;
  let myReviewsAdvanced = [];
  if(data.length){
    let myReviews = document.getElementById('myReviews');
    myReviews.innerText = ''
    for(let counter = 0; counter < data.length; counter++){
      let recentMovie = document.createElement('div');
      recentMovie.id = counter;
      fetch(`http://popcornd.tech/searchAdvanced?imdbID=${data[counter].movie}`)
      .then(response => {
        return response.json();
      })  
      .then(function(data){
        myReviewsAdvanced[counter] = data;
        recentMovie.style.backgroundImage=`url('${data.Poster}')`
      })
      recentMovie.classList.add('filmReview');
      myReviews.append(recentMovie);
    }
  }
  editReviews(myReviewsList, myReviewsAdvanced);
})

function editReviews(myReviews, myReviewsAdvanced){
  let filmReviews = document.querySelectorAll('.filmReview')
  for(let filmReview of filmReviews){
    advancedView(filmReviews, myReviewsAdvanced, myReviews)
  }
}

function advancedView(searchResultCards, movieAdvancedInfo, reviews){
  let movieModal = document.getElementById('movieModal');
  let movieDeepDive = document.getElementById('movieDeepDive');
  let closeModal = document.getElementById('closeModal');
  let buttons = document.querySelectorAll('.opinionChoice')
  for(let button of buttons){
    button.onclick = function(){
      if(document.querySelector('.userOpinion'))
        document.querySelector('.userOpinion').classList.remove('userOpinion')
      this.classList.add('userOpinion')
    }
  }
  for(let searchResultCard of searchResultCards){
    searchResultCard.onclick = function(){
      console.log(movieAdvancedInfo)
      document.getElementById('deleteEntry').style.display = 'initial'
      document.getElementById('addEntry').value = 'Update Entry'
      let counter = this.id
      document.querySelector('textarea').value = reviews[+this.id].userReview;
      for(let button of buttons){
        if(button.classList.contains('userOpinion'))
          button.classList.remove('userOpinion')
      }
      for(let button of buttons){
        if(button.innerText === reviews[+counter].userOpinion){
          button.classList.add('userOpinion')
          break;
        }
      }
      fetch(`http://popcornd.tech/specificReview?movie=${movieAdvancedInfo[+this.id].imdbID}`)
      .then(function(response){
        return response.json()
      })
      .then(function(data){
        document.querySelector('textarea').value = data.userReview;
      })
      document.body.style.overflow = 'hidden';
      document.getElementById('movieBanner').style.backgroundImage = `linear-gradient(180deg, rgba(25,25,25,0) 0%, rgba(25,25,25,.8) 70%, rgba(25,25,25,1) 100%)`;
      setTimeout(function(){
        document.onclick = function(e) {
        let isClickInside = movieDeepDive.contains(e.target)
        if (!isClickInside) {
          movieDeepDive.style.transform = "scale(0)"
          setTimeout(function(){movieModal.style.display = 'none';}, 100);
          document.onclick = () => {};
          document.body.style.overflow = 'visible';
        }
      }}, 400)
      closeModal.onclick = function(){
        movieDeepDive.style.transform = "scale(0)"
        setTimeout(function(){movieModal.style.display = 'none';}, 100);
        document.onclick = () => {};
        document.body.style.overflow = 'visible';
      }
      movieModal.style.display = 'block';
      document.getElementById('movieBanner').innerHTML = `<h1>${movieAdvancedInfo[+this.id].Title} <span>(${movieAdvancedInfo[+this.id].Year})</h1>`;
      selectedMovie = movieAdvancedInfo[+this.id].imdbID;
      if(movieAdvancedInfo[+this.id].Poster === 'N/A')
        document.querySelector('#movieAdvancedInformation>img').src = 'assets/placeholderPoster.jpg'
      else
        document.querySelector('#movieAdvancedInformation>img').src=movieAdvancedInfo[+this.id].Poster;
      document.querySelector('#movieAdvancedInformation>p').innerHTML = `${movieAdvancedInfo[+this.id].Plot}<br><br><span>Director: </span>${movieAdvancedInfo[+this.id].Director}<br><span>Starring: </span>${movieAdvancedInfo[+this.id].Actors}<br><span>Genre: </span>${movieAdvancedInfo[+this.id].Genre}<br><br><a href='https://www.imdb.com/title/${movieAdvancedInfo[+this.id].imdbID}' target='_blank'>More info</a>`;
      fetch(`http://popcornd.tech/imageBanner?movieTitle=${movieAdvancedInfo[+this.id].Title}&movieYear=${movieAdvancedInfo[+this.id].Year}`)
      .then(response => {
        return response.json();
      })
      .then(function(data){
        imageResults = data;
        for(let counter = 0; counter < imageResults.value.length; counter++){
          currentImage = imageResults.value[counter].contentUrl;
          if(currentImage.includes('dvd') || currentImage.includes('maxres') || currentImage.includes('thegarkside')|| currentImage.includes('cinephilia') || currentImage.includes('clickthecity')|| currentImage.includes('movie-trailer.co.uk') || currentImage.includes('blackfilm'))
            continue;
          else{
            isImageAvailable(currentImage);
            break;
          }
        }
      })
      .catch(err => {
        console.error(err);
      });
      setTimeout(function(){movieDeepDive.style.transform = "scale(1)"}, 100);
    }
  }
}

function isImageAvailable(url) {
  let image = document.createElement('img');
  image.src = url;
  image.onerror = () => {
    document.getElementById('movieBanner').style.backgroundImage = `linear-gradient(180deg, rgba(25,25,25,0) 0%, rgba(25,25,25,.8) 70%, rgba(25,25,25,1) 100%), url('assets/placeholderBanner.jpg')`;
  }
  image.onload = () => {
    document.getElementById('movieBanner').style.backgroundImage = `linear-gradient(180deg, rgba(25,25,25,0) 0%, rgba(25,25,25,.8) 70%, rgba(25,25,25,1) 100%), url('${currentImage}')`
  }
}

newReview.onsubmit = function(e){
  document.getElementById('movie').value = selectedMovie;
  document.getElementById('userOpinion').value = document.querySelector('.userOpinion').innerText;
}