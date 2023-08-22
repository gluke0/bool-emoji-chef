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
const loading = document.querySelector('.loader');
const message = document.querySelector('.message');
const modal = document.querySelector('.modal');
const recipe = document.querySelector('.modal-reciper');
const image = document.querySelector('.image');
const close = document.querySelector('.modal-x');