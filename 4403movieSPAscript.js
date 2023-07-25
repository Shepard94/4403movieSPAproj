// Define constants for API and image paths
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const API_KEY = 'f501c7abb0b5a215f8df55876d986b7a'; 

let lastSearchQuery = '';

document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('search-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();  // Prevent the form from submitting normally
        const searchQuery = document.getElementById('search-input').value;
        console.log(`Searching for: ${searchQuery}`);
        searchMovies(searchQuery);
    });
});

// Function to get top rated movies
function getTopRatedMovies() {
  // The URL to fetch top rated movies
  const url = `${API_URL}/movie/top_rated?api_key=${API_KEY}`;

  // Fetch the data
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Handle the data
      displayMovies(data.results);
    })
    .catch((error) => {
      // Handle the error
      console.error('Error:', error);
    });
}

// Function to display movies
function displayMovies(movies) {
  const movieContainer = document.getElementById('movie-container');
  movieContainer.innerHTML = ''; // Clear the container
  
  const sortOption = document.getElementById('sort-select').value;
  const yearFilters = Array.from(document.getElementsByClassName('year-filter'))
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

    // Filter the movies based on the year filters
    // Filter the movies based on the year filters
    if (yearFilters.length > 0) {
        movies = movies.filter(movie => {
            const releaseYear = parseInt(movie.release_date.slice(0, 4));
            return yearFilters.some(filter => {
                const decadeStart = parseInt(filter);
                const decadeEnd = decadeStart + 9;
                return releaseYear >= decadeStart && releaseYear <= decadeEnd;
            });
        });
    }


  // Sort the movies based on the selected option
  if (sortOption === 'title') {
    movies.sort((a, b) => a.title.localeCompare(b.title));
  } 
  else if (sortOption === 'release-date') {
    movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  } 
  else if (sortOption === 'rating') {
    movies.sort((a, b) => b.vote_average - a.vote_average);
  }

  movies.forEach((movie) => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    const imageElement = document.createElement('img');
    imageElement.src = `${IMAGE_URL}/${movie.poster_path}`;
    imageElement.addEventListener('click', () => {
        displayMovieDetails(movie.id);
    });

    const titleElement = document.createElement('h2');
    titleElement.textContent = movie.title;
    titleElement.addEventListener('click', () => {
            displayMovieDetails(movie.id);
    });

    movieElement.append(imageElement);
    movieElement.append(titleElement);

    movieContainer.append(movieElement);
  });
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
  
function displayMovieDetails(movieId) {
    const url = `${API_URL}/movie/${movieId}?api_key=${API_KEY}`;
    const creditsUrl = `${API_URL}/movie/${movieId}/credits?api_key=${API_KEY}`;
  
    Promise.all([
        fetch(url).then(response => response.json()),
        fetch(creditsUrl).then(response => response.json())
    ])
    .then(([data, creditsData]) => {
        // Display the movie details in the modal dialog
        const modalText = document.getElementById('modal-text');
        modalText.textContent = JSON.stringify(data, null, 2);  // Display the data as formatted JSON
        let content = '';
            content += `<h2>Title: ${data.title}</h2>`;
            content += `<p><strong>Release Date:</strong> ${data.release_date}</p>`;
            content += `<p><strong>Overview:</strong> ${data.overview}</p>`;
            content += `<p><strong>Genres:</strong> ${data.genres.map(genre => genre.name).join(', ')}</p>`;
            content += `<p><strong>Production Companies:</strong> ${data.production_companies.map(company => company.name).join(', ')}</p>`;
            content += `<p><strong>Average Vote:</strong> ${data.vote_average}</p>`;

            // Display the first 5 cast members
            content += '<strong>Cast:</strong> ' + creditsData.cast.slice(0, 5).map(person => `<span class="actor" data-id="${person.id}">${person.name}</span>`).join(', ');


            modalText.innerHTML = content;
  
        // Show the modal dialog
        const modal = document.getElementById('myModal');
        modal.style.display = "block";
        // Add click event listener to the actors
        document.querySelectorAll('.actor').forEach(actor => {
            actor.addEventListener('click', function() {
            const actorId = this.dataset.id;
            displayActorDetails(actorId);
            });
        });
      })
      .catch(error => console.error('Error:', error));
  }
document.getElementsByClassName('close')[0].onclick = function() {
  document.getElementById('myModal').style.display = "none";
}

// Function to handle search
function handleSearch(event) {
  event.preventDefault();
  const searchQuery = document.getElementById('search-input').value;
  
// Call your search function here
searchMovies(searchQuery);
}   

function searchMovies(query) {
    lastSearchQuery = query;  // Save the search query
    // Construct the URL for the search API
    const url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`;

    // Fetch the data
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Display the movies
            displayMovies(data.results);
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('sort-select').addEventListener('change', () => {
    searchMovies(lastSearchQuery);
});

// Add event listener for search
document.getElementById('search-form').addEventListener('submit', handleSearch);

// Fetch top rated movies on page load
getTopRatedMovies();

function displayActorDetails(actorId) {
    const url = `${API_URL}/person/${actorId}?api_key=${API_KEY}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const modalActorText = document.getElementById('modal-actor-text');
  
        let content = '';
        content += `Name: ${data.name}<br>`;
        content += `Biography: ${data.biography}<br>`;
  
        modalActorText.innerHTML = content;
  
        // Show the actor modal dialog
        const actorModal = document.getElementById('actorModal');
        actorModal.style.display = "block";
      })
      .catch(error => console.error('Error:', error));
}

var actorModalClose = document.getElementById('actorModalClose');

actorModalClose.onclick = function() {
  var actorModal = document.getElementById('actorModal');
  actorModal.style.display = "none";
}