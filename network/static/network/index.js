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
        tweet_div.innerHTML = `<div class="border p-2 m-2">
        <img
          src="https://static.thenounproject.com/png/630740-200.png"
          alt="profile picture"
          width="40px"
        />
        <strong>${tweet.user}</strong>
        <p>${tweet.date}</p>
        <p>
          ${tweet.content}
        </p>
        <span><3 ${tweet.likes.length}</span>
      </div>`;

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
    .then((result) => {
      document.querySelector("#msg").style.display = "block";
      console.log("tweeted!!!");
    });
}
