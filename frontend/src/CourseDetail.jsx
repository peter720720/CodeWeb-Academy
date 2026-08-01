import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function CourseDetail({ courses, user }) {
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

  return (
    <section className="section-block">
      <div className="section-title">
        <span className="eyebrow">Track</span>
        <h2>Your Track: {course.title}</h2>
        <p>{course.details}</p>
      </div>

      <div className="course-card" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div className="course-info">
          <p className="course-tag">{course.category}</p>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p className="course-detail-text">{course.details}</p>
          <Link className="learn-more" to="/courses">
            Browse all courses
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CourseDetail;
