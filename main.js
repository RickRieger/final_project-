// Use 'git-ignore' to save things like API keys and avoid it being pushed to git hub
const YOUR_APP_ID = '690f49ff';
let YOUR_APP_KEY = '';
// variables for fetching recipes
let num1 = 0;
let num2 = 4;
// variable for main search field
let searchValue = '';
// variable for displaying recipes
const resultsContainer = $('#results-container');
// variable to target page loading animation
const loading = $('.loader');
// variable to hold what region was selected
let regionValue = '';
// variable to hold an array of region buttons
const regionValueSubmitButtons = $('.region-buttons');


// Display ingredients to the DOM.
function displayRecipesAndIngredients(recipes){
    recipes.forEach((recipe) => {
        console.log(recipe)
        const recipeElement = document.createElement('div'); 
        const ingredients = recipe.ingredientLines;
        const unorderedList = document.createElement('ul');
        unorderedList.className = "results";
        const hr = document.createElement('hr');
        const anchorTag = document.createElement('a');
        anchorTag.href =  recipe.url;
        anchorTag.target = "_blank";
        anchorTag.innerText = "complete instructions here";
        ingredients.forEach((ingredient) =>{
            const ingredientElement = document.createElement('li'); 
            ingredientElement.innerText = ingredient;
            unorderedList.appendChild(ingredientElement);
        });
        recipeElement.classList.add("item");
        recipeElement.innerHTML = `<span class=”name ”>${recipe.label}</span>
        <img src="${recipe.image}" alt="food-picture" class="pic">`;
        resultsContainer.append(recipeElement);
        resultsContainer.append(unorderedList);
        resultsContainer.append(anchorTag);
        resultsContainer.append(hr);
    });
};

// API Fetches!
async function getRecipes(){
    
    if(regionValue === undefined || regionValue === ''){
        const response = await fetch(`https://api.edamam.com/search?q=${searchValue}
        &app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}&from=${num1}&to=${num2}`);
        const data = await response.json();
        isLoading = false;
        return data;
    };
    if(regionValue !== undefined || regionValue !== ''){
        const response = await fetch(`https://api.edamam.com/search?q=${searchValue}
        &app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}&from=${num1}&to=${num2}&cuisineType=${regionValue}`);
        const data = await response.json();
        isLoading=false;
        return data;
    };
};

// asynchronous function to show recipes
async function showRecipes(){
    let recipes = [];
    const object = await getRecipes();
    console.log(object);
    
    const results = object.hits;
    console.log(results);
    
    results.forEach((result) => {
        recipes.push(result.recipe);
    });
    console.log(recipes);

    displayRecipesAndIngredients(recipes);
};

// Shows animation and fetches data via API on a setTimeout
function showLoading(){
    loading.addClass('show');
    setTimeout(()=>{
        loading.removeClass('show');
        
        setTimeout(()=>{
           
            showRecipes();
            
        } ,100);
    }, 4000);
};

// Page loader on scroll and fetch new data
let isLoading = false;
$(document).ready(function(){
    console.log("doc ready");
    window.addEventListener('scroll', ()=>{
        const{scrollTop , scrollHeight, clientHeight} =
        document.documentElement;
        
        if(!isLoading && scrollTop + clientHeight === scrollHeight){
            isLoading=true;
            num1 += 5;
            num2 += 5;
            showLoading();
        };
    });
});

// Initial click event handler to grab search field and API
document.getElementById('button-search').addEventListener('click', ()=>{
    YOUR_APP_KEY = $('#API').val();
    num1 = 0;
    num2 = 4;
    $('#myCarousel').css('display', 'none');
    $('#results-container').empty();
    searchValue = $('#search').val();
    searchValue = searchValue.replace(' ' ,'%20');
    $('#welcome-section').css('display','none');
    $('#results-section').css('display','flex');
    showRecipes();
    $('.loader').css('display', 'flex');
});

// Region-link event-handler
$('#region-link').click(()=>{
    $('.loader').css('display','none');
    $('#results-container').empty();
    $('#results-section').css('display', 'none')

    $('#welcome-section').css('display','none');
    $('#myCarousel').css('display','block'); 
});


// Region-section event-handler
for (const button of regionValueSubmitButtons){
    button.addEventListener('click', ()=>{
        loading.addClass('show');
        searchValue = $('#search').val();
        searchValue = searchValue.replace(' ' ,'%20');
        console.log(searchValue);
        if(searchValue === ''){
            alert('please enter a specific value in the search field');
            return;
        };
        regionValue = button.value;
        $('#myCarousel').css('display', 'none');
        $('#results-section').css('display', 'flex');
        showRecipes();
        
    });
};



