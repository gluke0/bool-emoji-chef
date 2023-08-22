const OPENAI = {
    API_BASE_URL: 'https://api.openai.com/v1',
    API_KEY: '',
    GPT_MODEL: 'gpt-3.5-turbo',
    API_COMPLETIONS: '/chat/completions',
    API_IMAGE: '/images/generations'
};

// all the elements need to be associated to variables
const ingredients = document.querySelectorAll('.ingredient');
const singleIngredient = document.querySelectorAll('.single-ingredient');
const cook = document.querySelector('#cook');
const loader = document.querySelector('.loader');
const message = document.querySelector('.message');
const modal = document.querySelector('.modal');
const recipe = document.querySelector('.modal-recipe');
const image = document.querySelector('.image');
const close = document.querySelector('.modal-x');

let mixer = [];

cook.addEventListener('click', letsCook);

close.addEventListener('click', function(){
    modal.classList.add('dnone');
});

ingredients.forEach(function(el){
    el.addEventListener('click', function(){
        addIngredient(el.innerText);
    });
});

function addIngredient(ingredient) {
    const maxIngredients = singleIngredient.length;

    if (mixer.length === maxIngredients) {
        mixer.shift();
    }

    mixer.push(ingredient);

    singleIngredient.forEach(function (el, i) {
        let ingredient = '?';

        if (mixer[i]) {
            ingredient = mixer[i];
        }

        el.innerText = ingredient;
    });

    if (mixer.length === maxIngredients) {
        cook.classList.remove('dnone');
    }
}

async function letsCook() {
    loader.classList.remove('dnone');
    message.innerText = randomMessage();

    const messageInterval = setInterval(() => {
        message.innerText = randomMessage();
    }, 2000);

    const prompt = `\
Crea una ricetta con: ${mixer.join(', ')}.
La ricetta deve essere facile e con un titolo creativo e divertente.
Le tue risposte sono solo in formato JSON come questo esempio:

###

{
    "titolo": "Titolo ricetta",
    "ingredienti": "1 uovo e 1 pomodoro",
    "istruzioni": "mescola gli ingredienti e metti in forno"
}

###`;

    const recipeResponse = await makeRequest(OPENAI.API_COMPLETIONS, {
        model: OPENAI.GPT_MODEL,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.7
    });

    const content = JSON.parse(recipeResponse.choices[0].message.content);

    recipe.innerHTML = `
    <h2>${content.titolo}</h2>
    <p>${content.ingredienti}</p>
    <p>${content.istruzioni}</p>`;

    modal.classList.remove('dnone');
    loader.classList.add('dnone');
    clearInterval(messageInterval)

    const imageResponse = await makeRequest(OPENAI.API_IMAGE, {
        prompt: `Crea una immagine per questa ricetta: ${content.titolo}`,
        n: 1,
        size: '512x512',
    });

    const imageUrl = imageResponse.data[0].url;
    image.innerHTML = `<img src="${imageUrl}" alt="foto ricetta">`
    clearMixer();
}

function clearMixer() {
    mixer = [];

    singleIngredient.forEach(function (slot) {
        slot.innerText = '?';
    });
}

function randomMessage() {
    const messages = [
        'Preparo gli ingredienti...',
        'Scaldo i fornelli...',
        'Mescolo nella ciotola...',
        'Scatto foto per Instagram...',
        'Prendo il mestolo...',
        'Metto il grembiule...',
        'Mi lavo le mani...',
        'Tolgo le bucce...',
        'Pulisco il ripiano...',
        'Faccio un pisolino...',
        'Vado al supermercato...',
    ];

    const randIdx = Math.floor(Math.random() * messages.length);
    return messages[randIdx];
}

async function makeRequest(endpoint, data) {
    const response = await fetch(OPENAI.API_BASE_URL + endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI.API_KEY}`,
        },
        method: 'POST',
        body: JSON.stringify(data)
    });

    const json = await response.json();
    return json;
}
