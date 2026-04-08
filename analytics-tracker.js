// AlertPRO Analytics Tracker
// Simple client-side event tracking

(function() {
  const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace with actual URL
  const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with actual key

  // Generate session ID
  let sessionId = sessionStorage.getItem('ap_session');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('ap_session', sessionId);
  }

  // Track page view
  function trackPageView() {
    fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        page_path: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        session_id: sessionId
      })
    }).catch(err => console.log('Analytics error:', err));
  }

  // Track click events
  function trackClick(elementType, elementLabel, elementHref) {
    fetch(`${SUPABASE_URL}/rest/v1/click_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        page_path: window.location.pathname,
        element_type: elementType,
        element_label: elementLabel,
        element_href: elementHref,
        session_id: sessionId,
        user_agent: navigator.userAgent
      })
    }).catch(err => console.log('Analytics error:', err));
  }

  // Track form submission
  function trackFormSubmission(formType, city, packageInterest) {
    fetch(`${SUPABASE_URL}/rest/v1/form_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        page_path: window.location.pathname,
        form_type: formType,
        session_id: sessionId,
        city: city,
        package_interest: packageInterest,
        user_agent: navigator.userAgent
      })
    }).catch(err => console.log('Analytics error:', err));
  }

  // Initialize tracking
  document.addEventListener('DOMContentLoaded', function() {
    trackPageView();

    // Track all CTA button clicks
    document.querySelectorAll('a[href*="contact"], .btn-red, .nav-cta, .pkg-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        trackClick('cta_button', this.textContent.trim(), this.href);
      });
    });

    // Track phone number clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(phone => {
      phone.addEventListener('click', function() {
        trackClick('phone_call', this.textContent.trim(), this.href);
      });
    });

    // Track form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', function() {
        const city = this.querySelector('[name="city"]')?.value || '';
        const packageInterest = this.querySelector('[name="package"]')?.value || '';
        trackFormSubmission('quote_request', city, packageInterest);
      });
    });
  });

  // Make tracking functions available globally
  window.AlertProAnalytics = {
    trackClick,
    trackFormSubmission
  };
})();
