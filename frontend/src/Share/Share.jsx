import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Share = () => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Посмотри эту новость!");

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
    setOpen(false);
  };

  return (
    <Wrapper ref={wrapperRef}>
      <button className="button" onClick={() => setOpen((prev) => !prev)}>
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="icon">
          <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
        </svg>
        Share
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="popup"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <button onClick={() => handleShare('facebook')}>Facebook</button>
            <button onClick={() => handleShare('twitter')}>Twitter</button>
            <button onClick={() => handleShare('whatsapp')}>WhatsApp</button>
          </motion.div>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: inline-block;

  .button {
    cursor: pointer;
    padding: 10px;
    font-size: 1em;
    height: 48px;
    width: 106px;
    aspect-ratio: 1/0.25;
    color: white;
    background-color: #1d1d1d;
    border-radius: 16px;
    outline: 0.1em solid #353535;
    border: none;
    box-shadow:
      inset -2px -2px 5px rgba(255, 255, 255, 0.2),
      inset 2px 2px 5px rgba(0, 0, 0, 0.1),
      4px 4px 10px rgba(0, 0, 0, 0.4),
      -2px -2px 8px rgba(255, 255, 255, 0.1);
    position: relative;
  }

  .icon {
    fill: white;
    width: 1em;
    aspect-ratio: 1;
    margin-right: 0.5em;
  }

  .popup {
    position: absolute;
    top: 110%;
    right: 0;
    background: #fff;
    color: #000;
    border: 1px solid #ccc;
    padding: 10px 12px;
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 10;

    button {
      background: none;
      border: none;
      cursor: pointer;
      color: #333;
      padding: 4px 0;
      text-align: left;

      &:hover {
        color: #0077ff;
      }
    }
  }
`;

export default Share;
