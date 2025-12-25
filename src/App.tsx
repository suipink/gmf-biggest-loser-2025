import RevealSlideshow from './components/RevealSlideshow';
import { CompetitorEntry } from './utils/logic';

const competitorData: CompetitorEntry[] = [
  {
    name: "Benz",
    baselineWeight: 85,  // UPDATE: Replace with actual first weigh-in weight
    currentWeight: 78.03,  // UPDATE: Replace with actual last weigh-in weight
    profilePic: "/images/Benz after.jpg",
    beforePhoto: "/images/Benz Original.jpg",
    afterPhoto: "/images/Benz after.jpg",
    cheerer: "Team Thunder ⚡",  // UPDATE: Replace with actual team/cheerer name
    weighIns: [
      { date: "2025-01-01", weight: 85 },  // UPDATE: Replace with actual first weigh-in
      { date: "2025-02-15", weight: 78.03 }  // UPDATE: Replace with actual last weigh-in
    ]
  },
  {
    name: "Kan",
    baselineWeight: 120,  // UPDATE: Replace with actual first weigh-in weight
    currentWeight: 108.5,  // UPDATE: Replace with actual last weigh-in weight
    profilePic: "/images/Kan after.jpg",
    beforePhoto: "/images/Kan Original.jpg",
    afterPhoto: "/images/Kan after.jpg",
    cheerer: "Fitness Warriors 🏋️‍♂️",  // UPDATE: Replace with actual team/cheerer name
    weighIns: [
      { date: "2025-01-01", weight: 120 },  // UPDATE: Replace with actual first weigh-in
      { date: "2025-02-15", weight: 108.5 }  // UPDATE: Replace with actual last weigh-in
    ]
  },
  {
    name: "Khwan",
    baselineWeight: 95,  // UPDATE: Replace with actual first weigh-in weight
    currentWeight: 87.2,  // UPDATE: Replace with actual last weigh-in weight
    profilePic: "/images/Khwan after.jpg",
    beforePhoto: "/images/Khwan Original.jpg",
    afterPhoto: "/images/Khwan after.jpg",
    cheerer: "Dream Team 💫",  // UPDATE: Replace with actual team/cheerer name
    weighIns: [
      { date: "2025-01-01", weight: 95 },  // UPDATE: Replace with actual first weigh-in
      { date: "2025-02-15", weight: 87.2 }  // UPDATE: Replace with actual last weigh-in
    ]
  },
  {
    name: "Maprang",
    baselineWeight: 110,  // UPDATE: Replace with actual first weigh-in weight
    currentWeight: 101.5,  // UPDATE: Replace with actual last weigh-in weight
    profilePic: "/images/Maprang after.jpg",
    beforePhoto: "/images/Maprang Original.jpg",
    afterPhoto: "/images/Maprang after.jpg",
    cheerer: "Iron Eagles 🦅",  // UPDATE: Replace with actual team/cheerer name
    weighIns: [
      { date: "2025-01-01", weight: 110 },  // UPDATE: Replace with actual first weigh-in
      { date: "2025-02-15", weight: 101.5 }  // UPDATE: Replace with actual last weigh-in
    ]
  },
  {
    name: "Mera",
    baselineWeight: 90,  // UPDATE: Replace with actual first weigh-in weight
    currentWeight: 83.7,  // UPDATE: Replace with actual last weigh-in weight
    profilePic: "/images/Mera after.jpg",
    beforePhoto: "/images/Mera Original.jpg",
    afterPhoto: "/images/Mera after.jpg",
    cheerer: "Phoenix Rising 🔥",  // UPDATE: Replace with actual team/cheerer name
    weighIns: [
      { date: "2025-01-01", weight: 90 },  // UPDATE: Replace with actual first weigh-in
      { date: "2025-02-15", weight: 83.7 }  // UPDATE: Replace with actual last weigh-in
    ]
  },
  {
    name: "Sui",
    baselineWeight: 105,  // UPDATE: Replace with actual first weigh-in weight
    currentWeight: 98.8,  // UPDATE: Replace with actual last weigh-in weight
    profilePic: "/images/Sui After.jpg",
    beforePhoto: "/images/Sui Original.jpg",
    afterPhoto: "/images/Sui After.jpg",
    cheerer: "Victory Wolves 🐺",  // UPDATE: Replace with actual team/cheerer name
    weighIns: [
      { date: "2025-01-01", weight: 105 },  // UPDATE: Replace with actual first weigh-in
      { date: "2025-02-15", weight: 98.8 }  // UPDATE: Replace with actual last weigh-in
    ]
  }
];

function App() {

  return (
    <>
      <section className="hero" style={{ minHeight: '12vh', padding: '1rem 0.7rem' }}>
        <h1 className="title" style={{ fontSize: 'clamp(40px, 6vw, 70px)', margin: '0', gap: '10px' }}>
          <img
            src="GMF Circle Black.png"
            alt="GMF Logo"
            style={{
              height: 'clamp(50px, 7vw, 90px)',
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