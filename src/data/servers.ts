import { countries, specialServers, getCountryByName } from './countries';

export interface Server {
  id: number;
  name: string;
  country: string;
  flag: string;
  city: string;
  users: number;
  capacity: number;
  ping: number;
  special?: boolean;
  specialTag?: string;
}

function generateServers(): Server[] {
  const servers: Server[] = [];
  let id = 1;

  // Special LTE | Анти-чебурнет servers for specific countries
  for (const s of specialServers) {
    const c = getCountryByName(s.country);
    if (!c) continue;
    servers.push({
      id: id++,
      name: `LTE | Анти-чебурнет | ${s.tag}`,
      country: s.country,
      flag: s.flag,
      city: c.cities[0],
      users: Math.floor(Math.random() * 200) + 50,
      capacity: Math.floor(Math.random() * 40) + 10,
      ping: Math.floor(Math.random() * 30) + 10,
      special: true,
      specialTag: 'LTE | Анти-чебурнет',
    });
  }

  // Russian #1 - #4 servers (RU flag, no city)
  for (let n = 1; n <= 4; n++) {
    servers.push({
      id: id++,
      name: `LTE | Анти-чебурнет | #${n}`,
      country: 'Russia',
      flag: '🇷🇺',
      city: '',
      users: Math.floor(Math.random() * 150) + 30,
      capacity: Math.floor(Math.random() * 35) + 8,
      ping: Math.floor(Math.random() * 25) + 5,
      special: true,
      specialTag: 'Анти-чебурнет',
    });
  }

  // Regular servers across countries
  for (const c of countries) {
    if (id > 170) break;
    for (const city of c.cities) {
      if (id > 170) break;
      // Skip if this is just one of the special countries' first city (avoid duplicate)
      servers.push({
        id: id++,
        name: city,
        country: c.en,
        flag: c.flag,
        city,
        users: Math.floor(Math.random() * 900) + 10,
        capacity: Math.floor(Math.random() * 90) + 5,
        ping: Math.floor(Math.random() * 200) + 5,
      });
    }
  }

  return servers.slice(0, 170);
}

export const servers = generateServers();
