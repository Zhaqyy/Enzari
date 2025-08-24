import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// import Loader from "../Component/Loader/Loader";
import Transitioner from "../Util/Transition";

import Home from "../Pages/Home";

// import Header from "../Component/Header";

const Router = () => {
  // const [loaderFinished, setLoaderFinished] = useState(false);

  return (
    <>
      {/* <Loader onComplete={() => setLoaderFinished(true)} /> */}

      {/* Render routes only after the loader signals completion */}
      {/* {loaderFinished && ( */}
        <>
          {/* <Header /> */}

          <Routes>
            <Route
              index
              path='/'
              element={
                <Transitioner>
                  <Home />
                </Transitioner>
              }
            />
            {/* <Route
              path='/about'
              element={
                <Transitioner>
                  <About />
                </Transitioner>
              }
            />
            <Route
              path='/Project/:id'
              element={
                <Transitioner>
                  <Work />
                </Transitioner>
              }
            /> */}
          </Routes>
        </>
      {/* )} */}

    </>
  );
};

export default Router;
