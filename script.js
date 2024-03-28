let basketItems = [];
let prices = [];
let amounts = [];
let finalSum = 0;
let deliveryCost = 1.59;

load();

function render() {
  generateCategory(categoryNavigation);
  generateTitleCategory(menu);
  updateCartButtonText(basketBtn);
  generateBasket(basket);
  save();
}

let menu = document.getElementById("menu-container");
let main = document.querySelector(".main-container");
let categoryNavigation = document.getElementById("category-navigation");
let basket = document.getElementById("shopping-basket");
let basketBtn = document.getElementById("basket-btn");

let currentCategory = "";

function generateTitleCategory(menu) {
  menu.innerHTML = "";

  for (let i = 0; i < foods.length; i++) {
    let food = foods[i];

    if (food.category !== currentCategory) {
      currentCategory = food.category;

      menu.innerHTML += generateCategoryTitleHTML(currentCategory);
    }
    menu.innerHTML += generateMenu(i);
  }
}

function generateCategoryTitleHTML(category) {
  return /*html*/ `
    <h2 class="category-title" id="${category}">${category.toUpperCase()}</h2>
  `;
}

function generateCategory(categoryNavigation) {
  categoryNavigation.innerHTML = getCategoryNavigationHTML();
}

function getCategoryNavigationHTML() {
  let addedCategories = {};

  let categoryNavigation = "";

  foods.forEach((food) => {
    if (!addedCategories[food.category]) {
      addedCategories[food.category] = true;
      categoryNavigation += `<a href="#${food.category}">${food.category}</a>`;
    }
  });
  return categoryNavigation;
}

function generateMenu(i) {
  let food = foods[i];

  return /*html*/ `
  <div class="food-container">
<div class="food">
<h2>${food["name"]}</h2>
<img onclick="addToBasket(${i})" src="logos/plus.png" alt="plus">
</div>
<h2>${formatNumber(food["price"].toFixed(2)) + "€"}</h2>
  </div>
  `;
}

function generateBasket(basket) {
  basket.innerHTML = generateBasketBaseHTML();
  updateShoppingBasket();
}

function generateBasketBaseHTML() {
  return /*html*/ `
    <h2>Warenkorb</h2>
    <div class="basket">
    <div id="items"></div>
    </div>
    <div id="sum"></div>
  `;
}

function addToBasket(i) {
  addToBasketCondition(i);
  updateShoppingBasket();
  save();
  updateCartButtonText(basketBtn);
}

function addToBasketCondition(i) {
  let food = foods[i];
  let existingItem = basketItems.indexOf(food.name);

  if (existingItem === -1) {
    basketItems.push(food.name);
    prices.push(food.price);
    amounts.push(1);
  } else {
    amounts[existingItem] += 1;
  }
}

function updateShoppingBasket() {
  updateItemsDisplay();
  updateSumDisplay();
}

function updateItemsDisplay(i) {
  let itemsContainer = document.getElementById("items");
  itemsContainer.innerHTML = "";

  finalSum = 0;

  for (let i = 0; i < prices.length; i++) {
    let total = prices[i] * amounts[i];

    finalSum += total;

    if (amounts[i] > 0) {
      itemsContainer.innerHTML += generateBasketItemsHTML(i);
    }
  }
  updateSumDisplay();
}

function generateBasketItemsHTML(i) {
  let total = prices[i] * amounts[i];

  return /*html*/ `
  <span>
    <strong>${amounts[i]} ${basketItems[i]}</strong> 
  <div class="price">${formatNumber(total.toFixed(2))} €
</div>
</span>
${generatePlusMinusHTML(i)} 
`;
}

function generatePlusMinusHTML(i) {
  return /*html*/ `
  <div class="plus-minus">
  <img onclick="increaseItem(${i})" src="logos/plus.png" alt="plus">
  <strong>${amounts[i]}</strong> 
  <img onclick="decreaseItem(${i})" src="logos/minus.png" alt="minus">
</div>
<div class="seperator"></div>
`;
}

function updateSumDisplay(i) {
  let sumContainer = document.getElementById("sum");

  if (finalSum > 0) {
    sumContainer.innerHTML = generateCostsHTML(i);
  } else sumContainer.innerHTML = generateEmptyBasketHTML();
}

function generateEmptyBasketHTML() {
  return /*html*/ ` 
    <div class="empty-basket">
    <img src="logos/shopping-cart.png" alt="shopping-cart">
  <h2>Fülle deinen Warenkorb</h2>
  <p>Füge einige leckere Gerichte aus der Speisekarte hinzu und bestelle dein Essen.</p>
  </div>
  `;
}

function generateCostsHTML(i) {
  return /*html*/ `
    <span>Lieferkosten
      <div class="price">${deliveryCost} €</div>
    </span>
    <span>
      Zwischensumme
      <div class="price">${formatNumber(finalSum.toFixed(2))} €</div>
  </span> ${generateTotalCostsHTML(i)}`;
}

function generateTotalCostsHTML(i) {
  let totalSum = finalSum + deliveryCost;

  return /*html*/ `
  <span>Gesamt
    <div class="price">${formatNumber(totalSum)} €</div>
  </span>
<div class="button-container">
<button onclick="order()" class="orderBtn">BESTELLEN</button>
</div>`;
}

function increaseItem(i) {
  amounts[i] += 1;
  prices[i] * amounts[i];

  updateShoppingBasket();
  save();
}

function decreaseItem(i) {
  if (amounts[i] > 1) {
    amounts[i] -= 1;
  } else {
    basketItems.splice(i, 1);
    prices.splice(i, 1);
    amounts.splice(i, 1);
  }
  updateShoppingBasket();
  save();
}

function order(i) {
  basketItems = [];
  prices = [];
  amounts = [];
  updateShoppingBasket();
  alert("Testbestellung ist erfolgt!");
  save();
}

function updateCartButtonText(basketBtn) {
  let total = amounts.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  basketBtn.innerText = `${total} Warenkorb`;
}

function showCart(basketBtn, main, basket) {
  basket.style.display = "flex";
  main.classList.add("d-none");
  basketBtn.innerText = `Weitere Produkte hinzufügen`;
}

function hideCart(basket, main) {
  basket.style.display = "none";
  main.classList.remove("d-none");
  updateCartButtonText(basketBtn);
}

function toggleCart(basket) {
  if (!basket.style.display || basket.style.display === "none") {
    showCart(basketBtn, main, basket);
  } else {
    hideCart(basket, main);
  }
}

function formatNumber(number) {
  return number.toLocaleString("en-US");
}

function save() {
  localStorage.setItem("basketItems", JSON.stringify(basketItems));
  localStorage.setItem("prices", JSON.stringify(prices));
  localStorage.setItem("amounts", JSON.stringify(amounts));
}

function load() {
  const loadedBasketItems = localStorage.getItem("basketItems");
  const loadedPrices = localStorage.getItem("prices");
  const loadedAmounts = localStorage.getItem("amounts");

  if (loadedBasketItems) {
    basketItems = JSON.parse(loadedBasketItems);
  }
  if (loadedPrices) {
    prices = JSON.parse(loadedPrices);
  }
  if (loadedAmounts) {
    amounts = JSON.parse(loadedAmounts);
  }
}

render();
