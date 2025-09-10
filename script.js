// DOM Elements
const searchForm = document.getElementById('search-form');
const recipeListContainer = document.getElementById('recipe-list');
const homepageSection = document.getElementById('homepage');
const recipePageSection = document.getElementById('recipe-page');
const backButton = document.getElementById('back-btn');

// Current recipe data
let currentRecipes = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    if (searchForm) {
        searchForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (backButton) {
        backButton.addEventListener('click', showHomepage);
    }
}   