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
  loadPage("all");
});

function loadPage(page) {
  document.querySelector("#tweets").innerHTML = "";
  fetch(`/tweet/${page}`)
    .then((response) => response.json())
    .then((tweets) => {
      // make the tweet box
      tweets.forEach((tweet) => {
        const tweet_div = document.createElement("div");
        tweet_div.classList.add("border", "p-2", "m-1");
        tweet_div.innerHTML = `
        <i class="fas fa-user-circle m-2" id="profile_pic"></i>
        <strong id="name">${tweet.user}</strong>
        <p>${tweet.date}</p>
        <p>
          ${tweet.content}
        </p>`;

        const like = document.createElement("i");
        like.innerHTML = tweet.likes.length;
        like.classList.add("far", "fa-heart");
        like.style.color = "gray";
        like.id = tweet.id;
        like.addEventListener("click", liked);
        tweet_div.append(like);

        const user_id = document.querySelector("#name").dataset.id;
        tweet.likes.forEach((user) => {
          if (parseInt(user_id) === user) {
            like.classList.add("far", "fa-heart");
            like.style.color = "red";
          }
        });

        document.querySelector("#tweets").append(tweet_div);
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
      console.log(tweet);
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
  fetch(`/update/${e.target.id}`, {
    method: "PUT",
    body: JSON.stringify({
      like: true,
    }),
  });
}
