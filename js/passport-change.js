document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("change-language");

  button.addEventListener("click", function () {
    const surname = document.getElementById("surname");
    const name = document.getElementById("name");
    const birthYear = document.getElementById("birth-year");
    const digits = birthYear.textContent.match(/\d{4}/);

    surname.textContent = "Sidorenko";
    name.textContent = "Mikhail";
    birthYear.textContent = (digits ? digits[0] : "YYYY") + " year";

    surname.classList.remove("replace-me");
    name.classList.remove("replace-me");
    birthYear.classList.remove("replace-me");
    button.textContent = "Данные изменены";
    button.disabled = true;
  });
});
