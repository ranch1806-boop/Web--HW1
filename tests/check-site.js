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

  assert.match(html, /id="site-nav"/, `${file}: отсутствует общая навигация`);
  assert.match(html, /aria-current="page"/, `${file}: не обозначена текущая страница`);
  assert.match(html, /href="index\.html" target="_self"/, `${file}: нет перехода на начальную страницу`);
  assert.match(html, /href="html-basics\.html#section1" target="_self"/, `${file}: нет ссылки на закладку другой страницы`);
  assert.match(html, /href="https?:\/\/[^\"]+" target="_blank"/, `${file}: нет внешней ссылки в новом окне`);
}

assert.deepEqual(missing, [], "Найдены ссылки на отсутствующие локальные файлы");
assert.equal(htmlFiles.length, 9, "Ожидалось 9 HTML-файлов");

for (const file of ["html-basics.html", "css-basics.html", "javascript-basics.html", "gallery.html"]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert.match(html, /id="top"/, `${file}: нет закладки top`);
  assert.match(html, /href="#section1"/, `${file}: нет ссылки на раздел 1`);
  assert.match(html, /href="#section2"/, `${file}: нет ссылки на раздел 2`);
  assert.match(html, /К началу страницы/, `${file}: нет обратной закладки`);
}

const forms = fs.readFileSync(path.join(root, "forms.html"), "utf8");
assert.equal((forms.match(/<form /g) || []).length, 2, "forms.html: должно быть две формы");
for (const name of ["last_name", "first_name", "group", "mobile_phone", "message_date"]) {
  assert.match(forms, new RegExp(`name="${name}"`), `forms.html: нет контактного поля ${name}`);
}
for (const type of ["text", "number", "radio", "checkbox", "date", "password", "hidden"]) {
  assert.match(forms, new RegExp(`type="${type}"`, "i"), `forms.html: нет input type=${type}`);
}
for (const type of ["text", "number", "radio", "checkbox", "date", "password", "hidden"]) {
  assert.match(forms, new RegExp(`type="${type}"[^>]+(?:value=|checked)`, "i"), `forms.html: нет значения по умолчанию для type=${type}`);
}

const lists = fs.readFileSync(path.join(root, "html-basics.html"), "utf8");
assert.match(lists, /<ol>[\s\S]*<\/ol>/, "html-basics.html: нет нумерованного списка");
assert.match(lists, /<ul>[\s\S]*<ul>[\s\S]*<\/ul>[\s\S]*<\/ul>/, "html-basics.html: нет вложенного списка");

const gallery = fs.readFileSync(path.join(root, "gallery.html"), "utf8");
assert.match(gallery, /<table[^>]+background=/i, "gallery.html: нет фонового изображения таблицы");
assert.match(gallery, /<td[^>]+background=/i, "gallery.html: нет фонового изображения ячейки");
assert.match(gallery, /width="90"/, "gallery.html: нет миниатюры до 100 пикселей");
assert.match(gallery, /href="assets\/images\/hockey-match-600x400\.jpg" target="_blank"/, "gallery.html: большое изображение не открывается в новой вкладке");
assert.match(gallery, /На изображении показаны/, "gallery.html: нет пояснения к изображению");
assert.match(gallery, /<td[\s\S]*<img /i, "gallery.html: нет изображения в ячейке");
assert.match(gallery, /<table[\s\S]*<a /i, "gallery.html: нет гиперссылки в таблице");

assert.ok(fs.existsSync(path.join(root, "assets", "images", "hockey-match-600x400.jpg")), "Нет локальной версии фотографии 600 x 400");

for (const file of ["passport-dom.html", "passport-change.html"]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert.match(html, /passport-layout/, `${file}: нет паспортного шаблона`);
  assert.match(html, /id="surname"/, `${file}: нет DOM-элемента фамилии`);
  assert.match(html, /id="name"/, `${file}: нет DOM-элемента имени`);
  assert.match(html, /id="birth-year"/, `${file}: нет DOM-элемента года`);
}

const passportDom = fs.readFileSync(path.join(root, "passport-dom.html"), "utf8");
assert.match(passportDom, /<title>DOM_JS\. Считываем информацию из DOM<\/title>/, "Неверное название DOM-страницы");

const passportChange = fs.readFileSync(path.join(root, "passport-change.html"), "utf8");
assert.match(passportChange, /<title>Изменяем кириллицу на латиницу по клику<\/title>/, "Неверное название страницы изменения паспорта");
assert.match(passportChange, /id="change-language"/, "Нет элемента для события click");

const task = fs.readFileSync(path.join(root, "task-1006.html"), "utf8");
assert.match(task, /<title>Решение алгоритмической задачи<\/title>/, "Неверное название страницы задачи");
for (const name of ["formulation", "amount", "result"]) {
  assert.match(task, new RegExp(`name="${name}"`), `task-1006.html: не отправляется поле ${name}`);
}

console.log(`site-check: проверено ${htmlFiles.length} HTML-файлов, структура соответствует простым учебным примерам`);
