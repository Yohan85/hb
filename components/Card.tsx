import { PanInfo, motion, useAnimate, useAnimation } from "framer-motion";
import { useState, useEffect, useId } from "react";
import { CardProps } from "types";
import Image from "next/image";

import hp from "../public/hp.png";
import Speaker from "../public/Speaker.svg";
import Arrowright from "../public/Arrowright.svg";

const ANIMATIONSPEED = 2000;

const CardContent = ({ card, rand, active, answerState, nextCard }) => {
  // 0 => Show image and then everything else
  // 1 => Show audio and then everything else

  const initialImage = rand === 0 ? { opacity: 1 } : { opacity: 0 };
  const initialTitle = { y: -25, opacity: 0 };
  const initialCursive = { y: -25, opacity: 0 };
  const initialHp =
    rand === 1 ? { x: -75, y: -115, scale: 3.8 } : { y: -25, opacity: 0 };
  const initialObjects = { y: -25, opacity: 0 };

  const playAudio = (url1, url2) => {
    let audio1 = new Audio();
    let audio2 = new Audio();

    audio1.src = url1;

    if (url2 !== undefined) audio2.src = url2;

    const handleAudio2 = () => {
      if (url2 !== undefined)
        setTimeout(() => {
          audio2.play();
        }, 200);
    };

    audio1.addEventListener("ended", handleAudio2);

    audio1.play();

    return () => {
      audio1.removeEventListener("ended", handleAudio1Ended);
    };
  };

  return (
    <>
      {active && (answerState === "correct" || answerState === "incorrect") && (
        <div
          className="absolute bottom-0 right-0 transform translate-x-4 translate-y-4 w-[70px] h-[70px] bg-gradient-to-b from-cyan-400 to-cyan-500 rounded-full flex justify-center items-center"
          onClick={nextCard}
        >
          <Image src={Arrowright} alt="Next" className="w-90 h-90" />
        </div>
      )}
      <motion.div
        role="img"
        aria-label={card.word}
        className="emoji text-[140px] h-4/6 flex items-end opacity-50 relative"
        initial={initialImage}
      >
        <Image
          alt="listen"
          className="inset-0 w-90 h-90 object-cover"
          src={card.image}
          width={300}
          height={200}
        />
      </motion.div>
      <span className="text-3xl h-2/6 pt-2">
        <div className="flex">
          {card.gender && (
            <motion.div
              className="gender text-zinc-600 text-base self-end mr-3 mb-1"
              initial={initialObjects}
            >
              {`(${card.gender})`}
            </motion.div>
          )}
          <motion.div
            className="title text-5xl flex-shrink-0 self-center "
            initial={initialTitle}
          >
            {card.word}
          </motion.div>
          {
            <motion.div
              className="hp ml-3 self-center p-2 w-8 h-8 bg-gradient-to-tl from-blue-600 to-cyan-300 rounded-full flex justify-center items-center"
              initial={initialHp}
              onClick={() => {
                playAudio(
                  card.sound,
                  answerState === "incorrect" || answerState === "correct"
                    ? card.soundPlural
                    : undefined,
                );
              }}
            >
              <Image alt="listen" className="w-full h-full" src={Speaker} />
            </motion.div>
          }
        </div>
        <motion.span
          className="plural text-zinc-600 text-xl justify-center flex"
          initial={initialObjects}
        >
          {card.plural}
        </motion.span>
        <motion.h1
          className="cursive font-motek text-4xl justify-center flex"
          initial={initialCursive}
        >
          {card.word}
        </motion.h1>
      </span>
    </>
  );
};

const Card: React.FC<CardProps> = ({
  card,
  removeCard,
  active,
  rand,
  answerState,
  nextCard,
}) => {
  // Yohan adds
  const [hasClicked, setHasClicked] = useState(false);
  const [scope, animate] = useAnimate();

  const animImage = { opacity: 1 };
  const animTitle = { y: 0, opacity: 1, transition: { duration: 30 } };
  const animCursive = { y: 0, opacity: 1, transition: { duration: 30 } };
  const animHp = {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transition: { duration: 30 },
  };

  const animObject = { y: 0, opacity: 1, transition: { duration: 30 } };

  const reveal = () => {
    animate(".emoji", animImage);
    animate(".title", animTitle);
    animate(".cursive", animCursive);

    if (card.gender) animate(".gender", animObject);

    animate(".hp", animHp);
    animate(".plural", animObject);

    setHasClicked(true);
  };

  const [leaveX, setLeaveX] = useState(0);
  const [leaveY, setLeaveY] = useState(0);
  const onDragEnd = (_e: any, info: PanInfo) => {
    if (info.offset.y < -100) {
      setLeaveY(-2000);
      removeCard(card, "superlike");
      return;
    }
    if (info.offset.x > 100) {
      setLeaveX(1000);
      removeCard(card, "like");
    }
    if (info.offset.x < -100) {
      setLeaveX(-1000);
      removeCard(card, "nope");
    }
  };

  useEffect(() => {
    if (answerState === "correct" || answerState === "incorrect") reveal();
  }, [answerState]);

  const classNames = `w-3/4 h-4/5 absolute bg-white shadow-xl rounded-2xl flex flex-col justify-center items-center cursor-grab`;

  return (
    <>
      {active ? (
        <motion.div
          ref={scope}
          initial={{
            scale: 1,
          }}
          animate={{
            scale: 1.05,
            rotate: `${card.word.length % 2 === 0 ? 2 : -2}deg`,
          }}
          exit={{
            x: -2000,
            y: card.word.length % 2 === 0 ? 100 : -100,
            opacity: 0,
            scale: 0.5,
            transition: { duration: 0.3 },
          }}
          className={classNames}
          data-testid="active-card"
        >
          <CardContent
            card={card}
            rand={rand}
            active={active}
            answerState={answerState}
            nextCard={nextCard}
          />
        </motion.div>
      ) : (
        <div
          ref={scope}
          className={`${classNames} ${
            card.word.length % 2 === 0 ? "rotate-2" : "-rotate-2"
          }`}
        >
          <CardContent
            card={card}
            rand={rand}
            active={active}
            answerState={answerState}
          />
        </div>
      )}
    </>
  );
};

export default Card;
