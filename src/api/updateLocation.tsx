const API_URL = 'https://capstone-runeroutes-wgp6.onrender.com';

// src/api/updateLocation.ts
export const updateBackendLocation = async (
    accessToken: string,
    userId: string,
    lat: number,
    lon: number
  ) => {
    try {
      const response = await fetch('https://capstone-runeroutes-wgp6.onrender.com/auth/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId, lat, lon }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.warn(`❌ Server error ${response.status}:`, data);
      } else {
        console.log("✅ Synced location:", data);
      }
    } catch (err: any) {
      console.error("❌ Error syncing location:", err.message);
    }
  };
  
