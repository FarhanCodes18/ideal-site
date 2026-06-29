// ==========================================
// 🚨 GOOGLE SHEETS & FIREBASE LIVE CONFIGS 🚨
// ==========================================
const ADMISSION_SHEET_URL = "https://script.google.com/macros/s/AKfycby_9thAYsdn2AgSPlhtZnW7Tla05_Hs5fpsz3u0S2pXlCJod9f5mofspBvnzw0Bh4pU/exec";
const COMPLAINT_SHEET_URL = "https://script.google.com/macros/s/AKfycbxYI6vgpQDtoMlAz-3nQFEC1zrzxuNrALciCIDzR14K5D5LUCt-y7MO46BiqEx3JTMlqg/exec";

// 🌟 1. FIREBASE SETUP 🌟
const firebaseConfig = {
    apiKey: "AIzaSyCK-PK_YPHMdTfhTOR-MVJjY3Fodqq5K_g",
    authDomain: "ideal-public-school-59070.firebaseapp.com",
    databaseURL: "https://ideal-public-school-59070-default-rtdb.firebaseio.com",
    projectId: "ideal-public-school-59070",
    storageBucket: "ideal-public-school-59070.firebasestorage.app",
    messagingSenderId: "775234870692",
    appId: "1:775234870692:web:39c85c60ada28f5d563531"
};
let db = null;
if (typeof firebase !== 'undefined') {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.database();
    } catch (e) {
        console.error("Firebase initialization failed:", e);
    }
} else {
    console.warn("Firebase SDK is not loaded. Live database features will be disabled.");
}

// 🌟 2. TOAST NOTIFICATIONS 🌟
function showToast(message, isError = false) {
    const toast = document.getElementById("toastMessage"); 
    const toastText = document.getElementById("toastText");
    if (toast && toastText) { 
        toastText.innerText = message; 
        toast.style.backgroundColor = isError ? "#ef4444" : "#10b981"; 
        toast.classList.add("show"); 
        setTimeout(() => toast.classList.remove("show"), 3000); 
    }
}

// 🌟 3. MODAL LOGIC & CONTROLS 🌟
function openAdmissionForm() { document.getElementById('admissionModal').style.display = 'flex'; } 
function closeAdmissionForm() { document.getElementById('admissionModal').style.display = 'none'; }
function openELibrary() { document.getElementById('eLibraryModal').style.display = 'flex'; } 
function closeELibrary() { document.getElementById('eLibraryModal').style.display = 'none'; }
function openNoticeBoard() { document.getElementById('noticeBoardModal').style.display = 'flex'; } 
function closeNoticeBoard() { document.getElementById('noticeBoardModal').style.display = 'none'; }
function openResultModal() { document.getElementById('resultModal').style.display = 'flex'; } 
function closeResultModal() { document.getElementById('resultModal').style.display = 'none'; }
function openStudentId() { document.getElementById('studentIdModal').style.display = 'flex'; } 
function closeStudentId() { document.getElementById('studentIdModal').style.display = 'none'; }
function openMandatoryModal() { document.getElementById('mandatoryModal').style.display = 'flex'; } 
function closeMandatoryModal() { document.getElementById('mandatoryModal').style.display = 'none'; }
function openCallbackModal() { document.getElementById('callbackModal').style.display = 'flex'; }
function closeCallbackModal() { document.getElementById('callbackModal').style.display = 'none'; }

function openPublicFeeModal() {
    if (!db) {
        let container = document.getElementById('publicFeeContainer');
        if (container) {
            container.innerHTML = '<p style="color:#ef4444; font-weight:600; margin-top:15px; background:#fee2e2; padding:15px; border-radius:8px; border:1px solid #fca5a5;">Offline Mode: Fee structure is not available.</p>';
        }
        document.getElementById('publicFeeModal').style.display = 'flex';
        return;
    }
    db.ref('ideal_class_fees').once('value', snap => {
        let classFees = snap.val() || {}; 
        let container = document.getElementById('publicFeeContainer'); 
        let keys = Object.keys(classFees);
        if(keys.length > 0) {
            let html = '<table style="width:100%; text-align:left; border-collapse:collapse; margin-top:15px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);"><tr style="background: #f8fafc;"><th style="border-bottom:2px solid #e2e8f0; padding:15px; color:#475569;">Class Name</th><th style="border-bottom:2px solid #e2e8f0; padding:15px; text-align:right; color:#475569;">Total Fee (₹)</th></tr>';
            keys.forEach(cls => { html += `<tr><td style="padding:15px; border-bottom:1px solid #e2e8f0; font-weight:600; color:#334155;">${cls}</td><td style="padding:15px; border-bottom:1px solid #e2e8f0; color:#10b981; font-weight:bold; font-size:1.1rem; text-align:right;">₹${classFees[cls]}</td></tr>`; });
            container.innerHTML = html + '</table>';
        } else { container.innerHTML = '<p style="color:#ef4444; font-weight:600; margin-top:15px; background:#fee2e2; padding:15px; border-radius:8px; border:1px solid #fca5a5;">Fee structure is not published yet.</p>'; }
        document.getElementById('publicFeeModal').style.display = 'flex';
    });
}
function closePublicFeeModal() { document.getElementById('publicFeeModal').style.display = 'none'; }

// Window Click (Close Modals on outside click)
window.onclick = function(event) {
    const modals = ['admissionModal', 'noticeModal', 'studentIdModal', 'eLibraryModal', 'resultModal', 'noticeBoardModal', 'mandatoryModal', 'publicFeeModal', 'toppersModal', 'callbackModal'];
    modals.forEach(id => {
        const modal = document.getElementById(id);
        if (modal && event.target == modal) modal.style.display = 'none';
    });
}

// 🌟 4. DIGITAL ID CARD GENERATION & DOWNLOAD 🌟
function resetIdForm() { 
    document.getElementById('idGenForm').reset(); 
    document.getElementById('photoFileName').innerText = "Click to Upload Passport Photo"; 
    document.getElementById('idCardDisplay').style.display = 'none'; 
    document.getElementById('idGenFormBox').style.display = 'block'; 
}

function downloadIdCard() { 
    const card = document.getElementById('idCardToCapture'); 
    showToast("Generating High Quality PNG..."); 
    card.style.borderRadius = "0px"; 
    html2canvas(card, { scale: 3, backgroundColor: "#ffffff" }).then(canvas => { 
        let link = document.createElement('a'); 
        link.download = `ID_Card.png`; 
        link.href = canvas.toDataURL('image/png'); 
        link.click(); 
        card.style.borderRadius = "16px"; 
        showToast("ID Card Downloaded! ✅"); 
    }); 
}

// 🌟 5. LIVE FIREBASE DATA LISTENERS (DOMContentLoaded) 🌟
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-active');
    
    // Initialize homepage and placement sliders immediately to avoid blank areas on load
    initSlider([]);
    initPlacementCarousel([]);
    initNewsSlider([]);
    
    if (db) {
        // A. Live Gallery Load
        db.ref('ideal_gallery').on('value', (snapshot) => {
            const data = snapshot.val();
            
            // Helper to infer category from image title
            function getCategoryFromTitle(title) {
                const t = (title || '').toLowerCase();
                if (t.includes('sport') || t.includes('play') || t.includes('ground') || t.includes('game') || t.includes('run') || t.includes('volleyball') || t.includes('football') || t.includes('cricket') || t.includes('tenis') || t.includes('athletics')) return 'sports';
                if (t.includes('lab') || t.includes('computer') || t.includes('science') || t.includes('physics') || t.includes('chemistry') || t.includes('biology') || t.includes('it lab')) return 'labs';
                if (t.includes('event') || t.includes('annual') || t.includes('celebration') || t.includes('day') || t.includes('fair') || t.includes('exhibition') || t.includes('seminar') || t.includes('meet') || t.includes('independence') || t.includes('republic') || t.includes('exhibit')) return 'events';
                if (t.includes('culture') || t.includes('dance') || t.includes('sing') || t.includes('music') || t.includes('drill') || t.includes('art') || t.includes('craft') || t.includes('draw') || t.includes('painting') || t.includes('read')) return 'cultural';
                return 'campus'; // Default category
            }

            // Gallery filter buttons handler
            function initGalleryFilters() {
                const filters = document.querySelectorAll('.gallery-filter-btn');
                const items = document.querySelectorAll('.gallery-grid-item');
                if (filters.length === 0) return;
                
                filters.forEach(btn => {
                    const newBtn = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newBtn, btn);
                });

                const newFilters = document.querySelectorAll('.gallery-filter-btn');
                newFilters.forEach(btn => {
                    btn.addEventListener('click', () => {
                        newFilters.forEach(f => f.classList.remove('active'));
                        btn.classList.add('active');
                        
                        const category = btn.getAttribute('data-filter');
                        items.forEach(item => {
                            const itemCategory = item.getAttribute('data-category');
                            if (category === 'all' || itemCategory === category) {
                                item.style.display = 'block';
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    });
                });
            }

            // 1. Homepage Gallery
            const galleryContainer = document.getElementById('dynamicGalleryContainer');
            if (galleryContainer) {
                if (data) {
                    let html = '';
                    const photos = Object.keys(data).map(key => data[key]).reverse();
                    photos.forEach(item => { 
                        html += `<div class="card gallery-item" style="padding:10px; text-align:center;"><img src="${item.image}" alt="${item.title || 'Event Photo'}" style="width:100%; height:200px; object-fit:cover; border-radius:8px;"><p style="margin-top:10px; font-weight:600; color:#334155;">${item.title || 'Event Photo'}</p></div>`; 
                    });
                    galleryContainer.innerHTML = html;
                } else { 
                    galleryContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">No new photos uploaded yet.</p>'; 
                }
            }

            // 2. Our Campus page Tour Gallery
            const campusContainer = document.getElementById('campusGalleryContainer');
            if (campusContainer) {
                if (data) {
                    const photos = Object.keys(data).map(key => data[key]).reverse();
                    if (photos.length > 0) {
                        let html = '';
                        const bigPhoto = photos[0];
                        html += `
                          <div class="life-item-big gallery-item">
                            <img src="${bigPhoto.image}" alt="${bigPhoto.title || 'Campus Image'}" loading="lazy">
                          </div>
                        `;
                        if (photos.length > 1) {
                            html += '<div class="life-col">';
                            for (let i = 1; i < Math.min(photos.length, 4); i++) {
                                html += `
                                  <div class="life-item gallery-item">
                                    <img src="${photos[i].image}" alt="${photos[i].title || 'Campus Image'}" loading="lazy">
                                  </div>
                                `;
                            }
                            html += '</div>';
                        }
                        campusContainer.innerHTML = html;
                    } else {
                        campusContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">No campus photos uploaded yet.</p>';
                    }
                } else {
                    campusContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">No campus photos uploaded yet.</p>';
                }
            }

            // 3. Dedicated Gallery page
            const galleryPageContainer = document.getElementById('galleryPageContainer');
            if (galleryPageContainer) {
                if (data) {
                    let html = '';
                    const photos = Object.keys(data).map(key => data[key]).reverse();
                    photos.forEach(item => {
                        const category = getCategoryFromTitle(item.title);
                        let categoryDisplay = 'Campus';
                        if (category === 'labs') categoryDisplay = 'Labs';
                        if (category === 'events') categoryDisplay = 'Events';
                        if (category === 'sports') categoryDisplay = 'Sports';
                        if (category === 'cultural') categoryDisplay = 'Cultural Activities';

                        html += `
                          <div class="gallery-grid-item gallery-item" data-category="${category}">
                            <img src="${item.image}" alt="${item.title || 'Gallery Image'}" loading="lazy">
                            <div class="overlay">
                              <h4>${item.title || 'Gallery Image'}</h4>
                              <p>${categoryDisplay}</p>
                            </div>
                          </div>
                        `;
                    });
                    galleryPageContainer.innerHTML = html;
                    initGalleryFilters();
                } else {
                    galleryPageContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">No photos uploaded yet.</p>';
                }
            }

            // 4. Sports page Gallery
            const sportsContainer = document.getElementById('sportsGalleryContainer');
            if (sportsContainer) {
                if (data) {
                    const photos = Object.keys(data).map(key => data[key]).reverse();
                    const sportsPhotos = photos.filter(item => getCategoryFromTitle(item.title) === 'sports');
                    if (sportsPhotos.length > 0) {
                        let html = '';
                        sportsPhotos.forEach(item => {
                            html += `
                              <div class="campus-gallery-item gallery-item">
                                <img src="${item.image}" alt="${item.title || 'Sports Photo'}" loading="lazy">
                                <div class="cg-label">${item.title || 'Sports Photo'}</div>
                              </div>
                            `;
                        });
                        sportsContainer.innerHTML = html;
                    } else {
                        sportsContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">No sports photos uploaded yet.</p>';
                    }
                } else {
                    sportsContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">No sports photos uploaded yet.</p>';
                }
            }

            // 5. Library page Gallery
            const libraryContainer = document.getElementById('libraryGalleryContainer');
            if (libraryContainer) {
                if (data) {
                    const photos = Object.keys(data).map(key => data[key]).reverse();
                    const libraryPhotos = photos.filter(item => {
                        const cat = getCategoryFromTitle(item.title);
                        const t = (item.title || '').toLowerCase();
                        return cat === 'labs' || t.includes('library') || t.includes('book') || t.includes('read');
                    });
                    if (libraryPhotos.length > 0) {
                        let html = '';
                        libraryPhotos.forEach(item => {
                            html += `
                              <div class="campus-gallery-item gallery-item">
                                <img src="${item.image}" alt="${item.title || 'Library Photo'}" loading="lazy">
                                <div class="cg-label">${item.title || 'Library Photo'}</div>
                              </div>
                            `;
                        });
                        libraryContainer.innerHTML = html;
                    } else {
                        libraryContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">No library photos uploaded yet.</p>';
                    }
                } else {
                    libraryContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">No library photos uploaded yet.</p>';
                }
            }

            // 6. Transport page Gallery
            const transportContainer = document.getElementById('transportGalleryContainer');
            if (transportContainer) {
                if (data) {
                    const photos = Object.keys(data).map(key => data[key]).reverse();
                    const transportPhotos = photos.filter(item => {
                        const t = (item.title || '').toLowerCase();
                        return t.includes('bus') || t.includes('transport') || t.includes('van') || t.includes('route') || t.includes('vehicle');
                    });
                    if (transportPhotos.length > 0) {
                        let html = '';
                        transportPhotos.forEach(item => {
                            html += `
                              <div class="campus-gallery-item gallery-item">
                                <img src="${item.image}" alt="${item.title || 'Transport Photo'}" loading="lazy">
                                <div class="cg-label">${item.title || 'Transport Photo'}</div>
                              </div>
                            `;
                        });
                        transportContainer.innerHTML = html;
                    } else {
                        transportContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">No transport photos uploaded yet.</p>';
                    }
                } else {
                    transportContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">No transport photos uploaded yet.</p>';
                }
            }

            // 7. General Tour/Life Galleries (Overview, Mission, Messages pages)
            const overviewContainer = document.getElementById('overviewGalleryContainer');
            const principalContainer = document.getElementById('principalGalleryContainer');
            const directorContainer = document.getElementById('directorGalleryContainer');
            const missionContainer = document.getElementById('missionGalleryContainer');
            
            const generalContainers = [
                { el: overviewContainer },
                { el: principalContainer },
                { el: directorContainer },
                { el: missionContainer }
            ];

            generalContainers.forEach(c => {
                if (c.el) {
                    if (data) {
                        const photos = Object.keys(data).map(key => data[key]).reverse();
                        if (photos.length > 0) {
                            let html = '';
                            const bigPhoto = photos[0];
                            html += `
                              <div class="life-item-big gallery-item">
                                <img src="${bigPhoto.image}" alt="${bigPhoto.title || 'Campus Image'}" loading="lazy">
                              </div>
                            `;
                            if (photos.length > 1) {
                                html += '<div class="life-col">';
                                for (let i = 1; i < Math.min(photos.length, 4); i++) {
                                    html += `
                                      <div class="life-item gallery-item">
                                        <img src="${photos[i].image}" alt="${photos[i].title || 'Campus Image'}" loading="lazy">
                                      </div>
                                    `;
                                }
                                html += '</div>';
                            }
                            c.el.innerHTML = html;
                        } else {
                            c.el.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">No campus photos uploaded yet.</p>';
                        }
                    } else {
                        c.el.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">No campus photos uploaded yet.</p>';
                    }
                }
            });
        });

        // B. Live Books (E-Library) Load
        db.ref('ideal_library').on('value', (snapshot) => {
            let libs = []; snapshot.forEach(child => { libs.push(child.val()); });
            let libContainer = document.getElementById('userLibraryContainer');
            if (libContainer) {
                if (libs.length > 0) {
                    let html = '<div style="display:grid; gap:15px;">';
                    libs.reverse().forEach(l => {
                        let icon = l.type === 'PDF' ? '<i class="fas fa-file-pdf" style="color:#ef4444; font-size:2rem;"></i>' : (l.type === 'Video' ? '<i class="fas fa-video" style="color:#3b82f6; font-size:2rem;"></i>' : '<i class="fas fa-link" style="color:#10b981; font-size:2rem;"></i>');
                        html += `<a href="${l.link}" target="_blank" style="display:flex; align-items:center; gap:15px; background:#f8fafc; padding:15px; border-radius:10px; text-decoration:none; color:#0f172a; border:1px solid #e2e8f0; transition:0.3s;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">${icon}<div><h4 style="margin:0;">${l.title}</h4><span style="font-size:0.8rem; color:#64748b; background:#e2e8f0; padding:2px 8px; border-radius:4px;">${l.type}</span></div></a>`;
                    }); html += '</div>'; libContainer.innerHTML = html;
                } else { libContainer.innerHTML = '<p style="text-align:center; color:#64748b;">No resources available right now.</p>'; }
            }
        });

        // C. Live Notices Load (Modal & Marquee)
        db.ref('ideal_notices').on('value', (snapshot) => {
            let notices = []; snapshot.forEach(child => { notices.push(child.val()); });
            let noticeContainer = document.getElementById('userNoticeContainer');
            if (noticeContainer) {
                if (notices.length > 0) {
                    let html = '';
                    [...notices].reverse().forEach(n => {
                        html += `<div style="background:#f8fafc; border-left:4px solid #dc2626; padding:15px; margin-bottom:15px; border-radius:8px;"><strong style="color:#0f172a; font-size:1.1rem;">${n.title}</strong><div style="font-size:0.8rem; color:#64748b; margin-bottom:8px;">${n.date}</div><p style="font-size:0.95rem; color:#334155; margin:0;">${n.content}</p></div>`;
                    }); noticeContainer.innerHTML = html;
                } else { noticeContainer.innerHTML = '<p style="text-align:center; color:#64748b;">No new notices.</p>'; }
            }
            updateMarquee(notices);
        });

        // D. Live Scrolling Text & Popup & Emergency Alert
        db.ref('ideal_scrolling').on('value', snap => { 
            db.ref('ideal_notices').once('value', nSnap => {
                let notices = []; nSnap.forEach(c => notices.push(c.val())); updateMarquee(notices);
            });
        });

        db.ref('ideal_emergency').on('value', snap => {
            let emergency = snap.val(); 
            let banner = document.getElementById('emergencyBanner'); 
            let bannerText = document.getElementById('emergencyText');
            if (banner && bannerText) {
                if (emergency && emergency.active && emergency.text) { 
                    bannerText.innerText = emergency.text; 
                    banner.style.display = 'flex'; 
                } else { 
                    banner.style.display = 'none'; 
                }
            }
        });

        // E. Live Banners for Homepage Slider
        db.ref('ideal_sliders').orderByChild('order').on('value', (snap) => {
            let banners = [];
            snap.forEach(child => {
                let b = child.val();
                if (b.enabled !== false) banners.push(b);
            });
            initSlider(banners);
        });

        // F. Live Placement Achievers
        db.ref('ideal_placements').on('value', (snap) => {
            let achievers = [];
            snap.forEach(child => { achievers.push({ key: child.key, ...child.val() }); });
            
            // Use beautiful default toppers if database returns empty
            if (achievers.length === 0) {
                achievers = [
                    {
                        key: "default_achiever_1",
                        name: "Rahul Sharma",
                        company: "Class 12th Math Topper - 98.4%",
                        photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
                    },
                    {
                        key: "default_achiever_2",
                        name: "Anjali Verma",
                        company: "Class 12th Science Topper - 97.8%",
                        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
                    },
                    {
                        key: "default_achiever_3",
                        name: "Amit Patel",
                        company: "Class 12th Commerce Topper - 96.5%",
                        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                    }
                ];
            }
            initPlacementCarousel(achievers);
        });

        // G. Live News & Events
        db.ref('ideal_news').on('value', (snap) => {
            let newsItems = [];
            snap.forEach(child => { newsItems.push({ key: child.key, ...child.val() }); });
            
            const trackEl = document.getElementById('newsSliderTrack');
            const class10Img = (trackEl && trackEl.getAttribute('data-class10-toppers-img')) || "logo.jpeg";
            const class12Img = (trackEl && trackEl.getAttribute('data-class12-achievements-img')) || "logo.jpeg";

            // Prepend custom news items for Class 10th toppers and Class 12th achievements
            const defaultNews = [
                {
                    key: "default_class10_toppers",
                    title: "Ideal Public School Shines in CBSE Class 10th Board Results! Our stars set new records of excellence.",
                    category: "Class 10th Toppers Result",
                    tag: "ACHIEVEMENT",
                    photo: class10Img,
                    date: "June 2026"
                },
                {
                    key: "default_class12_achievements",
                    title: "Class 12th Achievements: Outstanding academic performance in Board Examinations. IPS students secure top positions.",
                    category: "Class 12th Achievements",
                    tag: "ACHIEVEMENT",
                    photo: class12Img,
                    date: "June 2026"
                }
            ];
            
            newsItems = [...defaultNews, ...newsItems];
            initNewsSlider(newsItems);
        });

        // H. Live Announcement Popup
        db.ref('ideal_popup').on('value', snap => {
            let popupText = snap.val();
            if (popupText && !sessionStorage.getItem('popup_shown')) {
                let noticeModal = document.getElementById('noticeModal');
                if (noticeModal) { 
                    noticeModal.querySelector('h2').innerText = "Important Announcement"; 
                    document.getElementById('noticeModalText').innerText = popupText; 
                    noticeModal.style.display = 'flex'; 
                    sessionStorage.setItem('popup_shown', 'true'); 
                }
            }
        });

        // I. Live Toppers List
        db.ref('ideal_toppers').on('value', (snapshot) => {
            let toppers = []; snapshot.forEach(child => { toppers.push(child.val()); });
            let toppersContainer = document.getElementById('toppersContainer');
            if (toppersContainer) {
                if (toppers.length > 0) {
                    let html = '';
                    toppers.forEach((t, index) => {
                        let rankClass = index === 0 ? 'rank-1' : (index === 1 ? 'rank-2' : (index === 2 ? 'rank-3' : 'rank-1'));
                        let rankText = index === 0 ? '1ST RANK' : (index === 1 ? '2ND RANK' : (index === 2 ? '3RD RANK' : 'TOPPER'));
                        html += `<div class="topper-card"><div class="topper-rank ${rankClass}"><i class="fas fa-medal"></i> ${rankText}</div><img src="${t.photo}" class="topper-photo" alt="Topper"><h3 style="color: #0f172a; margin: 0; font-size: 1.2rem;">${t.name}</h3><p style="color: #64748b; margin: 5px 0; font-size: 0.9rem;">${t.cls}</p><div class="topper-score">${t.score}</div></div>`;
                    }); toppersContainer.innerHTML = html;
                } else { toppersContainer.innerHTML = '<p style="text-align:center; color:#64748b; width: 100%; grid-column: 1 / -1; margin-top:20px;">Results are being compiled. Toppers will be announced soon!</p>'; }
            }
        });

        // J. Live Student Reviews (Home Page Carousel)
        db.ref('ideal_reviews_approved').on('value', (snap) => {
            let reviews = [];
            snap.forEach(child => { reviews.push({ key: child.key, ...child.val() }); });
            renderReviews(reviews);
        });
    } else {
        const galleryContainer = document.getElementById('dynamicGalleryContainer');
        if (galleryContainer) galleryContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">Gallery photos will load when online.</p>';
        const campusContainer = document.getElementById('campusGalleryContainer');
        if (campusContainer) campusContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">Gallery photos will load when online.</p>';
        const galleryPageContainer = document.getElementById('galleryPageContainer');
        if (galleryPageContainer) galleryPageContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">Gallery photos will load when online.</p>';
        const sportsContainer = document.getElementById('sportsGalleryContainer');
        if (sportsContainer) sportsContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">Gallery photos will load when online.</p>';
        const libraryContainer = document.getElementById('libraryGalleryContainer');
        if (libraryContainer) libraryContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">Gallery photos will load when online.</p>';
        const transportContainer = document.getElementById('transportGalleryContainer');
        if (transportContainer) transportContainer.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">Gallery photos will load when online.</p>';
        
        ['overviewGalleryContainer', 'principalGalleryContainer', 'directorGalleryContainer', 'missionGalleryContainer'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">Gallery photos will load when online.</p>';
        });

        const libContainer = document.getElementById('userLibraryContainer');
        if (libContainer) libContainer.innerHTML = '<p style="text-align:center; color:#64748b;">Digital resources will load when online.</p>';
        const noticeContainer = document.getElementById('userNoticeContainer');
        if (noticeContainer) noticeContainer.innerHTML = '<p style="text-align:center; color:#64748b;">Notice board will load when online.</p>';
        const toppersContainer = document.getElementById('toppersContainer');
        if (toppersContainer) toppersContainer.innerHTML = '<p style="text-align:center; color:#64748b; width: 100%; grid-column: 1 / -1; margin-top:20px;">Toppers will load when online.</p>';
    }

    // J. Scrolling news updater
    function updateMarquee(notices = []) {
        if (!db) {
            let marqueeText = document.getElementById('mainMarquee');
            if (marqueeText) marqueeText.innerText = "⭐ Welcome to Ideal Public School | Admissions Open for Session 2026-27!";
            return;
        }
        db.ref('ideal_scrolling').once('value', snap => {
            let scrollingNews = snap.val(); 
            let marqueeText = document.getElementById('mainMarquee'); 
            let marqueeString = "";
            if (scrollingNews) marqueeString += `🚨 ${scrollingNews} | `;
            if (notices.length > 0) { marqueeString += notices.map(n => `⭐ ${n.title}`).join(' | '); }
            if (marqueeString && marqueeText) { marqueeText.innerText = marqueeString; }
        });
    }

    // K. Global Gallery image click popup viewer
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.gallery-item')) {
            const viewerModal = document.getElementById('imageViewerModal');
            if (viewerModal) {
                const fullSizeImage = document.getElementById('fullSizeImage');
                const imageCaption = document.getElementById('imageCaption');
                if (fullSizeImage) fullSizeImage.src = e.target.src;
                
                let captionText = '';
                const overlay = e.target.closest('.gallery-item').querySelector('.overlay');
                if (overlay) {
                    const h4 = overlay.querySelector('h4');
                    if (h4) captionText = h4.innerText;
                } else {
                    const nextP = e.target.nextElementSibling;
                    if (nextP && nextP.tagName === 'P') {
                        captionText = nextP.innerText;
                    } else {
                        captionText = e.target.alt || 'Gallery Image';
                    }
                }
                
                if (imageCaption) imageCaption.innerText = captionText;
                viewerModal.style.display = 'flex';
            }
        }
    });

    // L. Form Submissions Event Listeners
    const complaintForm = document.getElementById('complaintForm');
    if(complaintForm) {
        complaintForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let name = document.getElementById('compName').value.trim(); 
            let type = document.getElementById('compType').value;
            let subject = document.getElementById('compSubject').value.trim(); 
            let msg = document.getElementById('compMessage').value.trim();
            let date = new Date().toLocaleDateString('en-GB'); 

            let submitBtn = this.querySelector('button[type="submit"]');
            let originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = "Sending... <i class='fas fa-spinner fa-spin'></i>"; 
            submitBtn.disabled = true;
            
            if (!db) {
                let formBody = new URLSearchParams();
                formBody.append("date", date); 
                formBody.append("name", name); 
                formBody.append("type", type); 
                formBody.append("subject", subject); 
                formBody.append("message", msg);
                fetch(COMPLAINT_SHEET_URL, { 
                    method: 'POST', 
                    body: formBody,
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(() => {
                    showToast("Complaint Submitted To Admin! ✅"); 
                    this.reset();
                }).catch(err => {
                    showToast("Submission failed. Please check network.", true);
                }).finally(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
                return;
            }

            // Push to Firebase for Admin dashboard
            db.ref('ideal_complaints').push({ 
                subject: `[${type}] ${subject} - by ${name}`, 
                message: msg, 
                timestamp: Date.now() 
            }).then(() => {
                // Post to Google Sheet URL for sheet storage
                let formBody = new URLSearchParams();
                formBody.append("date", date); 
                formBody.append("name", name); 
                formBody.append("type", type); 
                formBody.append("subject", subject); 
                formBody.append("message", msg);
                return fetch(COMPLAINT_SHEET_URL, { 
                    method: 'POST', 
                    body: formBody,
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
            }).then(() => {
                showToast("Complaint Submitted To Admin! ✅"); 
                this.reset();
            }).catch(err => {
                console.error("Complaint error:", err);
                showToast("Submission failed. Please check network.", true);
            }).finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Contact Form Spree Submit
    const contactForm = document.getElementById('contactUsForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            let inputs = this.querySelectorAll('input, textarea');
            let submitBtn = this.querySelector('button[type="submit"]');
            let originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = "Sending... <i class='fas fa-spinner fa-spin'></i>"; 
            submitBtn.disabled = true;

            try {
                let response = await fetch("https://formspree.io/f/xyknplbb", {
                    method: "POST",
                    headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({ name: inputs[0].value.trim(), email: inputs[1].value.trim(), message: inputs[2].value.trim() })
                });
                if (response.ok) {
                    showToast("Message Sent Successfully! ✅");
                    this.reset();
                } else {
                    showToast("Error sending message. Try again!", true);
                }
            } catch (error) {
                showToast("Network Error!", true);
            } finally {
                submitBtn.innerHTML = originalBtnText; 
                submitBtn.disabled = false;
            }
        });
    }

    // Admission Form submit (Sheet sync + Firebase storage)
    const admissionForm = document.getElementById('admissionForm');
    if (admissionForm) {
        admissionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let mobile = document.getElementById('admMobile').value.trim();
            if(mobile.length !== 10) return showToast("Mobile number must be exactly 10 digits!", true);
            
            const submitBtn = document.getElementById('admSubmitBtn') || this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Submitting Application... ⏳";
            submitBtn.disabled = true;

            const dobVal = document.getElementById('admDob').value;
            let calculatedAge = '';
            if (dobVal) {
                const birthDate = new Date(dobVal);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                calculatedAge = age;
            }

            let formBody = new URLSearchParams();
            formBody.append("date", new Date().toLocaleDateString('en-GB'));
            formBody.append("name", document.getElementById('admName').value.trim());
            formBody.append("mobile", mobile);
            formBody.append("email", document.getElementById('admEmail').value.trim());
            formBody.append("class", document.getElementById('admClass').value);
            formBody.append("age", calculatedAge);
            formBody.append("dob", dobVal);
            formBody.append("gender", document.getElementById('admGender').value);
            formBody.append("address", document.getElementById('admAddress').value.trim());

            if (!db) {
                fetch(ADMISSION_SHEET_URL, { 
                    method: 'POST', 
                    body: formBody,
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(() => {
                    showToast('Application submitted successfully! ✅');
                    this.reset();
                    closeAdmissionForm();
                }).catch(err => {
                    showToast('Cloud connection error. Sync failed.', true);
                }).finally(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                });
                return;
            }

            const admissionData = {
                date: new Date().toLocaleDateString('en-GB'),
                name: document.getElementById('admName').value.trim(),
                mobile: mobile,
                email: document.getElementById('admEmail').value.trim(),
                class: document.getElementById('admClass').value,
                age: calculatedAge,
                dob: dobVal,
                gender: document.getElementById('admGender').value,
                address: document.getElementById('admAddress').value.trim(),
                timestamp: Date.now()
            };

            db.ref('ideal_admissions').push(admissionData)
            .then(() => {
                return fetch(ADMISSION_SHEET_URL, { 
                    method: 'POST', 
                    body: formBody,
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
            })
            .then(() => {
                showToast('Application submitted successfully! ✅');
                this.reset();
                closeAdmissionForm();
            })
            .catch(err => {
                console.error(err);
                showToast('Cloud connection error. Sync failed.', true);
            })
            .finally(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // ID Card Generation Form
    const idGenForm = document.getElementById('idGenForm');
    if (idGenForm) {
        idGenForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('genIdName').value.trim();
            const roll = document.getElementById('genIdRoll').value.trim();
            const cls = document.getElementById('genIdClass').value;
            const dob = document.getElementById('genIdDob').value;
            const photoFile = document.getElementById('genIdPhoto').files[0];

            if(!name || !roll || !cls || !dob || !photoFile) return showToast("Please fill all details!", true);
            
            document.getElementById('idCardName').innerText = name; 
            document.getElementById('idCardRoll').innerText = roll; 
            document.getElementById('idCardClass').innerText = cls;
            
            const dateObj = new Date(dob); 
            document.getElementById('idCardDob').innerText = ("0" + dateObj.getDate()).slice(-2) + "-" + ("0" + (dateObj.getMonth() + 1)).slice(-2) + "-" + dateObj.getFullYear();
            
            const reader = new FileReader(); 
            reader.onload = function(e) { 
                document.getElementById('idCardPhoto').src = e.target.result; 
                document.getElementById('idGenFormBox').style.display = 'none'; 
                document.getElementById('idCardDisplay').style.display = 'block'; 
                showToast("ID Card Generated Successfully! ✅"); 
            }; 
            reader.readAsDataURL(photoFile);
        });
    }

    // M. Intersection Observer for Scroll Counter Animations
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false; 

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const speed = 100; 
            
            const updateCount = () => {
                const currentCount = +counter.innerText;
                const increment = target / speed;

                if (currentCount < target) {
                    counter.innerText = Math.ceil(currentCount + increment);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target; 
                }
            };
            updateCount();
        });
    };

    // Stats Bar Count Up Animation for School Pages
    const animateSchoolCounters = (statsBarEl) => {
        if (statsBarEl.classList.contains('counted')) return;
        statsBarEl.classList.add('counted');
        
        const schoolCounters = statsBarEl.querySelectorAll('[data-count]');
        schoolCounters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000; // 2 seconds
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.innerText = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.innerText = Math.floor(current) + suffix;
                }
            }, stepTime);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('dashboard') && !hasAnimated) {
                    animateCounters();
                    hasAnimated = true; 
                }
                if (entry.target.classList.contains('stats-bar') || entry.target.classList.contains('director-stats')) {
                    animateSchoolCounters(entry.target);
                }
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right, .zoom-in, .dashboard, .reveal, .stagger, .stats-bar, .director-stats').forEach(el => {
        if (el.id !== 'faculty') {
            observer.observe(el);
        }
    });

    // Initialize premium faculty carousel and scroll animations
    initFacultySlider();
    initFacultyScrollAnimations();

    // Mobile navigation hamburger toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const navCloseBtn = document.getElementById('navCloseBtn');
    
    if (navToggle && navMenu) {
        // Open the drawer menu
        const openMenu = () => {
            navToggle.classList.add('active');
            navMenu.classList.add('active');
            if (navOverlay) navOverlay.classList.add('active');
            // Lock body scroll so the page behind doesn't move
            document.body.style.overflow = 'hidden';
            // Reset drawer scroll to top so "Home" is always visible
            navMenu.scrollTop = 0;
        };

        // Close the drawer menu
        const closeMenu = () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            if (navOverlay) navOverlay.classList.remove('active');
            // Restore body scroll
            document.body.style.overflow = '';
        };

        // Toggle on hamburger click
        navToggle.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close on overlay click (clicking outside the drawer)
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMenu);
        }

        // Close on dedicated ✕ close button click
        if (navCloseBtn) {
            navCloseBtn.addEventListener('click', closeMenu);
        }
        
        // Close menu when clicking on any navigation link
        // (Exclude the dropdown trigger — it should toggle, not close the drawer)
        navMenu.querySelectorAll('a:not(.nav-dropdown-trigger)').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close mobile drawer when a dropdown sub-item is clicked
        navMenu.querySelectorAll('.nav-dropdown-item').forEach(item => {
            item.addEventListener('click', closeMenu);
        });
    }

    // ============================================================
    // 🔽 ABOUT US DROPDOWN — Desktop hover + Mobile accordion
    // ============================================================
    const aboutDropdown = document.getElementById('aboutDropdown');
    const aboutTrigger  = document.getElementById('aboutTrigger');
    const aboutPanel    = document.getElementById('aboutPanel');

    if (aboutDropdown && aboutTrigger && aboutPanel) {

        const isMobile = () => window.innerWidth <= 1024;

        // ── Helper: open / close ──────────────────────────────
        const openDropdown = () => {
            aboutDropdown.classList.add('open');
            aboutTrigger.setAttribute('aria-expanded', 'true');
        };
        const closeDropdown = () => {
            aboutDropdown.classList.remove('open');
            aboutTrigger.setAttribute('aria-expanded', 'false');
        };
        const toggleDropdown = () => {
            aboutDropdown.classList.contains('open') ? closeDropdown() : openDropdown();
        };

        // ── DESKTOP: hover with small delay so fast mouse-pass doesn't flash ──
        let hoverTimer = null;

        aboutDropdown.addEventListener('mouseenter', () => {
            if (isMobile()) return;
            clearTimeout(hoverTimer);
            openDropdown();
        });

        aboutDropdown.addEventListener('mouseleave', () => {
            if (isMobile()) return;
            hoverTimer = setTimeout(closeDropdown, 120);
        });

        // ── MOBILE / CLICK: toggle accordion on trigger click ──
        aboutTrigger.addEventListener('click', (e) => {
            if (!isMobile()) return; // desktop handled by hover
            e.preventDefault();
            toggleDropdown();
        });

        // ── KEYBOARD NAVIGATION ────────────────────────────────
        // Enter / Space on trigger: open & focus first item
        aboutTrigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown();
                if (aboutDropdown.classList.contains('open')) {
                    const firstItem = aboutPanel.querySelector('.nav-dropdown-item');
                    if (firstItem) setTimeout(() => firstItem.focus(), 50);
                }
            }
            if (e.key === 'Escape') closeDropdown();
        });

        // Arrow keys to navigate between items
        aboutPanel.addEventListener('keydown', (e) => {
            const items = [...aboutPanel.querySelectorAll('.nav-dropdown-item')];
            const focused = document.activeElement;
            const idx = items.indexOf(focused);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = items[idx + 1] || items[0];
                next.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = items[idx - 1] || items[items.length - 1];
                prev.focus();
            } else if (e.key === 'Escape') {
                closeDropdown();
                aboutTrigger.focus();
            } else if (e.key === 'Tab') {
                // Close when tabbing out of the panel
                if (!e.shiftKey && idx === items.length - 1) closeDropdown();
                if (e.shiftKey && idx === 0) closeDropdown();
            }
        });

        // ── Close on outside click ─────────────────────────────
        document.addEventListener('click', (e) => {
            if (!aboutDropdown.contains(e.target)) {
                closeDropdown();
            }
        });

        // ── Close on Escape from anywhere ─────────────────────
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && aboutDropdown.classList.contains('open')) {
                closeDropdown();
                aboutTrigger.focus();
            }
        });
    }
    // ── End About Us Dropdown ──────────────────────────────────────

    // ============================================================
    // 🔽 OUR CAMPUS DROPDOWN — Desktop hover + Mobile accordion
    // ============================================================
    const campusDropdown = document.getElementById('campusDropdown');
    const campusTrigger  = document.getElementById('campusTrigger');
    const campusPanel    = document.getElementById('campusPanel');

    if (campusDropdown && campusTrigger && campusPanel) {

        const isMobile = () => window.innerWidth <= 1024;

        // ── Helper: open / close ──────────────────────────────
        const openCampusDropdown = () => {
            campusDropdown.classList.add('open');
            campusTrigger.setAttribute('aria-expanded', 'true');
        };
        const closeCampusDropdown = () => {
            campusDropdown.classList.remove('open');
            campusTrigger.setAttribute('aria-expanded', 'false');
        };
        const toggleCampusDropdown = () => {
            campusDropdown.classList.contains('open') ? closeCampusDropdown() : openCampusDropdown();
        };

        // ── DESKTOP: hover with small delay so fast mouse-pass doesn't flash ──
        let campusHoverTimer = null;

        campusDropdown.addEventListener('mouseenter', () => {
            if (isMobile()) return;
            clearTimeout(campusHoverTimer);
            openCampusDropdown();
        });

        campusDropdown.addEventListener('mouseleave', () => {
            if (isMobile()) return;
            campusHoverTimer = setTimeout(closeCampusDropdown, 120);
        });

        // ── MOBILE / CLICK: toggle accordion on trigger click ──
        campusTrigger.addEventListener('click', (e) => {
            if (!isMobile()) return; // desktop handled by hover
            e.preventDefault();
            toggleCampusDropdown();
        });

        // ── KEYBOARD NAVIGATION ────────────────────────────────
        // Enter / Space on trigger: open & focus first item
        campusTrigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCampusDropdown();
                if (campusDropdown.classList.contains('open')) {
                    const firstItem = campusPanel.querySelector('.nav-dropdown-item');
                    if (firstItem) setTimeout(() => firstItem.focus(), 50);
                }
            }
            if (e.key === 'Escape') closeCampusDropdown();
        });

        // Arrow keys to navigate between items
        campusPanel.addEventListener('keydown', (e) => {
            const items = [...campusPanel.querySelectorAll('.nav-dropdown-item')];
            const focused = document.activeElement;
            const idx = items.indexOf(focused);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = items[idx + 1] || items[0];
                next.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = items[idx - 1] || items[items.length - 1];
                prev.focus();
            } else if (e.key === 'Escape') {
                closeCampusDropdown();
                campusTrigger.focus();
            } else if (e.key === 'Tab') {
                // Close when tabbing out of the panel
                if (!e.shiftKey && idx === items.length - 1) closeCampusDropdown();
                if (e.shiftKey && idx === 0) closeCampusDropdown();
            }
        });

        // ── Close on outside click ─────────────────────────────
        document.addEventListener('click', (e) => {
            if (!campusDropdown.contains(e.target)) {
                closeCampusDropdown();
            }
        });

        // ── Close on Escape from anywhere ─────────────────────
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && campusDropdown.classList.contains('open')) {
                closeCampusDropdown();
                campusTrigger.focus();
            }
        });
    }
    // ── End Our Campus Dropdown ────────────────────────────────────


    // Scroll hide/show navbar header logic
    let lastScrollY = window.scrollY;
    const headerEl = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (!headerEl) return;
        const currentScrollY = window.scrollY;

        // Keep nav visible at the top of the page
        if (currentScrollY < 100) {
            headerEl.classList.remove('nav-hidden');
            lastScrollY = currentScrollY;
            return;
        }

        // Keep nav visible if the mobile menu is open
        if (navMenu && navMenu.classList.contains('active')) {
            lastScrollY = currentScrollY;
            return;
        }

        if (currentScrollY > lastScrollY) {
            // Scrolling down: hide header
            headerEl.classList.add('nav-hidden');
        } else {
            // Scrolling up: show header
            headerEl.classList.remove('nav-hidden');
        }
        lastScrollY = currentScrollY;
    }, { passive: true });

    // Show quick callback popup after 1.5 seconds on page load
    setTimeout(() => {
        const callbackModal = document.getElementById('callbackModal');
        if (callbackModal) {
            callbackModal.style.display = 'flex';
        }
    }, 1500);

    // Callback Form Submit Handler
    const callbackForm = document.getElementById('callbackForm');
    if (callbackForm) {
        callbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('callName').value.trim();
            const phone = document.getElementById('callPhone').value.trim();
            const email = document.getElementById('callEmail').value.trim();
            const address = document.getElementById('callAddress').value.trim();
            const message = document.getElementById('callMessage').value.trim();

            if (phone.length !== 10) {
                return showToast("Phone number must be exactly 10 digits!", true);
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Requesting... ⏳";
            submitBtn.disabled = true;

            if (!db) {
                showToast("Callback Requested! We will contact you soon. ✅");
                callbackForm.reset();
                closeCallbackModal();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                return;
            }

            const callbackData = {
                name: name,
                phone: phone,
                email: email,
                address: address,
                message: message || "No message",
                date: new Date().toLocaleDateString('en-GB'),
                timestamp: Date.now()
            };

            db.ref('ideal_callbacks').push(callbackData).then(() => {
                showToast("Callback Requested! We will contact you soon. ✅");
                callbackForm.reset();
                closeCallbackModal();
            }).catch(err => {
                console.error("Callback submission error:", err);
                showToast("Submission failed. Please try again.", true);
            }).finally(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // ============================================================
    // 🔽 INTERACTIVE CORRIDOR MAP LOGIC
    // ============================================================
    const mapStopNodes = document.querySelectorAll('.map-stop-node');
    const selectedRouteNum = document.getElementById('selectedRouteNum');
    const selectedRouteName = document.getElementById('selectedRouteName');

    if (mapStopNodes.length > 0 && selectedRouteNum && selectedRouteName) {
        mapStopNodes.forEach(node => {
            const updatePanel = () => {
                if (node.classList.contains('active')) return;
                
                // Remove active class from all nodes
                mapStopNodes.forEach(n => n.classList.remove('active'));
                
                // Add active class to current node
                node.classList.add('active');

                const routeId = node.getAttribute('data-route');
                const stopName = node.getAttribute('data-name');

                // Animate text transition
                selectedRouteName.classList.add('update-animate');
                setTimeout(() => {
                    selectedRouteNum.textContent = routeId;
                    selectedRouteName.textContent = stopName;
                    selectedRouteName.classList.remove('update-animate');
                }, 200);
            };

            // Trigger on click
            node.addEventListener('click', updatePanel);

            // Trigger on hover (desktop only)
            node.addEventListener('mouseenter', () => {
                if (window.innerWidth > 1024) {
                    updatePanel();
                }
            });
        });
    }
});

// Fetch Live Result Search Helper
function findMyResult() {
    let roll = document.getElementById('searchRollNumber').value.trim();
    if(!roll) return showToast("Please enter Roll Number", true);
    if (!db) {
        document.getElementById('singleResultContainer').innerHTML = '<p style="color:#ef4444; font-weight:600; margin-top:15px;">Result lookup is only available when online.</p>';
        return;
    }
    document.getElementById('singleResultContainer').innerHTML = '<p style="color:#3b82f6;">Searching Database... ⏳</p>';
    
    db.ref('ideal_results').once('value', snap => {
        let results = []; snap.forEach(child => { results.push(child.val()); });
        let myRes = results.filter(r => r.roll.toLowerCase() === roll.toLowerCase());
        if(myRes.length > 0) {
            let html = '<table style="width:100%; text-align:left; border-collapse:collapse; margin-top:15px;"><tr><th style="border-bottom:2px solid #e2e8f0; padding:10px;">Exam</th><th style="border-bottom:2px solid #e2e8f0; padding:10px;">Name</th><th style="border-bottom:2px solid #e2e8f0; padding:10px;">Score</th></tr>';
            myRes.forEach(r => { html += `<tr><td style="padding:10px; border-bottom:1px solid #e2e8f0;">${r.exam}</td><td style="padding:10px; border-bottom:1px solid #e2e8f0;">${r.name}</td><td style="padding:10px; border-bottom:1px solid #e2e8f0; color:#10b981; font-weight:bold; font-size:1.1rem;">${r.score}</td></tr>`; });
            document.getElementById('singleResultContainer').innerHTML = html + '</table>';
        } else { document.getElementById('singleResultContainer').innerHTML = '<p style="color:#ef4444; font-weight:600; margin-top:15px;">No result found.</p>'; }
    });
}

// 🌟 6. DARK MODE SELECTION THEME 🌟
const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn) {
    const themeIcon = themeToggleBtn.querySelector('i');
    if (localStorage.getItem('ideal_theme') === 'dark') { 
        document.body.classList.add('dark-mode'); 
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun'); 
    }
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) { 
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun'); 
            localStorage.setItem('ideal_theme', 'dark'); 
        } else { 
            if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon'); 
            localStorage.setItem('ideal_theme', 'light'); 
        }
    });
}

// 🌟 7. HOMEPAGE SLIDER ENGINE 🌟
let sliderCurrent = 0;
let sliderTotal = 0;
let sliderAutoTimer = null;
let sliderBanners = [];

function initSlider(banners) {
    const track = document.getElementById('sliderTrack');
    const dotsEl = document.getElementById('sliderDots');
    if (!track) return;

    if (!banners || banners.length === 0) {
        banners = [
            {
                image: 'slider1.png',
                title: 'Welcome to Ideal Public School',
                subtitle: 'CBSE Affiliated | Chandori, Waraseoni | Affiliation No. 1030815',
                btnText: '✨ Discover Our School',
                btnUrl: '#about'
            },
            {
                image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
                title: 'Admissions Open 2026-27',
                subtitle: 'Nursery to Class XII - Enroll Your Child Today!',
                btnText: '📝 Apply for Admission',
                btnUrl: 'javascript:openAdmissionForm()'
            },
            {
                image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1600&q=80',
                title: 'Excellence in Education',
                subtitle: 'Smart Classrooms · Experienced Faculty · Holistic Development',
                btnText: '🏫 Explore Facilities',
                btnUrl: '#activities'
            }
        ];
    }

    sliderBanners = banners;
    sliderTotal = banners.length;
    sliderCurrent = 0;

    let slidesHtml = '';
    banners.forEach((b, i) => {
        let btnHtml = (b.btnText && b.btnUrl) ? `<a href="${b.btnUrl}" class="slide-btn">${b.btnText}</a>` : '';
        let titleHtml = b.title ? `<h2>${b.title}</h2>` : '';
        let subtitleHtml = b.subtitle ? `<p>${b.subtitle}</p>` : '';
        slidesHtml += `<div class="slide-item${i===0?' active':''}" id="slide-${i}">
            <img src="${b.image}" alt="Banner ${i+1}" loading="${i===0?'eager':'lazy'}">
            <div class="slide-overlay">${titleHtml}${subtitleHtml}${btnHtml}</div>
        </div>`;
    });
    track.innerHTML = slidesHtml;

    let dotsHtml = '';
    banners.forEach((_, i) => {
        dotsHtml += `<button class="slider-dot${i===0?' active':''}" onclick="goToSlide(${i})" aria-label="Go to slide ${i+1}"></button>`;
    });
    dotsEl.innerHTML = dotsHtml;

    document.getElementById('sliderPrev').style.display = sliderTotal > 1 ? 'flex' : 'none';
    document.getElementById('sliderNext').style.display = sliderTotal > 1 ? 'flex' : 'none';

    goToSlide(0, true);
    if (sliderTotal > 1) startSliderAuto();
}

function goToSlide(index, skipReset) {
    const track = document.getElementById('sliderTrack');
    if (!track) return;
    const oldActive = track.querySelector('.slide-item.active');
    if (oldActive) oldActive.classList.remove('active');
    const oldDot = document.querySelector('.slider-dot.active');
    if (oldDot) oldDot.classList.remove('active');

    sliderCurrent = ((index % sliderTotal) + sliderTotal) % sliderTotal;
    track.style.transform = `translateX(-${sliderCurrent * 100}%)`;

    const newSlide = document.getElementById('slide-' + sliderCurrent);
    if (newSlide) newSlide.classList.add('active');
    const dots = document.querySelectorAll('.slider-dot');
    if (dots[sliderCurrent]) dots[sliderCurrent].classList.add('active');

    if (!skipReset) restartProgress();
}

function sliderNext() {
    goToSlide(sliderCurrent + 1);
    resetSliderAuto();
}

function sliderPrev() {
    goToSlide(sliderCurrent - 1);
    resetSliderAuto();
}

function startSliderAuto() {
    clearInterval(sliderAutoTimer);
    sliderAutoTimer = setInterval(() => { goToSlide(sliderCurrent + 1); }, 3000);
    restartProgress();
}

function resetSliderAuto() {
    clearInterval(sliderAutoTimer);
    startSliderAuto();
}

function restartProgress() {
    const bar = document.getElementById('sliderProgress');
    if (!bar) return;
    bar.classList.remove('running');
    void bar.offsetWidth; // Reflow
    bar.classList.add('running');
}

// 🌟 8. PLACEMENT SPOTLIGHT CAROUSEL ENGINE 🌟
let pcCurrent  = 0;
let pcData     = [];
let pcAutoTimer = null;
let pcCardEls  = []; 

const PC_SLOTS = {
    '-2': { tx: -360, scale: 0.65, opacity: 0.35, rotY:  25, z: 1, shadow: 'none', blur: 6 },
    '-1': { tx: -200, scale: 0.82, opacity: 0.70, rotY:  15, z: 3, shadow: '0 15px 35px rgba(0,0,0,0.15)', blur: 3 },
     '0': { tx:    0, scale: 1.00, opacity: 1.00, rotY:   0, z: 5, shadow: '0 25px 60px rgba(0,0,0,0.35)', blur: 0 },
     '1': { tx:  200, scale: 0.82, opacity: 0.70, rotY: -15, z: 3, shadow: '0 15px 35px rgba(0,0,0,0.15)', blur: 3 },
     '2': { tx:  360, scale: 0.65, opacity: 0.35, rotY: -25, z: 1, shadow: 'none', blur: 6 },
};

function initPlacementCarousel(achievers) {
    const carousel = document.getElementById('placementCarousel');
    if (!carousel) return;
    clearInterval(pcAutoTimer);

    const show = achievers.length > 1;
    document.getElementById('pcPrev').style.display = show ? 'flex' : 'none';
    document.getElementById('pcNext').style.display = show ? 'flex' : 'none';

    if (!achievers || achievers.length === 0) {
        carousel.innerHTML = '<div class="placement-empty"><i class="fas fa-user-tie" style="font-size:3rem;display:block;margin-bottom:12px;"></i>Placement achievers will appear here.<br><small>Add them from the Admin Panel.</small></div>';
        buildPcDots(0);
        return;
    }

    pcData    = achievers;
    pcCurrent = 0;
    pcCardEls = [];

    carousel.innerHTML = '';
    pcData.forEach((d, i) => {
        const el = createPCard(d, i);
        carousel.appendChild(el);
        pcCardEls.push(el);
    });

    buildPcDots(pcData.length);
    applySlots(false);   

    if (pcData.length > 1) {
        pcAutoTimer = setInterval(() => pcSlide(1), 2500);
    }
}

function createPCard(d, idx) {
    const el = document.createElement('div');
    el.className = 'p-card';
    el.dataset.slot = '99'; 
    const imgHtml = d.photo
        ? `<img src="${d.photo}" alt="${d.name}">`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1e293b;"><i class="fas fa-user" style="font-size:5rem;color:rgba(255,255,255,0.2);"></i></div>`;
    el.innerHTML = `
        <div class="card-bg-logo"><img src="logo.jpeg" alt="Logo"></div>
        <div class="p-img-wrap">${imgHtml}</div>
        <div class="p-info">
            <p class="p-name">${d.name || 'Achiever'}</p>
            <p class="p-company">${d.company || ''}</p>
        </div>`;
    el.addEventListener('click', () => { if (el.dataset.slot !== '0') pcGoTo(idx); });
    return el;
}

function applySlots(animated) {
    const total = pcData.length;
    pcCardEls.forEach((el, i) => {
        let offset = i - pcCurrent;
        if (offset >  total / 2) offset -= total;
        if (offset < -total / 2) offset += total;

        el.dataset.slot = offset.toString();
        const abs = Math.abs(offset);

        if (!animated) {
            el.style.transition = 'none';
        } else {
            el.style.transition =
                'transform 0.68s cubic-bezier(0.25, 0.8, 0.25, 1), ' +
                'opacity   0.68s ease, ' +
                'filter    0.68s ease, ' +
                'box-shadow 0.68s ease';
        }

        if (abs > 2) {
            el.style.opacity = '0';
            el.style.zIndex  = '0';
            el.style.transform = `translate(-50%, -50%) translateX(${offset > 0 ? 600 : -600}px) scale(0.5)`;
            el.style.boxShadow = 'none';
            el.style.filter = 'blur(10px)';
            el.style.pointerEvents = 'none';
        } else {
            const s = PC_SLOTS[offset.toString()];
            el.style.opacity    = s.opacity;
            el.style.zIndex     = s.z;
            el.style.boxShadow  = s.shadow;
            el.style.transform  = `translate(calc(-50% + ${s.tx}px), -50%) scale(${s.scale}) rotateY(${s.rotY}deg)`;
            el.style.filter     = s.blur > 0 ? `blur(${s.blur}px)` : 'none';
            el.style.pointerEvents = offset === 0 ? 'auto' : 'auto';
        }
    });

    if (!animated) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                pcCardEls.forEach(el => { el.style.transition = ''; });
            });
        });
    }
    updatePcDots(pcCurrent);
}

function pcSlide(dir) {
    if (pcData.length < 2) return;
    pcCurrent = ((pcCurrent + dir) % pcData.length + pcData.length) % pcData.length;
    applySlots(true);
}

function pcGoTo(index) {
    if (index === pcCurrent) return;
    pcCurrent = index;
    applySlots(true);
    clearInterval(pcAutoTimer);
    if (pcData.length > 1) pcAutoTimer = setInterval(() => pcSlide(1), 2500);
}

function pcNext() {
    pcSlide(1);
    clearInterval(pcAutoTimer);
    if (pcData.length > 1) pcAutoTimer = setInterval(() => pcSlide(1), 2500);
}

function pcPrev() {
    pcSlide(-1);
    clearInterval(pcAutoTimer);
    if (pcData.length > 1) pcAutoTimer = setInterval(() => pcSlide(1), 2500);
}

function buildPcDots(count) {
    const el = document.getElementById('pcDots');
    if (!el) return;
    if (count <= 1) { el.innerHTML = ''; return; }
    el.innerHTML = Array.from({ length: count }, (_, i) =>
        `<button class="pc-dot${i === 0 ? ' active' : ''}" onclick="pcGoTo(${i})" aria-label="Slide ${i+1}"></button>`
    ).join('');
}

function updatePcDots(index) {
    document.querySelectorAll('.pc-dot').forEach((d, i) =>
        d.classList.toggle('active', i === index)
    );
}

// 🌟 9. NEWS & EVENTS SLIDER ENGINE 🌟
let newsCurrent = 0;
let newsTotal = 0;
let newsData = [];
let newsCardsToShow = 3; 
let newsAutoTimer = null;

function initNewsSlider(newsItems) {
    const track = document.getElementById('newsSliderTrack');
    const dotsEl = document.getElementById('newsDots');
    if (!track) return;
    
    clearInterval(newsAutoTimer);

    if (!newsItems || newsItems.length === 0) {
        track.innerHTML = '<p style="text-align:center; width:100%; color:#64748b; padding:40px 0; font-style:italic;">No news or events available right now.</p>';
        if (dotsEl) dotsEl.innerHTML = '';
        const prevBtn = document.getElementById('newsPrev');
        const nextBtn = document.getElementById('newsNext');
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    newsData = newsItems;
    newsTotal = newsItems.length;
    newsCurrent = 0;

    let html = '';
    newsItems.forEach(n => {
        const tagClass = n.tag ? `tag-${n.tag.toLowerCase()}` : 'tag-news';
        const imgHtml = n.photo 
            ? `<img src="${n.photo}" alt="${n.title}">` 
            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f1f5f9;"><i class="far fa-image" style="font-size:3rem;color:#cbd5e1;"></i></div>`;
        
        html += `
            <div class="news-card-wrapper">
                <div class="news-card">
                    <div class="news-img-wrap">
                        <span class="news-card-tag ${tagClass}">${n.tag || 'NEWS'}</span>
                        ${imgHtml}
                    </div>
                    <div class="news-body">
                        <span class="news-cat">${n.category || 'IPS HIGHLIGHT'}</span>
                        <h3 class="news-card-title">${n.title}</h3>
                        <div class="news-footer">
                            <span><i class="far fa-user"></i> by admin</span>
                            <span><i class="far fa-calendar-alt"></i> ${n.date || 'Recent'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    track.innerHTML = html;

    updateNewsCardsToShow();
    buildNewsDots();
    updateNewsSlider();
    
    if (newsTotal > newsCardsToShow) {
        startNewsAuto();
    }
}

function updateNewsCardsToShow() {
    const w = window.innerWidth;
    if (w <= 768) newsCardsToShow = 1;
    else if (w <= 1024) newsCardsToShow = 2;
    else newsCardsToShow = 3;
}

function buildNewsDots() {
    const el = document.getElementById('newsDots');
    if (!el) return;
    const dotsCount = Math.max(0, newsTotal - newsCardsToShow + 1);
    if (dotsCount <= 1) { el.innerHTML = ''; return; }
    
    let html = '';
    for (let i = 0; i < dotsCount; i++) {
        html += `<button class="news-dot${i === 0 ? ' active' : ''}" onclick="goToNews(${i})" aria-label="Go to slide ${i+1}"></button>`;
    }
    el.innerHTML = html;
}

function updateNewsSlider() {
    const track = document.getElementById('newsSliderTrack');
    if (!track) return;
    
    const maxIndex = Math.max(0, newsTotal - newsCardsToShow);
    if (newsCurrent > maxIndex) newsCurrent = maxIndex;
    if (newsCurrent < 0) newsCurrent = 0;

    const cardWidth = 100 / newsCardsToShow;
    track.style.transform = `translateX(-${newsCurrent * cardWidth}%)`;

    const prevBtn = document.getElementById('newsPrev');
    const nextBtn = document.getElementById('newsNext');
    if (prevBtn) {
        prevBtn.style.display = newsTotal > newsCardsToShow ? 'flex' : 'none';
        prevBtn.disabled = newsCurrent === 0;
    }
    if (nextBtn) {
        nextBtn.style.display = newsTotal > newsCardsToShow ? 'flex' : 'none';
        nextBtn.disabled = newsCurrent >= maxIndex;
    }

    document.querySelectorAll('.news-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === newsCurrent);
    });
}

function newsNext() {
    if (newsCurrent < newsTotal - newsCardsToShow) {
        newsCurrent++;
        updateNewsSlider();
        resetNewsAuto();
    }
}

function newsPrev() {
    if (newsCurrent > 0) {
        newsCurrent--;
        updateNewsSlider();
        resetNewsAuto();
    }
}

function goToNews(index) {
    newsCurrent = index;
    updateNewsSlider();
    resetNewsAuto();
}

function startNewsAuto() {
    newsAutoTimer = setInterval(() => {
        const maxIndex = Math.max(0, newsTotal - newsCardsToShow);
        if (newsCurrent >= maxIndex) {
            newsCurrent = 0;
        } else {
            newsCurrent++;
        }
        updateNewsSlider();
    }, 3000);
}

function resetNewsAuto() {
    clearInterval(newsAutoTimer);
    if (newsTotal > newsCardsToShow) {
        startNewsAuto();
    }
}

window.addEventListener('resize', () => {
    const oldLimit = newsCardsToShow;
    updateNewsCardsToShow();
    if (oldLimit !== newsCardsToShow) {
        buildNewsDots();
        updateNewsSlider();
    }
});

// ==============================================================
// 🌟 10. PREMIUM FACULTY CAROUSEL ENGINE 🌟
// ==============================================================
function handleFacultyImageError(img) {
    img.onerror = null; // Prevent infinite loop
    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e1" width="100%25" height="100%25"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67-0.2-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
    img.style.padding = '40px';
    img.style.opacity = '0.7';
}

function initFacultySlider() {
    const track = document.getElementById('facultySliderTrack');
    const prevBtn = document.getElementById('facultyPrevBtn');
    const nextBtn = document.getElementById('facultyNextBtn');
    const dotsContainer = document.getElementById('facultySliderDots');
    const viewport = document.getElementById('facultySliderViewport');

    if (!track || !prevBtn || !nextBtn || !dotsContainer || !viewport) return;

    const originalSlides = Array.from(track.querySelectorAll('.faculty-slide'));
    const originalCount = originalSlides.length;
    if (originalCount === 0) return;

    // Clear track and build dynamic 3x cloned set for seamless infinite loop
    track.innerHTML = '';
    
    // We clone 3 sets: Set 1 (Prepended Clones), Set 2 (Originals), Set 3 (Appended Clones)
    const clonedSet1 = originalSlides.map(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add('faculty-clone-prepended');
        return clone;
    });
    
    const clonedSet3 = originalSlides.map(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add('faculty-clone-appended');
        return clone;
    });

    // Append all sets to the track
    clonedSet1.forEach(slide => track.appendChild(slide));
    originalSlides.forEach(slide => track.appendChild(slide));
    clonedSet3.forEach(slide => track.appendChild(slide));

    let currentIndex = originalCount; // Start at the first original slide (index 6)
    let isTransitioning = false;
    let autoplayTimer = null;
    let visibleCards = 4;

    // Get current visible cards count from CSS variable
    function getVisibleCards() {
        const style = window.getComputedStyle(document.documentElement);
        return parseInt(style.getPropertyValue('--faculty-visible-cards').trim()) || 4;
    }

    visibleCards = getVisibleCards();

    // Setup Dots Pagination (matching originalCount)
    function buildDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < originalCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'faculty-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to faculty slide ${i + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(originalCount + i);
            });
            dotsContainer.appendChild(dot);
        }
    }

    buildDots();

    function updateDots() {
        const activeIdx = ((currentIndex - originalCount) % originalCount + originalCount) % originalCount;
        const dots = dotsContainer.querySelectorAll('.faculty-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIdx);
        });
    }

    // Translate Track Position in pixels (perfect resize behavior)
    function updatePosition(animated = true) {
        if (!animated) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        }
        
        const slides = track.querySelectorAll('.faculty-slide');
        if (slides[currentIndex]) {
            const slideWidth = slides[currentIndex].offsetWidth;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }
    }

    function goToSlide(index, animated = true) {
        if (isTransitioning && animated) return;
        if (animated) isTransitioning = true;
        
        currentIndex = index;
        updatePosition(animated);
        updateDots();
    }

    function slideNext() {
        goToSlide(currentIndex + 1);
        resetAutoplay();
    }

    function slidePrev() {
        goToSlide(currentIndex - 1);
        resetAutoplay();
    }

    prevBtn.addEventListener('click', slidePrev);
    nextBtn.addEventListener('click', slideNext);

    // Transition end handler to perform seamless wrap-around jump
    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        
        // Wrap around check
        if (currentIndex >= originalCount * 2) {
            // Jump back to middle original set
            currentIndex -= originalCount;
            updatePosition(false);
        } else if (currentIndex < originalCount) {
            // Jump forward to middle original set
            currentIndex += originalCount;
            updatePosition(false);
        }
    });

    // Autoplay logic
    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(slideNext, 4500); // 4.5 seconds interval
    }

    // Stop autoplay
    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function resetAutoplay() {
        startAutoplay();
    }

    // Hover listeners to pause/resume autoplay
    const container = document.querySelector('.faculty-slider-container');
    if (container) {
        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);
    }

    // Touch swipe support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50; // pixels
        if (touchStartX - touchEndX > swipeThreshold) {
            slideNext(); // Swiped left, show next
        } else if (touchEndX - touchStartX > swipeThreshold) {
            slidePrev(); // Swiped right, show prev
        }
    }

    // Handle Window Resize
    window.addEventListener('resize', () => {
        visibleCards = getVisibleCards();
        updatePosition(false);
    });

    // Initial position trigger
    setTimeout(() => {
        updatePosition(false);
        startAutoplay();
    }, 100);
}

// Intersection Observer for scroll stagger animation on Faculty section
function initFacultyScrollAnimations() {
    const facultySec = document.getElementById('faculty');
    if (!facultySec) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Fade in header
                const header = entry.target.querySelector('.faculty-header');
                if (header) header.classList.add('visible');

                // Stagger animate cards
                const cards = entry.target.querySelectorAll('.faculty-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 100); // 100ms stagger delay
                });

                // Unobserve since we only want to animate once
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    observer.observe(facultySec);
}


// Function to play showcase video in the portrait card on the homepage
function playShowcaseVideo(element) {
    const container = document.getElementById('videoPlayerContainer');
    if (!container) return;
    
    // If already playing, do nothing on wrapper click
    if (container.style.display === 'block') return;
    
    // Read the video URL from data attribute (local file or external URL)
    const videoUrl = (element && element.getAttribute('data-video-url')) || "school_video.mp4";
    
    // Hide the thumbnail video and overlay
    const thumbVideo = document.getElementById('videoThumbPreview');
    if (thumbVideo) thumbVideo.style.visibility = 'hidden';
    const overlay = document.getElementById('videoPlayOverlay');
    if (overlay) overlay.style.display = 'none';
    
    // Insert full video player and Close (X) button
    container.innerHTML = `
        <video src="${videoUrl}" controls autoplay playsinline 
            style="width:100%; height:100%; object-fit:cover; display:block; border-radius:inherit;"
            onended="resetVideoCard()">
        </video>
        <button onclick="event.stopPropagation(); resetVideoCard();" 
            class="close-video-btn"
            style="position:absolute; top:15px; right:15px; background:rgba(15,23,42,0.85); color:white; border:none; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:12; transition:all 0.2s; font-size:16px;" 
            onmouseover="this.style.background='rgba(239,68,68,1)'" 
            onmouseout="this.style.background='rgba(15,23,42,0.85)'"
            title="Close Video">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Make container visible and cover the card
    container.style.cssText = 'display:block; position:absolute; inset:0; z-index:10; border-radius:inherit;';
}

// Reset video card back to thumbnail state
function resetVideoCard() {
    const container = document.getElementById('videoPlayerContainer');
    if (container) { container.innerHTML = ''; container.style.display = 'none'; }
    const thumbVideo = document.getElementById('videoThumbPreview');
    if (thumbVideo) thumbVideo.style.visibility = 'visible';
    const overlay = document.getElementById('videoPlayOverlay');
    if (overlay) overlay.style.display = '';
}


// ============================================================
// 🏫 SCHOOL WEBSITE PAGES NAVIGATION & DROPDOWNS (MOBILE)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Hamburger Menu Toggle
    const schoolHamburger = document.getElementById('navHamburger');
    const schoolNavLinks = document.getElementById('navLinks');
    
    if (schoolHamburger && schoolNavLinks) {
        schoolHamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = schoolNavLinks.classList.contains('open');
            schoolHamburger.classList.toggle('active', !isOpen);
            schoolNavLinks.classList.toggle('open', !isOpen);
            schoolHamburger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        });
    }

    // 2. Mobile Accordion Dropdown Toggles
    const dropdownTriggers = document.querySelectorAll('.nav-dropdown-trigger-btn');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            // Only act on mobile (when window width <= 768px)
            if (window.innerWidth > 768) return;
            
            e.preventDefault();
            e.stopPropagation();
            const parentDropdown = trigger.closest('.nav-dropdown');
            if (parentDropdown) {
                const isOpen = parentDropdown.classList.contains('open');
                
                // Close other open dropdowns first
                document.querySelectorAll('.nav-dropdown').forEach(dd => {
                    if (dd !== parentDropdown) {
                        dd.classList.remove('open');
                        const btn = dd.querySelector('.nav-dropdown-trigger-btn');
                        if (btn) btn.setAttribute('aria-expanded', 'false');
                    }
                });

                parentDropdown.classList.toggle('open', !isOpen);
                trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
            }
        });
    });

    // 3. Click outside to close dropdowns / menu
    document.addEventListener('click', (e) => {
        // If clicking inside a dropdown, do not close it immediately (let navigation happen)
        if (e.target.closest('.nav-dropdown')) return;

        // If clicking the hamburger or nav links container, do not close here
        if (schoolHamburger && schoolHamburger.contains(e.target)) return;
        if (schoolNavLinks && schoolNavLinks.contains(e.target)) return;

        if (schoolNavLinks && schoolNavLinks.classList.contains('open')) {
            schoolHamburger.classList.remove('active');
            schoolNavLinks.classList.remove('open');
            schoolHamburger.setAttribute('aria-expanded', 'false');
        }
        document.querySelectorAll('.nav-dropdown').forEach(dd => {
            dd.classList.remove('open');
            const btn = dd.querySelector('.nav-dropdown-trigger-btn');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    });

    // 4. Helpdesk Modal Toggle
    const openHelpdeskBtn = document.getElementById('openHelpdeskBtn');
    const closeHelpdeskBtn = document.getElementById('closeHelpdeskBtn');
    const helpdeskModal = document.getElementById('helpdeskModal');
    const helpdeskOverlay = document.getElementById('helpdeskModalOverlay');

    if (helpdeskModal) {
        if (openHelpdeskBtn) {
            openHelpdeskBtn.addEventListener('click', () => {
                helpdeskModal.classList.add('active');
            });
        }
        if (closeHelpdeskBtn) {
            closeHelpdeskBtn.addEventListener('click', () => {
                helpdeskModal.classList.remove('active');
            });
        }
        if (helpdeskOverlay) {
            helpdeskOverlay.addEventListener('click', () => {
                helpdeskModal.classList.remove('active');
            });
        }
    }

    // 5. Transport Map Interactivity
    const mapNodes = document.querySelectorAll('.map-stop-node');
    const selectedRouteNum = document.getElementById('selectedRouteNum');
    const selectedRouteName = document.getElementById('selectedRouteName');

    if (mapNodes.length > 0 && selectedRouteNum && selectedRouteName) {
        mapNodes.forEach(node => {
            const updatePanel = () => {
                // Remove active class from other nodes
                mapNodes.forEach(n => n.classList.remove('active'));
                // Add active class to current node
                node.classList.add('active');

                const route = node.getAttribute('data-route');
                const name = node.getAttribute('data-name');

                // Animate text change
                selectedRouteName.classList.add('update-animate');
                setTimeout(() => {
                    selectedRouteNum.innerText = route;
                    selectedRouteName.innerText = name;
                    selectedRouteName.classList.remove('update-animate');
                }, 200);
            };

            node.addEventListener('mouseenter', updatePanel);
            node.addEventListener('click', updatePanel);
        });
    }

    // 6. Desktop Hover Delay for School Pages
    const schoolDropdowns = document.querySelectorAll('.nav-dropdown');
    schoolDropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.nav-dropdown-trigger-btn');
        const panel = dropdown.querySelector('.nav-dropdown-panel');
        if (!trigger || !panel) return;

        let hoverTimer = null;
        
        dropdown.addEventListener('mouseenter', () => {
            if (window.innerWidth <= 768) return; // mobile handled by accordion click
            clearTimeout(hoverTimer);
            dropdown.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
        });

        dropdown.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 768) return;
            hoverTimer = setTimeout(() => {
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }, 150); // 150ms delay to cross the gap
        });
    });
});


// ============================================================
// 🌟 STUDENT REVIEWS CAROUSEL ENGINE 🌟
// ============================================================
let reviewsOffset = 0;
let reviewsTotal = 0;
let reviewsVisible = 3;
let reviewsAutoTimer = null;

function getReviewsVisible() {
    if (window.innerWidth <= 580) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
}

function renderReviews(reviews) {
    const carousel = document.getElementById('reviewsCarousel');
    if (!carousel) return;

    reviewsTotal = reviews.length;
    reviewsOffset = 0;
    reviewsVisible = getReviewsVisible();

    clearInterval(reviewsAutoTimer);

    if (reviewsTotal === 0) {
        carousel.innerHTML = '<p style="text-align: center; width: 100%; color: #64748b; padding: 40px 0;">No student reviews yet. Be the first to share your feedback!</p>';
        return;
    }

    let html = '';
    reviews.forEach(r => {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += `<i class="${i <= (r.rating || 5) ? 'fas' : 'far'} fa-star" style="color: #f59e0b; font-size: 0.9rem;"></i>`;
        }
        const initial = (r.name || 'S').charAt(0).toUpperCase();
        html += `
            <div class="review-card">
                <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 15px;">
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${initial}</div>
                    <div>
                        <h4 style="margin: 0; color: #0f172a; font-size: 1rem; font-weight: 700;">${r.name || 'Student'}</h4>
                        <p style="margin: 2px 0 5px; color: #64748b; font-size: 0.8rem;">${r.class || ''}</p>
                        <div>${starsHtml}</div>
                    </div>
                </div>
                <p style="color: #334155; font-size: 0.93rem; line-height: 1.65; font-style: italic; flex-grow: 1;">"${r.text || ''}"</p>
                <div style="position: absolute; top: 15px; right: 20px; font-size: 2.5rem; color: #e2e8f0; font-family: serif; line-height: 1;">"</div>
            </div>`;
    });
    carousel.innerHTML = html;
    carousel.style.transform = 'translateX(0)';

    // Auto-slide only if more than reviewsVisible items
    if (reviewsTotal > reviewsVisible) {
        reviewsAutoTimer = setInterval(() => slideReviews(1), 3000);
    }
}

function slideReviews(dir) {
    const carousel = document.getElementById('reviewsCarousel');
    if (!carousel) return;

    reviewsVisible = getReviewsVisible();
    const maxOffset = reviewsTotal - reviewsVisible;
    if (maxOffset <= 0) return;

    reviewsOffset += dir;
    if (reviewsOffset > maxOffset) reviewsOffset = 0;
    if (reviewsOffset < 0) reviewsOffset = maxOffset;

    // Each card takes (100% + gap) / visible
    const cardWidth = carousel.querySelector('.review-card');
    if (!cardWidth) return;
    const gap = 25;
    const cardWidthPx = cardWidth.offsetWidth + gap;
    carousel.style.transform = `translateX(-${reviewsOffset * cardWidthPx}px)`;

    // Reset auto timer on manual click
    clearInterval(reviewsAutoTimer);
    if (reviewsTotal > reviewsVisible) {
        reviewsAutoTimer = setInterval(() => slideReviews(1), 3000);
    }
}

window.addEventListener('resize', () => {
    reviewsOffset = 0;
    const carousel = document.getElementById('reviewsCarousel');
    if (carousel) carousel.style.transform = 'translateX(0)';
    clearInterval(reviewsAutoTimer);
    reviewsVisible = getReviewsVisible();
    if (reviewsTotal > reviewsVisible) {
        reviewsAutoTimer = setInterval(() => slideReviews(1), 3000);
    }
});

// ============================================================
// 🌟 STUDENT FEEDBACK MODAL ENGINE 🌟
// ============================================================
let selectedRating = 5;

function openFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) modal.style.display = 'flex';
    selectedRating = 5;
    resetRatingHover();
    // Pre-fill stars to 5
    document.querySelectorAll('.rating-stars-interactive i').forEach((star, i) => {
        star.className = i < 5 ? 'fas fa-star' : 'far fa-star';
        star.style.color = i < 5 ? '#f59e0b' : '#cbd5e1';
    });
}

function closeFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) modal.style.display = 'none';
}

function setRating(val) {
    selectedRating = val;
    const ratingInput = document.getElementById('feedRatingValue');
    if (ratingInput) ratingInput.value = val;
    document.querySelectorAll('.rating-stars-interactive i').forEach((star, i) => {
        star.className = i < val ? 'fas fa-star' : 'far fa-star';
        star.style.color = i < val ? '#f59e0b' : '#cbd5e1';
    });
}

function hoverRating(val) {
    document.querySelectorAll('.rating-stars-interactive i').forEach((star, i) => {
        star.className = i < val ? 'fas fa-star' : 'far fa-star';
        star.style.color = i < val ? '#f59e0b' : '#cbd5e1';
    });
}

function resetRatingHover() {
    setRating(selectedRating);
}

function submitFeedback(e) {
    e.preventDefault();
    const name = document.getElementById('feedName').value.trim();
    const cls = document.getElementById('feedClass').value;
    const text = document.getElementById('feedText').value.trim();
    const rating = parseInt(document.getElementById('feedRatingValue').value) || 5;

    if (!name || !text) return showToast('Please fill all fields!', true);

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Submitting... ⏳';
    submitBtn.disabled = true;

    const reviewData = {
        name,
        class: cls,
        text,
        rating,
        status: 'pending',
        timestamp: Date.now()
    };

    if (!db) {
        showToast('Feedback saved locally! (No internet connection)', false);
        closeFeedbackModal();
        e.target.reset();
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        return;
    }

    db.ref('ideal_reviews_pending').push(reviewData)
        .then(() => {
            showToast('Thank you! Your feedback has been submitted for review. 🌟');
            closeFeedbackModal();
            e.target.reset();
            selectedRating = 5;
        })
        .catch(err => {
            showToast('Error submitting feedback. Please try again.', true);
            console.error('Feedback error:', err);
        })
        .finally(() => {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        });
}
