import React from "react";
import "./AboutUs.css"
const APURVMANJREKAR_IMAGE_URL = import.meta.env.BASE_URL + "ApurvManjrekar.jpg";
const EASHWARKRISHNA_IMAGE_URL = import.meta.env.BASE_URL + "EashwarKrishna.jpg";
const NICHOLASARAUJO_IMAGE_URL = import.meta.env.BASE_URL + "NicholasAraujo.jpg";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h1 className="about-us-title">Our Team</h1>
      <p className="about-us-description">
        We are a group of researchers passionate
        about improving rural healthcare access!
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
          <h2 className="member-name">Eashwar S.C. Krishna</h2>
          <p className="member-role">Team Lead</p>
          <p className="member-description">
            4th year undergraduate at UConn pursuing dual degrees in Sociology and Molecular Biology
          </p>
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
          <h2 className="member-name">Apurv Manjrekar</h2>
          <p className="member-role">Programmer</p>
          <p className="member-description">
            1st year Master’s student in Computer Science and Engineering with a Bachelor’s degree in Computer Science
          </p>
        </div>

        {/* Nicholas Araujo */}
        <div className="team-card">
          <div className="image-container">
            <img
              src={NICHOLASARAUJO_IMAGE_URL}
              alt="Nicholas Araujo"
              className="team-image"
            />
          </div>
          <h2 className="member-name">Nicholas Araujo</h2>
          <p className="member-role">Researcher</p>
          <p className="member-description">
            does stuff idk
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;