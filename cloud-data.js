/* Shared published content. Static fallback remains available if Supabase is unreachable. */
(async function () {
  const URL = "https://dnpejlvzcefollynnixy.supabase.co";
  const KEY = "sb_publishable_94yxuQMMiyWmjUwjgU3tuA_UOijez7q";
  try {
    const response = await fetch(URL + '/rest/v1/site_content?id=eq.1&select=content', {
      headers: { apikey: KEY, Authorization: 'Bearer ' + KEY }
    });
    if (!response.ok) throw new Error('Cloud content unavailable');
    const rows = await response.json();
    const content = rows && rows[0] && rows[0].content;
    if (content && content.business && Array.isArray(content.vehicles)) {
      window.BUSINESS = Object.assign({}, window.BUSINESS || {}, content.business);
      // Keep owner-published real vehicles, but always refresh the clearly marked demo cards
      // from the static catalogue so an older cloud snapshot cannot hide newer demo entries.
      const staticVehicles = Array.isArray(window.VEHICLES) ? window.VEHICLES : [];
      const cloudRealVehicles = content.vehicles.filter(vehicle => !vehicle.demo);
      const staticRealVehicles = staticVehicles.filter(vehicle => !vehicle.demo);
      const demoVehicles = staticVehicles.filter(vehicle => vehicle.demo);
      const mergedVehicles = [...cloudRealVehicles, ...staticRealVehicles, ...demoVehicles];
      const seenVehicleIds = new Set();
      window.VEHICLES = mergedVehicles.filter(vehicle => {
        const id = vehicle && vehicle.id;
        if (!id || seenVehicleIds.has(id)) return false;
        seenVehicleIds.add(id);
        return true;
      });
      window.REVIEWS = Array.isArray(content.reviews) ? content.reviews : [];
    }
  } catch (error) {
    console.warn('Using static site data; shared content could not be loaded.', error);
  }
  const script = document.createElement('script');
  script.src = 'app.js';
  script.defer = false;
  document.body.appendChild(script);
})();
