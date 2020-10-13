document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#post").addEventListener("click", post);
});

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
      console.log("tweeted!!!");
    });
}
