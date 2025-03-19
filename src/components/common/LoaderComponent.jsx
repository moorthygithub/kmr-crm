import { dotSpinner } from "ldrs";
import "ldrs/lineSpinner";
import React from "react";
import { zoomies } from "ldrs"; // Default values shown

const LoaderComponent = () => {
  return (
    <div>
      {" "}
      <l-line-spinner
        size="40"
        stroke="3"
        speed="1"
        color="black"
      ></l-line-spinner>
    </div>
  );
};

export default LoaderComponent;
export const ImageLoaderComponent = () => {
  dotSpinner.register();
  return (
    <div className="absolute">
      {" "}
      <l-dot-spinner size="40" speed="0.9" color="black"></l-dot-spinner>
    </div>
  );
};
export const EditLoaderComponent = () => {
  zoomies.register();
  return (
    <div className="min-h-64 flex justify-center items-center">
      {" "}
      <l-zoomies
        size="80"
        stroke="5"
        bg-opacity="0.1"
        speed="1.4"
        color="black"
      ></l-zoomies>{" "}
    </div>
  );
};
