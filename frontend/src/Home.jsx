import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Home({ courses }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCourse = courses[activeIndex];
  const [direction, setDirection] = useState(1); 

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % courses.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev + courses.length - 1) % courses.length);
  };

  // Sweet Automatic Carousel Engine Loop
  useEffect(() => {
    const autoSlideTimer = setInterval(() => {
      setDirection(1); 
      setActiveIndex((prev) => (prev + 1) % courses.length);
    }, 3000);

    return () => clearInterval(autoSlideTimer);
  }, [courses.length]);

  // Determine the correct image for the carousel display box dynamically
  let carouselImage = activeCourse.image;
  if (activeCourse.id === 'frontend') {
    carouselImage = "/frontend-dev.png";
  } else if (activeCourse.id === 'backend') {
    carouselImage = "/ChatGPT Image Jul 8, 2026, 02_24_17 AM.png";
  } else if (activeCourse.id === 'fullstack') {
    carouselImage = "/full-stack.png";
  } else if (activeCourse.id === 'cyber') {
    carouselImage = "/cyber.png";
  } else if (activeCourse.id === 'data') {
    carouselImage = "/data-analytics.png";
  } else if (activeCourse.id === 'graphics') {
    carouselImage = "/graphic-design.png";
  } else if (activeCourse.id === 'production') {
    carouselImage = "/products.png"; 
  } else if (activeCourse.id === 'product') {
    carouselImage = "/manager.png"; // Maps Product Management dynamically to manager.png
  }

  // Animation variants modified to remove all fading (opacity is forced to 1)
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1, // Solid entry
    }),
    center: {
      x: 0,
      opacity: 1, // Solid center
      transition: { x: { type: 'spring', stiffness: 220, damping: 26 } }
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1, // Solid exit
      transition: { x: { type: 'spring', stiffness: 220, damping: 26 } }
    }),
  };

  return (
    <section className="home-page">
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Welcome to CodeWeb</span>
          <h1>Build skills, launch careers, and join the next wave of digital makers.</h1>
          <p>
            At CodeWeb Academy, we guide learners through real-world web, product and design courses. Explore
            focused pathways for frontend, backend, cybersecurity, data analysis, and product strategy.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/courses">View Courses</Link>
          </div>
        </div>
        <div className="hero-image" aria-hidden="true" style={{ width: '100%', height: 'auto', minHeight: '520px', position: 'relative', alignSelf: 'stretch' }}>
          <div className="hero-image-frame" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <img
              src="/ChatGPT Image Jul 8, 2026, 02_56_01 AM.png"
              alt="Developer working at code panel workspace"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                display: 'block',
                borderRadius: 'inherit'
              }}
            />
          </div>
        </div>
      </div>

      <div className="course-intro">
        <div>
          <h2>Explore the learning path that fits your ambition.</h2>
          <p>
            Our courses are crafted for beginners, career switchers, and professionals ready to level up. Each program
            includes project-driven lessons, mentorship guidance, and clear outcomes so students can launch confident work.
          </p>
        </div>
        <Link className="button button-tertiary" to="/courses">See all course outlines</Link>
      </div>

      <div className="carousel-panel" style={{ position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              gap: '28px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <div className="carousel-copy" style={{ flex: '1 1 450px' }}>
              <p className="eyebrow">Featured course</p>
              <h3>{activeCourse.title}</h3>
              <p>{activeCourse.description}</p>
              <p className="course-details">{activeCourse.details}</p>
              <Link className="button button-primary" to="/courses">Learn more</Link>
            </div>
            <div className="carousel-image" style={{ backgroundImage: `url("${carouselImage}")`, flex: '1 1 380px' }} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="carousel-controls">
        <button type="button" className="button-outline" onClick={handlePrev}>Previous</button>
        <span>{activeCourse.category}</span>
        <button type="button" className="button-outline" onClick={handleNext}>Next</button>
      </div>
    </section>
  );
}

export default Home;
