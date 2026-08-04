import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StudentMessages from './StudentMessages';

function CourseDetail({ courses, user, accentColor }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find((item) => item.id === id);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!course) {
    return (
      <section className="section-block">
        <div className="section-title">
          <span className="eyebrow">Course Not Found</span>
          <h2>We couldn't locate that course.</h2>
          <p>Please choose one of the available CodeWeb pathways below.</p>
        </div>
        <Link className="button button-primary" to="/courses" style={{ display: 'inline-block', marginTop: '16px' }}>
          View All Courses
        </Link>
      </section>
    );
  }

  const formatPrice = (value) => {
    if (value === 0) return 'Pending';
    if (value == null || value === '') return 'Contact for pricing';
    return `₦${Number(value).toLocaleString()}`;
  };

  const getCourseImage = (courseId) => {
    switch (courseId) {
      case 'frontend':
        return '/frontend-dev.png';
      case 'backend':
        return '/graph.png';
      case 'fullstack':
        return '/full-stack.png';
      case 'cyber':
        return '/cyber.png';
      case 'data':
        return '/data-analytics.png';
      case 'graphics':
        return '/graphic-design.png';
      case 'production':
        return '/productin design.png';
      case 'product':
        return '/product-management.png';
      default:
        return course.image || '/products.png';
    }
  };

  const courseImage = getCourseImage(course.id);

  return (
    <section className="section-block">
      <div className="section-title">
        <span className="eyebrow">Track</span>
        <h2>Your Track: {course.title}</h2>
        <p>{course.details}</p>
        {course.scheduleDate || course.scheduleTime ? (
          <p style={{ marginTop: '14px', fontWeight: 700, color: accentColor }}>
            {course.scheduleDate ? `Class Date: ${new Date(course.scheduleDate).toLocaleDateString()}` : 'Date not set'}
            {course.scheduleTime ? ` • ${course.scheduleTime}` : ''}
          </p>
        ) : null}
      </div>

      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto 32px' }}>
        <img
          src={courseImage}
          alt={`${course.title} course`}
          style={{ width: '100%', height: '580px', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 32px 100px rgba(0, 0, 0, 0.35)' }}
        />
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', display: 'grid', gap: '20px', textAlign: 'center' }}>
        <span className="eyebrow" style={{ margin: '0 auto', letterSpacing: '0.28em', color: '#fbbf24' }}>DATA</span>
        <h3 style={{ margin: 0 }}>{course.title}</h3>
        <p style={{ margin: '0 auto', maxWidth: '680px', lineHeight: 1.9, color: '#cbd5e1' }}>
          Build practical analytics skills using Python, SQL, statistics, and modern visualization tools. This track helps you turn raw data into clear insight, dashboards, and decisions.
        </p>
        <p style={{ margin: '0 auto', maxWidth: '680px', lineHeight: 1.9, color: '#cbd5e1' }}>
          Learn industry-ready workflows for preparing data, finding patterns, and communicating results to stakeholders. Ideal for aspiring data analysts, researchers, and business intelligence professionals.
        </p>
        <Link className="learn-more" to="/courses" style={{ justifySelf: 'center' }}>
          Browse all courses
        </Link>
      </div>

      <StudentMessages accentColor={accentColor} />
    </section>
  );
}

export default CourseDetail;
