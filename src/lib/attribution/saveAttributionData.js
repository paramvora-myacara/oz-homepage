function getCookie(name) {
  const cookieName = `_uc_${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(cookieName) === 0) {
      return c.substring(cookieName.length, c.length);
    }
  }
  return "";
}

export function saveAttributionData() {
  const attributionData = {
    utm_source: getCookie('utm_source'),
    utm_medium: getCookie('utm_medium'),
    utm_campaign: getCookie('utm_campaign'),
    utm_term: getCookie('utm_term'),
    utm_content: getCookie('utm_content'),
    initial_utm_source: getCookie('initial_utm_source'),
    initial_utm_medium: getCookie('initial_utm_medium'),
    initial_utm_campaign: getCookie('initial_utm_campaign'),
    initial_utm_term: getCookie('initial_utm_term'),
    initial_utm_content: getCookie('initial_utm_content'),
    initial_referrer: getCookie('referrer'),
    last_referrer: getCookie('last_referrer'),
    initial_landing_page_url: getCookie('initial_landing_page'),
    visits: getCookie('visits'),
  };

  fetch('/api/attribution', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(attributionData),
  })
  .then(response => response.json())
  .then(data => {
    if (!data.success) {
        console.error('Failed to save attribution data:', data.error);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
} 