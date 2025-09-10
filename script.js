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
// Show recipe details
async function showRecipeDetails(recipe) {
    try {
        showRecipePage();
        
        // Show loading state
        updateRecipeTitle('Loading recipe...');
        
        // Fetch full recipe details
        const fullRecipe = await fetchRecipeDetails(recipe.idMeal);
        
        if (fullRecipe) {
            populateRecipeDetails(fullRecipe);
        } else {
            displayRecipeError('Recipe not found. Please try another recipe.');
        }
    } catch (error) {
        console.error('Recipe details error:', error);
        displayRecipeError('Failed to load recipe details. Please try again.');
    }
}

// Fetch recipe data from API
async function fetchRecipeData(searchTerm) {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`;
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.meals || [];
        
    } catch (error) {
        console.error('API fetch error:', error);
        throw new Error('Unable to fetch recipe data');
    }
}

// Fetch detailed recipe information
async function fetchRecipeDetails(id) {
    const apiEndpoint = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    
    try {
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const responseData = await response.json();
        return responseData.meals ? responseData.meals[0] : null;
        
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        throw new Error('Unable to load recipe information');
    }
}
// Populate all recipe details in the UI
function populateRecipeDetails(recipe) {
    updateRecipeTitle(recipe.strMeal);
    updateRecipeImage(recipe.strMealThumb, recipe.strMeal);
    updateIngredientsList(recipe);
    updateInstructions(recipe.strInstructions);
    updateVideoLink(recipe.strYoutube);
}

// Update recipe title
function updateRecipeTitle(title) {
    const titleElement = document.getElementById('recipe-title');
    if (titleElement) {
        titleElement.textContent = title;
        document.title = `${title} - Ocean Of Recipes`;
    }
}

// Update recipe image
function updateRecipeImage(imageSrc, altText) {
    const imageElement = document.getElementById('recipe-image');
    if (imageElement) {
        imageElement.src = imageSrc;
        imageElement.alt = altText;
    }
}

// Update ingredients list with measurements
function updateIngredientsList(recipe) {
    const ingredientsContainer = document.getElementById('ingredient-list');
    if (!ingredientsContainer) return;
    
    const ingredients = extractIngredients(recipe);
    ingredientsContainer.innerHTML = '';
    
    if (ingredients.length === 0) {
        const noIngredientsItem = document.createElement('li');
        noIngredientsItem.textContent = 'No ingredients available';
        noIngredientsItem.className = 'no-ingredients';
        ingredientsContainer.appendChild(noIngredientsItem);
        return;
    }
    
    ingredients.forEach((ingredient, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = ingredient;
        listItem.className = 'ingredient-item';
        ingredientsContainer.appendChild(listItem);
    });
}
// Extract and format ingredients with measurements
function extractIngredients(recipe) {
    const ingredientsList = [];
    
    // TheMealDB API provides up to 20 ingredients
    for (let index = 1; index <= 20; index++) {
        const ingredient = recipe[`strIngredient${index}`];
        const measurement = recipe[`strMeasure${index}`];
        
        if (ingredient && ingredient.trim() !== '') {
            const formattedIngredient = measurement && measurement.trim() !== '' 
                ? `${measurement.trim()} ${ingredient.trim()}`
                : ingredient.trim();
            
            ingredientsList.push(formattedIngredient);
        }
    }
    
    return ingredientsList;
}

// Update cooking instructions
function updateInstructions(instructions) {
    const instructionsElement = document.getElementById('recipe-instructions');
    if (instructionsElement) {
        instructionsElement.textContent = instructions || 'No instructions available.';
    }
}

// Update YouTube video link
function updateVideoLink(youtubeUrl) {
    const videoLinkElement = document.getElementById('video-link');
    if (videoLinkElement) {
        if (youtubeUrl && youtubeUrl.trim() !== '') {
            videoLinkElement.href = youtubeUrl;
            videoLinkElement.style.pointerEvents = 'auto';
            videoLinkElement.style.opacity = '1';
            videoLinkElement.textContent = '🎥 Watch Video Tutorial';
        } else {
            videoLinkElement.href = '#';
            videoLinkElement.style.pointerEvents = 'none';
            videoLinkElement.style.opacity = '0.5';
            videoLinkElement.textContent = '🎥 No Video Available';
        }
    }
}

// Utility functions for messages
function showMessage(message) {
    if (recipeListContainer) {
        recipeListContainer.innerHTML = `<li class="message">${message}</li>`;
    }
}

function showLoadingMessage() {
    if (recipeListContainer) {
        recipeListContainer.innerHTML = '<li class="loading">Searching for delicious recipes...</li>';
    }
}

function showErrorMessage(message) {
    if (recipeListContainer) {
        recipeListContainer.innerHTML = `<li class="error-message">${message}</li>`;
    }
}

function displayRecipeError(message) {
    const titleElement = document.getElementById('recipe-title');
    if (titleElement) {
        titleElement.textContent = 'Error Loading Recipe';
        titleElement.style.color = '#e74c3c';
    }
    
    const instructionsElement = document.getElementById('recipe-instructions');
    if (instructionsElement) {
        instructionsElement.textContent = message;
        instructionsElement.style.color = '#e74c3c';
    }
}