import React, { useState } from 'react';
import { Star, Send, RotateCcw, User, Mail, Phone, BookOpen, UserCheck, MessageSquare, AlertCircle } from 'lucide-react';

const SUBJECT_FACULTY_MAP = {
  'Web Technologies': ['Dr. Rajesh Kumar', 'Prof. Neha Gupta'],
  'Database Management Systems': ['Prof. Sunita Patel', 'Dr. Ramesh Rao'],
  'Data Structures & Algorithms': ['Dr. Vikramaditya', 'Prof. Sanjay Dutt'],
  'Cloud Computing': ['Prof. Anita Roy', 'Dr. Alok Verma'],
  'Artificial Intelligence & ML': ['Dr. Amitav Ghosh', 'Prof. Meenakshi S.'],
  'Computer Networks': ['Dr. Priya Sharma', 'Prof. K. V. Mohan'],
};

export default function FeedbackForm({ onSubmitted, addToast }) {
  const [formData, setFormData] = useState({
    regNo: '',
    studentName: '',
    clgEmail: '',
    phnNo: '',
    subject: '',
    faculty: '',
    rating: 0,
    queriesSuggestions: '',
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableFaculties = formData.subject && SUBJECT_FACULTY_MAP[formData.subject]
    ? SUBJECT_FACULTY_MAP[formData.subject]
    : Object.values(SUBJECT_FACULTY_MAP).flat();

  const handleSubjectChange = (e) => {
    const selectedSub = e.target.value;
    setFormData((prev) => ({
      ...prev,
      subject: selectedSub,
      faculty: '',
    }));
    if (errors.subject) setErrors((prev) => ({ ...prev, subject: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingClick = (num) => {
    setFormData((prev) => ({ ...prev, rating: num }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.regNo.trim()) {
      newErrors.regNo = 'Registration number is required';
    }
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }
    if (!formData.clgEmail.trim()) {
      newErrors.clgEmail = 'College Email ID is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clgEmail)) {
      newErrors.clgEmail = 'Invalid email address format';
    }
    if (!formData.phnNo.trim()) {
      newErrors.phnNo = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phnNo.replace(/\D/g, ''))) {
      newErrors.phnNo = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.subject) {
      newErrors.subject = 'Please select a subject from the dropdown';
    }
    if (!formData.faculty) {
      newErrors.faculty = 'Please select faculty from the dropdown';
    }
    if (!formData.rating || formData.rating < 1) {
      newErrors.rating = 'Please provide a faculty rating out of 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      addToast('Please complete all required fields', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        addToast('Feedback submitted and saved to MongoDB!', 'success');
        setFormData({
          regNo: '',
          studentName: '',
          clgEmail: '',
          phnNo: '',
          subject: '',
          faculty: '',
          rating: 0,
          queriesSuggestions: '',
        });
        setErrors({});
        if (onSubmitted) onSubmitted();
      } else {
        addToast(data.message || 'Failed to submit feedback', 'error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      addToast('Network error while connecting to server', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      regNo: '',
      studentName: '',
      clgEmail: '',
      phnNo: '',
      subject: '',
      faculty: '',
      rating: 0,
      queriesSuggestions: '',
    });
    setErrors({});
  };

  const getRatingLabel = (val) => {
    switch (val) {
      case 1: return '1 / 5 - Poor';
      case 2: return '2 / 5 - Fair';
      case 3: return '3 / 5 - Good';
      case 4: return '4 / 5 - Very Good';
      case 5: return '5 / 5 - Excellent';
      default: return 'Select rating out of 5';
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Title */}
      <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
          Online Feedback Form
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
          Fields marked with <span className="required-star">*</span> are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
          
          {/* 1) Reg no */}
          <div className="form-group">
            <label className="form-label" htmlFor="regNo">
              1) Reg no <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="regNo"
              name="regNo"
              className={`form-control ${errors.regNo ? 'error' : ''}`}
              placeholder="Enter Registration No (e.g. 21MCA0101)"
              value={formData.regNo}
              onChange={handleChange}
            />
            {errors.regNo && <span className="error-text"><AlertCircle size={13} /> {errors.regNo}</span>}
          </div>

          {/* 2) Student Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="studentName">
              2) Student Name <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              className={`form-control ${errors.studentName ? 'error' : ''}`}
              placeholder="Enter full student name"
              value={formData.studentName}
              onChange={handleChange}
            />
            {errors.studentName && <span className="error-text"><AlertCircle size={13} /> {errors.studentName}</span>}
          </div>

          {/* 3) Clg Email id */}
          <div className="form-group">
            <label className="form-label" htmlFor="clgEmail">
              3) Clg Email id <span className="required-star">*</span>
            </label>
            <input
              type="email"
              id="clgEmail"
              name="clgEmail"
              className={`form-control ${errors.clgEmail ? 'error' : ''}`}
              placeholder="student@college.edu"
              value={formData.clgEmail}
              onChange={handleChange}
            />
            {errors.clgEmail && <span className="error-text"><AlertCircle size={13} /> {errors.clgEmail}</span>}
          </div>

          {/* 4) Phn no */}
          <div className="form-group">
            <label className="form-label" htmlFor="phnNo">
              4) Phn no <span className="required-star">*</span>
            </label>
            <input
              type="tel"
              id="phnNo"
              name="phnNo"
              className={`form-control ${errors.phnNo ? 'error' : ''}`}
              placeholder="10-digit mobile number"
              value={formData.phnNo}
              onChange={handleChange}
            />
            {errors.phnNo && <span className="error-text"><AlertCircle size={13} /> {errors.phnNo}</span>}
          </div>

          {/* 5) Select Sub (Dropdown) */}
          <div className="form-group">
            <label className="form-label" htmlFor="subject">
              5) Select Sub (Dropdown) <span className="required-star">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              className={`form-control ${errors.subject ? 'error' : ''}`}
              value={formData.subject}
              onChange={handleSubjectChange}
            >
              <option value="">-- Select Subject --</option>
              {Object.keys(SUBJECT_FACULTY_MAP).map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            {errors.subject && <span className="error-text"><AlertCircle size={13} /> {errors.subject}</span>}
          </div>

          {/* 6) About faculty (Dropdown) */}
          <div className="form-group">
            <label className="form-label" htmlFor="faculty">
              6) About faculty (Dropdown) <span className="required-star">*</span>
            </label>
            <select
              id="faculty"
              name="faculty"
              className={`form-control ${errors.faculty ? 'error' : ''}`}
              value={formData.faculty}
              onChange={handleChange}
            >
              <option value="">-- Select Faculty --</option>
              {availableFaculties.map((fac) => (
                <option key={fac} value={fac}>{fac}</option>
              ))}
            </select>
            {errors.faculty && <span className="error-text"><AlertCircle size={13} /> {errors.faculty}</span>}
          </div>

        </div>

        {/* 7) Each faculty rating (out of 5) */}
        <div className="form-group" style={{ marginTop: '8px' }}>
          <label className="form-label">
            7) Each faculty rating (out of 5) <span className="required-star">*</span>
          </label>
          
          <div className={`star-rating-container ${errors.rating ? 'error' : ''}`}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((starNum) => {
                const isSelected = starNum <= (hoverRating || formData.rating);
                return (
                  <button
                    key={starNum}
                    type="button"
                    className="star-btn"
                    onMouseEnter={() => setHoverRating(starNum)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRatingClick(starNum)}
                    aria-label={`Rating ${starNum}`}
                  >
                    <Star className={`star-icon ${isSelected ? 'active' : 'inactive'}`} />
                  </button>
                );
              })}
            </div>
            
            <span className="rating-badge">
              {getRatingLabel(hoverRating || formData.rating)}
            </span>
          </div>
          {errors.rating && <span className="error-text"><AlertCircle size={13} /> {errors.rating}</span>}
        </div>

        {/* 8) Any Queries / Suggestions */}
        <div className="form-group" style={{ marginTop: '8px' }}>
          <label className="form-label" htmlFor="queriesSuggestions">
            8) Any Queries / Suggestions
          </label>
          <textarea
            id="queriesSuggestions"
            name="queriesSuggestions"
            rows="3"
            className="form-control"
            placeholder="Type your feedback, query or suggestion here..."
            value={formData.queriesSuggestions}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* 9) Submit button */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            <RotateCcw size={15} /> Reset Form
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            id="btn-submit-feedback"
          >
            {isSubmitting ? 'Submitting...' : '9) Submit Feedback'}
          </button>
        </div>

      </form>
    </div>
  );
}
