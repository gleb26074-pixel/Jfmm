// База данных треков
const tracks = [
    {
        id: 1,
        title: "Sunset Dreams",
        artist: "Chill Vibes",
        genre: "chill",
        duration: "3:45",
        color: "#667eea,#764ba2",
        icon: "fas fa-sun",
        audioUrl: "https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3"
    },
    {
        id: 2,
        title: "Electric Pulse",
        artist: "Neon Waves",
        genre: "electronic",
        duration: "4:20",
        color: "#f093fb,#f5576c",
        icon: "fas fa-bolt",
        audioUrl: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"
    },
    {
        id: 3,
        title: "Mountain Rock",
        artist: "Guitar Legends",
        genre: "rock",
        duration: "3:58",
        color: "#ff9a9e,#fad0c4",
        icon: "fas fa-guitar",
        audioUrl: "https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3"
    },
    {
        id: 4,
        title: "Ocean Breeze",
        artist: "Sea Harmony",
        genre: "chill",
        duration: "4:10",
        color: "#4facfe,#00f2fe",
        icon: "fas fa-water",
        audioUrl: "https://assets.mixkit.co/music/preview/mixkit-relaxation-time-117.mp3"
    },
    {
        id: 5,
        title: "Midnight Drive",
        artist: "City Lights",
        genre: "electronic",
        duration: "3:30",
        color: "#43e97b,#38f9d7",
        icon: "fas fa-car",
        audioUrl: "https://assets.mixkit.co/music/preview/mixkit-summer-bossa-482.mp3"
    },
    {
        id: 6,
        title: "Classical Moment",
        artist: "Piano Masters",
        genre: "chill",
        duration: "5:15",
        color: "#a18cd1,#fbc2eb",
        icon: "fas fa-music",
        audioUrl: "https://assets.mixkit.co/music/preview/mixkit-piano-melody-2375.mp3"
    },
    {
        id: 7,
        title: "Urban Beat",
        artist: "Street Sound",
        genre: "electronic",
        duration: "3:55",
        color: "#fdcbf1,#e6dee9",
        icon: "fas fa-city",
        audioUrl: "https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3"
    },
    {
        id: 8,
        title: "Acoustic Session",
        artist: "Wood & Strings",
        genre: "chill",
        duration: "4:05",
        color: "#667eea,#764ba2",
        icon: "fas fa-guitar",
        audioUrl: "https://assets.mixkit.co/music/preview/mixkit-acoustic-guitar-2021.mp3"
    }
];

// Радиостанции
const radioStations = [
    {
        id: 1,
        name: "Chill Radio",
        genre: "chill",
        description: "Спокойная музыка 24/7",
        url: "https://stream.radioparadise.com/mellow-128",
        icon: "fas fa-wind"
    },
    {
        id: 2,
        name: "Rock Radio",
        genre: "rock",
        description: "Лучшие рок хиты",
        url: "https://stream.radioparadise.com/rock-128",
        icon: "fas fa-volume-up"
    }
];

class MusicPlayer {
    constructor() {
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.isRadio = false;
        this.currentRadio = null;
        this.likedTracks = new Set();
        this.currentFilter = 'all';
        this.audio = document.getElementById('audio-player');
        
        this.init();
    }

    init() {
        this.renderTracks();
        this.setupEventListeners();
        this.updateGreeting();
        
        // Предзагрузка первого трека
        this.loadTrack(tracks[0]);
    }

    setupEventListeners() {
        // Кнопки плеера
        document.getElementById('play-btn').addEventListener('click', () => this.togglePlay());
        document.getElementById('prev-btn').addEventListener('click', () => this.prevTrack());
        document.getElementById('next-btn').addEventListener('click', () => this.nextTrack());
        document.getElementById('like-btn').addEventListener('click', () => this.toggleLike());
        
        // Прогресс бар
        document.getElementById('progress-bar').addEventListener('click', (e) => this.seek(e));
        
        // Меню
        document.getElementById('menu-btn').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('show');
        });
        
        // Фильтры
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderTracks();
            });
        });
        
        // Навигация
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                e.currentTarget.classList.add('active');
                // Показать соответствующий раздел
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });
        
        // Плейлисты
        document.querySelectorAll('.playlist-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const playlist = e.currentTarget.dataset.playlist;
                this.filterByGenre(playlist);
            });
        });
        
        // Радио
        document.querySelectorAll('.radio-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const radioGenre = e.currentTarget.dataset.radio;
                this.playRadio(radioGenre);
            });
        });
        
        // Аудио события
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        
        // Кнопки поиска и пользователя
        document.getElementById('search-btn').addEventListener('click', () => {
            alert('Функция поиска будет добавлена в следующем обновлении');
        });
        
        document.getElementById('user-btn').addEventListener('click', () => {
            alert('Профиль пользователя');
        });
    }

    renderTracks() {
        const trackList = document.getElementById('track-list');
        trackList.innerHTML = '';
        
        const filteredTracks = this.currentFilter === 'all' 
            ? tracks 
            : tracks.filter(track => track.genre === this.currentFilter);
        
        filteredTracks.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = `track-item glass-effect ${index === this.currentTrackIndex && !this.isRadio ? 'playing' : ''}`;
            trackElement.dataset.index = index;
            
            const [color1, color2] = track.color.split(',');
            
            trackElement.innerHTML = `
                <div class="track-info">
                    <div class="track-avatar" style="background: linear-gradient(135deg, ${color1}, ${color2})">
                        <i class="${track.icon}"></i>
                    </div>
                    <div class="track-details">
                        <h4>${track.title}</h4>
                        <p>${track.artist}</p>
                    </div>
                </div>
                <div class="track-controls">
                    <button class="icon-btn like-track" data-id="${track.id}">
                        <i class="${this.likedTracks.has(track.id) ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <span class="track-time">${track.duration}</span>
                </div>
            `;
            
            trackElement.addEventListener('click', (e) => {
                if (!e.target.closest('.like-track')) {
                    this.playTrack(index);
                }
            });
            
            trackList.appendChild(trackElement);
        });
        
        // Слушатели для лайков
        document.querySelectorAll('.like-track').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const trackId = parseInt(e.currentTarget.dataset.id);
                this.toggleTrackLike(trackId);
            });
        });
    }

    playTrack(index) {
        this.isRadio = false;
        this.currentTrackIndex = index;
        const track = tracks[index];
        
        this.loadTrack(track);
        this.play();
        this.updateUI();
    }

    loadTrack(track) {
        this.audio.src = track.audioUrl;
        
        document.getElementById('current-title').textContent = track.title;
        document.getElementById('current-artist').textContent = track.artist;
        document.getElementById('current-cover').style.background = `linear-gradient(135deg, ${track.color})`;
        document.getElementById('current-cover').innerHTML = `<i class="${track.icon}"></i>`;
        
        // Обновляем лайк
        const likeBtn = document.getElementById('like-btn');
        likeBtn.innerHTML = `<i class="${this.likedTracks.has(track.id) ? 'fas' : 'far'} fa-heart"></i>`;
    }

    playRadio(genre) {
        this.isRadio = true;
        const station = radioStations.find(s => s.genre === genre);
        if (!station) return;
        
        this.currentRadio = station;
        
        this.audio.src = station.url;
        this.audio.load();
        this.play();
        
        document.getElementById('current-title').textContent = station.name;
        document.getElementById('current-artist').textContent = 'Радиостанция';
        document.getElementById('current-cover').innerHTML = `<i class="${station.icon}"></i>`;
        
        this.updateUI();
    }

    play() {
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                document.getElementById('play-btn').innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(error => {
                console.log('Автовоспроизведение заблокировано:', error);
                // Показываем инструкцию
                document.getElementById('current-title').textContent = 'Нажмите ▶ для воспроизведения';
            });
        }
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        document.getElementById('play-btn').innerHTML = '<i class="fas fa-play"></i>';
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            if (this.audio.src) {
                this.play();
            } else {
                this.playTrack(0);
            }
        }
    }

    nextTrack() {
        if (this.isRadio) return;
        
        this.currentTrackIndex = (this.currentTrackIndex + 1) % tracks.length;
        this.playTrack(this.currentTrackIndex);
    }

    prevTrack() {
        if (this.isRadio) return;
        
        this.currentTrackIndex = this.currentTrackIndex > 0 ? this.currentTrackIndex - 1 : tracks.length - 1;
        this.playTrack(this.currentTrackIndex);
    }

    seek(e) {
        const progressBar = e.currentTarget;
        const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
        const percentage = clickPosition / progressBar.clientWidth;
        this.audio.currentTime = percentage * this.audio.duration;
    }

    updateProgress() {
        if (!isNaN(this.audio.duration)) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            document.getElementById('progress-fill').style.width = `${progress}%`;
            
            document.getElementById('current-time').textContent = this.formatTime(this.audio.currentTime);
            document.getElementById('total-time').textContent = this.formatTime(this.audio.duration);
        }
    }

    updateDuration() {
        if (!isNaN(this.audio.duration)) {
            document.getElementById('total-time').textContent = this.formatTime(this.audio.duration);
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    toggleLike() {
        if (this.isRadio) return;
        
        const currentTrack = tracks[this.currentTrackIndex];
        if (this.likedTracks.has(currentTrack.id)) {
            this.likedTracks.delete(currentTrack.id);
        } else {
            this.likedTracks.add(currentTrack.id);
        }
        
        this.updateUI();
    }

    toggleTrackLike(trackId) {
        if (this.likedTracks.has(trackId)) {
            this.likedTracks.delete(trackId);
        } else {
            this.likedTracks.add(trackId);
        }
        
        this.updateUI();
        this.renderTracks();
    }

    updateUI() {
        // Обновляем иконку лайка
        if (!this.isRadio) {
            const currentTrack = tracks[this.currentTrackIndex];
            const likeBtn = document.getElementById('like-btn');
            likeBtn.innerHTML = `<i class="${this.likedTracks.has(currentTrack.id) ? 'fas' : 'far'} fa-heart"></i>`;
        }
        
        // Обновляем выделение текущего трека
        document.querySelectorAll('.track-item').forEach((item, index) => {
            item.classList.toggle('playing', index === this.currentTrackIndex && !this.isRadio);
        });
    }

    filterByGenre(genre) {
        this.currentFilter = genre;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === genre);
        });
        this.renderTracks();
    }

    showSection(section) {
        // Прокрутка к соответствующему разделу
        const sections = document.querySelectorAll('.section');
        if (sections[0]) {
            sections[0].scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateGreeting() {
        const hour = new Date().getHours();
        let greeting = 'Доброй ночи';
        
        if (hour >= 5 && hour < 12) greeting = 'Доброе утро';
        else if (hour >= 12 && hour < 18) greeting = 'Добрый день';
        else if (hour >= 18 && hour < 23) greeting = 'Добрый вечер';
        
        document.getElementById('greeting').textContent = greeting;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем класс для iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.classList.add('ios-device');
    }
    
    // Инициализация плеера
    window.player = new MusicPlayer();
    
    // Обновляем приветствие каждую минуту
    setInterval(() => {
        if (window.player) {
            window.player.updateGreeting();
        }
    }, 60000);
    
    // Показываем приветственное сообщение
    setTimeout(() => {
        console.log('🎵 Яндекс Музыка iOS загружена!');
        console.log('Доступно треков:', tracks.length);
    }, 1000);
});

// Service Worker для PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('ServiceWorker зарегистрирован');
        }).catch(error => {
            console.log('Ошибка регистрации ServiceWorker:', error);
        });
    });
}
