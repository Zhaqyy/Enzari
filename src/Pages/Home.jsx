import React from "react";
import "../Style/Home.scss";

function Home() {
  return (
    <div className="entry-page">
      <div className="entry-content">
        <h1 className="entry-title">ENZARI</h1>
        <div className="entry-links">
          <a href="/oto" className="entry-link">OTO</a>
          <a href="/dorian" className="entry-link">DORIAN</a>
          {/* <a href="/coming-soon" className="entry-link">COMING SOON</a> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
