function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

let randomNumber = getRandomInt(3);

let choices = [
  {
    src: `assets/imNotHere2017.jpg`,
    blurb: `The page you're looking for says <strong>I'm Not Here</strong>.`
  },
  {
    src: `assets/landOfTheLost2009.jpg`,
    blurb: `Looks like you stumbled to the <strong>Land of the Lost</strong>.`
  },
  {
    src: `assets/wrongTurn2021.jpg`,
    blurb: `Oh, no! You must've taken a <strong>Wrong Turn</strong>.`
  }
]

document.getElementById('poster').src = choices[randomNumber].src;
document.querySelector('p').innerHTML = choices[randomNumber].blurb;