const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealElement = document.getElementById("meals");
const resultHeading = document.getElementsByClassName("result-heading");
const single_mealElement = document.getElementById("single-meal");

// search meals
function searchMeal(e) {
  // it will clear the searching bar when we click on submit button
  e.preventDefault();
  single_mealElement.innerHTML = ""; // clear single meal

  // get search meal
  const term = search.value;

  //check for empty (if search bar is empty)
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search Result for ${term}</h2>`;
        if (data.meals === null) {
          resultHeading.innerHTML = `<h2> There are no result for ${term}</h2>`;
        } else {
          mealElement.innerHTML = data.meals
            .map(
              (meal) => `<div class="meal">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                  <div class="meal-info" data-mealID="${meal.idMeal}">
                  <h3>${meal.strMeal}</h3>
                  </div>
                  </div>`
            )
            .join("");
        }
      });
  } else {
    alert("please insert a value....");
  }
}

//fetch meal by id

function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // all ingredient data related to particulaur dish is present in the meal array at index 0
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// random meal

function randomMeal() {
  mealElement.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// add meal to the dom
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealElement.innerHTML = `<div class="single-meal">
  <h1>${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
  <div class="single-meal-info">
  ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
  ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
  </div>
  <div class="main">
  <p>${meal.strInstructions}</p>
  <h2>Ingredients</h2>
  <ul>
  ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
  </ul>
  </div>
  </div>`;
}

//  event listener
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", randomMeal);
mealElement.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});
