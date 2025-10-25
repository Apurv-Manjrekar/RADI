import React from "react";
import { FaLinkedin } from "react-icons/fa";
import "./AboutUs.css";

const APURVMANJREKAR_IMAGE_URL = import.meta.env.BASE_URL + "ApurvManjrekar.jpg";
const EASHWARKRISHNA_IMAGE_URL = import.meta.env.BASE_URL + "EashwarKrishna.jpg";
const NICOLASARAUJO_IMAGE_URL = import.meta.env.BASE_URL + "NicolasAraujo.jpg";

const AboutUs = () => {
  // Replace these URLs with the actual LinkedIn profile URLs
  const linkedInUrls = {
    eashwar: "https://www.linkedin.com/in/eashwar-krishna/", // Replace with actual URL
    apurv: "https://www.linkedin.com/in/apurv-manjrekar/", // Replace with actual URL
    nicolas: "https://www.linkedin.com/in/nicolas-araujo/" // Replace with actual URL
  };

  return (
    <div className="about-us-container">
      <h1 className="about-us-title">Our Team</h1>
      <p className="about-us-description">
        We are a group of researchers passionate about improving rural healthcare access!
      </p>

      <div className="team-grid">
        {/* Eashwar Krishna */}
        <div className="team-card">
          <div className="image-container">
            <img
              src={EASHWARKRISHNA_IMAGE_URL}
              alt="Eashwar Krishna"
              className="team-image"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <h2 className="member-name" style={{ margin: 0 }}>Eashwar S.C. Krishna</h2>
            <a 
              href={linkedInUrls.eashwar} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#0077b5',
                transition: 'color 0.2s'
              }}
              aria-label="LinkedIn profile"
              onMouseEnter={(e) => e.currentTarget.style.color = '#005582'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#0077b5'}
            >
              <FaLinkedin size={20} />
            </a>
          </div>
          <p className="member-role">Project Lead</p>
        </div>

        {/* Apurv Manjrekar */}
        <div className="team-card">
          <div className="image-container">
            <img
              src={APURVMANJREKAR_IMAGE_URL}
              alt="Apurv Manjrekar"
              className="team-image"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <h2 className="member-name" style={{ margin: 0 }}>Apurv Manjrekar</h2>
            <a 
              href={linkedInUrls.apurv} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#0077b5',
                transition: 'color 0.2s'
              }}
              aria-label="LinkedIn profile"
              onMouseEnter={(e) => e.currentTarget.style.color = '#005582'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#0077b5'}
            >
              <FaLinkedin size={20} />
            </a>
          </div>
          <p className="member-role">Analytics Lead</p>
        </div>

        {/* Nicolas Araujo */}
        <div className="team-card">
          <div className="image-container">
            <img
              src={NICOLASARAUJO_IMAGE_URL}
              alt="Nicolas Araujo"
              className="team-image"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <h2 className="member-name" style={{ margin: 0 }}>Nicolas Araujo</h2>
            <a 
              href={linkedInUrls.nicholas} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#0077b5',
                transition: 'color 0.2s'
              }}
              aria-label="LinkedIn profile"
              onMouseEnter={(e) => e.currentTarget.style.color = '#005582'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#0077b5'}
            >
              <FaLinkedin size={20} />
            </a>
          </div>
          <p className="member-role">Research Assistant</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;