const filterContainer = document.querySelector(".filter");
const cardContainer = document.querySelector(".card-container");

let checker = (arr, target) => target.every((v) => arr.includes(v));

let allSkills = [];
const getData = async function () {
  filterContainer.classList.add("hidden");
  const res = await fetch("./data.json");
  const data = await res.json();

  for (const d of data) {
    let arrOfSkills = [];
    for (const t of d.tools) {
      arrOfSkills.push(t);
    }

    for (const l of d.languages) {
      arrOfSkills.push(l);
    }

    arrOfSkills.push(d.role);
    arrOfSkills.push(d.level);

    let skillsHtml = "";

    for (const skill of arrOfSkills) {
      skillsHtml += `<span class="card--item">${skill}</span>`;
    }

    let html = `
    <div class="card ${d.featured ? "featured" : ""}" data-i=${d.id - 1}>
        <img src="${d.logo}" alt="" />

        <div class="card--description">
        <div class="card--company">
            <p class="card--company--name">${d.company}</p>
            ${d.new ? `<p class='card--state'> New! </p>` : ""}
            ${d.featured ? `<p class="card--isFeatured">Featured</p>` : ""}

        </div>

        <div class="card--pos">
            <h1 class="role">${d.position}</h1>
        </div>

        <div class="card--detail">
            <p class="card--posted">${d.postedAt}</p>
            <p class="card--contract">${d.contract}</p>
            <p class="card--loc">${d.location}</p>
        </div>
        </div>

        <div class="card--lang">
            ${skillsHtml}
        </div>  
    </div>
    `;
    cardContainer.insertAdjacentHTML("beforeend", html);
    allSkills.push(arrOfSkills);
  }
};

getData();

/* <p class="card--isFeatured">${d.featured ? "Featured" : ""}</p> */
let filteredItems = [];

cardContainer.addEventListener("click", function (e) {
  if (
    e.target.closest(".card--item") &&
    !filteredItems.includes(e.target.closest(".card--item").textContent) &&
    filteredItems.length < 7
  ) {
    filterContainer.classList.remove("hidden");
    let html = `
     <div class="filter-item">
          <p>${e.target.closest(".card--item").textContent}</p>
          <img class="remove" src="images/icon-remove.svg" alt="" />
        </div>
    `;
    filterContainer.insertAdjacentHTML("afterbegin", html);
    filteredItems.push(e.target.closest(".card--item").textContent);

    // document.querySelectorAll(".card").forEach((c) => {
    //   c.classList.add("hidden");
    // });

    document.querySelectorAll(".card").forEach((c, index) => {
      //   console.log(c);
      //   console.log(filteredItems);
      //   console.log(allSkills[index]);
      if (!checker(allSkills[index], filteredItems)) {
        c.classList.add("hide");
      }
    });

    // for (let i = 0; i < allSkills.length; i++) {
    //   if (allSkills[i].includes(e.target.closest(".card--item").textContent)) {
    //   }
    // }
  }
});

filterContainer.addEventListener("click", function (e) {
  if (e.target.closest(".remove")) {
    const target =
      e.target.closest(".filter-item").firstElementChild.textContent;
    const index = filteredItems.indexOf(target);
    if (index > -1) {
      filteredItems.splice(index, 1);
    }
    e.target.closest(".filter-item").remove();
    document.querySelectorAll(".card").forEach((c, index) => {
      if (!checker(allSkills[index], filteredItems)) {
        c.classList.add("hide");
      } else {
        c.classList.remove("hide");
      }
    });
    if (filteredItems.length == 0) {
      filterContainer.classList.add("hidden");
    }
  }
  if (e.target.closest(".clear")) {
    filterContainer.classList.add("hidden");
    filteredItems = [];
    document.querySelectorAll(".card").forEach((c, index) => {
      c.classList.remove("hide");
    });
    document.querySelectorAll(".filter-item").forEach((f) => {
      f.remove();
    });
  }
});
