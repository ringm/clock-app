
/*--------- VARIABLES ---------*/


const bg = document.getElementById('bg');
const mainTimeContainer = document.getElementById('main-time-container');
const content = document.getElementById('content');
const quote = document.getElementById('quote');
const quoteAuthor = document.getElementById('quote-author');
const moreBtn = document.getElementById('more');
const moreContent = document.getElementById('more-content');
const yearDay = document.getElementById('year-day');
const weekDay = document.getElementById('week-day');
const weekNumber = document.getElementById('week-number');
const time = document.getElementById('time');
const timeZone = document.getElementById('time-zone');
const loc = document.getElementById('location');
const refresh = document.getElementById('refresh');
const gmt = document.getElementById('gmt');
const greeting = document.getElementById('greeting');
const greetingIcon = document.getElementById('greeting-icon');
let moreContentHeight = `-${moreContent.offsetHeight}px`;
let device = '';
let imgSuffix = '';
let h = 0;
let m = 0;
let s = 0;


/*--------- FUNCTIONS ---------*/

function setDevice(width) {
  if (width < 768) {
    device = 'mobile';
  } else if (width >= 768 && width <= 968) {
    device = 'tablet';
  } else {
    device = 'desktop';
  }
}

function updateGreeting(h) {

  if (h >= 5 && h <= 18) {
    imgSuffix = 'daytime';
    greetingIcon.src = "assets/desktop/icon-sun.svg";
    greeting.innerText = h < 12 ? "good morning, it's currently" : "good afternoon, it's currently";
    document.documentElement.style.setProperty('--more-bg-color', '#fff');
    document.documentElement.style.setProperty('--more-font-color', '#303030');
  } else {
    imgSuffix = 'nighttime';
    greetingIcon.src = "assets/desktop/icon-moon.svg";
    greeting.innerText = "good evening, it's currently";
    document.documentElement.style.setProperty('--more-bg-color', '#000000');
    document.documentElement.style.setProperty('--more-font-color', '#fff');
  }
  bg.style.backgroundImage = `url(./assets/${device}/bg-image-${imgSuffix}.jpg)`;

}

function startClock(startTime) {
  const now = new Date(startTime * 1000);
  h = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
  m = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
  s = now.getSeconds();
  time.innerHTML = `${h}:${m}`;
  updateGreeting(h);
  updateClock(h, m, s)
}

function updateClock(h, m, s) {
  setInterval(() => {
    s++
    if (s === 60) {
      s = 0;
      m = parseInt(m) + 1;
    }
    if (m === 60) {
      m = 0;
      h = parseInt(h) + 1;
      updateGreeting(h);
    }
    if (h === 24) {
      h = 0;
    }
    if (s === 0) {
      time.innerHTML = `${h}:${m < 10 ? `0${m}` : m}`;
    }
  }, 1000);
}

function getQuote() {
  fetch('https://api.quotable.io/random')
    .then(res => res.json())
    .then(data => {
      quote.innerHTML = data.content;
      quoteAuthor.innerHTML = data.author;
    })
}



/*--------- APP ---------*/

setDevice(window.innerWidth);
getQuote();

window.addEventListener('resize', () => {
  moreContentHeight = `-${moreContent.offsetHeight}px`;
  setDevice(window.innerWidth);
  bg.style.backgroundImage = `url(./assets/${device}/bg-image-${imgSuffix}.jpg)`;
})

moreBtn.addEventListener('click', () => moreBtn.checked ? content.style.top = 0 : content.style.top = moreContentHeight);

refresh.addEventListener('click', getQuote);

fetch("http://worldtimeapi.org/api/ip")
  .then(res => res.json())
  .then(data => {
    const {
      abbreviation,
      unixtime,
      day_of_week,
      day_of_year,
      week_number,
      timezone
    } = data;

    const [continent, country, city] = timezone.split('/').map(name => name.replace(/_/g, ' '));

    gmt.innerHTML = `GMT ${abbreviation}`;
    loc.innerText = city === undefined ? `in ${country}` : `in ${city}, ${country}`;
    timeZone.innerText = city === undefined ? `${continent}` : `${continent}/${city}`;
    yearDay.innerText = day_of_year;
    weekDay.innerText = day_of_week;
    weekNumber.innerText = week_number;

    startClock(unixtime);

    bg.classList.remove('hide');
    mainTimeContainer.classList.remove('hide', 'move');
  })



