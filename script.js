const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const mealList = document.getElementById("mealList");
const categoriesList = document.getElementById("categoriesList") 
const back = document.querySelector(".back");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipeCloseBtn");
const cover = document.querySelector(".cover");
const title = document.querySelector("#title")


// Event listeners
searchButton.addEventListener("click", async () => {
    const ingredient = searchInput.value.trim();
    title.innerText = ""
    if (ingredient) {
      const meals = await searchMealsByIngredient(ingredient);
      displayMeals(meals);
    }
  });
mealList.addEventListener("click", async (e) => {
  const card = e.target.closest(".meal-item");
  if (card) {
    const mealId = card.dataset.id;
    const meal = await getMealDetails(mealId);
    if (meal) {
      showMealDetailsPopup(meal);
    }
  }
});

// Remove the existing event listener for categorySelect

document.querySelector(".dropend").addEventListener("click", async (e) => {
  if (e.target.classList.contains("dropdown-item")) {
    const selectedCategory = e.target.dataset.category;
    const meals = await searchMealsByCategory(selectedCategory);
    displayMeals(meals);
    closeRecipeModal();
    searchInput.value = '';
  }
});
async function searchMealsByIngredient(ingredient) {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
      );
      const data = await response.json();
      return data.meals;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  

async function getMealDetails(mealId) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await response.json();
    return data.meals[0];
  } catch (error) {
    console.error("Error fetching meal details:", error);
  }
}

function displayMeals(meals) {
  mealList.innerHTML = "";
  if (meals) {
    meals.forEach((meal) => {
      cover.style.display = "none";
      const mealItem = document.createElement("div");
      mealItem.dataset.id = meal.idMeal;
      mealItem.classList.add('meal-item');
      mealItem.innerHTML = `
        <div class="card border border-success-subtle" style="width: 18rem;">
            <img src="${meal.strMealThumb}" alt="${meal.idMeal}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
                <p class="card-text">${meal.strCategory ? meal.strCategory : ""}</p>
                <a class="btn btn-success">Learn more</a>
            </div>
        </div>`;
      mealList.appendChild(mealItem);
    });
  } else {
    mealList.innerHTML = `<p>Not found. Try another category.</p>`;
  }
  if(meals.length === 1){
    cover.style.display = "flex";
    title.innerText = "Recomended"
  }else{
    title.innerText = `Meals`
  }
}

function showMealDetailsPopup(meal) {
  mealDetailsContent.innerHTML =`
  <div class="first p-4">
  <img class="recipe-img"src="${meal.strMealThumb}" alt="${meal.strMeal}">
  <div class="texts">
      <h1>${meal.strMeal}</h1>
      <h6>🌐 ${meal.strArea} Food</h6>
      <h6>Tags: ${meal.strTags}</h6>
      <h4>Main Ingredients</h4>
      <ul class='list-group'>
          <li class="list-group-item">${meal.strIngredient1}</li>
          <li class="list-group-item">${meal.strIngredient2}</li>
          <li class="list-group-item">${meal.strIngredient3}</li>
          <li class="list-group-item">${meal.strIngredient4}</li>
      </ul>
  </div>
</div>
<div class="second p-4">
  <h4>Instruction</h4>
  <p>${meal.strInstructions}</p>
</div>
<div class="recipe-video ">
  <a target="blank" href="${meal.strYoutube}" class="btn btn-success">Tap for Video</a>
</div>
`;
  back.style.display = "block";
}

recipeCloseBtn.addEventListener("click", closeRecipeModal);

function closeRecipeModal() {
  back.style.display = "none";
}

searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });
  
  async function performSearch() {
    const ingredient = searchInput.value.trim();
    if (ingredient) {
      const meals = await searchMealsByIngredient(ingredient);
      displayMeals(meals, "Search Results");
    }
  }
  

async function searchMealsByCategory(category) {
  try {
    let apiUrl = "https://www.themealdb.com/api/json/v1/1/filter.php";
    if (category !== "All") {
      apiUrl += `?c=${category}`;
    }
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


window.addEventListener("load", async () => {
    const defaultMeals = await getDefaultMeals();
    displayMeals(defaultMeals);
 });
  

async function getDefaultMeals() {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.error("Error fetching default meals:", error);
    return [];
  }
}


