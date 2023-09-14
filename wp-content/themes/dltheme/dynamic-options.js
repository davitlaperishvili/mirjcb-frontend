const productSearchURL =
  "https://mirjcb.ru/index.php?route=product/search&fsearch=true&search=";
const catSearchURL =
  "https://mirjcb.ru/index.php?route=product/catsearch&fsearch=true&search=";

async function getSearchResult(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (e) {
    console.log(e);
  }
}
function createOptionsHTML(dataArr) {
  const options = dataArr
    .map((option) => {
      const { href, name } = option;
      return `
    <li>
      <a href="${href}" class="option_item">${name}</a>
    </li>
    `;
    })
    .join(" ");
  if (!options) return "";
  return `<ul>${options}</ul>`;
}

function loadOptions(parentElem, selector, content) {
  if (content) {
    parentElem.querySelector(selector).innerHTML = content;
    parentElem.querySelector(selector).closest(".options_group").style.display =
      "block";
  } else {
    parentElem.querySelector(selector).closest(".options_group").style.display =
      "none";
  }
}

const dynamicOptionsInputs = document.querySelectorAll(
  ".dynamic_options_input"
);
let timer;
dynamicOptionsInputs.forEach((input) => {
  input.addEventListener("input", function (e) {
    try {
      clearTimeout(timer);
      timer = setTimeout(async function () {
        const value = e.target.value;
        const parent = e.target.parentElement;
        if (!value) {
          parent.classList.remove("is-active");
          return;
        }
        const productSearch = await getSearchResult(
          `${productSearchURL}${value}`
        );
        const productSearchHTML = createOptionsHTML(productSearch);

        const productCatSearch = await getSearchResult(
          `${catSearchURL}${value}`
        );
        const catSearchHTML = createOptionsHTML(productCatSearch);

        loadOptions(parent, "#categories", catSearchHTML);
        loadOptions(parent, "#products", productSearchHTML);

        parent.classList.add("is-active");
      }, 400); // Delay in milliseconds
    } catch (e) {}
  });
  input.addEventListener("focus", function (e) {
    if (window.innerWidth < 768) {
      console.log("Focus Event");
      const parent = e.target.parentElement;
      parent.classList.add("is-active");
    }
  });
});

document.querySelectorAll(".close_dynamic_options").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.target.closest("#search").classList.remove("is-active");
  });
});

window.addEventListener("click", function (e) {
  const target = e.target;
  if (!e.target.closest("#search")) {
    document.querySelectorAll("#search").forEach((search) => {
      search.classList.remove("is-active");
    });
  }
});
