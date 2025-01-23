document.addEventListener("DOMContentLoaded", () => {
  const loadMoreButton = document.querySelector(".load-more__button");
  const loadingContainer = document.querySelector("#ProductGridContainer > .collection");
  const productGrid = document.querySelector('#product-grid');
  const paginationList = document.querySelector('.pagination__list');

  if (!loadMoreButton) return;

  loadMoreButton.addEventListener("click", (event) => {
    event.preventDefault();

    const nextPageUrl = loadMoreButton.dataset.nextUrl.trim();

    loadMoreButton.disabled = true;
    loadingContainer.classList.add("loading");

    if (!nextPageUrl) return;

    fetch(nextPageUrl)
      .then((response) => response.text())
      .then((responseText) => {

        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const loadedProducts = html.querySelectorAll('#product-grid > .grid__item');
        const loadedNextPageUrl = html.querySelector(".load-more__button").dataset.nextUrl.trim();

        for (let product of loadedProducts) {
          productGrid.appendChild(product);
        }

        if (paginationList) {
          paginationList.innerHTML = html.querySelector('.pagination__list').innerHTML;
        }

        loadMoreButton.dataset.nextUrl = loadedNextPageUrl;

        if (loadedNextPageUrl) {
          loadMoreButton.disabled = false;
        }
        reloadTrustpilotWidgets();
        loadingContainer.classList.remove("loading");
      })

  })
})

function reloadTrustpilotWidgets() {
  // Check if Trustpilot script has loaded
  if (window.Trustpilot) {
    // Get all Trustpilot widgets on the page
    const widgets = document.querySelectorAll('.trustpilot-widget');

    // Reload Trustpilot widgets
    widgets.forEach((widget) => {
      Trustpilot.loadFromElement(widget);
    });
  } else {
    console.warn("Trustpilot script is not loaded yet.");
  }
}