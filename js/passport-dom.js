function collectPassportData() {
  const data = {
    surname: document.getElementById("surname").textContent.trim(),
    name: document.getElementById("name").textContent.trim(),
    birthYear: document.getElementById("birth-year").textContent.trim()
  };

  console.log(data);
  return data;
}

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("read-dom");
  const output = document.getElementById("dom-output");

  button.addEventListener("click", function () {
    const data = collectPassportData();
    output.textContent = JSON.stringify(data, null, 2);
  });
});
