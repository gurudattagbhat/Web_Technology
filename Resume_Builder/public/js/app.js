/* -------------------------------------------------------------
 * ProResume Builder - Main Application JS Logic
 * Interactive form state management, live preview, auto modal launch & print
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // Accordion Toggle
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    });

    // Dynamic Lists Containers
    const eduList = document.getElementById('education-list');
    const expList = document.getElementById('experience-list');
    const projList = document.getElementById('projects-list');
    const certList = document.getElementById('certificates-list');

    // Add Buttons
    document.getElementById('btn-add-education').addEventListener('click', () => addEducationCard());
    document.getElementById('btn-add-experience').addEventListener('click', () => addExperienceCard());
    document.getElementById('btn-add-project').addEventListener('click', () => addProjectCard());
    document.getElementById('btn-add-certificate').addEventListener('click', () => addCertificateCard());

    // Template Selector Event
    document.getElementById('select-template').addEventListener('change', () => {
        renderResume();
    });

    // Inputs Live Updating
    const inputsToListen = [
        'input-name', 'input-email', 'input-phn', 'input-location',
        'input-profile-title', 'input-github', 'input-linkdin', 'input-objective',
        'input-skills', 'input-strengths', 'input-weaknesses', 'input-hobbies'
    ];

    inputsToListen.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => renderResume());
        }
    });

    // Photo Upload State & Event Handlers
    let currentPhotoUrl = '';
    const fileInput = document.getElementById('input-photo-file');
    const btnUploadPhoto = document.getElementById('btn-upload-photo');
    const btnRemovePhoto = document.getElementById('btn-remove-photo');
    const photoPreviewWrapper = document.getElementById('photo-preview-wrapper');
    const photoPreviewImg = document.getElementById('photo-preview-img');

    if (btnUploadPhoto && fileInput) {
        btnUploadPhoto.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    currentPhotoUrl = evt.target.result;
                    photoPreviewImg.src = currentPhotoUrl;
                    photoPreviewWrapper.classList.remove('hidden');
                    btnRemovePhoto.classList.remove('hidden');
                    renderResume();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnRemovePhoto) {
        btnRemovePhoto.addEventListener('click', () => {
            currentPhotoUrl = '';
            fileInput.value = '';
            photoPreviewImg.src = '';
            photoPreviewWrapper.classList.add('hidden');
            btnRemovePhoto.classList.add('hidden');
            renderResume();
        });
    }

    // Action Buttons
    const btnBuildResume = document.getElementById('btn-build-resume');
    const btnBuildResumeTop = document.getElementById('btn-build-resume-top');
    const btnPrintTop = document.getElementById('btn-print-top');
    const btnPrintPreview = document.getElementById('btn-print-preview');
    const btnModalPrint = document.getElementById('btn-modal-print');
    const btnModalClose = document.getElementById('btn-modal-close');
    const btnSampleData = document.getElementById('btn-sample-data');
    const btnClear = document.getElementById('btn-clear');
    const btnFullscreen = document.getElementById('btn-view-fullscreen');

    const modal = document.getElementById('modal-resume-view');

    // Build Resume Trigger
    [btnBuildResume, btnBuildResumeTop].forEach(btn => {
        btn.addEventListener('click', () => {
            renderResume();
            openResumeModal();
        });
    });

    // Print Triggers
    [btnPrintTop, btnPrintPreview, btnModalPrint].forEach(btn => {
        btn.addEventListener('click', () => {
            window.print();
        });
    });

    // Fullscreen View
    btnFullscreen.addEventListener('click', () => {
        openResumeModal();
    });

    // Modal Close
    btnModalClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Sample Data Populator
    btnSampleData.addEventListener('click', () => {
        loadSampleData();
    });

    // Reset Form
    btnClear.addEventListener('click', () => {
        document.getElementById('resume-form').reset();
        eduList.innerHTML = '';
        expList.innerHTML = '';
        projList.innerHTML = '';
        certList.innerHTML = '';
        renderResume();
    });

    // Initialize with 1 default card of each dynamic section
    addEducationCard();
    addExperienceCard();
    addProjectCard();
    addCertificateCard();
    renderResume();
});

// Dynamic Card Creators
function addEducationCard(data = {}) {
    const container = document.getElementById('education-list');
    const cardId = 'edu-' + Date.now() + Math.random().toString(36).substr(2, 4);

    const html = `
        <div class="dynamic-card" id="${cardId}">
            <div class="dynamic-card-header">
                <span class="dynamic-card-title"><i class="fa-solid fa-graduation-cap"></i> Qualification Entry</span>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeCard('${cardId}')"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Degree / Qualification</label>
                    <input type="text" class="edu-degree" placeholder="B.S. in Computer Science" value="${data.degree || ''}" oninput="renderResume()">
                </div>
                <div class="form-group">
                    <label>Institution / University</label>
                    <input type="text" class="edu-institution" placeholder="Stanford University" value="${data.institution || ''}" oninput="renderResume()">
                </div>
                <div class="form-group">
                    <label>Passing Year / Duration</label>
                    <input type="text" class="edu-year" placeholder="2020 - 2024" value="${data.year || ''}" oninput="renderResume()">
                </div>
                <div class="form-group">
                    <label>GPA / Score (Optional)</label>
                    <input type="text" class="edu-score" placeholder="3.9 / 4.0" value="${data.score || ''}" oninput="renderResume()">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    renderResume();
}

function addExperienceCard(data = {}) {
    const container = document.getElementById('experience-list');
    const cardId = 'exp-' + Date.now() + Math.random().toString(36).substr(2, 4);

    const html = `
        <div class="dynamic-card" id="${cardId}">
            <div class="dynamic-card-header">
                <span class="dynamic-card-title"><i class="fa-solid fa-briefcase"></i> Work Experience / Internship</span>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeCard('${cardId}')"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Job Title / Role</label>
                    <input type="text" class="exp-role" placeholder="Full Stack Developer" value="${data.role || ''}" oninput="renderResume()">
                </div>
                <div class="form-group">
                    <label>Company / Organization</label>
                    <input type="text" class="exp-company" placeholder="TechCorp Inc." value="${data.company || ''}" oninput="renderResume()">
                </div>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="text" class="exp-start" placeholder="Jan 2022" value="${data.startDate || ''}" oninput="renderResume()">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="text" class="exp-end" placeholder="Present" value="${data.endDate || ''}" oninput="renderResume()">
                </div>
                <div class="form-group full-width">
                    <label>Responsibilities & Key Achievements</label>
                    <textarea class="exp-desc" rows="2" placeholder="Engineered high-performance REST APIs..." oninput="renderResume()">${data.description || ''}</textarea>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    renderResume();
}

function addProjectCard(data = {}) {
    const container = document.getElementById('projects-list');
    const cardId = 'proj-' + Date.now() + Math.random().toString(36).substr(2, 4);

    const html = `
        <div class="dynamic-card" id="${cardId}">
            <div class="dynamic-card-header">
                <span class="dynamic-card-title"><i class="fa-solid fa-laptop-code"></i> Project Entry</span>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeCard('${cardId}')"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Project Title</label>
                    <input type="text" class="proj-title" placeholder="AI Resume Builder" value="${data.title || ''}" oninput="renderResume()">
                </div>
                <div class="form-group">
                    <label>Technologies Used</label>
                    <input type="text" class="proj-tech" placeholder="Node.js, Express, HTML5, CSS3" value="${data.technologies || ''}" oninput="renderResume()">
                </div>
                <div class="form-group full-width">
                    <label>Project Link / Repository (Optional)</label>
                    <input type="url" class="proj-link" placeholder="https://github.com/user/project" value="${data.link || ''}" oninput="renderResume()">
                </div>
                <div class="form-group full-width">
                    <label>Project Summary</label>
                    <textarea class="proj-desc" rows="2" placeholder="Built a responsive resume web app with live rendering..." oninput="renderResume()">${data.description || ''}</textarea>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    renderResume();
}

function addCertificateCard(data = {}) {
    const container = document.getElementById('certificates-list');
    const cardId = 'cert-' + Date.now() + Math.random().toString(36).substr(2, 4);

    const html = `
        <div class="dynamic-card" id="${cardId}">
            <div class="dynamic-card-header">
                <span class="dynamic-card-title"><i class="fa-solid fa-certificate"></i> Certification</span>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeCard('${cardId}')"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Certificate Name</label>
                    <input type="text" class="cert-name" placeholder="AWS Certified Solutions Architect" value="${data.name || ''}" oninput="renderResume()">
                </div>
                <div class="form-group">
                    <label>Issuing Organization</label>
                    <input type="text" class="cert-issuer" placeholder="Amazon Web Services" value="${data.issuer || ''}" oninput="renderResume()">
                </div>
                <div class="form-group full-width">
                    <label>Year / Date</label>
                    <input type="text" class="cert-year" placeholder="2023" value="${data.year || ''}" oninput="renderResume()">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    renderResume();
}

function removeCard(id) {
    const el = document.getElementById(id);
    if (el) {
        el.remove();
        renderResume();
    }
}

// Data Gatherer & Renderer
function collectFormData() {
    // Education Items
    const education = [];
    document.querySelectorAll('#education-list .dynamic-card').forEach(card => {
        const degree = card.querySelector('.edu-degree').value;
        const institution = card.querySelector('.edu-institution').value;
        const year = card.querySelector('.edu-year').value;
        const score = card.querySelector('.edu-score').value;
        if (degree || institution) {
            education.push({ degree, institution, year, score });
        }
    });

    // Experience Items
    const experiences = [];
    document.querySelectorAll('#experience-list .dynamic-card').forEach(card => {
        const role = card.querySelector('.exp-role').value;
        const company = card.querySelector('.exp-company').value;
        const startDate = card.querySelector('.exp-start').value;
        const endDate = card.querySelector('.exp-end').value;
        const description = card.querySelector('.exp-desc').value;
        if (role || company) {
            experiences.push({ role, company, startDate, endDate, description });
        }
    });

    // Project Items
    const projects = [];
    document.querySelectorAll('#projects-list .dynamic-card').forEach(card => {
        const title = card.querySelector('.proj-title').value;
        const technologies = card.querySelector('.proj-tech').value;
        const link = card.querySelector('.proj-link').value;
        const description = card.querySelector('.proj-desc').value;
        if (title) {
            projects.push({ title, technologies, link, description });
        }
    });

    // Certificate Items
    const certificates = [];
    document.querySelectorAll('#certificates-list .dynamic-card').forEach(card => {
        const name = card.querySelector('.cert-name').value;
        const issuer = card.querySelector('.cert-issuer').value;
        const year = card.querySelector('.cert-year').value;
        if (name) {
            certificates.push({ name, issuer, year });
        }
    });

    return {
        name: document.getElementById('input-name').value,
        email: document.getElementById('input-email').value,
        phn: document.getElementById('input-phn').value,
        location: document.getElementById('input-location').value,
        profileTitle: document.getElementById('input-profile-title').value,
        github: document.getElementById('input-github').value,
        linkdin: document.getElementById('input-linkdin').value,
        objective: document.getElementById('input-objective').value,
        skills: document.getElementById('input-skills').value,
        strengths: document.getElementById('input-strengths').value,
        weaknesses: document.getElementById('input-weaknesses').value,
        hobbies: document.getElementById('input-hobbies').value,
        photo: (document.getElementById('photo-preview-img') ? document.getElementById('photo-preview-img').src : ''),
        education,
        experiences,
        projects,
        certificates
    };
}

function renderResume() {
    const data = collectFormData();
    const templateName = document.getElementById('select-template').value;
    const templateFunc = ResumeTemplates[templateName] || ResumeTemplates.modern;

    const htmlContent = templateFunc(data);
    const renderArea = document.getElementById('resume-render-area');
    const modalArea = document.getElementById('modal-resume-render-area');

    renderArea.className = `resume-paper ${templateName}-theme`;
    renderArea.innerHTML = htmlContent;

    if (modalArea) {
        modalArea.className = `resume-paper ${templateName}-theme`;
        modalArea.innerHTML = htmlContent;
    }
}

function openResumeModal() {
    const modal = document.getElementById('modal-resume-view');
    modal.classList.remove('hidden');
    modal.style.opacity = '1';
}

// Sample Data Filler
function loadSampleData() {
    document.getElementById('input-name').value = 'Samantha Vance';
    document.getElementById('input-email').value = 'samantha.vance@example.com';
    document.getElementById('input-phn').value = '+1 (555) 019-2834';
    document.getElementById('input-location').value = 'San Francisco, CA';
    document.getElementById('input-profile-title').value = 'Senior Software Engineer';
    document.getElementById('input-github').value = 'https://github.com/samanthavance';
    document.getElementById('input-linkdin').value = 'https://linkedin.com/in/samanthavance';
    document.getElementById('input-objective').value = 'Innovative and solution-driven Full Stack Software Engineer with over 4 years of experience building scalable, high-concurrency web applications, REST APIs, and modern user interfaces.';
    document.getElementById('input-skills').value = 'JavaScript (ES6+), Node.js, Express, React.js, Python, PostgreSQL, Docker, AWS, Git';
    document.getElementById('input-strengths').value = 'Problem Solving, System Architecture, Cross-functional Leadership, Adaptability';
    document.getElementById('input-weaknesses').value = 'Tendency to over-engineer perfection, Public speaking (actively working on it)';
    document.getElementById('input-hobbies').value = 'Open Source Development, Competitive Chess, Amateur Astronomy, Guitar';

    // Sample Photo Avatar
    const sampleAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%232563eb'/><circle cx='50' cy='40' r='20' fill='%23ffffff'/><path d='M25 80 C 25 60, 75 60, 75 80 Z' fill='%23ffffff'/></svg>";
    const photoImg = document.getElementById('photo-preview-img');
    const photoWrapper = document.getElementById('photo-preview-wrapper');
    const btnRemove = document.getElementById('btn-remove-photo');
    if (photoImg && photoWrapper) {
        photoImg.src = sampleAvatar;
        photoWrapper.classList.remove('hidden');
        if (btnRemove) btnRemove.classList.remove('hidden');
    }

    // Clear dynamic cards
    document.getElementById('education-list').innerHTML = '';
    document.getElementById('experience-list').innerHTML = '';
    document.getElementById('projects-list').innerHTML = '';
    document.getElementById('certificates-list').innerHTML = '';

    // Add sample dynamic items
    addEducationCard({
        degree: 'Master of Science in Computer Science',
        institution: 'University of California, Berkeley',
        year: '2020 - 2022',
        score: '3.95 / 4.0'
    });
    addEducationCard({
        degree: 'Bachelor of Technology in Computer Engineering',
        institution: 'IIT Bombay',
        year: '2016 - 2020',
        score: '9.2 / 10'
    });

    addExperienceCard({
        role: 'Senior Software Engineer',
        company: 'CloudScale Technologies',
        startDate: 'Jun 2022',
        endDate: 'Present',
        description: '• Architected microservices with Node.js & Express handling 2M+ daily active requests.\n• Reduced server response latencies by 35% through Redis caching and query optimization.\n• Mentored 5 junior engineers and led weekly code reviews.'
    });
    addExperienceCard({
        role: 'Full Stack Development Intern',
        company: 'InnovateX Labs',
        startDate: 'Jan 2020',
        endDate: 'May 2022',
        description: '• Developed interactive dashboard UI components using React and HTML5/CSS3.\n• Implemented secure JWT authentication and role-based access control.'
    });

    addProjectCard({
        title: 'ProResume - AI Resume Builder App',
        technologies: 'Node.js, Express, ES6 JavaScript, HTML5/CSS3',
        link: 'https://github.com/samanthavance/resume-builder',
        description: 'Built a real-time responsive web app allowing users to input professional details, select multi-theme templates, auto-generate resumes, and download standard print-ready PDF files.'
    });
    addProjectCard({
        title: 'Distributed Task Queue System',
        technologies: 'Python, Redis, Docker, RabbitMQ',
        link: 'https://github.com/samanthavance/task-queue',
        description: 'Created a fault-tolerant asynchronous task processing engine with auto-retries and worker pool health monitoring.'
    });

    addCertificateCard({
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        year: '2023'
    });
    addCertificateCard({
        name: 'Meta Full-Stack Developer Professional Certificate',
        issuer: 'Coursera / Meta',
        year: '2022'
    });

    renderResume();
}
