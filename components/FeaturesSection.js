import { useEffect, useRef } from 'react';

const FeaturesSection = () => {
  const featureBoxesRef = useRef([]);
  const percentageTextRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-5');
        }
      });
    }, { threshold: 0.1 });

    featureBoxesRef.current.forEach(box => {
      if (box) {
        box.classList.add('opacity-0', 'translate-y-5', 'transition-all', 'duration-600', 'ease-out');
        observer.observe(box);
      }
    });

    const percentageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && percentageTextRef.current) {
          let count = 0;
          const target = 75;
          const duration = 2000;
          const increment = target / (duration / 16);
          
          const updateCount = () => {
            if (count < target) {
              count += increment;
              if (count > target) count = target;
              if (percentageTextRef.current) {
                percentageTextRef.current.textContent = Math.floor(count) + '%';
              }
              requestAnimatio