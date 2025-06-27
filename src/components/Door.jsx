import React from 'react';
import { motion } from 'framer-motion';

const Door = ({ frameColor = 'gray', doorColor = 'brown', type = 'standard', isOpen = false, onClick }) => {
  const doorVariants = {
    closed: { rotateY: 0, transition: { duration: 0.5 } },
    open: { rotateY: -90, transition: { duration: 0.5 } },
  };

  const frameStyle = {
    position: 'relative',
    width: '120px',
    height: '240px',
    backgroundColor: frameColor,
    borderTopLeftRadius: '60px',
    borderTopRightRadius: '60px',
    overflow: 'hidden',
  };

  const doorStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    width: '100px',
    height: '220px',
    background: doorColor === 'red' ? 'red' : 'repeating-linear-gradient(0deg, #8B4513, #8B4513 5px, #A0522D 5px, #A0522D 10px)',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
    transformOrigin: 'left',
  };

  return (
    <motion.div style={{ perspective: '1000px' }}>
      <div style={frameStyle}>
        <motion.div
          style={doorStyle}
          variants={doorVariants}
          animate={isOpen ? 'open' : 'closed'}
          onClick={onClick}
        >
          {/* Hinges */}
          <div style={{
            position: 'absolute',
            left: '-5px',
            top: '20px',
            width: '10px',
            height: '30px',
            backgroundColor: 'black',
            borderRadius: '5px',
          }} />
          <div style={{
            position: 'absolute',
            left: '-5px',
            bottom: '20px',
            width: '10px',
            height: '30px',
            backgroundColor: 'black',
            borderRadius: '5px',
          }} />
          {/* Handle */}
          <div style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            backgroundColor: 'black',
            borderRadius: '50%',
          }} />
          {/* Prison window */}
          {type === 'prison' && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '60px',
              height: '60px',
              backgroundColor: 'gray',
              display: 'flex',
              justifyContent: 'space-around',
            }}>
              <div style={{ width: '5px', backgroundColor: 'black' }} />
              <div style={{ width: '5px', backgroundColor: 'black' }} />
              <div style={{ width: '5px', backgroundColor: 'black' }} />
            </div>
          )}
          {/* Red door straps */}
          {doorColor === 'red' && (
            <>
              <div style={{
                position: 'absolute',
                top: '30px',
                left: 0,
                width: '100%',
                height: '10px',
                backgroundColor: 'black',
              }} />
              <div style={{
                position: 'absolute',
                bottom: '30px',
                left: 0,
                width: '100%',
                height: '10px',
                backgroundColor: 'black',
              }} />
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Door;