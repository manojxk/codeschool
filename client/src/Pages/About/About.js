import React from "react";

import "./About.css";
import manoj from "./images/manoj.jpg";


export default function About() {
  return (
    <div>
      <div className="about-top-container">
        <div className="about-info">
          <h1 class="title">About Us</h1>
          <hr />
          <h5 className="about-answer">
            {" "}
            I created CodeSchool to provide students with an easy way to get
            the coding help they need without having to worry about paying
            anything for tutoring.
          </h5>
        </div>
      </div>
      <div className="about-bw-container">
        <h1 className="mt-title">Meet the Team</h1>
        <div className="about-bottom-container">
          <div class="person">
            <img src={manoj} alt="satya-img" class="person-image" />
            <h3 class="name">Manoj</h3>
            <p>
              Hola! I'm Manoj, an enthusiastic programmer with interests in Web Development. I'm currently pursuing my B.Tech Final year at NIT Trichy. Always excited to develop anything that helps to solve real world problems.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
