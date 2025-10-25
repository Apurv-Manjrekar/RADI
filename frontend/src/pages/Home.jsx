import React from 'react';

const Home = () => (
  <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', lineHeight: '1.8' }}>
    <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', color: '#1a365d' }}>
      Welcome to the RADI Dashboard
    </h1>
    
    <div style={{ fontSize: '1.1rem', color: '#2d3748' }}>
      <p style={{ marginBottom: '20px' }}>
        The Rural Adversity and Determinants Index (RADI) was developed by a team at the 
        University of Connecticut and University of Massachusetts to measure social determinants 
        of health (SDOH) in rural spaces. While a county-level score of SDOH does exist (the 
        CDC's Social Vulnerability Index, SVI) it has been shown to break down in areas of high 
        rurality, paradoxically showing less disadvantage for highly remote areas as compared to 
        less rural counties.
      </p>
      
      <p style={{ marginBottom: '20px' }}>
        Constructed using a deductive, data-driven methodology, the RADI outperforms the SVI and 
        simple measures of rurality (i.e, Rural-Urban Continuum Codes, RUCC) in predicting various 
        key measures of population health (Krishna et al., 2025). Navigate to the map to see a 
        visualization, or find a rural county of your choice in our database search.
      </p>
      
      <p style={{ marginBottom: '20px' }}>
        The full methodology and results can be found in this paper:{' '}
        <a 
          href="https://www.researchgate.net/publication/396453012_The_Rural_Adversity_and_Determinants_Index_A_Novel_Assessment_Method_of_At-Risk_Rural_Counties"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#2563eb', textDecoration: 'underline' }}
        >
          The Rural Adversity and Determinants Index: A Novel Assessment Method of At-Risk Rural Counties
        </a>
      </p>
    </div>
  </div>
);

export default Home;