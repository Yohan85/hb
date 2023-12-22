import { PanInfo, motion, useAnimate, useAnimation } from "framer-motion";
import { useState, useEffect, useId } from "react";
import { CardProps } from "types";
import Image from "next/image";

import hp from "../public/hp.png";

const ANIMATIONSPEED = 2000;

const CardContent = ({ card, rand }) => {
  const initialImage = rand === 0 ? { y: 50, opacity: 1 } : { opacity: 0 };

  const initialTitle = rand === 1 ? { y: -70 } : { y: -25, opacity: 0 };
  const initialCursive =
    rand === 2 ? { y: -175, scale: 1.5 } : { y: -25, opacity: 0 };
  const initialHp =
    rand === 3 ? { x: -65, y: -65, scale: 1.8 } : { y: -25, opacity: 0 };
  const initialObjects = { y: -25, opacity: 0 };

  return (
    <>
      <motion.span
        role="img"
        aria-label={card.name}
        className="emoji text-[140px] h-3/5 flex items-onDragEnd items-end opacity-50"
        initial={initialImage}
      >
        {card.emoji}
      </motion.span>
      <span className="text-3xl h-2/5 pt-2">
        <div className="flex">
          <motion.div
            className="gender text-zinc-600 text-base self-end mr-3 mb-1"
            initial={initialObjects}
          >
            (f)
          </motion.div>
          <motion.div
            className="title text-5xl flex-shrink-0 self-center "
            initial={initialTitle}
          >
            {card.name}
          </motion.div>
          <motion.div
            className="hp w-8 h-8 self-center ml-3"
            initial={initialHp}
          >
            <Image
              alt="listen"
              className="w-full h-full object-cover"
              src={hp}
            />
          </motion.div>
        </div>
        <motion.span
          className="plural text-zinc-600 text-xl justify-center flex"
          initial={initialObjects}
        >
          {card.plural}
        </motion.span>
        <motion.h1
          className="cursive font-motek text-4xl mt-5 justify-center flex"
          initial={initialCursive}
        >
          {card.name}
        </motion.h1>
      </span>
    </>
  );
};

const Card: React.FC<CardProps> = ({ card, removeCard, active, rand }) => {
  // Yohan adds
  const [hasClicked, setHasClicked] = useState(false);
  const [scope, animate] = useAnimate();

  const animImage =
    rand === 0
      ? { y: 0, transition: { duration: 30 }, opacity: 1 }
      : { opacity: 1 };

  const animTitle =
    rand === 1
      ? { y: 0, transition: { duration: 30 } }
      : { y: 0, opacity: 1, transition: { duration: 30 } };

  const animCursive =
    rand === 2
      ? { y: 0, scale: 1, transition: { duration: 30 } }
      : { y: 0, opacity: 1, transition: { duration: 30 } };

  const animHp =
    rand === 3
      ? { x: 0, y: 0, scale: 1, transition: { duration: 30 } }
      : { y: 0, opacity: 1, transition: { duration: 30 } };

  const animObject = { y: 0, opacity: 1, transition: { duration: 30 } };

  const handleClick = () => {
    animate(".emoji", animImage);
    animate(".title", animTitle);
    animate(".cursive", animCursive);

    animate(".gender", animObject);
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
  const classNames = `absolute h-[430px] w-[300px] bg-white shadow-xl rounded-2xl flex flex-col justify-center items-center cursor-grab`;

  return (
    <>
      {active ? (
        <motion.div
          ref={scope}
          whileTap={{ scale: 1.1 }}
          drag={true}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={onDragEnd}
          dragElastic={0.9}
          initial={{
            scale: 1,
          }}
          animate={{
            scale: 1.05,
            rotate: `${card.name.length % 2 === 0 ? 2 : -2}deg`,
          }}
          exit={{
            x: leaveX,
            y: leaveY,
            opacity: 0,
            scale: 0.5,
            transition: { duration: 0.2 },
          }}
          className={classNames}
          data-testid="active-card"
          onClick={() => {
            handleClick();
          }}
        >
          <CardContent card={card} rand={rand} />
        </motion.div>
      ) : (
        <div
          ref={scope}
          className={`${classNames} ${
            card.name.length % 2 === 0 ? "rotate-6" : "-rotate-6"
          }`}
        >
          <CardContent card={card} rand={rand} />
        </div>
      )}
    </>
  );
};

export default Card;
