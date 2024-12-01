import Scaledrone from 'scaledrone-node';
import fetch from 'node-fetch';

const locations = [
  {
    clientId: 'bobid',
    name: 'Bob',
    longitude: -122.164275,
    latitude: 37.442909,
  },
  {
    clientId: 'aliceid',
    name: 'Alice',
    longitude: -122.002131,
    latitude: 37.409883,
  },
  {
    clientId: 'johnid',
    name: 'John',
    longitude: -122.076628,
    latitude: 37.394109,
  },
];

async function doAuthRequest(clientId, name) {
  try {
    const response = await fetch(
      'http://localhost:3000/users/localization-service',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId, name }),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
}

(async () => {
  try {
    const tokens = await Promise.all(
      locations.map(async (location) => {
        return await doAuthRequest(location.clientId, location.name);
      }),
    );

    tokens.forEach((token, index) => {
      const location = locations[index];
      const drone = new Scaledrone('7PfEC7lkelNl1Zx0');
      drone.on('error', (error) => console.error(error));
      drone.on('open', () => {
        drone.authenticate(token);
      });
      drone.on('authenticate', () => {
        setInterval(() => {
          const delta = moveInRandomDirection();
          location.latitude += delta.dlat;
          location.longitude += delta.dlon;
          drone.publish({
            room: 'observable-locations',
            message: location,
          });
        }, 1000);
      });
      drone.subscribe('observable-locations');
    });
  } catch (error) {
    console.error('Error in fetching tokens:', error);
  }
})();

function moveInRandomDirection(maxDistance = 0.005) {
  const angle = Math.random() * Math.PI * 2;
  const distance = maxDistance * Math.random();
  return {
    dlat: Math.cos(angle) * distance,
    dlon: Math.sin(angle) * distance,
  };
}
