const navToggler = document.querySelector(".main-nav__toggle");
const navigation = document.querySelector(".main-nav__list");

navToggler.hidden = false;
navigation.classList.add("main-nav__list--enabled");

navToggler.addEventListener("click", () => {
  navigation.classList.toggle("main-nav__list--opened");
  navToggler.classList.toggle("main-nav__toggle--opened");
});
