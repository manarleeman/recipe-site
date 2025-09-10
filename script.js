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
// Navigation functions
function showHomepage() {
    homepageSection.classList.remove('hidden');
    recipePageSection.classList.add('hidden');
    document.title = 'Ocean Of Recipes';
}

function showRecipePage() {
    homepageSection.classList.add('hidden');
    recipePageSection.classList.remove('hidden');
}
// Form submission handler
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const searchTerm = formData.get('meal');
    
    if (!searchTerm.trim()) {
        showMessage('Please enter a recipe name to search.');
        return;
    }
    
    try {
        showLoadingMessage();
        const recipes = await fetchRecipeData(searchTerm);
        currentRecipes = recipes;
        displayRecipes(recipes);
    } catch (error) {
        showErrorMessage('Failed to fetch recipes. Please try again.');
        console.error('Search error:', error);
    }
}
