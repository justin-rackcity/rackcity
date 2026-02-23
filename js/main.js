/* ============================================
   RACK CITY — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navMobile = document.querySelector('.nav-mobile');

  if (menuToggle && navMobile) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMobile.classList.toggle('open');
      document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Sticky Header Scroll Detection ---
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Accordion ---
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all
        accordionItems.forEach(other => {
          other.classList.remove('active');
          const otherContent = other.querySelector('.accordion-content');
          if (otherContent) otherContent.style.maxHeight = null;
        });

        // Open clicked (if it was closed)
        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

  // --- Fade-In on Scroll (IntersectionObserver) ---
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(el => observer.observe(el));
  }

  // --- Lazy Load Videos ---
  const lazyVideos = document.querySelectorAll('video[data-src]');
  if (lazyVideos.length > 0 && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const video = entry.target;
            const source = video.querySelector('source');
            if (source && source.dataset.src) {
              source.src = source.dataset.src;
              video.load();
              video.play().catch(() => {});
            }
            videoObserver.unobserve(video);
          }
        });
      },
      { threshold: 0.25 }
    );

    lazyVideos.forEach(video => videoObserver.observe(video));
  }

  // --- Mobile FAB: Hide when at top ---
  const fab = document.querySelector('.mobile-fab');
  if (fab) {
    const fabObserver = () => {
      if (window.scrollY > 300) {
        fab.style.transform = 'translateY(0)';
        fab.style.opacity = '1';
      } else {
        fab.style.transform = 'translateY(100px)';
        fab.style.opacity = '0';
      }
    };
    fab.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    window.addEventListener('scroll', fabObserver, { passive: true });
    fabObserver();
  }

});
