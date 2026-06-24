export interface Server {
  id: number;
  name: string;
  country: string;
  flag: string;
  city: string;
  users: number;
  capacity: number;
  ping: number;
}

const countries = [
  { name: 'Japan', flag: '🇯🇵', cities: ['Tokyo', 'Osaka', 'Kyoto', 'Sapporo', 'Nagoya'] },
  { name: 'United States', flag: '🇺🇸', cities: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco', 'Seattle', 'Dallas', 'Boston', 'Denver', 'Atlanta'] },
  { name: 'Germany', flag: '🇩🇪', cities: ['Berlin', 'Frankfurt', 'Munich', 'Hamburg', 'Cologne'] },
  { name: 'United Kingdom', flag: '🇬🇧', cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Edinburgh'] },
  { name: 'France', flag: '🇫🇷', cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'] },
  { name: 'Canada', flag: '🇨🇦', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'] },
  { name: 'Netherlands', flag: '🇳🇱', cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'] },
  { name: 'Singapore', flag: '🇸🇬', cities: ['Singapore'] },
  { name: 'Australia', flag: '🇦🇺', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'] },
  { name: 'Brazil', flag: '🇧🇷', cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Curitiba'] },
  { name: 'South Korea', flag: '🇰🇷', cities: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Gwangju'] },
  { name: 'Switzerland', flag: '🇨🇭', cities: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne'] },
  { name: 'Sweden', flag: '🇸🇪', cities: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås'] },
  { name: 'Spain', flag: '🇪🇸', cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao'] },
  { name: 'Italy', flag: '🇮🇹', cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'] },
  { name: 'India', flag: '🇮🇳', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'] },
  { name: 'Russia', flag: '🇷🇺', cities: ['Moscow', 'St. Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan'] },
  { name: 'Poland', flag: '🇵🇱', cities: ['Warsaw', 'Kraków', 'Wrocław', 'Poznań', 'Łódź'] },
  { name: 'Turkey', flag: '🇹🇷', cities: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya'] },
  { name: 'UAE', flag: '🇦🇪', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'] },
];

function generateServers(): Server[] {
  const servers: Server[] = [];
  let id = 1;
  
  for (const country of countries) {
    for (const city of country.cities) {
      const numServers = Math.ceil(Math.random() * 2);
      for (let i = 0; i < numServers && id <= 170; i++) {
        servers.push({
          id,
          name: `${city} ${i > 0 ? i + 1 : ''}`,
          country: country.name,
          flag: country.flag,
          city,
          users: Math.floor(Math.random() * 900) + 50,
          capacity: Math.floor(Math.random() * 90) + 10,
          ping: Math.floor(Math.random() * 200) + 5,
        });
        id++;
      }
    }
  }
  
  while (servers.length < 170) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const city = country.cities[Math.floor(Math.random() * country.cities.length)];
    servers.push({
      id,
      name: `${city} ${id}`,
      country: country.name,
      flag: country.flag,
      city,
      users: Math.floor(Math.random() * 900) + 50,
      capacity: Math.floor(Math.random() * 90) + 10,
      ping: Math.floor(Math.random() * 200) + 5,
    });
    id++;
  }
  
  return servers.slice(0, 170);
}

export const servers = generateServers();
