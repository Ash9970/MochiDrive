// Application State
const app = {
    pixeldrainApiKey: '144a77c7-51e0-4709-ad97-75dfdceca89a',
    baseApiUrl: 'https://pixeldrain.com/api',
    videos: [],
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.checkAuth();
        this.fetchVideos();
    },
    cacheDOM() {
        this.loginForm = document.getElementById('login-form');
        this.loginEmail = document.getElementById('login-email');
        this.loginPassword = document.getElementById('login-password');
        this.loginError = document.getElementById('login-error');
        this.videoContainer = document.getElementById('video-list');
        this.videoModal = new bootstrap.Modal(document.getElementById('videoModal'));
        this.videoModalTitle = document.getElementById('videoModalLabel');
        this.videoModalPlayer = document.getElementById('video-player');
    },
    bindEvents() {
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
    },
    checkAuth() {
        const token = localStorage.getItem('authToken');
        if (token) {
            document.querySelector('.main-content').style.display = 'block';
            if (this.loginForm) document.querySelector('.vh-100').style.display = 'none';
        } else {
            if (this.loginForm) {
                document.querySelector('.vh-100').style.display = 'flex';
                document.querySelector('.main-content').style.display = 'none';
            }
        }
    },
    handleLogin(e) {
        e.preventDefault();
        const email = this.loginEmail.value.trim();
        const password = this.loginPassword.value.trim();

        if (email === 'admin@mochi.com' && password === 'mochi123') {
            localStorage.setItem('authToken', 'fake-token');
            this.checkAuth();
        } else {
            this.loginError.classList.remove('d-none');
        }
    },
    async fetchVideos() {
        try {
            const response = await fetch(`${this.baseApiUrl}/list?folder=3YVjGz5B`, {
                headers: {
                    Authorization: `Bearer ${this.pixeldrainApiKey}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch videos.');

            const data = await response.json();
            this.videos = data.files;
            this.renderVideos();
        } catch (err) {
            console.error(err);
        }
    },
    renderVideos() {
        this.videoContainer.innerHTML = '';
        this.videos.forEach(file => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';

            const card = document.createElement('div');
            card.className = 'video-card shadow';

            const thumbnail = document.createElement('div');
            thumbnail.className = 'video-thumbnail d-flex align-items-center justify-content-center';
            thumbnail.innerHTML = '<i class="fas fa-play-circle"></i>';

            const info = document.createElement('div');
            info.className = 'video-info';

            const title = document.createElement('h5');
            title.className = 'video-title';
            title.textContent = file.name;

            const meta = document.createElement('div');
            meta.className = 'video-meta';
            meta.innerHTML = `
                <span class="badge bg-secondary">${file.id}</span> 
                <span class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</span>
            `;

            const actions = document.createElement('div');
            actions.className = 'video-actions mt-2';

            const playBtn = document.createElement('button');
            playBtn.className = 'btn btn-play';
            playBtn.textContent = 'Watch';
            playBtn.onclick = () => this.playVideo(file.id, file.name);

            const downloadBtn = document.createElement('a');
            downloadBtn.className = 'btn btn-download';
            downloadBtn.textContent = 'Download';
            downloadBtn.href = `https://pixeldrain.com/api/file/${file.id}?download`;
            downloadBtn.target = '_blank';

            actions.appendChild(playBtn);
            actions.appendChild(downloadBtn);

            info.appendChild(title);
            info.appendChild(meta);
            info.appendChild(actions);

            card.appendChild(thumbnail);
            card.appendChild(info);
            col.appendChild(card);

            this.videoContainer.appendChild(col);
        });
    },
    playVideo(fileId, title) {
        this.videoModalTitle.textContent = title;
        this.videoModalPlayer.src = `https://pixeldrain.com/api/file/${fileId}`;
        this.videoModal.show();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});