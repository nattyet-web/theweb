document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts');
    const filteredPostsContainer = document.getElementById('filteredPosts');
    const paginationContainer = document.getElementById('pagination');
    const postsPerPage = 16;
    let currentPage = 1;
    let allPosts = [];
    let filteredPosts = [];

    fetch('assets/js/post.json')
        .then(response => response.json())
        .then(data => {
            allPosts = data;

            // Display posts for the main page
            if (postsContainer) {
                displayPosts(allPosts, postsContainer, currentPage, postsPerPage);
                if (allPosts.length > postsPerPage && paginationContainer) {
                    displayPagination(allPosts, postsPerPage);
                }
            }

            // Display filtered posts for the filtered page
            if (filteredPostsContainer) {
                const filteredTitles = ["charli D'amelio" ,"charli D'amelio and dixie", "dixie"]; // Example title to be filtered
                filteredPosts = allPosts.filter(post => filteredTitles.includes(post.title));
                displayPosts(filteredPosts, filteredPostsContainer, currentPage, postsPerPage);
                if (filteredPosts.length > postsPerPage && paginationContainer) {
                    displayPagination(filteredPosts, postsPerPage);
                }
            }

            // Hide the preloader once posts are loaded
            const preloader = document.getElementById("preloader");
            if (preloader) {
                preloader.classList.add("hide-preloader");
            }
        })
        .catch(error => {
            console.error('Error fetching the posts:', error);
            // Handle errors here
        });

    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        const postTitle = document.createElement('h2');
        postTitle.textContent = post.title;

        const postImage = document.createElement('img');
        postImage.src = post.image;
        postImage.alt = post.title;

        const postDescription = document.createElement('p');
        postDescription.textContent = post.description;

        postDiv.appendChild(postTitle);
        postDiv.appendChild(postImage);
        postDiv.appendChild(postDescription);

        return postDiv;
    }

    function displayPosts(posts, container, page, postsPerPage) {
        if (container) {
            container.innerHTML = ''; // Clear existing posts
            const startIndex = (page - 1) * postsPerPage;
            const endIndex = Math.min(startIndex + postsPerPage, posts.length);
            const paginatedPosts = posts.slice(startIndex, endIndex);

            paginatedPosts.forEach(post => {
                const postElement = createPostElement(post);
                container.appendChild(postElement);
            });
        }
    }

    function displayPagination(posts, postsPerPage) {
        if (paginationContainer) {
            paginationContainer.innerHTML = ''; // Clear existing pagination buttons

            const totalPages = Math.ceil(posts.length / postsPerPage);
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                if (i === currentPage) {
                    pageButton.classList.add('active');
                }
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    if (postsContainer) {
                        displayPosts(posts, postsContainer, currentPage, postsPerPage);
                    }
                    if (filteredPostsContainer) {
                        displayPosts(filteredPosts, filteredPostsContainer, currentPage, postsPerPage);
                    }
                    updatePaginationButtons();
                });
                paginationContainer.appendChild(pageButton);
            }
        }
    }

    function updatePaginationButtons() {
        if (paginationContainer) {
            const buttons = paginationContainer.getElementsByTagName('button');

            for (let i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove('active');
                if (parseInt(buttons[i].textContent) === currentPage) {
                    buttons[i].classList.add('active');
                }
            }
        }
    }

    window.addEventListener("load", function () {
        const preloader = document.getElementById("preloader");
        if (preloader) {
            preloader.classList.add("hide-preloader");
        }

        // Initialize Isotope
        const isotopeContainer = document.querySelector('.entry-container');
        if (isotopeContainer) {
            $(isotopeContainer).isotope({
                itemSelector: '.entry-item',
                layoutMode: 'masonry'
            });
        }
    });
});
