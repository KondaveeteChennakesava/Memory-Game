import { useEffect, useState } from "react";

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);

  const [flippedCards, setFlippedCards] = useState([]);
  const [solvedCards, setSolvedCards] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);

  const [isWon, setIsWon] = useState(false);

  const handleGridSizeChange = (e) => {
    const value = e.target.value;
    if (value === "") return setGridSize(0);
    else {
      parseInt(e.target.value) > 10
        ? setGridSize(10)
        : setGridSize(parseInt(e.target.value));
    }
  };

  const initializeGame = () => {
    const totalPairs = Math.floor((gridSize * gridSize) / 2);
    const numbers = [
      ...Array(totalPairs)
        .keys()
        .map((num) => num + 1),
    ];
    const shuffledNumbers = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, gridSize * gridSize)
      .map((num, idx) => ({ id: idx, num }));

    setCards(shuffledNumbers);
    setFlippedCards([]);
    setSolvedCards([]);
    setIsWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const checkMatch = (secondId) => {
    const [firstId] = flippedCards;
    if (cards[firstId].num === cards[secondId].num) {
      setSolvedCards([...solvedCards, firstId, secondId]);
      setFlippedCards([]);
      setIsDisabled(false);
    } else {
      setTimeout(() => {
        setFlippedCards([]);
        setIsDisabled(false);
      }, 1000);
    }
  };

  const handleCardClick = (id) => {
    if (isDisabled || isWon) return;

    if (flippedCards.length === 0) {
      setFlippedCards([id]);
      return;
    }

    if (flippedCards.length === 1) {
      setIsDisabled(true);
      if (id !== flippedCards[0]) {
        setFlippedCards([...flippedCards, id]);
        checkMatch(id);
      } else {
        // setSolvedCards([...solvedCards, id]);
        setFlippedCards([]);
        setIsDisabled(false);
      }
    }
  };

  const isFlipped = (id) =>
    flippedCards.includes(id) || solvedCards.includes(id);
  const isSolved = (id) => solvedCards.includes(id);

  useEffect(() => {
    if (solvedCards.length === cards.length && cards.length > 0) setIsWon(true);
  }, [solvedCards, cards]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-grey-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>

      {/* input */}
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2">
          {" "}
          Grid Size: (max 10)
        </label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={gridSize}
          onChange={handleGridSizeChange}
          className="border-2 border-gray-300 rounded px-2 py-1"
        />
      </div>

      {/* Gameboard  */}
      <div
        className={`grid gap-2`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr)`,
          width: `min(100%, ${gridSize * 4.5}rem)`,
        }}
      >
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square test-xl font-bold rounded-lg cursor-pointer transition-all duration-300 w-16 h-16  flex items-center justify-center ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "text-gray-400 bg-gray-300"
              }`}
            >
              {isFlipped(card.id) ? card.num : "?"}
            </div>
          );
        })}
      </div>

      {/* Result  */}
      {isWon && (
        <div className="mt-4 font-bold text-4xl text-green-600 animate-bounce">
          You Won!
        </div>
      )}

      {/* Reset / Play Button  */}
      <button
        onClick={initializeGame}
        className="mt-4 px-4 py-2 bg-green-500 font-bold text-white rounded hover:bg-green-600"
      >
        {isWon ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;
