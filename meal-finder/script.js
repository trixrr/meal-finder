const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');

// search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = '';

  // Get search term
  const term = search.value;

  // check for empty
  if (term.trim()) {
    fetch(` https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again<p>`;
        } else {
          mealsEl.innerHTML = data.meals.map(meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt"${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
               </div>
              </div>  
          `)
            .join('');
        }
      })
    // clear search text
    search.value = '';
  } else {
    alert('Please enter a search term');
  }

  // set search value to term.
  // if there is something in search bar fetch from mealdb api with term as dynamic search valye
  // get res then=> the res.json()
  // once we have the json use that data 
  // if data.meals property from api array === null aka nothing comes under our search then resheading.innerhtml etc
  // else go through each meal generated with map and create a div / add class etc
  // give each div / meal img srcs from meal.strMealThumb property in api.  
  // .join('') on the end because .map loops through it as array, join turns back into string. 
}


function getMealById(mealID) {
  fetch(` https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0]

      addMealToDOM(meal);
    })
}

// Fetch random meal from API
function getRandomMeal() {
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    })
}
// clear elements if they are filled
// fetch api meal data / get res  json etc then data.
// fill dom with addMealToDOM func.

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
      ${meal.strArea ? `<p>${meal.strArea}` : ''}
    </div>
    <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>
    </div>
  </div>
  `;

  // initialise ingredients array which is empty
  // intialise for loop up to 20
  // if there is meal.strIngredients and meal.strMeasure with the same iterators up to 20 in the array we have called from the api. 
  // then log(push) those ingredients and measurements up to 20. 
  // else break if there is nothing. ignore.
  // next insert the html for what the meal is, the picture of meal, 
  // what category (e.g beef) and if there is ?   then insert it in a <p>    : else just blank string
  // same with area (where the dish is from)
  // then the instructions etc 
  // then we cycle through out ingredients array with .map using ing as iterator and plug those ingredients in an li   .join to turn bak into a string. 




}

// Event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  })

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID);
  }
  // go through meals and with item as iterator and if any items(elements) have a classList with meal-info return it else do nothing
  // if there is a meal-info element, get mealInfo id 
})