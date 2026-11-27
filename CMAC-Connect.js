const STORAGE_KEY = "cmac-connect-posts-v1";

const samplePosts = [
  {
    id: "sample-1",
    author: "CMAC News",
    initials: "CN",
    grade: "7",
    category: "School news",
    title: "What’s happening this week",
    body: "Check in with your teachers for this week’s announcements, club meetups, and upcoming school events.",
    likes: 8,
    timestamp: "School update",
    avatar: "avatar-yellow",
  },
  {
    id: "sample-2",
    author: "The Maker Crew",
    initials: "MC",
    grade: "8",
    category: "Project",
    title: "Our cardboard arcade is open!",
    body: "We designed and built our own arcade games in class. Come try them out and see how they work!",
    likes: 12,
    timestamp: "Student showcase",
    avatar: "avatar-green",
  },
  {
    id: "sample-3",
    author: "CMAC Community",
    initials: "CC",
    grade: "5",
    category: "Achievement",
    title: "Celebrating curious minds",
    body: "A big cheer for everyone who shared their ideas, asked great questions, and helped a classmate this week.",
    likes: 6,
    timestamp: "Community shout-out",
    avatar: "avatar-blue",
  },
  {
    id: "sample-4",
    author: "CMAC News",
    initials: "CN",
    grade: "9",
    category: "School news",
    title: "Have a project to show?",
    body: "Share something you’ve been working on, a goal you reached, or a moment you’re proud of. Your story belongs here.",
    likes: 4,
    timestamp: "School update",
    avatar: "avatar-pink",
  },
];

const postList = document.querySelector("#post-list");
const postDialog = document.querySelector(".post-dialog");
const postForm = document.querySelector("#post-form");
const toast = document.querySelector("#toast");
const activeFilterLabel = document.querySelector("#active-filter");
const feedTitle = document.querySelector("#feed-title");
const breadcrumbCurrent = document.querySelector("#breadcrumb-current");
const gradeCards = [...document.querySelectorAll("[data-grade-filter]")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const mobileMenuButton = document.querySelector(".mobile-menu-button");
const sidebar = document.querySelector(".sidebar");
const likedPostIds = new Set();
let activeGrade = "all";
let toastTimeout;

function getStudentPosts() {
  try {
    const savedPosts = window.localStorage.getItem(STORAGE_KEY);
    if (!savedPosts) return [];

    const posts = JSON.parse(savedPosts);
    if (!Array.isArray(posts)) throw new Error("Saved posts are not in the expected format.");

    return posts;
  } catch (error) {
    console.error("Could not load CMAC Connect posts.", error);
    showToast("Saved posts could not be loaded from this browser.", true);
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

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createPostCard(post) {
  const article = makeElement("article", "post-card");
  const topLine = makeElement("div", "post-topline");
  const author = makeElement("div", "post-author");
  const avatar = makeElement("span", `author-avatar ${post.avatar || ""}`, post.initials);
  avatar.setAttribute("aria-hidden", "true");
  const authorDetails = makeElement("div");
  authorDetails.append(
    makeElement("div", "author-name", post.author),
    makeElement("div", "post-meta", post.timestamp),
  );
  author.append(avatar, authorDetails);
  topLine.append(author, makeElement("span", "post-category", post.category));

  const title = makeElement("h3", "post-title", post.title);
  const body = makeElement("p", "post-body", post.body);
  const actions = makeElement("div", "post-actions");
  const likeButton = makeElement("button", "like-button");
  likeButton.type = "button";
  likeButton.dataset.like = post.id;
  likeButton.setAttribute("aria-pressed", "false");
  const heart = makeElement("span", "post-reaction-icon", "♡");
  heart.setAttribute("aria-hidden", "true");
  likeButton.append(heart, document.createTextNode(` ${post.likes} cheers`));
  const gradeTag = makeElement("span", "grade-tag", `Grade ${post.grade}`);
  actions.append(likeButton, gradeTag);
  article.append(topLine, title, body, actions);
  return article;
}

function renderPosts() {
  const posts = [...getStudentPosts(), ...samplePosts];
  const visiblePosts = activeGrade === "all"
    ? posts
    : posts.filter((post) => String(post.grade) === activeGrade);
  postList.replaceChildren();

  if (visiblePosts.length === 0) {
    const emptyState = makeElement("div", "empty-state");
    emptyState.append(
      makeElement("strong", "", `Nothing posted for Grade ${activeGrade} yet`),
      makeElement("p", "", "Be the first to share a project, achievement, or school update."),
    );
    postList.append(emptyState);
    return;
  }

  postList.append(...visiblePosts.map(createPostCard));
}

function updateNavigation(grade) {
  const isGradePage = grade !== "all";
  activeGrade = isGradePage ? grade : "all";
  const pageName = isGradePage ? `GRADE ${grade}` : "NEWS FEED";
  feedTitle.textContent = isGradePage ? `Grade ${grade} stories` : "School news & stories";
  breadcrumbCurrent.textContent = pageName;
  activeFilterLabel.textContent = isGradePage ? `Grade ${grade}` : "All grades";

  gradeCards.forEach((card) => {
    const selected = card.dataset.gradeFilter === activeGrade;
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-pressed", String(selected));
  });
  navLinks.forEach((link) => {
    const selected = isGradePage
      ? link.dataset.grade === grade
      : link.dataset.page === "news";
    link.classList.toggle("is-active", selected);
    if (selected) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  renderPosts();
}

function gradeFromHash() {
  const match = window.location.hash.match(/^#grade-([5-9])$/);
  return match ? match[1] : "all";
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

postDialog.addEventListener("click", (event) => {
  if (event.target === postDialog) postDialog.close();
});

postForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!postForm.reportValidity()) return;

  const formData = new FormData(postForm);
  const post = {
    id: `student-${Date.now()}`,
    author: "CMAC Student",
    initials: "CS",
    grade: String(formData.get("grade")),
    category: String(formData.get("category")),
    title: String(formData.get("title")).trim(),
    body: String(formData.get("body")).trim(),
    likes: 0,
    timestamp: "Just now",
    avatar: "avatar-yellow",
  };
  const posts = getStudentPosts();

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([post, ...posts]));
  } catch (error) {
    console.error("Could not save CMAC Connect post.", error);
    showToast("Your post couldn’t be saved. Check browser storage and try again.", true);
    return;
  }

  postForm.reset();
  postDialog.close();
  if (activeGrade !== "all" && activeGrade !== post.grade) {
    window.location.hash = `grade-${post.grade}`;
  } else {
    renderPosts();
  }
  showToast("Your post was saved on this device.");
});

postList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-like]");
  if (!button) return;

  const postId = button.dataset.like;
  const liked = likedPostIds.has(postId);
  if (liked) likedPostIds.delete(postId);
  else likedPostIds.add(postId);
  button.classList.toggle("is-liked", !liked);
  button.setAttribute("aria-pressed", String(!liked));
  button.querySelector(".post-reaction-icon").textContent = liked ? "♡" : "♥";

  const post = [...getStudentPosts(), ...samplePosts].find((item) => item.id === postId);
  const count = post ? post.likes + (liked ? 0 : 1) : 0;
  button.lastChild.textContent = ` ${count} cheers`;
});

gradeCards.forEach((card) => {
  card.addEventListener("click", () => {
    const grade = card.dataset.gradeFilter;
    window.location.hash = grade === "all" ? "news" : `grade-${grade}`;
  });
});

window.addEventListener("hashchange", () => {
  updateNavigation(gradeFromHash());
  document.querySelector("#news").scrollIntoView({ behavior: "smooth", block: "start" });
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

mobileMenuButton.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("sidebar-open");
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  mobileMenuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

updateNavigation(gradeFromHash());
