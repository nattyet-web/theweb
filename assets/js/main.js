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

// Create a loading element
const loadingElement = document.createElement('div');
loadingElement.id = 'loading';
loadingElement.innerText = 'Loading...';
loadingElement.style.display = 'none'; // Initially hidden
document.body.appendChild(loadingElement); // Append loading element to the body

async function fetchPosts() {
    try {
        const response = await fetch('assets/js/post.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allPosts = await response.json();
        return allPosts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        alert('Failed to load posts. Please try again later.'); // Notify the user
        return []; // Return an empty array if there's an error
    }
}

async function displayPosts(posts) {
    const postContainer = document.getElementById('postContainer');
    postContainer.innerHTML = '';
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const slicedPosts = posts.slice(start, end);

    slicedPosts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            ${post.image ? `<img src="${post.image}" alt="${post.title}" loading="lazy">` : ''}
            ${post.video ? `<iframe src="${post.video}" width="560" height="315" frameborder="0" allowfullscreen></iframe>` : ''}
            <p>${post.description}</p>
        `;

        postContainer.appendChild(postElement);

        // Insert ad after the 5th post
        if ((index + 1) === 5) {
            const adContainer = document.createElement('div');
            adContainer.classList.add('ad-container');
            postContainer.appendChild(adContainer);

            const adScriptConfig = document.createElement('script');
            adScriptConfig.type = 'text/javascript';
            adScriptConfig.text = `
                atOptions = {
                    'key' : '94e546547f0c1d04bcc33be261ff8357',
                    'format' : 'iframe',
                    'height' : 300,
                    'width' : 160,
                    'params' : {}
                };
            `;
            adContainer.appendChild(adScriptConfig);

            const adScript = document.createElement('script');
            adScript.type = 'text/javascript';
            adScript.src = "//constellationbedriddenexams.com/94e546547f0c1d04bcc33be261ff8357/invoke.js";
            adContainer.appendChild(adScript);

            console.log("Ad script added after post index:", index);
        }

        // Insert new ad after the 10th post
        if ((index + 1) === 10) {
            const adContainer10 = document.createElement('div');
            adContainer10.classList.add('ad-container');
            postContainer.appendChild(adContainer10);

            const adScriptConfig10 = document.createElement('script');
            adScriptConfig10.type = 'text/javascript';
            adScriptConfig10.text = `
                atOptions = {
                    'key' : '2a2b18c6d0e7fc8c71926bf73216c8a8',
                    'format' : 'iframe',
                    'height' : 250,
                    'width' : 300,
                    'params' : {}
                };
            `;
            adContainer10.appendChild(adScriptConfig10);

            const adScript10 = document.createElement('script');
            adScript10.type = 'text/javascript';
            adScript10.src = "//constellationbedriddenexams.com/2a2b18c6d0e7fc8c71926bf73216c8a8/invoke.js";
            adContainer10.appendChild(adScript10);

            console.log("New ad script added after post index:", index);
        }
    });
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
            loadingElement.style.display = 'block'; // Show loading element
            currentPage = i; // Update current page
            await displayPosts(posts); // Display posts for the current page
            displayPagination(posts); // Update pagination

            // Scroll to the top of the post container
            postContainer.scrollIntoView({ behavior: 'smooth' });

            loadingElement.style.display = 'none'; // Hide loading element after posts are displayed
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
    displayPosts(filteredPosts);
    displayPagination(filteredPosts);
}

document.getElementById('searchBar').addEventListener('input', handleSearch);

// Initial display of posts and pagination
async function initialize() {
    const posts = await fetchPosts();
    displayPosts(posts);
    displayPagination(posts);
}

initialize();

window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    preloader.classList.add("hide-preloader");

    // Initialize Isotope
    $('.entry-container').isotope({
        itemSelector: '.entry-item',
        layoutMode: 'masonry'
    });
});
