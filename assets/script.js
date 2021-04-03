let searchResult, imageResults, currentImage, searchTerm;
let movieAdvancedInfo = [];
let searchAction = document.getElementById('searchAction');
let searchResults = document.getElementById('searchResults');
let newReview = document.getElementById('newReview');
let failSearch = document.getElementById('failSearch');
let selectedMovie;

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
    setTimeout(function(){
      document.getElementById('acts').style.display = 'none'
    }, 500)
    showActions()
  }
}

document.getElementById('logOut').onclick = function(){
  window.location = 'http://popcornd.tech/logOut'
}

fetch(`http://popcornd.tech/recentReviews`)
.then(response => {
  return response.json()
})
.then(function(data){
  let sixRecent = data;
  let sixRecentAdvanced = [];
  if(data.length){
    let recentReviews = document.getElementById('recentReviews');
    recentReviews.innerText = ''
    let recentHeading = document.createElement('div');
    recentHeading.id = 'recentHeading';
    let myRecentReviews = document.createElement('h1');
    myRecentReviews.innerText = 'My recent reviews';
    recentHeading.append(myRecentReviews);
    let allMyReviews = document.createElement('button')
    allMyReviews.innerText = 'All my reviews'
    allMyReviews.onclick = function(){
      window.location = 'http://popcornd.tech/profile'
    }
    recentHeading.append(allMyReviews);
    recentReviews.append(recentHeading)
    for(let counter = 0; counter < data.length; counter++){
      if (counter === 6){
        break;
      }
      let recentMovie = document.createElement('div');
      recentMovie.id = counter;
      fetch(`http://popcornd.tech/searchAdvanced?imdbID=${data[counter].movie}`)
      .then(response => {
        return response.json();
      })  
      .then(function(data){
        sixRecentAdvanced[counter] = data;
        recentMovie.style.backgroundImage=`url('${data.Poster}')`
      })
      recentMovie.classList.add('recentReview');
      recentReviews.append(recentMovie);
    }
  }
  editRecentReviews(sixRecent, sixRecentAdvanced);
})

document.getElementById('newEntry').onclick = function(){
  document.getElementById('searchQuery').focus()
}

newReview.onsubmit = function(e){
  document.getElementById('movie').value = selectedMovie;
  document.getElementById('userOpinion').value = document.querySelector('.userOpinion').innerText;
}

searchAction.onsubmit = function(e) {
  e.preventDefault()
  searchResults.innerHTML = '<div class="lds-dual-ring"></div>';
  if(document.getElementById('searchQuery').value.trim() === '')
    location.reload()
  if(document.getElementById('searchQuery').value.trim().length === 1)
    location.reload()
  if(document.getElementById('searchQuery').value.trim().length === 2)
    searchTerm = `http://popcornd.tech/searchSimple?searchTitle=${encodeURIComponent(document.getElementById('searchQuery').value.trim())}&searchYear=${document.getElementById('year').value}&method=t`
  else
    searchTerm = `http://popcornd.tech/searchSimple?searchTitle=${encodeURIComponent(document.getElementById('searchQuery').value.trim())}&searchYear=${document.getElementById('year').value}&method=s`
  fetch(searchTerm)
  .then(response => {
    return response.json();
  })
  .then(function(data){
    searchResults.innerText ='';
    if(searchTerm.includes('method=t'))
      searchResult = {Search: [data]};
    else
      searchResult = data;
    for(let counter = 0; counter < searchResult.Search.length; counter++){
      if(counter === 5)
        break;
      let searchResults = document.getElementById('searchResults')
      let newResultCard = document.createElement('div');
      newResultCard.classList.add('searchResult')
      let moviePoster = document.createElement('img');
      if(searchResult.Search[counter].Poster === 'N/A')
        moviePoster.src = 'assets/placeholderPoster.jpg';
      else
        moviePoster.src = searchResult.Search[counter].Poster;
      newResultCard.append(moviePoster);
      let movieInfo = document.createElement('div');
      movieInfo.classList.add('movieInfo')
      let movieTitle = document.createElement('h1');
      movieTitle.innerHTML = `${searchResult.Search[counter].Title}&nbsp;&nbsp;<span class='releaseYear'>(${searchResult.Search[counter].Year})`;
      movieInfo.append(movieTitle);
      let movieCredits = document.createElement('p');
      fetch(`http://popcornd.tech/searchAdvanced?imdbID=${searchResult.Search[counter].imdbID}`)
      .then(response => {
        return response.json();
      })  
      .then(function(data){
        movieAdvancedInfo[counter] = data;
        movieCredits.innerHTML = `<span class='role'>Director: </span> ${movieAdvancedInfo[counter].Director}<br><span class='role'>Starring: </span> ${movieAdvancedInfo[counter].Actors}<br><span class='role'>Genre: </span> ${movieAdvancedInfo[counter].Genre}`;
        movieInfo.append(movieCredits);
        newResultCard.append(movieInfo);
      })
      .catch(err => {
        console.error(err);
      });
      fetch(`http://popcornd.tech/isSeen?movie=${searchResult.Search[counter].imdbID}`)
      .then(function(response){
        return response.json()
      })
      .then(function(data){
        if(data){
          let watchedBanner = document.createElement('div');
          watchedBanner.innerText = 'Done!'
          watchedBanner.classList.add('watched')
          newResultCard.append(watchedBanner)
        }
      })
      newResultCard.id = counter;
      searchResults.append(newResultCard); 
      advancedView(document.querySelectorAll('.searchResult'), movieAdvancedInfo);
    }
  })
  .catch(err => {
    console.error(err);
  }); 
  failSearch.style.display = 'initial';
  return false;
}

function advancedView(searchResultCards, movieAdvancedInfo, isEditMode = false, reviews = ''){
  //let searchResultCards = document.querySelectorAll('.searchResult');
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
      document.getElementById('deleteEntry').style.display = 'none'
      document.getElementById('addEntry').value = 'Add Entry'
      document.querySelector('textarea').value = '';
      if(this.innerHTML.includes('watched')){
        document.getElementById('deleteEntry').style.display = 'initial'
        document.getElementById('addEntry').value = 'Update Entry'
        fetch(`http://popcornd.tech/specificReview?movie=${movieAdvancedInfo[+this.id].imdbID}`)
        .then(function(response){
          return response.json()
        })
        .then(function(data){
          document.querySelector('textarea').value = data.userReview;
        })
      }
      for(let button of buttons){
        if(button.classList.contains('userOpinion'))
          button.classList.remove('userOpinion')
      }
      document.querySelector('.opinionChoice:nth-child(2)').className = 'opinionChoice userOpinion'
      if(isEditMode){
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
      }
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

function editRecentReviews(sixRecent, sixRecentAdvanced){
  let recentReviews = document.querySelectorAll('.recentReview')
  for(let recentReview of recentReviews){
    advancedView(recentReviews, sixRecentAdvanced, true, sixRecent)
  }
}