import RevealSlideshow from './components/RevealSlideshow';
import { CompetitorEntry } from './utils/logic';

const competitorData: CompetitorEntry[] = [
  {
    name: "Kan",
    baselineWeight: 76.00,
    currentWeight: 68.90,
    profilePic: "/images/Kan after.jpg",
    beforePhoto: "/images/Kan Original.jpg",
    afterPhoto: "/images/Kan after.jpg",
    cheerer: "กองเชียร์: Kate",
    weighIns: [
      { date: "2025-01-01", weight: 76.00 },
      { date: "2025-02-15", weight: 68.90 }
    ]
  },
  {
    name: "Mera",
    baselineWeight: 77.60,
    currentWeight: 70.90,
    profilePic: "/images/Mera after.jpg",
    beforePhoto: "/images/Mera Original.jpg",
    afterPhoto: "/images/Mera after.jpg",
    cheerer: "กองเชียร์: James",
    weighIns: [
      { date: "2025-01-01", weight: 77.60 },
      { date: "2025-02-15", weight: 70.90 }
    ]
  },
  {
    name: "Khwan",
    baselineWeight: 79.90,
    currentWeight: 76.00,
    profilePic: "/images/Khwan after.jpg",
    beforePhoto: "/images/Khwan Original.jpg",
    afterPhoto: "/images/Khwan after.jpg",
    cheerer: "กองเชียร์: Mint",
    weighIns: [
      { date: "2025-01-01", weight: 79.90 },
      { date: "2025-02-15", weight: 76.00 }
    ]
  },
  {
    name: "Sui",
    baselineWeight: 80.80,
    currentWeight: 77.50,
    profilePic: "/images/Sui After.jpg",
    beforePhoto: "/images/Sui Original.jpg",
    afterPhoto: "/images/Sui After.jpg",
    cheerer: "กองเชียร์: -",
    weighIns: [
      { date: "2025-01-01", weight: 80.80 },
      { date: "2025-02-15", weight: 77.50 }
    ]
  },
  {
    name: "Benz",
    baselineWeight: 79.80,
    currentWeight: 79.00,
    profilePic: "/images/Benz after.jpg",
    beforePhoto: "/images/Benz Original.jpg",
    afterPhoto: "/images/Benz after.jpg",
    cheerer: "กองเชียร์: Pink",
    weighIns: [
      { date: "2025-01-01", weight: 79.80 },
      { date: "2025-02-15", weight: 79.00 }
    ]
  },
  {
    name: "Maprang",
    baselineWeight: 80.30,
    currentWeight: 81.50,
    profilePic: "/images/Maprang after.jpg",
    beforePhoto: "/images/Maprang Original.jpg",
    afterPhoto: "/images/Maprang after.jpg",
    cheerer: "กองเชียร์: Jik",
    weighIns: [
      { date: "2025-01-01", weight: 80.30 },
      { date: "2025-02-15", weight: 81.50 }
    ]
  }
];

function App() {

  return (
    <>
      <section className="hero" style={{ minHeight: '11vh', padding: '1.6rem 0.7rem 0.8rem', marginBottom: '0' }}>
        <h1 className="title" style={{ fontSize: 'clamp(52px, 7.5vw, 85px)', margin: '0', gap: '12px' }}>
          <img
            src="/GMF Circle Black.png"
            alt="GMF Logo"
            style={{
              height: 'clamp(62px, 8.5vw, 100px)',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          GMF BIGGEST LOSER 2025
        </h1>
      </section>

      <section style={{ minHeight: '80vh' }}>
        <RevealSlideshow
          entries={competitorData}
          mode="preFinal"
        />
      </section>
    </>
  );
}

export default App;