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
// Display recipes in the UI
function displayRecipes(recipes) {
    if (!recipeListContainer) return;
    
    recipeListContainer.innerHTML = '';
    
    if (!recipes || recipes.length === 0) {
        showMessage('No recipes found. Try searching for something else!');
        return;
    }
    
    recipes.forEach((recipe, index) => {
        const listItem = createRecipeCard(recipe, index);
        recipeListContainer.appendChild(listItem);
    });
}

// Create individual recipe card
function createRecipeCard(recipe, index) {
    const listItem = document.createElement('li');
    const recipeImage = document.createElement('img');
    const recipeTitle = document.createElement('span');
    
    // Set image properties
    recipeImage.src = recipe.strMealThumb;
    recipeImage.alt = recipe.strMeal;
    recipeImage.loading = 'lazy';
    
    // Set title
    recipeTitle.textContent = recipe.strMeal;
    recipeTitle.className = 'recipe-title';
    
    // Add click event to show recipe details
    listItem.addEventListener('click', () => showRecipeDetails(recipe));
    
    // Append elements
    listItem.appendChild(recipeImage);
    listItem.appendChild(recipeTitle);
    
    // Add classes
    listItem.className = 'recipe-card';
    listItem.setAttribute('data-recipe-id', recipe.idMeal);
    
    return listItem;
}
