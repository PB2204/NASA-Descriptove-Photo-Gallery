const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

//NASA API
const count = 30;
const apiKey = '4CGYfPiWO7oTAfGUudmEhe1dp5eaHOsAp29VSi4i';
const nasaApiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`; 

let resultsArray = [];
let favorites = {};

const showLoader= page => {
    window.scrollTo({top: 0, behavior: 'instant'});
    if(page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
};

const createDomElements = (page) => {
    const currentAr = page === 'results' ? resultsArray : Object.values(favorites);
    currentAr.forEach((el) => {
        // create Card Container 
        const card = document.createElement('div');
        card.classList.add('card');
        //Link
        const link = document.createElement('a');
        link.href = el.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        //Image
        const img = document.createElement('img');
        img.src = el.url;
        img.alt = 'NASA Picture Of The Day';
        img.loading = 'lazy';
        img.classList.add('card-img-top');
        //Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = el.title;
        // Save text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page==='results') {
        saveText.textContent = 'Add To Favorites';
        saveText.setAttribute('onclick', `saveFavorites('${el.url}')`);
        } else {
            saveText.textContent = 'Remove Favorites';
            saveText.setAttribute('onclick', `removeFavorites('${el.url}')`);
        }
        //Card text
        const cardText = document.createElement('p');
        cardText.textContent = el.explanation;
        //footer container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        //date 
        const date = document.createElement('strong');
        date.textContent = el.date;
        //copyright
        const copyright = document.createElement('span');
        copyright.textContent = ` ${el.copyright===undefined ? '' : el.copyright}`;
        //append items
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(img);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
   });
};

const updateDom = (page) => {
    //get favorites from local storage
    if(localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';
    createDomElements(page);
    showLoader(page);
};

//Get 15 images from api
async function getNasaPictures() {
    loader.classList.remove('hidden');
    try {
        const response = await fetch(nasaApiUrl);
        resultsArray = await response.json();
        updateDom('results');
    } catch(error) {
        console.log(error);
    }
}

//add element to favorites
const saveFavorites = itemUrl => {
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            //show save confirmation for 2s
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            //save in local storage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
};
//remove

const removeFavorites = itemUrl => {
    if(favorites[itemUrl]) {
       delete favorites[itemUrl];
       //save in local storage
       localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
       updateDom('favorites');
    }
};

getNasaPictures();