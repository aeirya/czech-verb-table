const STORAGE_KEY = "czech-verb-lab-comparison-v1";
const DEFAULT_VERBS = ["delat", "mluvit", "pracovat", "byt"];
const state = {
  verbs: new Set(DEFAULT_VERBS),
  tenses: new Set(["present"]),
  people: new Set(PEOPLE.map((person) => person.id)),
  gender: "masculine",
  axis: "verbs",
  colors: true,
};
const byId = (id) => document.getElementById(id);

function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return;
    for (const [key, known] of [
      ["verbs", VERBS.map((verb) => verb.id)],
      ["tenses", TENSES.map((tense) => tense.id)],
      ["people", PEOPLE.map((person) => person.id)],
    ]) {
      if (Array.isArray(saved[key])) {
        state[key] = new Set(saved[key].filter((id) => known.includes(id)));
      }
    }
    if (["masculine", "feminine"].includes(saved.gender)) state.gender = saved.gender;
    if (["verbs", "tenses"].includes(saved.axis)) state.axis = saved.axis;
    if (typeof saved.colors === "boolean") state.colors = saved.colors;
  } catch (_) {
    // Invalid or unavailable browser storage should not stop the app.
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      verbs: [...state.verbs], tenses: [...state.tenses], people: [...state.people],
      gender: state.gender, axis: state.axis, colors: state.colors,
    }));
  } catch (_) {}
}

function changeSelection(group, id, checked) {
  if (checked) state[group].add(id);
  else state[group].delete(id);
  update();
}

function checkbox(group, id, labelText, checked, className) {
  const label = document.createElement("label");
  label.className = className;
  const box = document.createElement("input");
  box.type = "checkbox";
  box.checked = checked;
  box.value = id;
  box.addEventListener("change", () => changeSelection(group, id, box.checked));
  const name = document.createElement("span");
  name.textContent = labelText;
  label.append(box, name);
  return label;
}

function renderPresets() {
  const parent = byId("presets");
  parent.replaceChildren();
  for (const preset of PRESETS) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = preset.label;
    const active = state.verbs.size === preset.ids.length &&
      preset.ids.every((id) => state.verbs.has(id));
    button.setAttribute("aria-pressed", String(active));
    button.addEventListener("click", () => {
      state.verbs = new Set(preset.ids);
      update();
    });
    parent.append(button);
  }
}

function normalizeSearch(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function renderVerbOptions() {
  const parent = byId("verbOptions");
  const search = normalizeSearch(byId("verbSearch").value.trim());
  const matches = VERBS.filter((verb) => normalizeSearch(
    verb.infinitive + " " + verb.english + " " + verb.family + " " + verb.aspect
  ).includes(search));
  parent.replaceChildren();
  for (const verb of matches) {
    const label = document.createElement("label");
    label.className = "verb-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = verb.id;
    input.checked = state.verbs.has(verb.id);
    input.addEventListener("change", () => changeSelection("verbs", verb.id, input.checked));
    const text = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = verb.infinitive;
    const detail = document.createElement("small");
    detail.textContent = verb.english + " · " + verb.aspect;
    text.append(name, detail);
    label.append(input, text);
    parent.append(label);
  }
  if (!matches.length) {
    const note = document.createElement("p");
    note.className = "no-match";
    note.textContent = "No matching verbs.";
    parent.append(note);
  }
  byId("verbCount").textContent = "(" + state.verbs.size + "/" + VERBS.length + ")";
}

function renderChecks(containerId, group, values) {
  const parent = byId(containerId);
  parent.replaceChildren(...values.map((item) =>
    checkbox(group, item.id, item.label, state[group].has(item.id), "chip")
  ));
}

function personLabel(person, index, tense) {
  if (tense === "past") {
    if (index === 2) return state.gender === "masculine" ? "on" : "ona";
    if (index === 5) return state.gender === "masculine" ? "oni" : "ony";
  }
  return person.label;
}

function getForm(verb, tense, index) {
  if (tense === "present" && verb.aspect === "perfective") return null;
  if (tense === "past") return verb.past[state.gender][index];
  return verb[tense][index];
}

function splitForm(verb, tense, index, form) {
  if (tense === "past") {
    const aux = AUX_PAST[index];
    const main = aux ? form.slice(0, -aux.length) : form;
    const stem = verb.pastRoots?.[state.gender]?.[index] || verb.pastStem;
    if (stem && main.startsWith(stem)) {
      return [
        { kind: "stem", value: stem },
        { kind: "ending", value: main.slice(stem.length) },
        { kind: "tail", value: aux },
      ];
    }
    return [{ kind: "ending", value: main }, { kind: "tail", value: aux }];
  }

  // Imperfective analytic future: highlight bud- + auxiliary ending,
  // and leave the infinitive visually intact.
  if (tense === "future" && verb.aspect === "imperfective" && !verb.futureStem) {
    const auxiliary = AUX_FUTURE[index];
    return [
      { kind: "stem", value: "bud" },
      { kind: "ending", value: auxiliary.slice(3) },
      { kind: "tail", value: " " + verb.infinitive },
    ];
  }

  let stem = tense === "future" ? (verb.futureStem ?? verb.stem) : verb.stem;
  if (Array.isArray(stem)) stem = stem[index];
  if (stem && form.startsWith(stem)) {
    return [
      { kind: "stem", value: stem },
      { kind: "ending", value: form.slice(stem.length) },
    ];
  }
  return [{ kind: "ending", value: form }];
}

function tenseBlock(verb, tense) {
  const section = document.createElement("section");
  section.className = "tense-block tense-" + tense.id;
  const heading = document.createElement("div");
  heading.className = "tense-head";
  const title = document.createElement("h4");
  title.textContent = tense.label;
  const detail = document.createElement("small");
  detail.textContent = tense.id === "past"
    ? (state.gender === "masculine" ? "masculine / mixed" : "feminine")
    : tense.id === "future" && verb.aspect === "perfective"
      ? "perfective non-past" : tense.english;
  heading.append(title, detail);
  section.append(heading);

  if (tense.id === "present" && verb.aspect === "perfective") {
    const warning = document.createElement("p");
    warning.className = "unavailable";
    warning.textContent = "No true present tense. Select Future to see these perfective non-past forms.";
    section.append(warning);
    return section;
  }

  for (const [index, person] of PEOPLE.entries()) {
    if (!state.people.has(person.id)) continue;
    const row = document.createElement("div");
    row.className = "form-row";
    const label = document.createElement("span");
    label.className = "person";
    const name = document.createElement("strong");
    name.textContent = personLabel(person, index, tense.id);
    const english = document.createElement("small");
    english.textContent = person.english;
    label.append(name, english);
    const form = document.createElement("span");
    form.className = "form";
    const full = getForm(verb, tense.id, index);
    form.setAttribute("aria-label", full);
    for (const part of splitForm(verb, tense.id, index, full)) {
      if (!part.value) continue;
      const span = document.createElement("span");
      span.className = part.kind;
      span.textContent = part.value;
      form.append(span);
    }
    row.append(label, form);
    section.append(row);
  }
  return section;
}

function renderTables() {
  const chosenVerbs = VERBS.filter((verb) => state.verbs.has(verb.id));
  const chosenTenses = TENSES.filter((tense) => state.tenses.has(tense.id));
  const numberOfPeople = state.people.size;
  const visible = chosenVerbs.length > 0 && chosenTenses.length > 0 && numberOfPeople > 0;

  const summary = byId("summary");
  summary.textContent = chosenVerbs.length + (chosenVerbs.length === 1 ? " verb" : " verbs") +
    " · " + chosenTenses.length + (chosenTenses.length === 1 ? " tense" : " tenses") +
    " · " + numberOfPeople + (numberOfPeople === 1 ? " person" : " persons");
  const empty = byId("empty");
  empty.hidden = visible;
  const tables = byId("tables");
  tables.dataset.axis = state.axis;
  tables.replaceChildren();

  if (!visible) return;
  for (const verb of chosenVerbs) {
    const card = document.createElement("article");
    card.className = "verb-card";
    const head = document.createElement("div");
    head.className = "verb-head";
    const nameBox = document.createElement("div");
    const heading = document.createElement("h3");
    heading.textContent = verb.infinitive;
    const meaning = document.createElement("p");
    meaning.className = "meaning";
    meaning.textContent = verb.english;
    nameBox.append(heading, meaning);
    const type = document.createElement("span");
    type.className = "type";
    type.textContent = verb.family + " · " + (verb.aspect === "perfective" ? "PF" : "IPF");
    type.title = verb.aspect;
    head.append(nameBox, type);
    card.append(head);
    if (verb.note) {
      const note = document.createElement("p");
      note.className = "note";
      note.textContent = verb.note;
      card.append(note);
    }
    const tenseGrid = document.createElement("div");
    tenseGrid.className = "tense-grid";
    for (const tense of chosenTenses) tenseGrid.append(tenseBlock(verb, tense));
    card.append(tenseGrid);
    tables.append(card);
  }
}

function renderControls() {
  renderPresets();
  renderVerbOptions();
  renderChecks("tenseOptions", "tenses", TENSES);
  renderChecks("personOptions", "people", PEOPLE);
  byId("pastGroup").hidden = !state.tenses.has("past");
  for (const button of document.querySelectorAll("[data-gender]")) {
    button.setAttribute("aria-pressed", String(button.dataset.gender === state.gender));
  }
  for (const button of document.querySelectorAll("button[data-axis]")) {
    button.setAttribute("aria-pressed", String(button.dataset.axis === state.axis));
  }
  byId("colorToggle").checked = state.colors;
  document.body.classList.toggle("no-colors", !state.colors);
}

function update() {
  renderControls();
  renderTables();
  save();
}

byId("verbSearch").addEventListener("input", renderVerbOptions);
for (const button of document.querySelectorAll("[data-control]")) {
  button.addEventListener("click", () => {
    const group = button.dataset.control;
    const all = group === "verbs" ? VERBS : group === "tenses" ? TENSES : PEOPLE;
    state[group] = button.dataset.action === "all"
      ? new Set(all.map((item) => item.id)) : new Set();
    update();
  });
}
for (const button of document.querySelectorAll("[data-gender]")) {
  button.addEventListener("click", () => { state.gender = button.dataset.gender; update(); });
}
for (const button of document.querySelectorAll("button[data-axis]")) {
  button.addEventListener("click", () => { state.axis = button.dataset.axis; update(); });
}
byId("colorToggle").addEventListener("change", (event) => {
  state.colors = event.target.checked;
  update();
});
byId("reset").addEventListener("click", () => {
  state.verbs = new Set(DEFAULT_VERBS);
  state.tenses = new Set(["present"]);
  state.people = new Set(PEOPLE.map((person) => person.id));
  state.gender = "masculine";
  state.axis = "verbs";
  state.colors = true;
  byId("verbSearch").value = "";
  update();
});
restore();
update();
