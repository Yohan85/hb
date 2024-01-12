import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import RotateIcon from "@icons/RotateIcon";
import Counter from "@components/Counter";
import { CardType, HistoryType, ResultType, SwipeType } from "types";
import CARDS from "@data/cards";
import Card from "@components/Card";
import Head from "next/head";
import { Player } from "store/Player";

import Keyboard from "components/Keyboard";
import Input from "components/Input";
import ProgressBar from "components/ProgressBar";

const Home: NextPage = ({ randArray, data }) => {
  const [cards, setCards] = useState([]);
  const [result, setResult] = useState<ResultType>({
    like: 0,
    nope: 0,
    superlike: 0,
  });
  const [history, setHistory] = useState<HistoryType[]>([]);
  const [answer, setAnswer] = useState("");
  const [answerState, setAnswerState] = useState("typing");
  const [isLoading, setIsLoading] = useState(true);

  const answerChange = (letter) => {
    setAnswer((old) => old + letter);
  };

  const answerBack = () => {
    setAnswer((old) => old.slice(0, -1));
  };

  const answerCheck = () => {
    if (answer === cards[activeIndex].word) {
      setAnswerState("correct");
    } else {
      setAnswerState("incorrect");
    }
  };

  const nextCard = () => {
    removeCard(cards[activeIndex], answerState);
    setAnswer("");
    setAnswerState("typing");
  };

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

    console.log(history);
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

  // Fetch data from Airtable
  useEffect(() => {
    console.log("-- Starting fetching");
    const fetchData = async () => {
      try {
        const data = await fetchDataFromAirtable();

        console.log("-- Ended fetching");

        setCards(data, () => {
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error fetching data from Airtable:", error);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="flex justify-center items-center h-screen gradient">
          <div className="relative inline-flex">
            <div className="w-8 h-8 bg-blue-50 rounded-full"></div>
            <div className="w-8 h-8 bg-blue-50 rounded-full absolute top-0 left-0 animate-ping"></div>
            <div className="w-8 h-8 bg-blue-50 rounded-full absolute top-0 left-0 animate-pulse"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="relative flex flex-col justify-center items-center w-full h-screen gradient">
      <Head>
        <title>Hebrew game</title>
      </Head>
      <div className="w-full flex items-center pl-6 pr-6 pt-6 pb-3">
        <ProgressBar />
      </div>
      <div className="w-full flex-grow pt-30 pb-30 pl-30 pr-30 flex items-center justify-center relative">
        <AnimatePresence>
          {cards.map((card, index) => (
            <Card
              key={card.id}
              active={index === activeIndex}
              removeCard={removeCard}
              card={card}
              rand={randArray[index]}
              answerState={answerState}
              nextCard={nextCard}
            />
          ))}
        </AnimatePresence>
      </div>
      <div className="relative w-full h-[60px] pl-6 pr-6 pt-3 pb-3">
        <Input
          answer={answer}
          back={answerBack}
          check={answerCheck}
          answerState={answerState}
        />
      </div>
      <div className="w-full p-2 pt-3 pb-8">
        <Keyboard action={answerChange} />
      </div>
      {cards.length === 0 ? (
        <span className="text-white text-xl">End of Stack</span>
      ) : null}
    </div>
  );
};

export default Home;

export async function getServerSideProps() {
  // ***************************************************************************
  // Générer un nombre aléatoire côté serveur
  // ***************************************************************************

  const randArray = Array.from({ length: 1000 }, () =>
    Math.floor(Math.random() * 2),
  );

  // Passer le nombre aléatoire en tant que propriété
  return {
    props: {
      randArray,
    },
  };
}

const fetchDataFromAirtable = async () => {
  var Airtable = require("airtable");
  var base = new Airtable({
    apiKey:
      "patzE1v2QLhmppgah.08f1cfb5881452dcad5833d6bec5572667182dc141ba9ba8705e87c4aafb91fb",
  }).base("apphzBaClHuoxYsqB");

  return new Promise((resolve, reject) => {
    let data = [];

    base("Words")
      .select({
        maxRecords: 200,
        view: "Grid view",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record, index) {
            if (record.get("Name") && record.get("Word")) {
              const images = record.get("image");
              const sounds = record.get("Sound");
              const soundsPlural = record.get("Sound plural");

              let image,
                sound,
                soundPlural = undefined;

              if (images && images.length > 0) {
                image = images[0].url;

                if (sounds && sounds.length > 0) {
                  sound = sounds[0].url;
                }

                if (soundsPlural && soundsPlural.length > 0) {
                  soundPlural = soundsPlural[0].url;
                }

                data.push({
                  id: index,
                  word: record.get("Word"),
                  plural: record.get("Plural"),
                  gender: record.get("Gender"),
                  image: image,
                  sound: sound,
                  soundPlural: soundPlural,
                });
              }
            }
          });

          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }
          resolve(data);
        },
      );
  });
};
