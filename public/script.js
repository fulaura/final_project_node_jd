let currentIndex = 0;
const items = document.querySelectorAll('.carousel-item');

function showNextImage() {
    items[currentIndex].style.transform = `translateX(-${100 * currentIndex}%)`;
    currentIndex = (currentIndex + 1) % items.length;
    items[currentIndex].style.transform = `translateX(-${100 * currentIndex}%)`;
}



async function accessProtectedRoute() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('User not authenticated');
        localStorage.removeItem('verified');
        return;
    }

    const loginButton = document.getElementById('login-btn');
    const registerButton = document.getElementById('register-btn');
    const logoutButton = document.createElement('button');
    logoutButton.id = 'logout-btn';
    logoutButton.innerText = 'Logout';
    logoutButton.classList.add('button', 'is-danger', 'is-inverted', 'is-outlined');

    if (loginButton) {
        loginButton.remove();
    }
    if (registerButton) {
        registerButton.remove();
    }
    document.getElementById('control_btn').appendChild(logoutButton);

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.reload();
    });
}


accessProtectedRoute();

async function checkProfile() {
    if(!localStorage.getItem('verified')) {
        return;
    }
    const response = await fetch(`/check_profile?username=${localStorage.getItem('username')}`);
    const profile = await response.json();
    //console.log(profile);

    const profileContainer = document.getElementById('profile_container');
    if (profile) {
        profileContainer.innerHTML = `
        <div class="name" style="display: flex;">
                    <h1 style="font-size: 1.5rem;"><strong>${profile.name}</strong></h1>
                    <p style="padding-left: 0.5%; padding-top: 1%; font-size: 0.8rem;">${profile.email}</p>
                    <p style="padding-left: 1%; padding-top: 1%; font-size: 0.8rem;">${profile.username}</p>
                <p style="padding-left: 1%; padding-top: 1%; font-size: 0.8rem; margin-left: auto;">Created: ${profile.posted}</p>
                <button style="margin-left: 1%; padding-bottom: 0.15%;">:e</button>
                <!-- <span id="timestamp"></span> -->
                <!-- <script>
                document.addEventListener('DOMContentLoaded', (event) => {
                    const timestampElement = document.getElementById('timestamp');
                    const now = new Date();
                    const formattedDate = now.toLocaleString();
                    timestampElement.textContent = formattedDate;
                });
                </script> -->
                </div>
                <hr style="margin-top: 0.8rem;">

                <div class="columns">
                    <div class="column is-one-quarter">
                        <!-- Content for the first column (1/4) -->
                        <div class="carousel">
                            ${profile.photos.map((photo, index) => `
                                <div class="carousel-item">
                                    <img src="data:image/png;base64,${photo}" alt="Image ${index + 1}" style="object-fit: cover; width: 100%; height: 100%;">
                                </div>
                            `).join('')}
                        </div>

                    </div>
                    <div class="vertical-line" style="border-left: 1px solid #353535; height: auto;"></div>
                    <div class="column">
                        <!-- Content for the second column (3/4) -->
                         <div class="title">
                            <h1 style="font-size: 1.5rem;"><strong>${profile.title}</strong></h1>
                         </div>
                         <div class="decription">
                            <p style="font-size: 1rem;">
                                ${profile.description}
                         </div>
                    </div>
                </div>
                `;
    } else {
        profileContainer.innerHTML =
         `
         <div class="field"></div>
            <label class="label">Full Name</label>
            <div class="control has-icons-left">
                <input class="input" placeholder="John Kennedy" id="full_name">
                <span class="icon is-small is-left">
                    <i class="fas fa-cloud"></i>
                </span>
            </div>

        <div class="field"></div>
            <label class="label">email</label>
            <div class="control has-icons-left">
                <input class="input" placeholder="john.bullet@america.com" id="email">
                <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                </span>
            </div>
        
        <div class="field"></div>
            <label class="label">Title</label>
            <div class="control has-icons-left">
                <input class="input" placeholder="Hello World" id="title">
                <span class="icon is-small is-left">
                    <i class="fas fa-random"></i>
                </span>
            </div>

        <div class="field"></div>
            <label class="label">Description</label>
            <div class="control has-icons-left">
                <input class="input" placeholder="Hello-hello hello" id="description">
                <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                </span>
            </div>

            <div class="field">
                <label class="label">Upload Photos</label>
                <div class="control">
                    <div class="file has-name is-boxed">
                        <label class="file-label">
                            <input class="file-input" type="file" id="photo_upload" multiple>
                            <span class="file-cta">
                                <span class="file-icon">
                                    <i class="fas fa-upload"></i>
                                </span>
                                <span class="file-label">
                                    Choose files…
                                </span>
                            </span>
                            <span class="file-name" id="photo_count">
                                No photos chosen
                            </span>
                        </label>
                    </div>
                </div>
            </div>
            
            <br>

            <div class="button" id="add_profile">Add profile</div>
         `;
        let files = [];
         document.getElementById('photo_upload').addEventListener('change', function() {
            const fileInput = document.getElementById('photo_upload');
            const fileName = document.getElementById('photo_count');
            files = fileInput.files;
            if (files.length > 0) {
                fileName.textContent = `${files.length} file(s) chosen`;
            } else {
                fileName.textContent = 'No photos chosen';
            }
        });
        
        document.getElementById('add_profile').addEventListener('click', async () => {
            const fullName = document.getElementById('full_name').value;
            const email = document.getElementById('email').value;
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;

            if(files.length>3){
                return;
            }
            const profileData = {
                name: fullName,
                email: email,
                username: localStorage.getItem('username'),
                posted: new Date(),
                title: title,
                description: description,
                photos: files
            };
            const response = await fetch('/newprofile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            const formData = new FormData();
            formData.append('username', localStorage.getItem('username'));
            for (let i = 0; i < files.length; i++) {
                formData.append('photos', files[i]);
            }
            const response2 = await fetch('/uploadPhotos', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log('Profile added successfully');
                window.location.reload();
            } else {
                console.error('Failed to add profile');
            }
        });
    }
}

checkProfile();

async function fetchNews() {
    const response = await fetch('/news');
    for (const news of await response.json()) {
        const newselement = 
        `<div class="news-item">
            <a href="${news.url}" target="_blank">
              <div class="news-image" style="background-image: url(${news.photo});">
                <div class="news-overlay">
                  <p>${news.headline}</p>
                </div>
              </div>
            </a>
          </div> `
        document.getElementById('news_block').innerHTML += newselement;
    }
}
fetchNews();

setInterval(showNextImage, 3000);













/////////////////
