import { PanInfo, motion, useAnimate } from "framer-motion";
import { useState } from "react";
import { CardProps } from "types";

const ANIMATIONSPEED = 2000;

const CardContent = ({ card, rand }) => {
  return (
    <>
      <motion.span
        role="img"
        aria-label={card.name}
        className="emoji text-[140px] h-3/5 flex items-onDragEnd"
        initial={rand === 0 ? { y: 100 } : { opacity: 0 }}
      >
        {card.emoji}
      </motion.span>
      <motion.span
        className="title text-3xl font-bold h-2/5 pt-2"
        initial={rand === 1 ? { y: 100 } : { y: -25, opacity: 0 }}
      >
        {card.name}
      </motion.span>
    </>
  );
};

const Card: React.FC<CardProps> = ({ card, removeCard, active }) => {
  // Yohan adds
  const [hasClicked, setHasClicked] = useState(false);
  const [scope, animate] = useAnimate();

  // Randomize question
  let rand = Math.floor(Math.random() * 3);
  rand = 0;

  const handleClick = () => {
    // Image 0
    if (rand === 0) {
      animate(".emoji", { y: 70, transition: { duration: 30 } });
      animate(".title", { y: 0, opacity: 1, transition: { duration: 30 } });
    } else if (rand === 1) {
      //
    } else if (rand === 2) {
      //
    }

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
          <CardContent card={card} />
        </div>
      )}
    </>
  );
};

export default Card;
