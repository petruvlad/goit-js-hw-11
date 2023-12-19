import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm.js';
import Notiflix from 'notiflix';

const apiKey = '40035722-2407ce7b1ab62bda679cb58b1';
let page = 1;
let searchQuery = '';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const handleSearch = async event => {
  event.preventDefault();
  page = 1; 
  searchQuery = event.target.elements.searchQuery.value;
  await fetchImages();
};

const fetchImages = async () => {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    const { hits, totalHits } = response.data;

    if (page === 1) {
      gallery.innerHTML = ''; // Clear the gallery for new search
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      hits.forEach(image => {
        createImageCard(image);
      });

      if (page === 1) {
        loadMoreBtn.style.display = 'block';
      }

      page++;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};

const createImageCard = image => {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const infoItems = ['Likes', 'Views', 'Comments', 'Downloads'];
  infoItems.forEach(item => {
    const p = document.createElement('p');
    p.classList.add('info-item');
    p.innerHTML = `<b>${item}</b>: ${image[item.toLowerCase()]}`;
    info.appendChild(p);
  });

  card.appendChild(img);
  card.appendChild(info);
  gallery.appendChild(card);
};

const handleLoadMore = () => {
  fetchImages();
  smoothScroll();
};

const smoothScroll = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

searchForm.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);

const lightbox = new SimpleLightbox('.gallery', {
  captionsData: 'alt',
  captionDelay: 250,
});
