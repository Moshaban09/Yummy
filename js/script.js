/* ========================================
   DOM ELEMENTS
   ======================================== */

let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;

const loadingScreen = document.querySelector(".loading-screen");
const innerLoadingScreen = document.querySelector(".inner-loading-screen");
const sideNav = document.querySelector(".side-nav-menu");
const toggleIcon = document.querySelector(".side-nav-menu i.open-close-icon");

let isNavOpen = false;
const navLinks = document.querySelectorAll(".links li");
const navTab = document.querySelector(".side-nav-menu .nav-tab");
const navWidth = navTab?.offsetWidth ?? 0;

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

function hideLoadingScreen() {
  loadingScreen?.classList.add("d-none");
}

function showInnerLoading() {
  innerLoadingScreen?.classList.remove("d-none");
  innerLoadingScreen?.classList.add("d-flex");
}

function hideInnerLoading() {
  innerLoadingScreen?.classList.remove("d-flex");
  innerLoadingScreen?.classList.add("d-none");
}

function clearSearchContainer() {
  searchContainer.innerHTML = "";
}

async function fetchData(url) {
  try {
    let response = await fetch(url);
    response = await response.json();
    return response;
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
}

/* ========================================
   API FUNCTIONS
   ======================================== */

async function searchByName(term) {
  showInnerLoading();
  try {
    const response = await fetchData(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
    );

    if (response && response.meals) {
      displayMeals(response.meals);
    } else {
      rowData.innerHTML = "<p>No meals found.</p>";
    }
  } finally {
    hideInnerLoading();
  }
}

async function searchByFLetter(letter) {
  showInnerLoading();
  try {
    letter = letter || "a";
    const response = await fetchData(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
    );

    if (response && response.meals) {
      displayMeals(response.meals);
    } else {
      rowData.innerHTML = "<p>No meals found.</p>";
    }
  } finally {
    hideInnerLoading();
  }
}

async function getCategories() {
  clearSearchContainer();
  showInnerLoading();
  try {
    const response = await fetchData(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );

    if (response && response.categories) {
      displayCategories(response.categories);
    }
  } finally {
    hideInnerLoading();
  }
}

async function getCategoryMeals(category) {
  showInnerLoading();
  try {
    const response = await fetchData(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );

    if (response && response.meals) {
      displayMeals(response.meals);
    } else {
      rowData.innerHTML = "<p>No meals found.</p>";
    }
  } finally {
    hideInnerLoading();
  }
}

async function getArea() {
  clearSearchContainer();
  showInnerLoading();
  try {
    const response = await fetchData(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );

    if (response && response.meals) {
      displayArea(response.meals);
    }
  } finally {
    hideInnerLoading();
  }
}

async function getAreaMeals(area) {
  showInnerLoading();
  try {
    const response = await fetchData(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
    );

    if (response && response.meals) {
      displayMeals(response.meals);
    } else {
      rowData.innerHTML = "<p>No meals found.</p>";
    }
  } finally {
    hideInnerLoading();
  }
}

async function getIngredients() {
  clearSearchContainer();
  showInnerLoading();
  try {
    const response = await fetchData(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    );

    if (response && response.meals) {
      displayIngredients(response.meals.slice(0, 20));
    }
  } finally {
    hideInnerLoading();
  }
}

async function getIngredientsMeals(ingredient) {
  showInnerLoading();
  try {
    const response = await fetchData(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );

    if (response && response.meals) {
      displayMeals(response.meals);
    } else {
      rowData.innerHTML = "<p>No meals found.</p>";
    }
  } finally {
    hideInnerLoading();
  }
}

async function getMealDetails(mealID) {
  showInnerLoading();
  try {
    const response = await fetchData(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    );

    if (response && response.meals) {
      displayMealDetails(response.meals[0]);
    } else {
      rowData.innerHTML = "<p>No meal details found.</p>";
    }
  } finally {
    hideInnerLoading();
  }
}

/* ========================================
   DISPLAY FUNCTIONS
   ======================================== */

function displayMeals(arr) {
  rowData.innerHTML = "";

  arr.forEach((meal) => {
    const col = document.createElement("div");
    col.className = "col-md-3";

    const card = document.createElement("div");
    card.className =
      "meal-card meal position-relative overflow-hidden rounded-2 cursor-pointer";
    card.dataset.id = meal.idMeal;

    const img = document.createElement("img");
    img.className = "w-100";
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;

    const layer = document.createElement("div");
    layer.className =
      "meal-layer position-absolute d-flex align-items-center text-black p-2";

    const h3 = document.createElement("h3");
    h3.textContent = meal.strMeal;

    layer.appendChild(h3);
    card.appendChild(img);
    card.appendChild(layer);
    col.appendChild(card);
    rowData.appendChild(col);

    card.addEventListener("click", () => getMealDetails(meal.idMeal));
  });
}

function displayMealDetails(meal) {
  rowData.innerHTML = "";

  const colImg = document.createElement("div");
  colImg.className = "col-md-4";

  const img = document.createElement("img");
  img.className = "w-100 rounded-3";
  img.src = meal.strMealThumb;
  img.alt = meal.strMeal;

  const h2Title = document.createElement("h2");
  h2Title.textContent = meal.strMeal;

  colImg.appendChild(img);
  colImg.appendChild(h2Title);

  const colDetails = document.createElement("div");
  colDetails.className = "col-md-8";

  const h2Instructions = document.createElement("h2");
  h2Instructions.textContent = "Instructions";

  const pInstructions = document.createElement("p");
  pInstructions.textContent = meal.strInstructions;

  const h3Area = document.createElement("h3");
  const spanArea = document.createElement("span");
  spanArea.className = "fw-bolder";
  spanArea.textContent = "Area : ";
  h3Area.appendChild(spanArea);
  h3Area.appendChild(document.createTextNode(meal.strArea));

  const h3Category = document.createElement("h3");
  const spanCategory = document.createElement("span");
  spanCategory.className = "fw-bolder";
  spanCategory.textContent = "Category : ";
  h3Category.appendChild(spanCategory);
  h3Category.appendChild(document.createTextNode(meal.strCategory));

  const h3Recipes = document.createElement("h3");
  h3Recipes.textContent = "Recipes :";

  const ulRecipes = document.createElement("ul");
  ulRecipes.className = "list-unstyled d-flex g-3 flex-wrap";

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      const li = document.createElement("li");
      li.className = "alert alert-info m-2 p-1";
      li.textContent = `${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`;
      ulRecipes.appendChild(li);
    }
  }

  const h3Tags = document.createElement("h3");
  h3Tags.textContent = "Tags :";

  const ulTags = document.createElement("ul");
  ulTags.className = "list-unstyled d-flex g-3 flex-wrap";

  if (meal.strTags) {
    meal.strTags.split(",").forEach((tag) => {
      const li = document.createElement("li");
      li.className = "alert alert-danger m-2 p-1";
      li.textContent = tag;
      ulTags.appendChild(li);
    });
  }

  const btnSource = document.createElement("a");
  btnSource.target = "_blank";
  btnSource.href = meal.strSource;
  btnSource.className = "btn btn-success me-2";
  btnSource.textContent = "Source";

  const btnYoutube = document.createElement("a");
  btnYoutube.target = "_blank";
  btnYoutube.href = meal.strYoutube;
  btnYoutube.className = "btn btn-danger";
  btnYoutube.textContent = "Youtube";

  colDetails.appendChild(h2Instructions);
  colDetails.appendChild(pInstructions);
  colDetails.appendChild(h3Area);
  colDetails.appendChild(h3Category);
  colDetails.appendChild(h3Recipes);
  colDetails.appendChild(ulRecipes);
  colDetails.appendChild(h3Tags);
  colDetails.appendChild(ulTags);
  colDetails.appendChild(btnSource);
  colDetails.appendChild(btnYoutube);

  rowData.appendChild(colImg);
  rowData.appendChild(colDetails);
}

function displayCategories(arr) {
  rowData.innerHTML = "";

  arr.forEach((category) => {
    const col = document.createElement("div");
    col.className = "col-md-3";

    const card = document.createElement("div");
    card.className =
      "meal-card position-relative overflow-hidden rounded-2 cursor-pointer";

    const img = document.createElement("img");
    img.className = "w-100";
    img.src = category.strCategoryThumb;
    img.alt = category.strCategory;

    const layer = document.createElement("div");
    layer.className =
      "meal-layer position-absolute d-flex flex-column align-items-center justify-content-center text-black p-2 text-center";

    const h3 = document.createElement("h3");
    h3.textContent = category.strCategory;

    const p = document.createElement("p");
    p.textContent = category.strCategoryDescription
      .split(" ")
      .slice(0, 20)
      .join(" ");

    layer.appendChild(h3);
    layer.appendChild(p);
    card.appendChild(img);
    card.appendChild(layer);
    col.appendChild(card);
    rowData.appendChild(col);

    card.addEventListener("click", () =>
      getCategoryMeals(category.strCategory)
    );
  });
}

function displayArea(arr) {
  rowData.innerHTML = "";

  arr.forEach((area) => {
    const col = document.createElement("div");
    col.className = "col-md-3";

    const card = document.createElement("div");
    card.className =
      "meal-card rounded-2 text-center cursor-pointer p-3 text-white";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-house-laptop fa-4x";

    const h3 = document.createElement("h3");
    h3.textContent = area.strArea;

    card.appendChild(icon);
    card.appendChild(h3);
    col.appendChild(card);
    rowData.appendChild(col);

    card.addEventListener("click", () => getAreaMeals(area.strArea));
  });
}

function displayIngredients(arr) {
  rowData.innerHTML = "";

  arr.forEach((ingredient) => {
    const col = document.createElement("div");
    col.className = "col-md-3";

    const card = document.createElement("div");
    card.className =
      "meal-card rounded-2 text-center cursor-pointer p-3 text-white";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-drumstick-bite fa-4x";

    const h3 = document.createElement("h3");
    h3.textContent = ingredient.strIngredient;

    const p = document.createElement("p");
    p.textContent = ingredient.strDescription
      ? ingredient.strDescription.split(" ").slice(0, 20).join(" ")
      : "";

    card.appendChild(icon);
    card.appendChild(h3);
    card.appendChild(p);
    col.appendChild(card);
    rowData.appendChild(col);

    card.addEventListener("click", () =>
      getIngredientsMeals(ingredient.strIngredient)
    );
  });
}

/* ========================================
   UI FUNCTIONS
   ======================================== */

function showSearchInputs() {
  searchContainer.innerHTML = "";

  const row = document.createElement("div");
  row.className = "row py-4";

  const col1 = document.createElement("div");
  col1.className = "col-md-6";

  const nameInput = document.createElement("input");
  nameInput.className = "form-control bg-transparent text-white";
  nameInput.type = "text";
  nameInput.placeholder = "Search By Name";
  nameInput.addEventListener("keyup", (e) => searchByName(e.target.value));

  col1.appendChild(nameInput);

  const col2 = document.createElement("div");
  col2.className = "col-md-6";

  const letterInput = document.createElement("input");
  letterInput.className = "form-control bg-transparent text-white";
  letterInput.type = "text";
  letterInput.maxLength = "1";
  letterInput.placeholder = "Search By First Letter";
  letterInput.addEventListener("keyup", (e) => searchByFLetter(e.target.value));

  col2.appendChild(letterInput);

  row.appendChild(col1);
  row.appendChild(col2);

  searchContainer.appendChild(row);

  rowData.innerHTML = "";
}

function createInputColumn(id, type, placeholder, alertId, alertText) {
  const col = document.createElement("div");
  col.className = "col-md-6";

  const input = document.createElement("input");
  input.id = id;
  input.type = type;
  input.className = "form-control";
  input.placeholder = placeholder;
  input.addEventListener("keyup", inputsValidation);

  const alertDiv = document.createElement("div");
  alertDiv.id = alertId;
  alertDiv.className = "alert alert-danger w-100 mt-2 d-none";
  alertDiv.textContent = alertText;

  col.appendChild(input);
  col.appendChild(alertDiv);

  return col;
}

function showContacts() {
  clearSearchContainer();
  rowData.innerHTML = "";

  const contactDiv = document.createElement("div");
  contactDiv.className =
    "contact min-vh-100 d-flex justify-content-center align-items-center";

  const container = document.createElement("div");
  container.className = "container w-75 text-center";

  const row = document.createElement("div");
  row.className = "row g-4";

  row.appendChild(
    createInputColumn(
      "nameInput",
      "text",
      "Enter Your Name",
      "nameAlert",
      "Special characters and numbers not allowed"
    )
  );
  row.appendChild(
    createInputColumn(
      "emailInput",
      "email",
      "Enter Your Email",
      "emailAlert",
      "Email not valid *exemple@yyy.zzz"
    )
  );
  row.appendChild(
    createInputColumn(
      "phoneInput",
      "text",
      "Enter Your Phone",
      "phoneAlert",
      "Enter valid Phone Number"
    )
  );
  row.appendChild(
    createInputColumn(
      "ageInput",
      "number",
      "Enter Your Age",
      "ageAlert",
      "Enter valid age"
    )
  );
  row.appendChild(
    createInputColumn(
      "passwordInput",
      "password",
      "Enter Your Password",
      "passwordAlert",
      "Enter valid password *Minimum eight characters, at least one letter and one number:*"
    )
  );
  row.appendChild(
    createInputColumn(
      "repasswordInput",
      "password",
      "Repassword",
      "repasswordAlert",
      "Enter valid repassword"
    )
  );

  submitBtn = document.createElement("button");
  submitBtn.id = "submitBtn";
  submitBtn.disabled = true;
  submitBtn.className = "btn btn-outline-danger px-2 mt-3";
  submitBtn.textContent = "Submit";

  container.appendChild(row);
  container.appendChild(submitBtn);
  contactDiv.appendChild(container);
  rowData.appendChild(contactDiv);
}

function inputsValidation() {
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const phoneInput = document.getElementById("phoneInput");
  const ageInput = document.getElementById("ageInput");
  const passwordInput = document.getElementById("passwordInput");
  const repasswordInput = document.getElementById("repasswordInput");

  const nameRegex = /^[a-zA-Z ]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const ageRegex = /^(1[89]|[2-9]\d)$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const nameValid = nameRegex.test(nameInput.value);
  const emailValid = emailRegex.test(emailInput.value);
  const phoneValid = phoneRegex.test(phoneInput.value);
  const ageValid = ageRegex.test(ageInput.value);
  const passwordValid = passwordRegex.test(passwordInput.value);
  const repasswordValid = repasswordInput.value === passwordInput.value;

  document
    .getElementById("nameAlert")
    .classList.toggle("d-none", nameValid || nameInput.value === "");
  document
    .getElementById("emailAlert")
    .classList.toggle("d-none", emailValid || emailInput.value === "");
  document
    .getElementById("phoneAlert")
    .classList.toggle("d-none", phoneValid || phoneInput.value === "");
  document
    .getElementById("ageAlert")
    .classList.toggle("d-none", ageValid || ageInput.value === "");
  document
    .getElementById("passwordAlert")
    .classList.toggle("d-none", passwordValid || passwordInput.value === "");
  document
    .getElementById("repasswordAlert")
    .classList.toggle(
      "d-none",
      repasswordValid || repasswordInput.value === ""
    );

  if (
    nameValid &&
    emailValid &&
    phoneValid &&
    ageValid &&
    passwordValid &&
    repasswordValid
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

/* ========================================
   NAVIGATION FUNCTIONS
   ======================================== */

function animateNavLinks(isOpen) {
  navLinks.forEach((li, i) => {
    li.style.transition = "top 0.5s";
    if (isOpen) {
      setTimeout(() => (li.style.top = "0"), (i + 2) * 100);
    } else {
      li.style.top = "300px";
    }
  });
}

function closeSideNav() {
  isNavOpen = false;
  sideNav?.classList.add("closed");
  toggleIcon?.classList.remove("fa-x");
  toggleIcon?.classList.add("fa-align-justify");
  animateNavLinks(false);
}

function toggleSideNav() {
  isNavOpen = !isNavOpen;

  if (isNavOpen) {
    sideNav?.classList.remove("closed");
  } else {
    sideNav?.classList.add("closed");
  }

  toggleIcon?.classList.toggle("fa-x", isNavOpen);
  toggleIcon?.classList.toggle("fa-align-justify", !isNavOpen);

  animateNavLinks(isNavOpen);
}

/* ========================================
   EVENT LISTENERS & INITIALIZATION
   ======================================== */

closeSideNav();
toggleIcon?.addEventListener("click", toggleSideNav);

const logoElem = document.querySelector(".logo");
logoElem?.addEventListener("click", (e) => {
  e?.preventDefault();
  clearSearchContainer();
  searchByName("");
  closeSideNav();
  window.location.href = "index.html";
});

navLinks.forEach((link, index) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    if (index === 0) showSearchInputs();
    else if (index === 1) getCategories();
    else if (index === 2) getArea();
    else if (index === 3) getIngredients();
    else if (index === 4) showContacts();

    closeSideNav();
  });
});

(async function initApp() {
  try {
    await searchByName("");
  } finally {
    hideLoadingScreen();
  }
})();
