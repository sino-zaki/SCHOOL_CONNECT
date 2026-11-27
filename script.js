const initialPosts = [
  {id:1,category:"部活動",title:"新入生向け！バスケ部の活動紹介🏀",body:"週4日、体育館で楽しく練習しています。初心者も経験者も大歓迎！練習の見学もできるので、興味があったらぜひチェックしてみてください。",date:"2026.11.20",author:"バスケ好き",likes:12},
  {id:2,category:"学校行事",title:"文化祭の準備、いよいよスタート！",body:"今年の文化祭に向けてクラスで出し物を考えています。みんなの学校ではどんな企画をする予定？おすすめがあれば教えてください！",date:"2026.11.19",author:"文化祭実行委員",likes:8},
  {id:3,category:"部活動",title:"美術部の作品展示を開催します🎨",body:"放課後の作品展示を行います。イラストやデザインなど、部員それぞれの作品を展示する予定です。気軽に見に来てください！",date:"2026.11.18",author:"美術部",likes:15},
  {id:4,category:"その他",title:"テスト期間の勉強方法を共有しよう",body:"テスト前にどんなふうに勉強している？おすすめのノートのまとめ方や、集中するための工夫があったらぜひ共有してほしいです。",date:"2026.11.17",author:"勉強中",likes:21},
  {id:5,category:"学校行事",title:"体育祭で盛り上がった競技は？",body:"体育祭の種目を考えています。みんなの学校で人気だった競技や、クラスで盛り上がった企画を教えてください！",date:"2026.11.16",author:"体育祭係",likes:6},
  {id:6,category:"部活動",title:"軽音楽部で一緒に演奏しませんか？",body:"楽器を始めたばかりの人も歓迎です。好きな音楽について話したり、みんなで演奏を楽しんだりしています。",date:"2026.11.15",author:"音楽好き",likes:10}
];
let posts = [...initialPosts];
let selectedCategory = "すべて";
const likedPosts = new Set();

const postGrid = document.getElementById("postGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const dialog = document.getElementById("postDialog");

function categoryClass(category) {
  if (category === "学校行事") return "event";
  if (category === "その他") return "other";
  return "";
}

function renderPosts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const visiblePosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "すべて" || post.category === selectedCategory;
    const matchesKeyword = `${post.title} ${post.body} ${post.category}`.toLowerCase().includes(keyword);
    return matchesCategory && matchesKeyword;
  });

  postGrid.innerHTML = visiblePosts.map(post => `
    <article class="post-card">
      <div class="post-top">
        <span class="category-tag ${categoryClass(post.category)}">${escapeHTML(post.category)}</span>
        <span class="post-date">${escapeHTML(post.date)}</span>
      </div>
      <h3>${escapeHTML(post.title)}</h3>
      <p>${escapeHTML(post.body)}</p>
      <div class="post-footer">
        <span class="post-author">投稿者：${escapeHTML(post.author)}</span>
        <div>
          <button class="like-button ${likedPosts.has(post.id) ? "liked" : ""}" data-like="${post.id}" aria-label="いいね">♥ ${post.likes}</button>
          <button class="report-button" data-report="${post.id}">報告</button>
        </div>
      </div>
    </article>`).join("");
  emptyState.hidden = visiblePosts.length !== 0;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[char]);
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button));
    renderPosts();
  });
});
searchInput.addEventListener("input", renderPosts);

postGrid.addEventListener("click", event => {
  const likeButton = event.target.closest("[data-like]");
  const reportButton = event.target.closest("[data-report]");
  if (likeButton) {
    const id = Number(likeButton.dataset.like);
    const post = posts.find(item => item.id === id);
    if (likedPosts.has(id)) {
      likedPosts.delete(id);
      post.likes--;
    } else {
      likedPosts.add(id);
      post.likes++;
    }
    renderPosts();
  }
  if (reportButton) {
    alert("報告を受け付けました（デモ版のため送信・保存はされません）。");
  }
});

function openDialog() {
  dialog.showModal();
  document.getElementById("postTitle").focus();
}
document.getElementById("openPost").addEventListener("click", openDialog);
document.getElementById("openPost2").addEventListener("click", openDialog);
document.getElementById("closePost").addEventListener("click", () => dialog.close());

document.getElementById("postForm").addEventListener("submit", event => {
  event.preventDefault();
  const title = document.getElementById("postTitle").value.trim();
  const body = document.getElementById("postBody").value.trim();
  const category = document.getElementById("postCategory").value;
  if (!title || !body) return;
  posts.unshift({
    id: Date.now(), category, title, body,
    date: new Date().toLocaleDateString("ja-JP").replaceAll("/", "."),
    author: "ゲスト", likes: 0
  });
  selectedCategory = "すべて";
  document.querySelectorAll(".filter").forEach(button => button.classList.toggle("active", button.dataset.category === "すべて"));
  searchInput.value = "";
  renderPosts();
  event.target.reset();
  dialog.close();
  document.getElementById("posts").scrollIntoView({behavior:"smooth"});
});

renderPosts();
