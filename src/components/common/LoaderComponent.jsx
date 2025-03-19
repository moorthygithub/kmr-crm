import { CircularProgress } from "@mui/material";
import React from "react";

const LoaderComponent = () => {
  return (
    <div>
      {" "}
      <CircularProgress size="30px" />
    </div>
  );
};

export default LoaderComponent;
export const ImageLoaderComponent = () => {
  return (
    <div className="absolute">
      {" "}
      <CircularProgress size="30px" />
    </div>
  );
};
