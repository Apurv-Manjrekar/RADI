import React from "react";
import "./AboutUs.css"

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h1 className="about-us-title">Our Team</h1>
      <p className="about-us-description">
        We are a group of researchers passionate
        about improving rural healthcare access!
      </p>

      <div className="team-grid">
        {/* Apurv Manjrekar */}
        <div className="team-card">
          <div className="image-container">
            {/* <img
              src={ApurvManjrekarImage}
              alt="Apurv Manjrekar"
              className="team-image"
            /> */}
          </div>
          <h2 className="member-name">Apurv Manjrekar</h2>
          <p className="member-role">Programmer</p>
          <p className="member-description">
            Programs
          </p>
        </div>

        {/* Eashwar Krishna */}
        <div className="team-card">
          <div className="image-container">
            {/* <img
              src={EashwarKrishnaImage}
              alt="Eashwar Krishna"
              className="team-image"
            /> */}
          </div>
          <h2 className="member-name">Eashwar Krishna</h2>
          <p className="member-role">Team Lead</p>
          <p className="member-description">
            Leads stuff idk
          </p>
        </div>

        {/* I forgot his name */}
        <div className="team-card">
          <div className="image-container">
            {/* <img
              src={InsertNameImage}
              alt="Insert Name Here"
              className="team-image"
            /> */}
          </div>
          <h2 className="member-name">Insert Name Here</h2>
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