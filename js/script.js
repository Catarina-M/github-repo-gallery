// profile information appears here
const overview = document.querySelector(".overview");
const username = "Catarina-M";
const repoList = document.querySelector(".repo-list");
const reopInformation = document.querySelector(".repos");
const individualRepoData = document.querySelector(".repo-data");
const repoGalleryBtn = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const githubInfo = async function () {
    const response = await fetch(
        `https://api.github.com/users/${username}`
    );
    const data= await response.json();
    displayInfo(data);
};

githubInfo();

const displayInfo = function (data) {
   const div = document.createElement("div");
   div.classList.add("user-info");
   div.innerHTML = `
   <figure>
       <img alt="user avatar" src=${data.avatar_url}
       </figure>
       <div>
         <p><strong>Name:</strong> ${data.login}</p>
         <p><strong>Bio</strong> ${data.bio}</p>
         <p><strong>Location:</strong> ${data.location}</p>
         <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div
        `;
    overview.append(div);
    gitRepos();
};

const gitRepos = async function () {
    const fetchRespos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData= await fetchRespos.json();
    displayRepos(repoData);
};

const displayRepos = function (repos) {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }  
};

repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        getRepoInfo(repoName);
    }
});

const getRepoInfo = async function (repoName) {
    const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchInfo.json();
    console.log(repoInfo);

    const fetchLanguages = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`);
    const languageData = await fetchLanguages.json();
  

    const languages = [];
for (const language in languageData) {
    languages.push(language);
}
displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = function (repoInfo, languages) {
    individualRepoData.innerHTML = "";
    individualRepoData.classList.remove("hide");
    reopInformation.classList.add("hide");
    repoGalleryBtn.classList.remove("hide");
    const div = document.createElement("div");
    div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
        <p>Default Branch: ${repoInfo.default_branch}</p>
        <p>Languages: ${languages.join(", ")}</p>
        <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHib!</a>`;
    individualRepoData.append(div);
};

repoGalleryBtn.addEventListener("click", function () {
    reopInformation.classList.remove("hide");
    individualRepoData.classList.add("hide");
    repoGalleryBtn.classList.add("hide");
});

//Dynamic search

filterInput.addEventListener("input", function (e) {
    const repoInput = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const searchRepo = repoInput.toLowerCase();

    for (const repo of repos) {
        const repoLowerText = repo.innerText.toLowerCase();
    if ( repoLowerText.includes(searchRepo)) {
        repo.classList.remove("hide");
    } else {
        repo.classList.add("hide");
    }
    }
});