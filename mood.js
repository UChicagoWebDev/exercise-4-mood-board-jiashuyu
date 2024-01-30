const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {

  // TODO: Clear the results pane before you run a new search
  document.getElementById('resultsImageContainer').innerHTML = '';

  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.
  const query = document.querySelector('.search input').value;
  const url = `${bing_api_endpoint}?q=${encodeURIComponent(query)}`;

  let request = new XMLHttpRequest();

  // TODO: Construct the request object and add appropriate event listeners to handle responses.
  //  See: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //
  request.open('GET', url);
  request.responseType = 'json';

  request.onload = function(event) {
    console.log("API Response:", event.target.response);
    const resultsContainer = document.getElementById('resultsImageContainer');
    resultsContainer.innerHTML = ''; // Clear previous images

    const images = event.target.response.value;
    images.forEach(image => {
      const imgElement = document.createElement('img');
      imgElement.src = image.contentUrl;
      imgElement.addEventListener('click', () => addImageToMoodBoard(image.contentUrl));
      resultsContainer.appendChild(imgElement);
    });

    // Display related concepts
    const relatedSearches = event.target.response.queryExpansions;
    if (relatedSearches) {
      const suggestionsContainer = document.getElementById('suggestionList');
      suggestionsContainer.innerHTML = ''; // Clear previous suggestions

      relatedSearches.forEach(search => {
        const li = document.createElement('li');
        li.textContent = search.displayText;
        li.addEventListener('click', () => {
          document.querySelector(".search input").value = li.textContent;
          runSearch();
        });
        suggestionsContainer.appendChild(li);
      });
    }
  };

  request.onerror = function() {
    console.error('An error occurred fetching the image data.');
  };

  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);

  // TODO: Send the request
  request.send();

  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function addImageToMoodBoard(imageUrl) {
  const board = document.getElementById('board');
  const imgElement = document.createElement('img');
  imgElement.src = imageUrl;
  board.appendChild(imgElement);
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key === "Escape") {closeResultsPane()}
});
