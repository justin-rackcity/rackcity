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

  // --- Waitlist Modal ---
  const WAITLIST_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzLWwsL-OdIEWIVgDUo4uAULrS7ioiBnL1Ex0mZsnIXdANra5OL8CBNXB7754r6bq_L/exec';

  const waitlistModal = document.getElementById('waitlistModal');
  const waitlistForm  = document.getElementById('waitlistForm');
  const waitlistSuccess = document.getElementById('waitlistSuccess');

  if (waitlistModal) {
    // Open
    document.querySelectorAll('.waitlist-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        waitlistModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close — backdrop or X button
    waitlistModal.querySelector('.waitlist-modal-backdrop').addEventListener('click', closeWaitlist);
    waitlistModal.querySelector('.waitlist-modal-close').addEventListener('click', closeWaitlist);

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeWaitlist();
    });

    // Submit
    waitlistForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name  = document.getElementById('waitlistName').value.trim();
      const email = document.getElementById('waitlistEmail').value.trim();
      if (!name || !email) return;

      const url = WAITLIST_SCRIPT_URL + '?' + new URLSearchParams({ name, email }).toString();
      fetch(url, { method: 'GET', mode: 'no-cors' }).finally(() => {
        waitlistForm.style.display = 'none';
        waitlistSuccess.style.display = 'block';
        setTimeout(() => {
          closeWaitlist();
          waitlistForm.style.display = '';
          waitlistSuccess.style.display = '';
          waitlistForm.reset();
        }, 3000);
      });
    });
  }

  function closeWaitlist() {
    if (waitlistModal) {
      waitlistModal.classList.remove('open');
      document.body.style.overflow = '';
    }
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
