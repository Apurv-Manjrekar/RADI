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
        {/* Eashwar Krishna */}
        <div className="team-card">
          <div className="image-container">
            {/* <img
              src={EashwarKrishnaImage}
              alt="Eashwar Krishna"
              className="team-image"
            /> */}
          </div>
          <h2 className="member-name">Eashwar S.C. Krishna</h2>
          <p className="member-role">Team Lead</p>
          <p className="member-description">
            Leads stuff idk
          </p>
        </div>

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

        {/* Nicholas Araujo */}
        <div className="team-card">
          <div className="image-container">
            {/* <img
              src={InsertNameImage}
              alt="Insert Name Here"
              className="team-image"
            /> */}
          </div>
          <h2 className="member-name">Nicholas Araujo</h2>
          <p className="member-role">Researcher</p>
          <p className="member-description">
            does stuff idk
          </p>
        </div>

        {/* Quang Dai La */}
        <div className="team-card">
          <div className="image-container">
            {/* <img
              src={InsertNameImage}
              alt="Insert Name Here"
              className="team-image"
            /> */}
          </div>
          <h2 className="member-name">Quang Dai La</h2>
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