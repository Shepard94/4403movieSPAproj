function search() {
    var searchInput = document.getElementById('searchInput').value;
    var url = "https://api.themoviedb.org/3/search/multi?api_key=YOUR_API_KEY&query=" + searchInput;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        var results = document.getElementById('searchResults');
        results.innerHTML = '';

        data.results.forEach(result => {
            var title = result.title || result.name;
            var poster = result.poster_path ? 'https://image.tmdb.org/t/p/w200' + result.poster_path : 'no_image_available.jpg';
            var overview = result.overview;

            var html = '<div class="result">' +
                '<img src="' + poster + '">' +
                '<h3>' + title + '</h3>' +
                '<p>' + overview + '</p>' +
                '</div>';

            results.innerHTML += html;
        });
    })
    .catch(error => {
        console.log(error);
    });
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayResults();
    }
}

function nextPage() {
    const maxPage = Math.ceil(filteredResults.length / resultsPerPage);

    if (currentPage < maxPage) {
        currentPage++;
        displayResults();
    }
}

// Initial display
displayResults();