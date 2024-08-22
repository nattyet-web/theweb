/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

/* Menu show */
if(navToggle) {
   navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
   });
}

/* Menu hidden */
if(navClose) {
   navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
   });
}

const postsPerPage = 16;
let currentPage = 1;
let allPosts = [];

async function fetchPosts() {
    const response = await fetch('assets/js/post.json');
    allPosts = await response.json();
    return allPosts;
}

async function displayPosts(posts) {
    const postContainer = document.getElementById('postContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Show the loading spinner
    loadingSpinner.style.display = 'block';
    
    // Clear the post container
    postContainer.innerHTML = '';

    // Simulate loading time (optional)
    await new Promise(resolve => setTimeout(resolve, 500));

    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const slicedPosts = posts.slice(start, end);

    slicedPosts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            ${post.image ? `<img src="${post.image}" alt="${post.title}" loading="lazy">` : ''}
            ${post.video ? `<iframe src="${post.video}" frameborder="0"></iframe>` : ''}
            <p>${post.description}</p>
        `;

        postContainer.appendChild(postElement);

        // Insert ad after the 5th and 10th post
        if ((index + 1) === 5) {
            insertAd(postContainer);
        } else if ((index + 1) === 10) {
            insertAd(postContainer, true);
        }
    });

    // Hide the loading spinner after posts are loaded
    loadingSpinner.style.display = 'none';
}

function insertAd(postContainer, isSecondAd = false) {
    const adContainer = document.createElement('div');
    adContainer.classList.add('ad-container');
    postContainer.appendChild(adContainer);

    const adScriptConfig = document.createElement('script');
    adScriptConfig.type = 'text/javascript';
    adScriptConfig.text = `
        atOptions = {
            'key' : '${isSecondAd ? '2a2b18c6d0e7fc8c71926bf73216c8a8' : '94e546547f0c1d04bcc33be261ff8357'}',
            'format' : 'iframe',
            'height' : ${isSecondAd ? '250' : '300'},
            'width' : ${isSecondAd ? '300' : '160'},
            'params' : {}
        };
    `;
    adContainer.appendChild(adScriptConfig);

    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.src = `//constellationbedriddenexams.com/${isSecondAd ? '2a2b18c6d0e7fc8c71926bf73216c8a8' : '94e546547f0c1d04bcc33be261ff8357'}/invoke.js`;
    adContainer.appendChild(adScript);
}

async function displayPagination(posts) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(posts.length / postsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', async () => {
            currentPage = i;
            await displayPosts(posts);
            displayPagination(posts);

            // Scroll to top of the postContainer
            document.getElementById('postContainer').scrollIntoView({ behavior: 'smooth' });
        });
        pagination.appendChild(pageButton);
    }
}

function normalizeText(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\W_]+/g, " ").trim();
}

function generateSearchVariants(text) {
    const variants = [text];
    const words = text.split(" ");

    if (words.length > 1) {
        variants.push(words.join(""));
        for (let i = 1; i < words.length; i++) {
            variants.push(words.slice(0, i).join("") + " " + words.slice(i).join(" "));
        }
    }

    return variants;
}

async function handleSearch() {
    const searchTerm = normalizeText(document.getElementById('searchBar').value);
    const searchVariants = generateSearchVariants(searchTerm);
    const posts = await fetchPosts();

    const filteredPosts = posts.filter(post => {
        const normalizedTitle = normalizeText(post.title);
        const normalizedDescription = normalizeText(post.description);
        const normalizedTags = post.tags ? normalizeText(post.tags.join(' ')) : '';

        return searchVariants.some(variant => 
            normalizedTitle.includes(variant) || 
            normalizedDescription.includes(variant) || 
            normalizedTags.includes(variant)
        );
    });

    currentPage = 1; // Reset to first page for new search
    await displayPosts(filteredPosts);
    displayPagination(filteredPosts);
}

document.getElementById('searchBar').addEventListener('input', handleSearch);

// Initial display of posts and pagination
async function initialize() {
    const posts = await fetchPosts();
    await displayPosts(posts);
    displayPagination(posts);
}

initialize();

window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    preloader.classList.add("hide-preloader");

    // Initialize Isotope (if necessary)
    // $('.entry-container').isotope({
    //     itemSelector: '.entry-item',
    //     layoutMode: 'masonry'
    // });
});
