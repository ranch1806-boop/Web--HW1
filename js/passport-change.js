document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("change-language");
  const fields = document.querySelectorAll(".passport-layout [data-en]");
  const russianText = Array.from(fields, function (field) {
    return field.textContent;
  });
  let english = false;

  button.addEventListener("click", function () {
    english = !english;
    fields.forEach(function (field, index) {
      field.textContent = english ? field.dataset.en : russianText[index];
    });
  });
});
