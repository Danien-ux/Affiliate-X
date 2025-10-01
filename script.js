const STORAGE_KEY = 'zenith_posts';
const PASSWORD = 'Danien-ux';

// Load posts from localStorage
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const feed = document.getElementById('feed');
    feed.innerHTML = '';
    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'post-card';

        let media;
        if (post.type === 'image') {
            media = document.createElement('img');
            media.src = post.data;
            media.className = 'post-media';
        } else if (post.type === 'video') {
            media = document.createElement('video');
            media.src = post.data;
            media.controls = true;
            media.className = 'post-media';
        }
        card.appendChild(media);

        const desc = document.createElement('p');
        desc.className = 'post-description';
        desc.textContent = post.description;
        card.appendChild(desc);

        const link = document.createElement('a');
        link.className = 'buy-link';
        link.href = post.link;
        link.target = '_blank';
        link.textContent = 'Buy on Amazon';
        card.appendChild(link);

        // Add click event to toggle expanded view
        card.addEventListener('click', (e) => {
            // Prevent expanding when clicking the Buy link
            if (e.target.classList.contains('buy-link')) return;
            // Toggle expanded class
            if (card.classList.contains('expanded')) {
                card.classList.remove('expanded');
            } else {
                // Remove expanded from all cards first
                document.querySelectorAll('.post-card.expanded').forEach(c => c.classList.remove('expanded'));
                card.classList.add('expanded');
            }
        });

        feed.appendChild(card);
    });
}

// Load posts in admin posts view
function loadAdminPosts() {
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const postsList = document.getElementById('posts-list');
    postsList.innerHTML = '';
    posts.forEach((post, index) => {
        const postItem = document.createElement('div');
        postItem.className = 'post-item';

        let media;
        if (post.type === 'image') {
            media = document.createElement('img');
            media.src = post.data;
        } else if (post.type === 'video') {
            media = document.createElement('video');
            media.src = post.data;
        }
        postItem.appendChild(media);

        const desc = document.createElement('p');
        desc.textContent = post.description;
        postItem.appendChild(desc);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            posts.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
            loadAdminPosts();
            loadPosts();
        });
        postItem.appendChild(deleteBtn);

        postsList.appendChild(postItem);
    });
}

// Show admin modal
document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('admin-modal').style.display = 'flex';
    document.getElementById('password-form').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('password-input').value = '';
});

// Submit password
document.getElementById('submit-password').addEventListener('click', () => {
    const input = document.getElementById('password-input').value;
    if (input === PASSWORD) {
        document.getElementById('password-form').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'flex';
        document.getElementById('post-form').style.display = 'block';
        document.getElementById('posts-view').style.display = 'none';
    } else {
        alert('Incorrect password');
    }
});

// Show post form
document.getElementById('show-post-form').addEventListener('click', () => {
    document.getElementById('post-form').style.display = 'block';
    document.getElementById('posts-view').style.display = 'none';
});

// Show posts view
document.getElementById('show-posts').addEventListener('click', () => {
    document.getElementById('post-form').style.display = 'none';
    document.getElementById('posts-view').style.display = 'block';
    loadAdminPosts();
});

// Back to form
document.getElementById('back-to-form').addEventListener('click', () => {
    document.getElementById('post-form').style.display = 'block';
    document.getElementById('posts-view').style.display = 'none';
});

// Submit post
document.getElementById('submit-post').addEventListener('click', () => {
    const file = document.getElementById('media-input').files[0];
    const description = document.getElementById('description-input').value;
    const link = document.getElementById('link-input').value;

    if (!file || !description || !link) {
        alert('Please fill all fields');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const type = file.type.startsWith('image') ? 'image' : 'video';
        const post = {
            type,
            data: e.target.result,
            description,
            link
        };
        const posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        posts.unshift(post);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
        loadPosts();
        document.getElementById('admin-modal').style.display = 'none';
    };
    reader.readAsDataURL(file);
});

// Close modal on outside click
document.getElementById('admin-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('admin-modal')) {
        document.getElementById('admin-modal').style.display = 'none';
    }
});

// Initial load
loadPosts();
