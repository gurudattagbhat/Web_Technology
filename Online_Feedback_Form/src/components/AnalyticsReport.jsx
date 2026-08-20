import React, { useState, useEffect } from 'react';
import { 
  BarChart3, RefreshCw, Star, Users, BookOpen, 
  Award, Search, Trash2, Database, FileSpreadsheet, FileText, Printer 
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function AnalyticsReport({ addToast }) {
  const [reportData, setReportData] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const resReport = await fetch('/api/feedback/report');
      const dataReport = await resReport.json();

      if (dataReport.success) {
        setReportData(dataReport);
      }

      let queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (selectedFaculty !== 'All') queryParams.append('faculty', selectedFaculty);
      if (selectedSubject !== 'All') queryParams.append('subject', selectedSubject);

      const resFeedbacks = await fetch(`/api/feedback?${queryParams.toString()}`);
      const dataFeedbacks = await resFeedbacks.json();

      if (dataFeedbacks.success) {
        setFeedbacks(dataFeedbacks.data);
      }
    } catch (err) {
      console.error('Error fetching report analytics:', err);
      addToast('Failed to load report data from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [search, selectedFaculty, selectedSubject]);

  const handleSeedData = async () => {
    try {
      const res = await fetch('/api/feedback/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        addToast(data.message, 'success');
        fetchReport();
      } else {
        addToast('Failed to seed sample data', 'error');
      }
    } catch (err) {
      addToast('Error communicating with server', 'error');
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Delete this feedback record?')) return;
    try {
      const res = await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        addToast('Feedback record deleted', 'success');
        fetchReport();
      }
    } catch (err) {
      addToast('Failed to delete feedback record', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear ALL feedback records?')) return;
    try {
      const res = await fetch('/api/feedback/clear/all', { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        addToast('All feedback records cleared', 'success');
        fetchReport();
      }
    } catch (err) {
      addToast('Failed to clear records', 'error');
    }
  };

  const handleExportCSV = () => {
    if (!feedbacks || feedbacks.length === 0) {
      addToast('No feedback data available to export', 'error');
      return;
    }

    const headers = ['Reg No', 'Student Name', 'College Email', 'Phone', 'Subject', 'Faculty', 'Rating', 'Suggestions', 'Submitted Date'];
    const csvRows = [headers.join(',')];

    feedbacks.forEach((item) => {
      const row = [
        `"${item.regNo || ''}"`,
        `"${item.studentName || ''}"`,
        `"${item.clgEmail || ''}"`,
        `"${item.phnNo || ''}"`,
        `"${item.subject || ''}"`,
        `"${item.faculty || ''}"`,
        item.rating,
        `"${(item.queriesSuggestions || '').replace(/"/g, '""')}"`,
        `"${new Date(item.createdAt).toLocaleString()}"`,
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Faculty_Feedback_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('CSV Report downloaded!', 'success');
  };

  const handleExportPDF = async () => {
    const reportElement = document.getElementById('printable-report-area');
    if (!reportElement) return;

    setIsExportingPDF(true);
    addToast('Generating PDF Report...', 'success');

    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Feedback_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      addToast('PDF Report exported successfully!', 'success');
    } catch (err) {
      console.error('PDF Error:', err);
      addToast('Opening print dialog for PDF export', 'error');
      window.print();
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const summary = reportData?.summary || {
    totalFeedbacks: 0,
    overallAverageRating: 0,
    topFaculty: 'N/A',
    totalSubjects: 0,
    totalFaculties: 0,
  };

  const facultyReport = reportData?.facultyReport || [];
  const subjectReport = reportData?.subjectReport || [];
  const ratingDist = reportData?.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Control Bar & Actions */}
      <div className="glass-card-sm no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>
            Feedback Analytics & Reports
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            Real-time report generated based on feedback saved in MongoDB.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchReport} title="Refresh data">
            <RefreshCw size={14} /> Refresh
          </button>
          
          <button className="btn btn-amber btn-sm" onClick={handleSeedData} title="Seed 8 sample student entries">
            <Database size={14} /> Seed Sample Data
          </button>

          <button className="btn btn-emerald btn-sm" onClick={handleExportCSV}>
            <FileSpreadsheet size={14} /> Export CSV
          </button>

          <button className="btn btn-primary btn-sm" onClick={handleExportPDF} disabled={isExportingPDF}>
            <FileText size={14} /> Export PDF
          </button>

          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* Printable Report Section */}
      <div id="printable-report-area">
        
        {/* Summary Metric Cards */}
        <div className="metrics-grid">
          
          <div className="metric-card">
            <div className="metric-icon indigo">
              <Users size={22} />
            </div>
            <div className="metric-info">
              <div className="val">{summary.totalFeedbacks}</div>
              <div className="lbl">Total Feedbacks</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon gold">
              <Star size={22} />
            </div>
            <div className="metric-info">
              <div className="val">{summary.overallAverageRating} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/ 5</span></div>
              <div className="lbl">Overall Average</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon emerald">
              <Award size={22} />
            </div>
            <div className="metric-info">
              <div className="val" style={{ fontSize: '1.15rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '140px' }}>
                {summary.topFaculty}
              </div>
              <div className="lbl">Top Rated Faculty</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon cyan">
              <BookOpen size={22} />
            </div>
            <div className="metric-info">
              <div className="val">{summary.totalSubjects}</div>
              <div className="lbl">Subjects Evaluated</div>
            </div>
          </div>

        </div>

        {/* Breakdown Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          
          {/* Star Rating Distribution Visual Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
              <Star size={16} color="#d97706" /> Rating Distribution (1 to 5 Stars)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[5, 4, 3, 2, 1].map((starNum) => {
                const count = ratingDist[starNum] || 0;
                const percentage = summary.totalFeedbacks > 0 ? Math.round((count / summary.totalFeedbacks) * 100) : 0;
                return (
                  <div key={starNum} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '55px', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', color: '#334155' }}>
                      {starNum} <Star size={13} fill="#d97706" color="#d97706" />
                    </div>

                    <div className="progress-bar-bg" style={{ flex: 1 }}>
                      <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                    </div>

                    <div style={{ width: '65px', fontSize: '0.82rem', color: '#64748b', textAlign: 'right' }}>
                      {count} ({percentage}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subject Average Ratings */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
              <BookOpen size={16} color="#2563eb" /> Subject Rating Summary
            </h3>

            {subjectReport.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '0.88rem', textAlign: 'center', padding: '16px 0' }}>
                No feedback data recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {subjectReport.map((sub) => (
                  <div key={sub.subject} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.88rem', color: '#0f172a' }}>{sub.subject}</span>
                      <span style={{ fontWeight: '700', color: '#d97706', fontSize: '0.85rem' }}>
                        ★ {sub.avgRating} / 5 ({sub.totalFeedback})
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${(sub.avgRating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Faculty Summary Table */}
        <div className="glass-card" style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '14px', color: '#0f172a' }}>
            Faculty Performance Report Table
          </h3>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Subject</th>
                  <th>Total Feedbacks</th>
                  <th>Avg Rating</th>
                  <th>Star Distribution (5★ to 1★)</th>
                </tr>
              </thead>
              <tbody>
                {facultyReport.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                      No faculty feedback recorded.
                    </td>
                  </tr>
                ) : (
                  facultyReport.map((fac) => (
                    <tr key={fac.faculty}>
                      <td style={{ fontWeight: '700', color: '#0f172a' }}>{fac.faculty}</td>
                      <td>{fac.subject}</td>
                      <td>
                        <span className="badge badge-cyan">{fac.totalFeedback} votes</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: '700', color: '#d97706' }}>
                          ★ {fac.avgRating} / 5
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
                          <span style={{ color: '#059669', fontWeight: '600' }}>5★: {fac.distribution[5]}</span>
                          <span style={{ color: '#2563eb', fontWeight: '600' }}>4★: {fac.distribution[4]}</span>
                          <span style={{ color: '#d97706', fontWeight: '600' }}>3★: {fac.distribution[3]}</span>
                          <span style={{ color: '#dc2626', fontWeight: '600' }}>2★: {fac.distribution[2]}</span>
                          <span style={{ color: '#991b1b', fontWeight: '600' }}>1★: {fac.distribution[1]}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Raw Feedback Submissions Log */}
      <div className="glass-card no-print">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', margin: 0, color: '#0f172a' }}>
              Student Feedback Records (MongoDB)
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              Showing {feedbacks.length} records
            </p>
          </div>

          {feedbacks.length > 0 && (
            <button className="btn btn-danger btn-sm" onClick={handleClearAll}>
              <Trash2 size={13} /> Clear All Records
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '16px' }}>
          
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search Reg No or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '34px' }}
            />
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          </div>

          <div>
            <select
              className="form-control"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="All">All Subjects</option>
              {subjectReport.map((s) => (
                <option key={s.subject} value={s.subject}>{s.subject}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="form-control"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              <option value="All">All Faculty</option>
              {facultyReport.map((f) => (
                <option key={f.faculty} value={f.faculty}>{f.faculty}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Table of Submissions */}
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Reg No</th>
                <th>Student Details</th>
                <th>Subject & Faculty</th>
                <th>Rating</th>
                <th>Queries / Suggestions</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                    Loading records from MongoDB...
                  </td>
                </tr>
              ) : feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                    No matching feedback records.
                  </td>
                </tr>
              ) : (
                feedbacks.map((item) => (
                  <tr key={item._id}>
                    <td style={{ fontWeight: '700', color: '#2563eb' }}>{item.regNo}</td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{item.studentName}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.clgEmail} | {item.phnNo}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{item.subject}</div>
                      <div style={{ fontSize: '0.8rem', color: '#0284c7' }}>Prof: {item.faculty}</div>
                    </td>
                    <td>
                      <span className="badge badge-amber">★ {item.rating} / 5</span>
                    </td>
                    <td style={{ maxWidth: '220px', fontSize: '0.85rem', color: '#475569' }}>
                      {item.queriesSuggestions || <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>None</span>}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        style={{ padding: '3px 8px' }}
                        onClick={() => handleDeleteFeedback(item._id)}
                        title="Delete entry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
