function getRepositories(searchQuery){
    return new Promise((resolve, reject) => {
      fetch(`https://api.github.com/search/repositories?q=${searchQuery} in:name`)
        .then(response => response.json())
        .then(post => resolve(post))
        .catch(err => reject(err)) 
    });
}

const searchInput = document.querySelector('.searchInput');
const autocompleteResults = document.querySelector('.autocompleteResults');
const repositoriesList = document.querySelector('.repositoriesList');

function debounce(fn, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(context, args), delay);
    };
}

const debouncedSearchRepositories = debounce(searchRepositories, 600);

searchInput.addEventListener('input', debouncedSearchRepositories);

function searchRepositories() {
    const query = searchInput.value;
    if (query.trim() !== '') {
        getRepositories(query)
            .then(data => {
                autocompleteResults.innerHTML = '';
                if (data.items.length === 0) {
                    const noResults = document.createElement('div');
                    noResults.classList.add('nothingFound')
                    noResults.textContent = 'Ничего не найдено';
                    autocompleteResults.appendChild(noResults);
                } else {
                    data.items.slice(0, 5).forEach(repo => {
                        const repoItem = document.createElement('li');
                        repoItem.classList.add('resultsAutocomplete')
                        repoItem.textContent = `${repo.name}`;
                        autocompleteResults.appendChild(repoItem);
                        repoItem.addEventListener('click', () => {
                            addRepositoryToList(repo);
                            autocompleteResults.innerHTML = '';
                        });
                    });
                }
            })
            .catch(error => console.error(error));
    }
}

function addRepositoryToList(repo) {
    const addList = document.createElement('li');
    addList.classList.add('addList');
    repositoriesList.appendChild(addList)

    const info = document.createElement('p');
    info.classList.add('info');
    addList.appendChild(info)

    const name = document.createElement('span')
    name.textContent =  `name: ${repo.name}`
    info.appendChild(name)
  
    const owner = document.createElement('span')
    owner.textContent =  `owner: ${repo.owner.login}`
    info.appendChild(owner)
  
    const stars = document.createElement('span')
    stars.textContent =  `stars: ${repo.stargazers_count}`
    info.appendChild(stars)

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteBtn')
    deleteButton.addEventListener('click', () => {
        repositoriesList.removeChild(addList);
    });
    addList.appendChild(deleteButton);

    searchInput.value = '';
}