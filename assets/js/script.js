
        const postsPerPage = 16;
        let currentPage = 1;
        let allPosts = [];

        async function fetchPosts() {
            const response = await fetch('assets/js/post.json');
            allPosts = await response.json();
            return allPosts;
        }

        function filterPostsByDescription(posts, keyword) {
            return posts.filter(post => post.description.toLowerCase().includes(keyword.toLowerCase()));
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
                    ${post.video ? `<iframe src="${post.video}" frameborder="0"></iframe>` : ''}
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
                            'key' : '2a2b18c6dbe7814d57e9672b31da0f5b',
                            'format' : 'iframe',
                            'height' : 300,
                            'width' : 160,
                            'params' : {}
                        };
                    `;
                    adContainer10.appendChild(adScriptConfig10);

                    const adScript10 = document.createElement('script');
                    adScript10.type = 'text/javascript';
                    adScript10.src = "//constellationbedriddenexams.com/2a2b18c6dbe7814d57e9672b31da0f5b/invoke.js";
                    adContainer10.appendChild(adScript10);

                    console.log("Ad script added after post index:", index);
                }
            });

            updatePagination(posts.length);
        }

        function updatePagination(totalPosts) {
            const paginationContainer = document.getElementById('pagination');
            paginationContainer.innerHTML = '';

            const totalPages = Math.ceil(totalPosts / postsPerPage);
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.innerText = i;
                pageButton.onclick = () => {
                    currentPage = i;
                    displayPosts(allPosts);
                };

                if (i === currentPage) {
                    pageButton.classList.add('active');
                }

                paginationContainer.appendChild(pageButton);
            }
        }

        async function init(keyword) {
            const posts = await fetchPosts();
            const filteredPosts = filterPostsByDescription(posts, keyword);
            displayPosts(filteredPosts);
        }

        // Pass the keyword you want to filter by as a parameter to the init function
        init('celeb');
