const button = document.querySelector("button")

button.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: copyReleaseNotes,
  })

  button.textContent = "Copied!"

  setTimeout(() => {
    button.textContent = "Copy Release Notes"
  }, 1500)
})

function copyReleaseNotes() {
  const releaseNotes = [...document.querySelectorAll(".merge-request.merged")]
    .map(
      (el) =>
        ` ${el.querySelector(".merge-request-title-text").textContent} - ${
          el.querySelector(".issuable-reference").textContent
        }`
    )
    .map((el) => el.replace(/(\r\n|\n|\r)/gm, ""))
    .join("\n")

  function copyToClipboard(text) {
    var dummy = document.createElement("textarea")
    document.body.appendChild(dummy)
    dummy.value = text
    dummy.select()
    document.execCommand("copy")
    document.body.removeChild(dummy)
  }

  copyToClipboard(releaseNotes)
}
