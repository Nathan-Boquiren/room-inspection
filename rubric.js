class Rubric {
  constructor() {
    this.sections = [];
  }

  async create() {
    const data = await this.fetchData();
    this.sections = data.map((section) => {
      return new Section(section);
    });
    this.render();
  }

  async fetchData() {
    try {
      const res = await fetch("./rubric.json");
      return await res.json();
    } catch (e) {
      console.error("Error Fetching Rubric:", e);
      return null;
    }
  }

  render() {
    this.sections.forEach((section) => (this.html += section.el));
  }

  getScoreMeaning(score) {
    if (score >= 9) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 5) return "Needs Improvement";
    if (score >= 3) return "Not Good";
    return "Unacceptable";
  }
}

class Section {
  constructor(section) {
    this.name = section.name;
    this.max_points = section.max_points;
    this.categories = this.getCategories(section.categories);
    this.icon = section.icon;
    this.el = this.render();
  }

  getCategories(categories) {
    return categories.map((cat) => {
      return new Category(cat, this.name);
    });
  }

  render() {
    const el = createElement("div", ["rubric-section"]);
    const name = createElement("h1", ["section-name"], this.icon + this.name);
    el.append(name);
    this.categories.forEach((cat) => el.append(cat.el));
    return el;
  }
}

class Category {
  constructor(category, sectionName) {
    this.name = category.name;
    this.max_points = category.max_points;
    this.criteria = category.criteria;
    this.section = sectionName;
    this.el = this.render();
  }

  render() {
    const el = createElement("div", ["category"]);
    const name = createElement("h2", ["category-name"], this.name);
    const choices = this.renderChoicesContainer();
    el.addEventListener("input", () => el.classList.add("selected"));
    el.append(name, choices);
    return el;
  }

  renderChoicesContainer() {
    const choices = createElement("div", ["choices-container"]);
    this.criteria
      .map((choice) => {
        const label = createElement("label", ["choice"]);
        const checkHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="m400-403 244-244q11-11 25.5-11t25.5 11q11 11 11 25.5T695-596L425-326q-11 11-25.5 11T374-326L265-435q-11-11-11-25.5t11-25.5q11-11 25.5-11t25.5 11l84 83Z"/></svg>';
        const radio = createElement("div", ["radio"], checkHTML);
        const txt = createElement("p", null, choice.description);
        txt.style.setProperty("--points", choice.points);
        const input = this.renderInput(choice.points);
        const points = createElement("span", ["points"], `${choice.points}`);
        label.append(input, radio, txt, points);
        return label;
      })
      .forEach((el) => choices.append(el));
    return choices;
  }

  renderInput(points) {
    const input = createElement("input");
    input.type = "radio";
    input.name = this.name.replace(/ /g, "_") + `_[${this.section}]`;
    input.value = points;
    return input;
  }
}

function createElement(type, classNames, innerHTML) {
  const el = document.createElement(type);
  if (classNames) classNames.forEach((name) => el.classList.add(name));
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

const rubric = new Rubric();
const rubricReady = rubric.create();

export { rubric, rubricReady, createElement };
