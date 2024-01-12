import React, { useState, useContext } from "react";

const KEYS = ["'קראטוןםפ", "שדגכעיחלךף", "זסבהנמצתץ"];

const Keyboard = ({ action }) => {
  function handleClick(letter) {
    action(letter);
  }
  return (
    <>
      {KEYS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center justify-center">
          {row.split("").map((letter, letterIndex) => (
            <button
              className="w-[35px] aspect-[3/4] rounded-lg justify-center bg-white mr-1 mb-2 shadow-solid-primary"
              onClick={() => handleClick(letter)}
              key={letterIndex}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
    </>
  );
};

export default Keyboard;
