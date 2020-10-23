document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("#profile-page")
    .addEventListener("click", () => loadPage("profile_page"));
  document
    .querySelector("#home")
    .addEventListener("click", () => loadPage("all"));
  document
    .querySelector("#following")
    .addEventListener("click", () => loadPage("following_page"));
  document.querySelector("#post").addEventListener("click", post);
  document.querySelector("#name").addEventListener("click", profilePage);
  loadPage("all");
});

function loadPage(page) {
  document.querySelector("#tweets").innerHTML = "";
  document.querySelector("#profile_view").style.display = "none";

  document.querySelector("#main_view").style.display = "block";
  url = `tweet/${page}`;

  fetch(url)
    .then((response) => response.json())
    .then((tweets) => {
      // make the tweet box
      tweets.forEach((tweet) => {
        const box = tweet_box(tweet);
        box
          .getElementsByTagName("strong")[0]
          .addEventListener("click", profilePage);
        document.querySelector("#tweets").append(box);
      });
    });
}

function profilePage(e) {
  document.querySelector("#tweets_of").innerHTML = "";
  document.querySelector("#main_view").style.display = "none";
  document.querySelector("#profile_view").style.display = "block";

  document.querySelector("#profile_name").innerHTML = e.target.dataset.user;
  fetch(`tweetsOf/${e.target.dataset.id}`)
    .then((response) => response.json())
    .then((tweets) => {
      tweets.forEach((tweet) => {
        const box = tweet_box(tweet);
        document.querySelector("#tweets_of").append(box);
      });
    });
}

function post() {
  const content = document.querySelector("#content").value;
  document.querySelector("#content").value = "";

  fetch("post", {
    method: "POST",
    body: JSON.stringify({
      content: content,
    }),
  })
    .then((response) => response.json())
    .then((tweet) => {
      document.querySelector("#msg").style.display = "block";
      loadPage("all");
      console.log(tweet);
      document.querySelector("#msg").style.display = "none";
    });
}

function liked(e) {
  if (e.target.style.color !== "red") {
    e.target.style.color = "red";
    e.target.innerHTML++;
  } else {
    e.target.style.color = "gray";
    e.target.innerHTML--;
  }
  if (e.target.innerHTML > 1) {
    e.target.nextSibling.innerHTML = "likes";
  } else {
    e.target.nextSibling.innerHTML = "like";
  }
  fetch(`/update/${e.target.id}`, {
    method: "PUT",
    body: JSON.stringify({
      like: true,
    }),
  });
}

function tweet_box(tweet) {
  const tweet_div = document.createElement("div");

  tweet_div.classList.add("border", "p-3", "mt-3", "shadow");
  tweet_div.innerHTML = `
  <i class="fas fa-user-circle m-2" id="profile_pic"></i>
  <strong id="name" data-id="${tweet.user_id}" data-user="${tweet.user}">${tweet.user}</strong>
  <p>${tweet.date}</p>
  <p>
    ${tweet.content}
  </p>`;

  const like = document.createElement("i");

  const like_word = document.createElement("p");
  like_word.id = "like_word";
  if (tweet.likes.length < 2) {
    like_word.innerHTML = "like";
  } else {
    like_word.innerHTML = "likes";
  }

  like.innerHTML = tweet.likes.length;
  like.classList.add("far", "fa-heart", "ml-2");
  like.style.color = "gray";
  like.id = tweet.id;
  like.addEventListener("click", liked);
  tweet_div.append(like);
  tweet_div.append(like_word);

  const user_id = document.querySelector("#name").dataset.id;
  tweet.likes.forEach((user) => {
    if (parseInt(user_id) === user) {
      like.classList.add("far", "fa-heart");
      like.style.color = "red";
    }
  });
  return tweet_div;
}
