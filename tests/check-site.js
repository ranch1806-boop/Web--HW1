const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith(".html"));
const missing = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual(duplicates, [], `${file}: повторяющиеся id`);

  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (/^(?:https?:|mailto:|tel:|#)/.test(reference)) continue;
    const localPath = reference.split("#")[0].split("?")[0];
    if (localPath && !fs.existsSync(path.resolve(root, localPath))) {
      missing.push(`${file} -> ${reference}`);
    }
  }

  if (file !== "image-view.html") {
    assert.match(html, /id="site-nav"/, `${file}: отсутствует общая навигация`);
    assert.match(html, /текущая/i, `${file}: не обозначена текущая страница`);
  }
}

assert.deepEqual(missing, [], "Найдены ссылки на отсутствующие локальные файлы");
assert.equal(htmlFiles.length, 10, "Ожидалось 10 HTML-файлов");

for (const file of ["html-basics.html", "css-basics.html", "javascript-basics.html", "gallery.html"]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert.match(html, /id="top"/, `${file}: нет закладки top`);
  assert.match(html, /href="#section1"/, `${file}: нет ссылки на раздел 1`);
  assert.match(html, /href="#section2"/, `${file}: нет ссылки на раздел 2`);
  assert.match(html, /К началу страницы/, `${file}: нет обратной закладки`);
}

const forms = fs.readFileSync(path.join(root, "forms.html"), "utf8");
for (const type of ["text", "number", "radio", "checkbox", "date", "password", "hidden"]) {
  assert.match(forms, new RegExp(`type="${type}"`, "i"), `forms.html: нет input type=${type}`);
}

const gallery = fs.readFileSync(path.join(root, "gallery.html"), "utf8");
assert.match(gallery, /<table[^>]+background=/i, "gallery.html: нет фонового изображения таблицы");
assert.match(gallery, /<td[^>]+background=/i, "gallery.html: нет фонового изображения ячейки");

for (const file of ["passport-dom.html", "passport-change.html"]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert.match(html, /passport-layout/, `${file}: нет паспортного шаблона`);
  assert.match(html, /id="surname"/, `${file}: нет DOM-элемента фамилии`);
  assert.match(html, /id="name"/, `${file}: нет DOM-элемента имени`);
  assert.match(html, /id="birth-year"/, `${file}: нет DOM-элемента года`);
}

console.log(`site-check: проверено ${htmlFiles.length} HTML-файлов, структура соответствует простым учебным примерам`);
