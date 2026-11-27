const STORAGE_KEY = "cmac-connect-showcase-v1";

const resourceLinks = [
  {
    name: "CBE PowerSchool",
    description: "Check grades, attendance, and school information.",
    label: "Open PowerSchool",
    url: "https://sis.cbe.ab.ca/public/home.html",
    icon: "↗",
  },
  {
    name: "CBE D2L",
    description: "Head to your CBE online learning environment.",
    label: "Open D2L",
    url: "https://d2l.cbe.ab.ca/",
    icon: "↗",
  },
  {
    name: "School website",
    description: "Find the official CMAC school website through CBE.",
    label: "Find your school",
    url: "https://www.cbe.ab.ca/schools/Pages/default.aspx",
    icon: "↗",
  },
  {
    name: "CBE library resources",
    description: "Explore library services and learning resources from CBE.",
    label: "Explore libraries",
    url: "https://www.cbe.ab.ca/programs/program-options/Pages/Libraries.aspx",
    icon: "↗",
  },
  {
    name: "Student handbook",
    description: "Ask your school for its current student handbook and policies.",
    label: "Find your school",
    url: "https://www.cbe.ab.ca/schools/Pages/default.aspx",
    icon: "↗",
  },
];

const stories = [
  {
    id: "story-1",
    category: "School news",
    title: "A week to connect, create, and celebrate",
    summary: "Make time to share what you’re learning, cheer on a classmate, and get involved in your school community.",
    date: `Sample · ${getTodayLabel()}`,
    art: "art-community",
    alt: "Illustration of colourful shapes coming together",
    more: "This sample feature is a placeholder for a school-approved announcement or community story.",
  },
  {
    id: "story-2",
    category: "Student projects",
    title: "Big ideas start with a first sketch",
    summary: "From science experiments to creative builds, the CMAC community is full of ideas worth showing off.",
    date: `Sample · ${getTodayLabel()}`,
    art: "art-ideas",
    alt: "Illustration of a light bulb and creative project shapes",
    more: "Invite students to share a description of their work. Add photos only after the school has approved a safe upload process.",
  },
  {
    id: "story-3",
    category: "Achievements",
    title: "Celebrate the little wins, too",
    summary: "Finished a tricky assignment? Helped a teammate? Progress comes in all shapes and sizes.",
    date: `Sample · ${getTodayLabel()}`,
    art: "art-celebrate",
    alt: "Illustration of stars and a celebration banner",
    more: "Replace this example with an achievement that has been reviewed and approved by a teacher or administrator.",
  },
];

const gradeDetails = {
  5: {
    announcement: "Welcome, Grade 5 students! This is your space to share class projects, celebrate new skills, and keep up with grade updates.",
    event: "Add your next class event here",
    work: "Show us what you’re curious about",
  },
  6: {
    announcement: "Grade 6 students: bring your ideas, questions, and latest creations. Check back with your teachers for class announcements.",
    event: "Add your next class event here",
    work: "Share a project you’re proud of",
  },
  7: {
    announcement: "Grade 7 students: this space is ready for class news, creative projects, and the milestones you reach together.",
    event: "Add your next class event here",
    work: "Explore what classmates are making",
  },
  8: {
    announcement: "Grade 8 students: share your work, support a classmate, and look here for updates from your grade community.",
    event: "Add your next class event here",
    work: "Showcase your latest idea",
  },
  9: {
    announcement: "Grade 9 students: celebrate your achievements and share the projects, performances, and moments that matter to you.",
    event: "Add your next class event here",
    work: "Celebrate a Grade 9 achievement",
  },
};

const exampleShowcases = [
  {
    id: "showcase-1",
    firstName: "Avery",
    grade: "8",
    category: "Project",
    title: "A tiny cardboard arcade",
    description: "I designed a tabletop game from recycled cardboard and tested different ways to make the ball roll.",
    date: `Sample · ${getTodayLabel()}`,
    art: "art-ideas",
  },
  {
    id: "showcase-2",
    firstName: "Jordan",
    grade: "6",
    category: "Art",
    title: "Patterns from nature",
    description: "My sketchbook page is inspired by the shapes and patterns I noticed outside.",
    date: `Sample · ${getTodayLabel()}`,
    art: "art-community",
  },
  {
    id: "showcase-3",
    firstName: "Sam",
    grade: "9",
    category: "Achievement",
    title: "A goal worth celebrating",
    description: "I kept practising a new skill even when it felt challenging. I’m proud of sticking with it.",
    date: `Sample · ${getTodayLabel()}`,
    art: "art-celebrate",
  },
];

const pageView = document.querySelector("#page-view");
const pageTitle = document.querySelector("#breadcrumb-current");
const postDialog = document.querySelector(".post-dialog");
const postForm = document.querySelector("#post-form");
const toast = document.querySelector("#toast");
const navLinks = [...document.querySelectorAll(".nav-link")];
const mobileMenuButton = document.querySelector(".mobile-menu-button");
const sidebar = document.querySelector(".sidebar");
const likedPostIds = new Set();
let activePage = "home";
let toastTimeout;

function makeElement(tagName, className = "", text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function getStudentPosts() {
  try {
    const savedPosts = window.localStorage.getItem(STORAGE_KEY);
    if (!savedPosts) return [];
    const posts = JSON.parse(savedPosts);
    if (!Array.isArray(posts)) throw new Error("Saved posts are not in the expected format.");
    return posts;
  } catch (error) {
    console.error("Could not load CMAC-Connect showcase posts.", error);
    showToast("Saved showcase posts could not be loaded from this browser.", true);
    return [];
  }
}

function showToast(message, isError = false) {
  window.clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.toggle("toast-error", isError);
  toast.classList.add("is-visible");
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function getTodayLabel() {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date());
}

function createArtwork(className, description) {
  const artwork = makeElement("div", `story-art ${className}`);
  artwork.setAttribute("role", "img");
  artwork.setAttribute("aria-label", description);
  artwork.append(makeElement("span", "art-shape art-shape-one"), makeElement("span", "art-shape art-shape-two"), makeElement("span", "art-glyph", "✦"));
  return artwork;
}

function createStoryCard(story, showReadMore = false) {
  const card = makeElement("article", "story-card");
  card.append(createArtwork(story.art, story.alt || story.title));
  const content = makeElement("div", "story-card-content");
  const meta = makeElement("div", "story-card-meta");
  meta.append(makeElement("span", "post-category", story.category), makeElement("span", "story-date", story.date));
  content.append(meta, makeElement("h3", "post-title", story.title), makeElement("p", "post-body", story.summary));
  if (showReadMore) {
    const more = makeElement("p", "story-more", story.more);
    more.hidden = true;
    const button = makeElement("button", "text-link story-more-button", "Read more +");
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
      more.hidden = !more.hidden;
      button.setAttribute("aria-expanded", String(!more.hidden));
      button.textContent = more.hidden ? "Read more +" : "Read less −";
    });
    content.append(more, button);
  }
  card.append(content);
  return card;
}

function createShowcaseCard(post) {
  const card = makeElement("article", "showcase-card");
  card.append(createArtwork(post.art || "art-community", `${post.category} artwork shared by ${post.firstName}`));
  const content = makeElement("div", "showcase-card-content");
  const author = makeElement("div", "showcase-author");
  const avatar = makeElement("span", "author-avatar", post.firstName.slice(0, 1).toUpperCase());
  avatar.setAttribute("aria-hidden", "true");
  const authorInfo = makeElement("div");
  authorInfo.append(makeElement("div", "author-name", post.firstName), makeElement("div", "post-meta", `Grade ${post.grade} · ${post.date}`));
  author.append(avatar, authorInfo, makeElement("span", "post-category", post.category));
  content.append(author, makeElement("h3", "post-title", post.title), makeElement("p", "post-body", post.description));
  card.append(content);
  return card;
}

function createResourceCard(resource) {
  const card = makeElement("article", "resource-card");
  card.append(makeElement("span", "resource-icon", resource.icon));
  card.append(makeElement("h3", "", resource.name), makeElement("p", "", resource.description));
  const link = makeElement("a", "text-link", `${resource.label} ↗`);
  link.href = resource.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  card.append(link);
  return card;
}

function createShowcaseSection(limit = Infinity, grade = "") {
  const section = makeElement("section", "page-section");
  const heading = makeElement("div", "section-heading");
  const headingCopy = makeElement("div");
  headingCopy.append(makeElement("p", "section-kicker", grade ? "GRADE COMMUNITY" : "STUDENT STORIES"));
  headingCopy.append(makeElement("h2", "", grade ? "Projects & achievements" : "Made by our community"));
  heading.append(headingCopy);
  const more = makeElement("a", "text-link", "View showcase ↗");
  more.href = "#showcase";
  heading.append(more);

  const posts = [...getStudentPosts(), ...exampleShowcases]
    .filter((post) => !grade || String(post.grade) === grade)
    .slice(0, limit);
  const grid = makeElement("div", "showcase-grid");
  if (posts.length) {
    grid.append(...posts.map(createShowcaseCard));
  } else {
    grid.append(makeElement("p", "empty-state", "No student stories have been shared for this grade yet."));
  }
  section.append(heading, grid);
  return section;
}

function createResourceLinks() {
  const section = makeElement("section", "page-section quick-resources");
  const heading = makeElement("div", "section-heading");
  const title = makeElement("div");
  title.append(makeElement("p", "section-kicker", "ONE-CLICK ACCESS"), makeElement("h2", "", "Your school links"));
  heading.append(title);
  const more = makeElement("a", "text-link", "All resources ↗");
  more.href = "#resources";
  heading.append(more);
  const links = makeElement("div", "resource-shortcuts");
  resourceLinks.slice(0, 3).forEach((resource) => {
    const link = makeElement("a", "resource-shortcut", resource.name);
    link.href = resource.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.append(makeElement("span", "", "↗"));
    links.append(link);
  });
  section.append(heading, links);
  return section;
}

function createGradeCards() {
  const section = makeElement("section", "page-section");
  const heading = makeElement("div", "section-heading");
  const title = makeElement("div");
  title.append(makeElement("p", "section-kicker", "FIND YOUR PEOPLE"), makeElement("h2", "", "Explore by grade"));
  heading.append(title, makeElement("span", "section-aside", "GRADES 5—9"));
  const grid = makeElement("div", "grade-row");
  for (let grade = 5; grade <= 9; grade += 1) {
    const link = makeElement("a", "grade-card");
    link.href = `#grade-${grade}`;
    link.append(
      makeElement("span", "grade-card-number", `0${grade}`),
      makeElement("span", "grade-card-name", `Grade ${grade}`),
      makeElement("span", "grade-card-arrow", "↗"),
    );
    grid.append(link);
  }
  section.append(heading, grid);
  return section;
}

function createHero() {
  const hero = makeElement("section", "welcome-banner");
  const copy = makeElement("div", "welcome-copy");
  copy.append(makeElement("div", "eyebrow", "CMAC COMMUNITY"));
  const heading = makeElement("h1");
  heading.append(document.createTextNode("CMAC-Connect"));
  heading.append(document.createElement("br"));
  const tagline = makeElement("span", "", "Connect • Create • Celebrate");
  heading.append(tagline);
  copy.append(heading, makeElement("p", "", "Your school community, all in one place. Catch up on news, share what you’re working on, and celebrate one another."));
  const button = makeElement("a", "button button-dark", "Explore student showcase ↗");
  button.href = "#showcase";
  copy.append(button);

  const art = makeElement("div", "welcome-art");
  art.setAttribute("role", "img");
  art.setAttribute("aria-label", "Illustrated CMAC mascot");
  art.append(makeElement("span", "art-orbit orbit-one"), makeElement("span", "art-orbit orbit-two"));
  const mascot = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  mascot.setAttribute("viewBox", "0 0 200 200");
  mascot.setAttribute("class", "welcome-mascot");
  mascot.setAttribute("aria-hidden", "true");
  mascot.innerHTML = '<path d="m49 48-23-20-4 49 24-9m105-20 23-20 4 49-24-9" fill="#171714"/><path d="M100 37c-44 0-72 34-72 82v37l27-14 14 34h62l14-34 27 14v-37c0-48-28-82-72-82Z" fill="#171714"/><path d="M66 103h.5m67-.5h.5" stroke="#F0D66E" stroke-width="13" stroke-linecap="round"/><path d="M82 130c10 9 26 9 36 0" stroke="#F0D66E" stroke-width="8" stroke-linecap="round"/>';
  art.append(mascot, makeElement("span", "mascot-caption", "CMAC COMMUNITY"));
  hero.append(copy, art);
  return hero;
}

function renderHome() {
  const page = [createHero(), createGradeCards()];
  const featured = makeElement("section", "page-section");
  const heading = makeElement("div", "section-heading");
  const title = makeElement("div");
  title.append(makeElement("p", "section-kicker", "GOOD THINGS HAPPENING"), makeElement("h2", "", "A little bit of everything"));
  heading.append(title);
  const latest = makeElement("a", "text-link", "Latest news ↗");
  latest.href = "#news";
  heading.append(latest);
  const grid = makeElement("div", "story-grid");
  grid.append(...stories.map((story) => createStoryCard(story, true)));
  featured.append(heading, grid);
  page.push(featured, createShowcaseSection(2), createResourceLinks());
  pageView.append(...page);
}

function renderNews() {
  const header = makeElement("section", "page-intro");
  header.append(
    makeElement("p", "section-kicker", "WHAT’S NEW AT CMAC"),
    makeElement("h1", "page-heading", "News & announcements"),
    makeElement("p", "page-description", "School updates, student stories, and things to look forward to."),
  );
  const search = makeElement("label", "search-field");
  search.setAttribute("for", "news-search");
  search.append(makeElement("span", "", "⌕"));
  const input = makeElement("input");
  input.id = "news-search";
  input.type = "search";
  input.placeholder = "Search news and announcements";
  input.setAttribute("aria-label", "Search news and announcements");
  search.append(input);
  const grid = makeElement("div", "story-grid news-grid");
  grid.id = "news-results";
  grid.append(...stories.map((story) => createStoryCard(story, true)));
  const note = makeElement("p", "demo-notice", "Sample stories are shown as design examples. Replace them with school-approved news before launch.");
  pageView.append(header, search, grid, note);
  input.addEventListener("input", () => {
    const query = input.value.trim().toLocaleLowerCase();
    const filteredStories = stories.filter((story) => `${story.title} ${story.summary} ${story.category}`.toLocaleLowerCase().includes(query));
    grid.replaceChildren();
    if (filteredStories.length) grid.append(...filteredStories.map((story) => createStoryCard(story, true)));
    else grid.append(makeElement("p", "empty-state", "No stories match that search. Try another word."));
  });
}

function renderGrade(grade) {
  const details = gradeDetails[grade];
  const intro = makeElement("section", "page-intro");
  intro.append(
    makeElement("p", "section-kicker", "YOUR GRADE COMMUNITY"),
    makeElement("h1", "page-heading", `Grade ${grade}`),
    makeElement("p", "page-description", "Announcements, student work, and updates for Grade " + grade + "."),
  );
  const announcement = makeElement("section", "announcement-card");
  announcement.append(makeElement("span", "section-kicker", "GRADE ANNOUNCEMENT"), makeElement("h2", "", "A note for Grade " + grade), makeElement("p", "", details.announcement));
  const updates = makeElement("section", "page-section");
  const heading = makeElement("div", "section-heading");
  const headingCopy = makeElement("div");
  headingCopy.append(makeElement("p", "section-kicker", "WHAT’S HAPPENING"), makeElement("h2", "", "Grade updates"));
  heading.append(headingCopy);
  const grid = makeElement("div", "grade-update-grid");
  const gradeStories = [
    { title: details.work, category: "Student work", art: "art-ideas", alt: "Illustrated student project" },
    { title: "Photos from our grade", category: "Photos", art: "art-community", alt: "Illustrated photo placeholder" },
    { title: details.event, category: "Events", art: "art-celebrate", alt: "Illustrated event placeholder" },
  ];
  gradeStories.forEach((story) => {
    const card = makeElement("article", "grade-update-card");
    card.append(createArtwork(story.art, story.alt));
    card.append(makeElement("span", "post-category", story.category), makeElement("h3", "", story.title));
    card.append(makeElement("p", "post-meta", "Add school-approved grade details here."));
    grid.append(card);
  });
  updates.append(heading, grid);
  pageView.append(intro, announcement, updates, createShowcaseSection(Infinity, grade));
}

function renderShowcase() {
  const intro = makeElement("section", "page-intro showcase-intro");
  const copy = makeElement("div");
  copy.append(
    makeElement("p", "section-kicker", "STUDENT SHOWCASE"),
    makeElement("h1", "page-heading", "Made by our community"),
    makeElement("p", "page-description", "Projects, art, sports, music, and the wins worth celebrating."),
  );
  const share = makeElement("button", "button button-yellow", "＋ Share your story");
  share.type = "button";
  share.dataset.openPost = "";
  intro.append(copy, share);
  const grid = makeElement("div", "showcase-grid");
  grid.id = "showcase-results";
  const posts = [...getStudentPosts(), ...exampleShowcases];
  grid.append(...posts.map(createShowcaseCard));
  const note = makeElement("p", "demo-notice", "Sample stories are examples. Student submissions stay on this device and are not reviewed or visible to other students.");
  pageView.append(intro, grid, note);
}

function renderResources() {
  const intro = makeElement("section", "page-intro");
  intro.append(
    makeElement("p", "section-kicker", "YOUR SCHOOL TOOLKIT"),
    makeElement("h1", "page-heading", "Helpful links"),
    makeElement("p", "page-description", "Quick access to CBE learning tools and school information."),
  );
  const grid = makeElement("div", "resource-grid");
  grid.append(...resourceLinks.map(createResourceCard));
  const note = makeElement("p", "demo-notice", "The school website and handbook links depend on your school’s official pages. Confirm the right links with school staff.");
  pageView.append(intro, grid, note);
}

function renderFooter() {
  const footer = makeElement("footer", "page-footer");
  footer.append(makeElement("span", "", "CMAC-CONNECT · CMAC COMMUNITY"));
  const cbe = makeElement("a", "", "Calgary Board of Education ↗");
  cbe.href = "https://www.cbe.ab.ca/";
  cbe.target = "_blank";
  cbe.rel = "noopener noreferrer";
  footer.append(cbe);
  pageView.append(footer);
}

function currentRoute() {
  const route = window.location.hash.slice(1).toLocaleLowerCase();
  if (route === "news" || route === "showcase" || route === "resources") return { page: route };
  const gradeMatch = route.match(/^grade-([5-9])$/);
  if (gradeMatch) return { page: "grade", grade: gradeMatch[1] };
  return { page: "home" };
}

function updateNavigation(route) {
  const routeName = route.page === "grade" ? `GRADE ${route.grade}` : route.page.toUpperCase();
  pageTitle.textContent = routeName;
  document.title = `${route.page === "grade" ? `Grade ${route.grade}` : routeName[0] + routeName.slice(1).toLowerCase()} | CMAC-Connect`;
  navLinks.forEach((link) => {
    const selected = route.page === "grade"
      ? link.dataset.page === "grade" && link.dataset.grade === route.grade
      : link.dataset.page === route.page;
    link.classList.toggle("is-active", selected);
    if (selected) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function renderPage() {
  const route = currentRoute();
  activePage = route.page;
  updateNavigation(route);
  pageView.replaceChildren();
  if (route.page === "news") renderNews();
  else if (route.page === "grade") renderGrade(route.grade);
  else if (route.page === "showcase") renderShowcase();
  else if (route.page === "resources") renderResources();
  else renderHome();
  renderFooter();
  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeMobileMenu() {
  sidebar.classList.remove("sidebar-open");
  mobileMenuButton.setAttribute("aria-expanded", "false");
  mobileMenuButton.setAttribute("aria-label", "Open navigation");
}

document.querySelectorAll("[data-open-post]").forEach((button) => {
  button.addEventListener("click", () => postDialog.showModal());
});

document.querySelectorAll("[data-close-post]").forEach((button) => {
  button.addEventListener("click", () => postDialog.close());
});

pageView.addEventListener("click", (event) => {
  if (event.target.closest("[data-open-post]")) postDialog.showModal();
});

postDialog.addEventListener("click", (event) => {
  if (event.target === postDialog) postDialog.close();
});

postForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!postForm.reportValidity()) return;

  const formData = new FormData(postForm);
  const post = {
    id: `student-${Date.now()}`,
    firstName: String(formData.get("firstName")).trim(),
    grade: String(formData.get("grade")),
    category: String(formData.get("category")),
    title: String(formData.get("title")).trim(),
    description: String(formData.get("body")).trim(),
    date: getTodayLabel(),
    art: "art-community",
  };

  try {
    const posts = getStudentPosts();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([post, ...posts]));
  } catch (error) {
    console.error("Could not save CMAC-Connect showcase post.", error);
    showToast("Your story couldn’t be saved. Check browser storage and try again.", true);
    return;
  }

  postForm.reset();
  postDialog.close();
  if (activePage !== "showcase") window.location.hash = "showcase";
  else renderPage();
  showToast("Your story was saved on this device.");
});

window.addEventListener("hashchange", renderPage);
navLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));

mobileMenuButton.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("sidebar-open");
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  mobileMenuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

renderPage();
