/* -------------------------------------------------------------
 * ProResume Builder - Templates Engine
 * Renders data into clean HTML structures based on chosen template
 * ------------------------------------------------------------- */

const ResumeTemplates = {
    // 1. Modern Tech Template
    modern: function(data) {
        const skillsArray = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
        const strengthsArray = data.strengths ? data.strengths.split(',').map(s => s.trim()).filter(Boolean) : [];
        const weaknessesArray = data.weaknesses ? data.weaknesses.split(',').map(s => s.trim()).filter(Boolean) : [];
        const hobbiesArray = data.hobbies ? data.hobbies.split(',').map(s => s.trim()).filter(Boolean) : [];

        return `
            <header class="modern-header">
                <div class="modern-header-text">
                    <div class="modern-name">${escapeHtml(data.name || 'YOUR NAME')}</div>
                    <div class="modern-title">${escapeHtml(data.profileTitle || 'PROFESSIONAL TITLE')}</div>
                    <div class="modern-contact">
                        ${data.email ? `<span class="modern-contact-item"><i class="fa-solid fa-envelope"></i> ${escapeHtml(data.email)}</span>` : ''}
                        ${data.phn ? `<span class="modern-contact-item"><i class="fa-solid fa-phone"></i> ${escapeHtml(data.phn)}</span>` : ''}
                        ${data.location ? `<span class="modern-contact-item"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(data.location)}</span>` : ''}
                        ${data.github ? `<span class="modern-contact-item"><i class="fa-brands fa-github"></i> <a href="${escapeHtml(data.github)}" target="_blank">GitHub</a></span>` : ''}
                        ${data.linkdin ? `<span class="modern-contact-item"><i class="fa-brands fa-linkedin"></i> <a href="${escapeHtml(data.linkdin)}" target="_blank">LinkedIn</a></span>` : ''}
                    </div>
                </div>
                ${data.photo ? `<img src="${data.photo}" class="resume-photo" alt="Profile Photo">` : ''}
            </header>

            ${data.objective ? `
                <section class="modern-section">
                    <h3 class="modern-section-title"><i class="fa-solid fa-bullseye"></i> Career Objective</h3>
                    <p class="modern-item-desc">${escapeHtml(data.objective)}</p>
                </section>
            ` : ''}

            ${data.experiences && data.experiences.length > 0 ? `
                <section class="modern-section">
                    <h3 class="modern-section-title"><i class="fa-solid fa-briefcase"></i> Work Experience & Internships</h3>
                    ${data.experiences.map(exp => `
                        <div class="modern-item">
                            <div class="modern-item-header">
                                <span class="modern-item-title">${escapeHtml(exp.role || 'Role / Position')}</span>
                                <span class="modern-item-date">${escapeHtml(exp.startDate || '')} - ${escapeHtml(exp.endDate || 'Present')}</span>
                            </div>
                            <div class="modern-item-sub">${escapeHtml(exp.company || 'Company Name')} ${exp.location ? `| ${escapeHtml(exp.location)}` : ''}</div>
                            ${exp.description ? `<p class="modern-item-desc">${escapeHtml(exp.description)}</p>` : ''}
                        </div>
                    `).join('')}
                </section>
            ` : ''}

            ${data.projects && data.projects.length > 0 ? `
                <section class="modern-section">
                    <h3 class="modern-section-title"><i class="fa-solid fa-laptop-code"></i> Projects</h3>
                    ${data.projects.map(proj => `
                        <div class="modern-item">
                            <div class="modern-item-header">
                                <span class="modern-item-title">${escapeHtml(proj.title || 'Project Title')}</span>
                                ${proj.link ? `<span class="modern-item-date"><a href="${escapeHtml(proj.link)}" target="_blank">Link <i class="fa-solid fa-external-link"></i></a></span>` : ''}
                            </div>
                            ${proj.technologies ? `<div class="modern-item-sub">Tech: ${escapeHtml(proj.technologies)}</div>` : ''}
                            ${proj.description ? `<p class="modern-item-desc">${escapeHtml(proj.description)}</p>` : ''}
                        </div>
                    `).join('')}
                </section>
            ` : ''}

            ${data.education && data.education.length > 0 ? `
                <section class="modern-section">
                    <h3 class="modern-section-title"><i class="fa-solid fa-graduation-cap"></i> Qualifications & Education</h3>
                    ${data.education.map(edu => `
                        <div class="modern-item">
                            <div class="modern-item-header">
                                <span class="modern-item-title">${escapeHtml(edu.degree || 'Degree / Qualification')}</span>
                                <span class="modern-item-date">${escapeHtml(edu.year || '')}</span>
                            </div>
                            <div class="modern-item-sub">${escapeHtml(edu.institution || 'University / Institution')} ${edu.score ? `(Score: ${escapeHtml(edu.score)})` : ''}</div>
                        </div>
                    `).join('')}
                </section>
            ` : ''}

            ${skillsArray.length > 0 ? `
                <section class="modern-section">
                    <h3 class="modern-section-title"><i class="fa-solid fa-code"></i> Technical & Professional Skills</h3>
                    <div class="tag-container">
                        ${skillsArray.map(skill => `<span class="tag-chip">${escapeHtml(skill)}</span>`).join('')}
                    </div>
                </section>
            ` : ''}

            ${data.certificates && data.certificates.length > 0 ? `
                <section class="modern-section">
                    <h3 class="modern-section-title"><i class="fa-solid fa-certificate"></i> Certificates</h3>
                    ${data.certificates.map(cert => `
                        <div class="modern-item">
                            <div class="modern-item-header">
                                <span class="modern-item-title">${escapeHtml(cert.name || 'Certificate Name')}</span>
                                <span class="modern-item-date">${escapeHtml(cert.year || '')}</span>
                            </div>
                            <div class="modern-item-sub">Issuer: ${escapeHtml(cert.issuer || 'Organization')}</div>
                        </div>
                    `).join('')}
                </section>
            ` : ''}

            ${(strengthsArray.length > 0 || weaknessesArray.length > 0 || hobbiesArray.length > 0) ? `
                <section class="modern-section">
                    <h3 class="modern-section-title"><i class="fa-solid fa-star"></i> Strengths, Weaknesses & Hobbies</h3>
                    ${strengthsArray.length > 0 ? `
                        <div style="margin-bottom: 6px;">
                            <strong>Strengths:</strong>
                            <div class="tag-container">
                                ${strengthsArray.map(s => `<span class="tag-chip" style="background:#e0f2fe; color:#0369a1;">${escapeHtml(s)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${weaknessesArray.length > 0 ? `
                        <div style="margin-bottom: 6px;">
                            <strong>Weaknesses:</strong>
                            <div class="tag-container">
                                ${weaknessesArray.map(w => `<span class="tag-chip" style="background:#fef2f2; color:#991b1b;">${escapeHtml(w)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${hobbiesArray.length > 0 ? `
                        <div>
                            <strong>Hobbies & Interests:</strong>
                            <div class="tag-container">
                                ${hobbiesArray.map(h => `<span class="tag-chip" style="background:#f0fdf4; color:#166534;">${escapeHtml(h)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </section>
            ` : ''}
        `;
    },

    // 2. Executive Classic Template
    executive: function(data) {
        const skillsArray = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
        const strengthsArray = data.strengths ? data.strengths.split(',').map(s => s.trim()).filter(Boolean) : [];
        const hobbiesArray = data.hobbies ? data.hobbies.split(',').map(s => s.trim()).filter(Boolean) : [];

        return `
            <div class="executive-header">
                <div class="executive-name">${escapeHtml(data.name || 'YOUR NAME')}</div>
                <div class="executive-title">${escapeHtml(data.profileTitle || 'PROFESSIONAL TITLE')}</div>
                <div class="executive-contact">
                    ${data.email ? `<span>Email: ${escapeHtml(data.email)}</span> •` : ''}
                    ${data.phn ? `<span>Phone: ${escapeHtml(data.phn)}</span> •` : ''}
                    ${data.location ? `<span>${escapeHtml(data.location)}</span> •` : ''}
                    ${data.github ? `<span>GitHub: ${escapeHtml(data.github)}</span> •` : ''}
                    ${data.linkdin ? `<span>LinkedIn: ${escapeHtml(data.linkdin)}</span>` : ''}
                </div>
            </div>

            ${data.objective ? `
                <div style="margin-bottom: 16px;">
                    <div class="executive-section-title">Career Summary</div>
                    <p style="font-size: 12px; line-height: 1.6; text-align: justify;">${escapeHtml(data.objective)}</p>
                </div>
            ` : ''}

            ${data.experiences && data.experiences.length > 0 ? `
                <div style="margin-bottom: 16px;">
                    <div class="executive-section-title">Work Experience</div>
                    ${data.experiences.map(exp => `
                        <div style="margin-bottom: 10px;">
                            <div style="display:flex; justify-shadow:space-between; font-weight:bold;">
                                <span>${escapeHtml(exp.role)} — ${escapeHtml(exp.company)}</span>
                                <span style="font-style:italic; font-size:11px;">${escapeHtml(exp.startDate)} - ${escapeHtml(exp.endDate)}</span>
                            </div>
                            <p style="font-size:11.5px; margin-top:3px;">${escapeHtml(exp.description)}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            ${data.education && data.education.length > 0 ? `
                <div style="margin-bottom: 16px;">
                    <div class="executive-section-title">Education & Qualifications</div>
                    ${data.education.map(edu => `
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                            <div><strong>${escapeHtml(edu.degree)}</strong> — ${escapeHtml(edu.institution)}</div>
                            <div style="font-size:11px;">${escapeHtml(edu.year)}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            ${skillsArray.length > 0 ? `
                <div style="margin-bottom: 16px;">
                    <div class="executive-section-title">Core Competencies & Skills</div>
                    <p style="font-size:11.5px;">${skillsArray.join(' • ')}</p>
                </div>
            ` : ''}

            ${data.projects && data.projects.length > 0 ? `
                <div style="margin-bottom: 16px;">
                    <div class="executive-section-title">Key Projects</div>
                    ${data.projects.map(p => `
                        <div style="margin-bottom: 8px;">
                            <strong>${escapeHtml(p.title)}</strong> ${p.technologies ? `(${escapeHtml(p.technologies)})` : ''}
                            <p style="font-size:11px; margin-top:2px;">${escapeHtml(p.description)}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            ${(strengthsArray.length > 0 || hobbiesArray.length > 0) ? `
                <div>
                    <div class="executive-section-title">Personal Strengths & Hobbies</div>
                    ${strengthsArray.length > 0 ? `<p style="font-size:11px;"><strong>Strengths:</strong> ${strengthsArray.join(', ')}</p>` : ''}
                    ${hobbiesArray.length > 0 ? `<p style="font-size:11px; margin-top:3px;"><strong>Hobbies:</strong> ${hobbiesArray.join(', ')}</p>` : ''}
                </div>
            ` : ''}
        `;
    },

    // 3. Minimalist Slate Template
    minimal: function(data) {
        return this.modern(data); // Falls back gracefully to Modern styling
    },

    // 4. Creative Template
    creative: function(data) {
        return this.modern(data);
    }
};

// Helper function to escape HTML unsafe characters
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
