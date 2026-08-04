import React from 'react';

function Courses({ courses }) {
  return (
    <section className="section-block">
      <div className="section-title">
        <span className="eyebrow">Course Pathways</span>
        <h2>Comprehensive courses built for modern teams and creative careers.</h2>
        <p>
          Choose the pathway that matches your goals and enjoy hands-on learning with mentorship, practice builds, and industry-aligned guidance.
        </p>
      </div>

      <div className="course-grid">
        {courses.map((course) => {
          // Identify the targets for custom images
          const isFrontend = course.id === 'frontend';
          const isBackend = course.id === 'backend';
          const isFullstack = course.id === 'fullstack';
          const isCyber = course.id === 'cyber';
          const isData = course.id === 'data';
          const isGraphics = course.id === 'graphics';
          const isProduction = course.id === 'production';
          const isProduct = course.id === 'product';
          
          // Determine the correct background image path
          let cardImage = course.image;
          if (isFrontend) {
            cardImage = "/ChatGPT Image Jul 8, 2026, 02_31_10 AM.png";
          } else if (isBackend) {
            cardImage = "/ChatGPT Image Jul 8, 2026, 02_24_17 AM.png";
          } else if (isFullstack) {
            cardImage = "/full-stack.png";
          } else if (isCyber) {
            cardImage = "/cyber.png";
          } else if (isData) {
            cardImage = "/data-analytics.png";
          } else if (isGraphics) {
            cardImage = "/graphic-design.png";
          } else if (isProduction) {
            cardImage = "/productin design.png"; // Matches file spelling exactly
          } else if (isProduct) {
            cardImage = "/product-management.png";
          }
          
          const formatPrice = (value) => {
            if (value === 0) return 'Pending';
            if (value == null || value === '') return 'Contact for pricing';
            return `₦${Number(value).toLocaleString()}`;
          };
          return (
            <article className="course-card" key={course.id}>
              <div 
                className="course-image" 
                style={{ backgroundImage: `url("${cardImage}")` }} 
              />
              <div className="course-info">
                <p className="course-tag">{course.category}</p>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p className="course-price" style={{ margin: '16px 0 0', fontWeight: 700 }}>{formatPrice(course.price)}</p>
                <p className="course-detail-text">{course.details}</p>
                <a className="learn-more" href="/courses">Learn more</a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Courses;
