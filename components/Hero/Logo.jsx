import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Logo.css';

import bottomLeftBig from '/Logo/bottomleftbig.svg';
import bottomLeftSmall from '/Logo/bottomleftsmall.svg';
import bottomRightBig from '/Logo/bottomrightbig.svg';
import bottomRightSmall from '/Logo/bottomrightsmall.svg';
import actsText from '/Logo/image 3.svg';
import leftBottomBig from '/Logo/leftbottombig.svg';
import leftTopBig from '/Logo/lefttopbig.svg';
import topRightBig from '/Logo/Toprightbig.svg';
import topRightSmall from '/Logo/toprightsmall.svg';

const containerVariants = {
  initial: {
    width: '250px',
    height: '250px',
    borderRadius: '20px',
    backgroundColor: '#000000',
  },
  animate: {
    width: '100vw',
    height: '100vh',
    borderRadius: '0px',
    backgroundColor: '#000000',
    transition: { duration: 1.5, ease: 'easeInOut' },
  },
};

const textVariants = {
  initial: { opacity: 1, scale: 1, x: 0, y: 0 },
  animate: {
    x: '-42vw',
    y: '-42vh',
    scale: 0.7,
    transition: { duration: 1.5, ease: 'easeInOut' },
  },
  hover: {
    scale: 0.75,
    filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.7))',
  }
};

const Logo = ({ isAnimating, onAnimationComplete }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isHoverEnabled, setIsHoverEnabled] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDynamicProperties = (baseScale, baseAnimateProps) => {
    if (windowWidth < 768) {
      return { opacity: 0, scale: 0 };
    }
    return {
      opacity: 1,
      scale: baseScale,
      x: baseAnimateProps.x || 0,
      y: baseAnimateProps.y || 0,
    };
  };

  const createTriangleVariants = (baseScale, baseAnimateProps) => {
    const animateState = getDynamicProperties(baseScale, baseAnimateProps);
    return {
      initial: { scale: 1, x: 0, y: 0, opacity: 1 },
      animate: animateState,
      hover: {
        scale: animateState.scale ? animateState.scale * 1.05 : 0,
        filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))',
      },
    };
  };

  const topRightBigVariants = createTriangleVariants(5, { x: -200 });
  const topRightSmallVariants = createTriangleVariants(4, { x: -250, y: 100 });
  const bottomLeftBigVariants = createTriangleVariants(4, { x: 100, y: -50 });
  const bottomLeftSmallVariants = createTriangleVariants(4, { x: 300, y: -80 });
  const bottomRightBigVariants = createTriangleVariants(5, { x: -200, y: -100 });
  const bottomRightSmallVariants = createTriangleVariants(4, { x: -200, y: -100 });
  const leftBottomBigVariants = createTriangleVariants(4, { x: 0, y: -300 });
  const leftTopBigVariants = createTriangleVariants(4, { x: -30, y: 100 });

  const motionProps = (variants) => ({
    variants,
    initial: "initial",
    animate: isAnimating ? "animate" : "initial",
    whileHover: isHoverEnabled ? "hover" : undefined,
    transition: { duration: 1.5, ease: 'easeInOut' },
  });

  return (
    <motion.div
      className="logo-container"
      variants={containerVariants}
      initial="initial"
      animate={isAnimating ? 'animate' : 'initial'}
      onAnimationComplete={() => {
        onAnimationComplete();
        setIsHoverEnabled(true);
      }}
    >
      <motion.img
        src={actsText}
        alt="ACTS"
        className="acts-text"
        {...motionProps(textVariants)}
      />
      <motion.img
        src={topRightBig}
        alt="decoration"
        className="top-right-big"
        {...motionProps(topRightBigVariants)}
      />
      <motion.img
        src={topRightSmall}
        alt="decoration"
        className="top-right-small"
        {...motionProps(topRightSmallVariants)}
      />
      <motion.img
        src={bottomLeftBig}
        alt="decoration"
        className="bottom-left-big"
        {...motionProps(bottomLeftBigVariants)}
      />
      <motion.img
        src={bottomLeftSmall}
        alt="decoration"
        className="bottom-left-small"
        {...motionProps(bottomLeftSmallVariants)}
      />
      <motion.img
        src={bottomRightBig}
        alt="decoration"
        className="bottom-right-big"
        {...motionProps(bottomRightBigVariants)}
      />
      <motion.img
        src={bottomRightSmall}
        alt="decoration"
        className="bottom-right-small"
        {...motionProps(bottomRightSmallVariants)}
      />
      <motion.img
        src={leftBottomBig}
        alt="decoration"
        className="left-bottom-big"
        {...motionProps(leftBottomBigVariants)}
      />
      <motion.img
        src={leftTopBig}
        alt="decoration"
        className="left-top-big"
        {...motionProps(leftTopBigVariants)}
      />
    </motion.div>
  );
};

export default Logo;