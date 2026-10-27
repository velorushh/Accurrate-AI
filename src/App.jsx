import React from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import SocialProof from './components/SocialProof.jsx';
import GTMLayers from './components/GTMLayers.jsx';
import FeatureGrid from './components/FeatureGrid.jsx';
import SecurityLogos from './components/SecurityLogos.jsx';
import CTASection from './components/CTASection.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#edebe8]">
      <Header />
      <main className="flex-grow">
        <Hero />
        <SocialProof />
        <GTMLayers />
        <FeatureGrid />
        <SecurityLogos />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
