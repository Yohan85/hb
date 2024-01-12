import React from "react";

const ProgressBar = () => {
  return (
    <>
      <div className="w-full bg-purple-300 rounded-full p-1.5">
        <div
          className="bg-gradient-to-b from-purple-500 to-violet-700 h-5 rounded-full"
          style={{ width: "45%" }}
        ></div>
      </div>
    </>
  );
};

export default ProgressBar;
