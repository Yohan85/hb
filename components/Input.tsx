import React from "react";
import Back from "../public/Back.svg";
import Run from "../public/Run.svg";
import Cross from "../public/Cross.svg";
import Check from "../public/Check.svg";
import Image from "next/image";

const Input = ({ answer, back, check, answerState }) => {
  return (
    <>
      <div
        className={`w-full h-12 rounded-full text-white text-right flex justify-end items-center ${
          answerState === "typing"
            ? "bg-black bg-opacity-40"
            : answerState === "incorrect"
              ? "bg-red-400 bg-opacity-90"
              : "bg-green-300 bg-opacity-90"
        }  `}
      >
        {answerState === "typing" && (
          <button
            className="w-8 h-8 ml-2 flex bg-gradient-to-b from-yellow-600 to-amber-500 rounded-full justify-center items-center"
            onClick={back}
          >
            <Image src={Back} alt="Backspace" className="w-5 h-5 ml-0.5" />
          </button>
        )}

        <p className="flex-grow text-white mr-4">{answer}</p>

        <button
          className={`w-8 h-8 mr-2 flex rounded-full justify-center items-center ${
            answerState === "typing"
              ? "bg-gradient-to-b from-cyan-500 to-teal-300"
              : answerState === "incorrect"
                ? "bg-red-900"
                : "bg-slate-500"
          }  `}
          onClick={check}
        >
          <Image
            src={
              answerState === "typing"
                ? Run
                : answerState === "correct"
                  ? Check
                  : Cross
            }
            alt="Backspace"
            className="w-3 h-3"
          />
        </button>
      </div>
    </>
  );
};

export default Input;
