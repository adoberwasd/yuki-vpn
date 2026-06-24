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

  // Special servers first
  const specials: Server[] = [
    { id: id++, name: 'LTE | Анти-чебурнет', country: 'Germany', flag: '🇩🇪', city: 'Frankfurt', users: 120, capacity: 35, ping: 28, special: true, specialTag: 'LTE' },
    { id: id++, name: 'Анти-чебурнет | Secure', country: 'Germany', flag: '🇩🇪', city: 'Berlin', users: 89, capacity: 42, ping: 35, special: true, specialTag: 'Анти-чебурнет' },
    { id: id++, name: 'LTE | Premium Stream', country: 'United Kingdom', flag: '🇬🇧', city: 'London', users: 200, capacity: 30, ping: 22, special: true, specialTag: 'LTE' },
    { id: id++, name: 'Анти-чебурнет | Fast', country: 'United Kingdom', flag: '🇬🇧', city: 'Manchester', users: 75, capacity: 28, ping: 30, special: true, specialTag: 'Анти-чебурнет' },
    { id: id++, name: 'LTE | Gaming', country: 'Netherlands', flag: '🇳🇱', city: 'Amsterdam', users: 300, capacity: 45, ping: 15, special: true, specialTag: 'LTE' },
    { id: id++, name: 'Анти-чебурнет | Ultra', country: 'Netherlands', flag: '🇳🇱', city: 'Rotterdam', users: 150, capacity: 22, ping: 18, special: true, specialTag: 'Анти-чебурнет' },
    { id: id++, name: 'LTE | Streaming', country: 'Austria', flag: '🇦🇹', city: 'Vienna', users: 90, capacity: 25, ping: 24, special: true, specialTag: 'LTE' },
    { id: id++, name: 'Анти-чебурнет | Shield', country: 'Austria', flag: '🇦🇹', city: 'Innsbruck', users: 60, capacity: 31, ping: 32, special: true, specialTag: 'Анти-чебурнет' },
  ];

  servers.push(...specials);

  // 162 servers across many countries - mostly 1 per country, some with multiple cities
  const countryData = [
    { name: 'Japan', flag: '🇯🇵', cities: ['Tokyo', 'Osaka', 'Kyoto'] },
    { name: 'United States', flag: '🇺🇸', cities: ['New York', 'Los Angeles', 'Chicago', 'Miami'] },
    { name: 'Canada', flag: '🇨🇦', cities: ['Toronto', 'Vancouver'] },
    { name: 'United Kingdom', flag: '🇬🇧', cities: ['London', 'Birmingham'] },
    { name: 'Germany', flag: '🇩🇪', cities: ['Berlin', 'Munich'] },
    { name: 'France', flag: '🇫🇷', cities: ['Paris', 'Lyon'] },
    { name: 'Netherlands', flag: '🇳🇱', cities: ['Amsterdam', 'Utrecht'] },
    { name: 'Austria', flag: '🇦🇹', cities: ['Vienna', 'Salzburg'] },
    { name: 'Sweden', flag: '🇸🇪', cities: ['Stockholm', 'Gothenburg'] },
    { name: 'Norway', flag: '🇳🇴', cities: ['Oslo'] },
    { name: 'Denmark', flag: '🇩🇰', cities: ['Copenhagen'] },
    { name: 'Finland', flag: '🇫🇮', cities: ['Helsinki'] },
    { name: 'Switzerland', flag: '🇨🇭', cities: ['Zurich', 'Geneva'] },
    { name: 'Belgium', flag: '🇧🇪', cities: ['Brussels'] },
    { name: 'Portugal', flag: '🇵🇹', cities: ['Lisbon'] },
    { name: 'Spain', flag: '🇪🇸', cities: ['Madrid', 'Barcelona'] },
    { name: 'Italy', flag: '🇮🇹', cities: ['Rome', 'Milan'] },
    { name: 'Greece', flag: '🇬🇷', cities: ['Athens'] },
    { name: 'Turkey', flag: '🇹🇷', cities: ['Istanbul', 'Ankara'] },
    { name: 'Russia', flag: '🇷🇺', cities: ['Moscow', 'St. Petersburg'] },
    { name: 'Poland', flag: '🇵🇱', cities: ['Warsaw'] },
    { name: 'Czech Republic', flag: '🇨🇿', cities: ['Prague'] },
    { name: 'Hungary', flag: '🇭🇺', cities: ['Budapest'] },
    { name: 'Romania', flag: '🇷🇴', cities: ['Bucharest'] },
    { name: 'Bulgaria', flag: '🇧🇬', cities: ['Sofia'] },
    { name: 'Croatia', flag: '🇭🇷', cities: ['Zagreb'] },
    { name: 'Serbia', flag: '🇷🇸', cities: ['Belgrade'] },
    { name: 'Ukraine', flag: '🇺🇦', cities: ['Kyiv'] },
    { name: 'Lithuania', flag: '🇱🇹', cities: ['Vilnius'] },
    { name: 'Latvia', flag: '🇱🇻', cities: ['Riga'] },
    { name: 'Estonia', flag: '🇪🇪', cities: ['Tallinn'] },
    { name: 'Ireland', flag: '🇮🇪', cities: ['Dublin'] },
    { name: 'Iceland', flag: '🇮🇸', cities: ['Reykjavik'] },
    { name: 'Australia', flag: '🇦🇺', cities: ['Sydney', 'Melbourne'] },
    { name: 'New Zealand', flag: '🇳🇿', cities: ['Auckland'] },
    { name: 'Singapore', flag: '🇸🇬', cities: ['Singapore'] },
    { name: 'Malaysia', flag: '🇲🇾', cities: ['Kuala Lumpur'] },
    { name: 'Thailand', flag: '🇹🇭', cities: ['Bangkok'] },
    { name: 'Indonesia', flag: '🇮🇩', cities: ['Jakarta'] },
    { name: 'Philippines', flag: '🇵🇭', cities: ['Manila'] },
    { name: 'Vietnam', flag: '🇻🇳', cities: ['Ho Chi Minh City'] },
    { name: 'South Korea', flag: '🇰🇷', cities: ['Seoul', 'Busan'] },
    { name: 'China', flag: '🇨🇳', cities: ['Shanghai'] },
    { name: 'Hong Kong', flag: '🇭🇰', cities: ['Hong Kong'] },
    { name: 'Taiwan', flag: '🇹🇼', cities: ['Taipei'] },
    { name: 'India', flag: '🇮🇳', cities: ['Mumbai', 'Delhi'] },
    { name: 'Bangladesh', flag: '🇧🇩', cities: ['Dhaka'] },
    { name: 'Pakistan', flag: '🇵🇰', cities: ['Karachi'] },
    { name: 'Sri Lanka', flag: '🇱🇰', cities: ['Colombo'] },
    { name: 'Nepal', flag: '🇳🇵', cities: ['Kathmandu'] },
    { name: 'Myanmar', flag: '🇲🇲', cities: ['Yangon'] },
    { name: 'Cambodia', flag: '🇰🇭', cities: ['Phnom Penh'] },
    { name: 'Laos', flag: '🇱🇦', cities: ['Vientiane'] },
    { name: 'Brunei', flag: '🇧🇳', cities: ['Bandar Seri Begawan'] },
    { name: 'UAE', flag: '🇦🇪', cities: ['Dubai', 'Abu Dhabi'] },
    { name: 'Saudi Arabia', flag: '🇸🇦', cities: ['Riyadh'] },
    { name: 'Qatar', flag: '🇶🇦', cities: ['Doha'] },
    { name: 'Kuwait', flag: '🇰🇼', cities: ['Kuwait City'] },
    { name: 'Bahrain', flag: '🇧🇭', cities: ['Manama'] },
    { name: 'Oman', flag: '🇴🇲', cities: ['Muscat'] },
    { name: 'Israel', flag: '🇮🇱', cities: ['Tel Aviv'] },
    { name: 'Lebanon', flag: '🇱🇧', cities: ['Beirut'] },
    { name: 'Jordan', flag: '🇯🇴', cities: ['Amman'] },
    { name: 'Iraq', flag: '🇮🇶', cities: ['Baghdad'] },
    { name: 'Egypt', flag: '🇪🇬', cities: ['Cairo'] },
    { name: 'Morocco', flag: '🇲🇦', cities: ['Casablanca'] },
    { name: 'Tunisia', flag: '🇹🇳', cities: ['Tunis'] },
    { name: 'Algeria', flag: '🇩🇿', cities: ['Algiers'] },
    { name: 'Nigeria', flag: '🇳🇬', cities: ['Lagos'] },
    { name: 'South Africa', flag: '🇿🇦', cities: ['Johannesburg'] },
    { name: 'Kenya', flag: '🇰🇪', cities: ['Nairobi'] },
    { name: 'Ghana', flag: '🇬🇭', cities: ['Accra'] },
    { name: 'Ethiopia', flag: '🇪🇹', cities: ['Addis Ababa'] },
    { name: 'Senegal', flag: '🇸🇳', cities: ['Dakar'] },
    { name: 'Brazil', flag: '🇧🇷', cities: ['São Paulo', 'Rio de Janeiro'] },
    { name: 'Argentina', flag: '🇦🇷', cities: ['Buenos Aires'] },
    { name: 'Chile', flag: '🇨🇱', cities: ['Santiago'] },
    { name: 'Colombia', flag: '🇨🇴', cities: ['Bogotá'] },
    { name: 'Peru', flag: '🇵🇪', cities: ['Lima'] },
    { name: 'Venezuela', flag: '🇻🇪', cities: ['Caracas'] },
    { name: 'Ecuador', flag: '🇪🇨', cities: ['Quito'] },
    { name: 'Uruguay', flag: '🇺🇾', cities: ['Montevideo'] },
    { name: 'Mexico', flag: '🇲🇽', cities: ['Mexico City', 'Guadalajara'] },
    { name: 'Costa Rica', flag: '🇨🇷', cities: ['San José'] },
    { name: 'Panama', flag: '🇵🇦', cities: ['Panama City'] },
    { name: 'Guatemala', flag: '🇬🇹', cities: ['Guatemala City'] },
    { name: 'Cuba', flag: '🇨🇺', cities: ['Havana'] },
    { name: 'Jamaica', flag: '🇯🇲', cities: ['Kingston'] },
    { name: 'Trinidad', flag: '🇹🇹', cities: ['Port of Spain'] },
    { name: 'Barbados', flag: '🇧🇧', cities: ['Bridgetown'] },
    { name: 'Fiji', flag: '🇫🇯', cities: ['Suva'] },
    { name: 'Papua New Guinea', flag: '🇵🇬', cities: ['Port Moresby'] },
    { name: 'Mongolia', flag: '🇲🇳', cities: ['Ulaanbaatar'] },
    { name: 'Kazakhstan', flag: '🇰🇿', cities: ['Almaty'] },
    { name: 'Uzbekistan', flag: '🇺🇿', cities: ['Tashkent'] },
    { name: 'Georgia', flag: '🇬🇪', cities: ['Tbilisi'] },
    { name: 'Armenia', flag: '🇦🇲', cities: ['Yerevan'] },
    { name: 'Azerbaijan', flag: '🇦🇿', cities: ['Baku'] },
    { name: 'Belarus', flag: '🇧🇾', cities: ['Minsk'] },
    { name: 'Moldova', flag: '🇲🇩', cities: ['Chisinau'] },
    { name: 'Kyrgyzstan', flag: '🇰🇬', cities: ['Bishkek'] },
    { name: 'Tajikistan', flag: '🇹🇯', cities: ['Dushanbe'] },
    { name: 'Turkmenistan', flag: '🇹🇲', cities: ['Ashgabat'] },
  ];

  for (const c of countryData) {
    if (id > 170) break;
    for (const city of c.cities) {
      if (id > 170) break;
      servers.push({
        id: id++,
        name: city,
        country: c.name,
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
