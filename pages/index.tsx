import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import RotateIcon from "@icons/RotateIcon";
import Counter from "@components/Counter";
import { CardType, HistoryType, ResultType, SwipeType } from "types";
import CARDS from "@data/cards";
import Card from "@components/Card";
import Head from "next/head";

const Home: NextPage = ({ randArray }) => {
  const [cards, setCards] = useState(CARDS);
  const [result, setResult] = useState<ResultType>({
    like: 0,
    nope: 0,
    superlike: 0,
  });
  const [history, setHistory] = useState<HistoryType[]>([]);
  // index of last card
  const activeIndex = cards.length - 1;
  const removeCard = (oldCard: CardType, swipe: SwipeType) => {
    setHistory((current) => [...current, { ...oldCard, swipe }]);
    setCards((current) =>
      current.filter((card) => {
        return card.id !== oldCard.id;
      }),
    );
    setResult((current) => ({ ...current, [swipe]: current[swipe] + 1 }));
  };
  const undoSwipe = () => {
    const newCard = history.pop();
    if (newCard) {
      const { swipe } = newCard;
      setHistory((current) =>
        current.filter((card) => {
          return card.id !== newCard.id;
        }),
      );
      setResult((current) => ({ ...current, [swipe]: current[swipe] - 1 }));
      setCards((current) => [...current, newCard]);
    }
  };

  console.log(randArray);

  return (
    <div className="relative flex flex-col justify-center items-center w-full h-screen gradient">
      <Head>
        <title>Tinder cards with Framer motion</title>
      </Head>
      <AnimatePresence>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            active={index === activeIndex}
            removeCard={removeCard}
            card={card}
            rand={randArray[index]}
          />
        ))}
      </AnimatePresence>
      {cards.length === 0 ? (
        <span className="text-white text-xl">End of Stack</span>
      ) : null}
    </div>
  );
};

export default Home;

/*
 <footer className="absolute bottom-4 flex items-center space-x-4">
        <div className="flex flex-col items-center space-y-2">
          <button
            disabled={history.length === 0}
            className="w-14 h-14 rounded-full text-black bg-white inline-flex justify-center items-center disabled:cursor-not-allowed"
            onClick={undoSwipe}
            data-testid="undo-btn"
            aria-label="Undo Swipe"
          >
            <RotateIcon strokeWidth={3} />
          </button>
          <span className="text-xs text-white">Undo</span>
        </div>
        <Counter label="Likes" count={result.like} testid="like-count" />
        <Counter label="Nopes" count={result.nope} testid="nope-count" />
        <Counter
          label="Superlike"
          count={result.superlike}
          testid="superlike-count"
        />
      </footer>
      */
export async function getServerSideProps() {
  // Générer un nombre aléatoire côté serveur
  const randArray = Array.from({ length: CARDS.length }, () =>
    Math.floor(Math.random() * 4),
  );

  // Passer le nombre aléatoire en tant que propriété
  return {
    props: {
      randArray,
    },
  };
}
