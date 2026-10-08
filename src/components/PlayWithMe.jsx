import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import "./PlayWithMe.css";

import mansiProfile from "../assets/images/mansi.png";
import manseeProfile from "../assets/images/mansee.jpg";
import { Link } from "react-router-dom";
import GameSelector from "./GameSelector";
import TicTacToe from "./TicTacToe";
import { chooseComputerMove, getWinner } from "./ticTacToeLogic";

const CHAT_TIMEOUT_MS = 30000;
const AI_MOVE_DELAY_MS = 450;
const TIC_TAC_TOE_DELAY_MS = 650;

const createChatId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://manseez-portfolio.onrender.com"
).replace(/\/+$/, "");
const CHAT_API_URL = `${API_BASE_URL}/api/chat/`;

/* =====================================================
   CHESS AI
===================================================== */

const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

/*
  Positive score = good for Black
  Negative score = good for White
*/

const evaluatePosition = (position) => {
  let score = 0;

  for (const row of position.board()) {
    for (const piece of row) {
      if (piece) {
        score +=
          piece.color === "b"
            ? PIECE_VALUES[piece.type]
            : -PIECE_VALUES[piece.type];
      }
    }
  }

  return score;
};

/*
  Minimax AI.
*/

const minimax = (
  position,
  depth,
  alpha,
  beta,
  aiColor
) => {
  if (depth === 0 || position.isGameOver()) {
    if (position.isCheckmate()) {
      return position.turn() === aiColor
        ? -100000
        : 100000;
    }

    const evaluation = evaluatePosition(position);

    return aiColor === "b"
      ? evaluation
      : -evaluation;
  }

  const aiTurn = position.turn() === aiColor;

  let bestScore = aiTurn
    ? -Infinity
    : Infinity;

  for (const move of position.moves({
    verbose: true,
  })) {
    const nextPosition = new Chess(position.fen());

    nextPosition.move(move);

    const score = minimax(
      nextPosition,
      depth - 1,
      alpha,
      beta,
      aiColor
    );

    if (aiTurn) {
      bestScore = Math.max(
        bestScore,
        score
      );

      alpha = Math.max(
        alpha,
        score
      );
    } else {
      bestScore = Math.min(
        bestScore,
        score
      );

      beta = Math.min(
        beta,
        score
      );
    }

    if (beta <= alpha) {
      break;
    }
  }

  return bestScore;
};

/*
  Find AI's best move.
*/

const getBestAiMove = (
  position,
  aiColor
) => {
  const legalMoves = position.moves({
    verbose: true,
  });

  if (!legalMoves.length) {
    return null;
  }

  let bestScore = -Infinity;

  const bestMoves = [];

  for (const move of legalMoves) {
    const nextPosition =
      new Chess(position.fen());

    nextPosition.move(move);

    const score = minimax(
      nextPosition,
      2,
      -Infinity,
      Infinity,
      aiColor
    );

    if (score > bestScore) {
      bestScore = score;

      bestMoves.length = 0;

      bestMoves.push(move);
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }

  return bestMoves[
    Math.floor(
      Math.random() *
        bestMoves.length
    )
  ];
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function PlayWithMe() {
  /* =====================================================
     CHESS STATE
  ===================================================== */

  const [game, setGame] = useState(
    () => new Chess()
  );

  /*
    Player color:
    "w" = You are White
    "b" = You are Black
  */

  const [playerColor, setPlayerColor] =
    useState("w");

  const [boardOrientation, setBoardOrientation] =
    useState("white");

  const [
    isComputerThinking,
    setIsComputerThinking,
  ] = useState(false);

  const [moveHistory, setMoveHistory] =
    useState([]);

  const [selectedGame, setSelectedGame] = useState("chess");
  const [ticTacToeBoard, setTicTacToeBoard] = useState(() => Array(9).fill(null));
  const [ticTacToeThinking, setTicTacToeThinking] = useState(false);
  const [ticTacToeResult, setTicTacToeResult] = useState(null);
  const [ticTacToeWinningCells, setTicTacToeWinningCells] = useState([]);
  const [ticTacToeScore, setTicTacToeScore] = useState({ player: 0, computer: 0, ties: 0 });

  /* =====================================================
     CHAT STATE
  ===================================================== */

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([
      {
        id: createChatId(),
        sender: "bot",
        text: "Hello there!",
      },
    ]);

  /* =====================================================
     REFS
  ===================================================== */

  const chatInFlightRef =
    useRef(false);

  const chatAbortControllerRef =
    useRef(null);

  const aiMoveTimerRef =
    useRef(null);

  const ticTacToeTimerRef = useRef(null);

  const movesListRef = useRef(null);

  const isMountedRef =
    useRef(false);

  /* =====================================================
     COMPONENT MOUNT
  ===================================================== */

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      chatAbortControllerRef.current?.abort();

      window.clearTimeout(
        aiMoveTimerRef.current
      );

      window.clearTimeout(ticTacToeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    movesListRef.current?.scrollTo({
      top: movesListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [moveHistory]);

  /* =====================================================
     COMPUTER MOVE
  ===================================================== */

  useEffect(() => {
    if (game.isGameOver()) {
      setIsComputerThinking(false);
      return undefined;
    }

    if (game.turn() === playerColor) {
      setIsComputerThinking(false);
      return undefined;
    }

    const aiColor =
      playerColor === "w"
        ? "b"
        : "w";

    const positionBeforeMove =
      game.fen();

    setIsComputerThinking(true);

    aiMoveTimerRef.current =
      window.setTimeout(() => {
        const currentGame =
          new Chess(positionBeforeMove);

        if (
          currentGame.isGameOver() ||
          currentGame.turn() === playerColor
        ) {
          setIsComputerThinking(false);
          return;
        }

        const bestMove =
          getBestAiMove(
            currentGame,
            aiColor
          );

        if (!bestMove) {
          setIsComputerThinking(false);
          return;
        }

        const playedMove =
          currentGame.move(bestMove);

        if (!playedMove) {
          setIsComputerThinking(false);
          return;
        }

        setMoveHistory(
          (previous) => [
            ...previous,
            {
              color: playedMove.color,
              san: playedMove.san,
            },
          ]
        );

        console.log(
          "AI move:",
          playedMove.san
        );

        setGame(currentGame);

        setIsComputerThinking(false);
      }, AI_MOVE_DELAY_MS);

    return () => {
      window.clearTimeout(
        aiMoveTimerRef.current
      );
    };
  }, [game, playerColor]);

  /* =====================================================
     PLAYER MOVE
  ===================================================== */

  const handlePieceDrop = ({
    sourceSquare,
    targetSquare,
    piece,
  }) => {
    console.log(
      "Piece moved:",
      {
        piece,
        sourceSquare,
        targetSquare,
      }
    );

    if (game.turn() !== playerColor) {
      console.log(
        "Not player's turn"
      );

      return false;
    }

    if (game.isGameOver()) {
      return false;
    }

    if (isComputerThinking) {
      return false;
    }

    if (
      !sourceSquare ||
      !targetSquare
    ) {
      return false;
    }

    try {
      const newGame =
        new Chess(game.fen());

      const move =
        newGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });

      if (!move) {
        console.log(
          "Illegal move"
        );

        return false;
      }

      setMoveHistory(
        (previous) => [
          ...previous,
          {
            color: move.color,
            san: move.san,
          },
        ]
      );

      console.log(
        "Valid move:",
        move.san
      );

      setGame(newGame);

      return true;
    } catch (error) {
      console.error(
        "Chess move error:",
        error
      );

      return false;
    }
  };

  /* =====================================================
     NEW GAME
  ===================================================== */

  const handleNewGame = () => {
    window.clearTimeout(
      aiMoveTimerRef.current
    );

    const newGame =
      new Chess();

    setGame(newGame);

    setMoveHistory([]);

    setBoardOrientation(
      playerColor === "w"
        ? "white"
        : "black"
    );

    setIsComputerThinking(false);

    console.log(
      "New game started"
    );
  };

  /* =====================================================
     FLIP BOARD / CHANGE PLAYER
  ===================================================== */

  const handleFlipBoard = () => {
    window.clearTimeout(
      aiMoveTimerRef.current
    );

    const newPlayerColor =
      playerColor === "w"
        ? "b"
        : "w";

    const newGame =
      new Chess();

    setPlayerColor(
      newPlayerColor
    );

    setBoardOrientation(
      newPlayerColor === "w"
        ? "white"
        : "black"
    );

    setGame(newGame);

    setMoveHistory([]);

    setIsComputerThinking(false);

    console.log(
      "Player is now:",
      newPlayerColor === "w"
        ? "White"
        : "Black"
    );
  };

  const handleTicTacToeNewGame = () => {
    window.clearTimeout(ticTacToeTimerRef.current);
    setTicTacToeBoard(Array(9).fill(null));
    setTicTacToeThinking(false);
    setTicTacToeResult(null);
    setTicTacToeWinningCells([]);
  };

  const finishTicTacToe = (nextBoard, outcome) => {
    const winner = getWinner(nextBoard);
    setTicTacToeBoard(nextBoard);
    setTicTacToeResult(outcome);
    setTicTacToeWinningCells(winner?.line || []);
    setTicTacToeScore((previous) => ({
      ...previous,
      player: previous.player + (outcome === "X" ? 1 : 0),
      computer: previous.computer + (outcome === "O" ? 1 : 0),
      ties: previous.ties + (outcome === "draw" ? 1 : 0),
    }));
  };

  const handleTicTacToeCellClick = (index) => {
    if (ticTacToeBoard[index] || ticTacToeThinking || ticTacToeResult) return;

    const playerBoard = [...ticTacToeBoard];
    playerBoard[index] = "X";
    const playerWinner = getWinner(playerBoard);

    if (playerWinner) {
      finishTicTacToe(playerBoard, "X");
      return;
    }

    if (playerBoard.every(Boolean)) {
      finishTicTacToe(playerBoard, "draw");
      return;
    }

    setTicTacToeBoard(playerBoard);
    setTicTacToeThinking(true);
    ticTacToeTimerRef.current = window.setTimeout(() => {
      const computerIndex = chooseComputerMove(playerBoard);
      const computerBoard = [...playerBoard];
      computerBoard[computerIndex] = "O";
      const computerWinner = getWinner(computerBoard);

      if (computerWinner) {
        finishTicTacToe(computerBoard, "O");
      } else if (computerBoard.every(Boolean)) {
        finishTicTacToe(computerBoard, "draw");
      } else {
        setTicTacToeBoard(computerBoard);
      }
      setTicTacToeThinking(false);
    }, TIC_TAC_TOE_DELAY_MS);
  };

  /* =====================================================
     CHAT SUBMIT
  ===================================================== */

  const handleChatSubmit =
    async (e) => {
      e.preventDefault();

      const text =
        message.trim();

      if (
        !text ||
        chatInFlightRef.current
      ) {
        return;
      }

      chatInFlightRef.current =
        true;

      setMessages(
        (previous) => [
          ...previous,
          {
            id: createChatId(),
            sender: "user",
            text,
          },
        ]
      );

      setMessage("");

      const history =
        messages
          .slice(-10)
          .map(
            ({
              sender,
              text: content,
            }) => ({
              role:
                sender === "user"
                  ? "user"
                  : "model",
              content,
            })
          );

      const controller =
        new AbortController();

      const botMessageId =
        createChatId();

      let replyText = "";

      let botMessageAdded =
        false;

      let timedOut = false;

      let timeoutId;

      chatAbortControllerRef.current =
        controller;

      const timeoutMessage =
        "Sorry, my reply is taking too long. Please try again.";

      const connectionErrorMessage =
        "Sorry, I couldn't connect to my AI assistant right now.";

      /* =====================================================
         UPDATE CHAT REPLY
      ===================================================== */

      const updateStreamedReply =
        (textChunk) => {
          if (
            !isMountedRef.current
          ) {
            return;
          }

          replyText += textChunk;

          const shouldAddBotMessage =
            !botMessageAdded;

          botMessageAdded =
            true;

          setMessages(
            (previous) => {
              if (
                !shouldAddBotMessage
              ) {
                return previous.map(
                  (item) =>
                    item.id ===
                    botMessageId
                      ? {
                          ...item,
                          text: replyText,
                        }
                      : item
                );
              }

              return [
                ...previous,
                {
                  id: botMessageId,
                  sender: "bot",
                  text: replyText,
                },
              ];
            }
          );
        };

      /* =====================================================
         SERVER SENT EVENT
      ===================================================== */

      const handleServerEvent =
        (eventBlock) => {
          let eventName =
            "message";

          const dataLines = [];

          for (
            const line of eventBlock.split(
              /\r?\n/
            )
          ) {
            if (
              line.startsWith("event:")
            ) {
              eventName =
                line
                  .slice(6)
                  .trim();
            } else if (
              line.startsWith("data:")
            ) {
              dataLines.push(
                line
                  .slice(5)
                  .trim()
              );
            }
          }

          if (!dataLines.length) {
            return false;
          }

          const data =
            JSON.parse(
              dataLines.join("\n")
            );

          if (
            eventName === "token" &&
            typeof data.text ===
              "string"
          ) {
            updateStreamedReply(
              data.text
            );
          } else if (
            eventName === "error"
          ) {
            throw new Error(
              typeof data.message ===
                "string"
                ? data.message
                : "The chat service could not finish the reply."
            );
          }

          return (
            eventName === "done"
          );
        };

      /* =====================================================
         CHAT REQUEST
      ===================================================== */

      try {
        const timeout =
          new Promise(
            (_, reject) => {
              timeoutId =
                window.setTimeout(
                  () => {
                    timedOut = true;

                    controller.abort();

                    reject(
                      new Error(
                        "Chat request timed out"
                      )
                    );
                  },
                  CHAT_TIMEOUT_MS
                );
            }
          );

        const request =
          fetch(
            CHAT_API_URL,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                message: text,
                history,
              }),

              signal:
                controller.signal,
            }
          );

        const response =
          await Promise.race([
            request,
            timeout,
          ]);

        if (!response.ok) {
          throw new Error(
            `Chat API failed with status ${response.status}`
          );
        }

        const contentType =
          response.headers.get(
            "content-type"
          ) || "";

        /* JSON response */

        if (
          contentType.includes(
            "application/json"
          )
        ) {
          const data =
            await response.json();

          if (
            typeof data.reply !==
              "string" ||
            !data.reply.trim()
          ) {
            throw new Error(
              "Invalid response from chat API"
            );
          }

          updateStreamedReply(
            data.reply
          );
        }

        /* Streaming response */

        else if (
          contentType.includes(
            "text/event-stream"
          ) &&
          response.body
        ) {
          const reader =
            response.body.getReader();

          const decoder =
            new TextDecoder();

          let buffer = "";

          let streamFinished =
            false;

          while (
            !streamFinished
          ) {
            const readResult =
              await Promise.race([
                reader.read(),
                timeout,
              ]);

            buffer +=
              decoder.decode(
                readResult.value ||
                  new Uint8Array(),
                {
                  stream:
                    !readResult.done,
                }
              );

            let boundary =
              buffer.search(
                /\r?\n\r?\n/
              );

            while (
              boundary !== -1
            ) {
              const eventBlock =
                buffer.slice(
                  0,
                  boundary
                );

              const delimiter =
                buffer.match(
                  /\r?\n\r?\n/
                )[0];

              buffer =
                buffer.slice(
                  boundary +
                    delimiter.length
                );

              streamFinished =
                handleServerEvent(
                  eventBlock
                );

              if (
                streamFinished
              ) {
                break;
              }

              boundary =
                buffer.search(
                  /\r?\n\r?\n/
                );
            }

            if (
              readResult.done
            ) {
              if (
                buffer.trim()
              ) {
                streamFinished =
                  handleServerEvent(
                    buffer
                  );
              }

              break;
            }
          }

          if (!replyText.trim()) {
            throw new Error(
              "Chat API returned an empty response"
            );
          }
        } else {
          throw new Error(
            "Invalid response format from chat API"
          );
        }
      } catch (error) {
        if (
          error.name !==
            "AbortError" ||
          timedOut
        ) {
          console.error(
            "Chat error:",
            error
          );

          if (
            isMountedRef.current
          ) {
            setMessages(
              (previous) => [
                ...previous,
                {
                  id: createChatId(),
                  sender: "bot",
                  text: timedOut
                    ? timeoutMessage
                    : error.message ||
                      connectionErrorMessage,
                },
              ]
            );
          }
        }
      } finally {
        window.clearTimeout(
          timeoutId
        );

        chatAbortControllerRef.current =
          null;

        chatInFlightRef.current =
          false;
      }
    };

  /* =====================================================
     GAME STATUS
  ===================================================== */

  const getGameStatus = () => {
    if (game.isCheckmate()) {
      return game.turn() === "w"
        ? "Black wins"
        : "Mansi wins";
    }

    if (game.isDraw()) {
      return "Game drawn";
    }

    if (isComputerThinking) {
      return "Mansi is thinking...";
    }

    if (game.inCheck()) {
      return game.turn() === "w"
        ? "Mansi is in check!"
        : "Black is in check!";
    }

    return game.turn() === "w"
      ? "White's turn"
      : "Black's turn";
  };

  /* =====================================================
     MOVE PAIRS
  ===================================================== */

  const movePairs = [];

  for (
    let i = 0;
    i < moveHistory.length;
    i += 2
  ) {
    movePairs.push({
      number:
        Math.floor(i / 2) + 1,

      white:
        moveHistory[i]?.color === "w"
          ? moveHistory[i].san
          : "",

      black:
        moveHistory[i + 1]?.color === "b"
          ? moveHistory[i + 1].san
          : "",
    });
  }

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <main className="play-page">

      {/* TOP BAR */}

      <header className="play-topbar">
        <Link
          to="/"
          className="back-home"
        >
          ← Back to Home
        </Link>

        <span className="play-label">
          PLAY WITH ME
        </span>
      </header>

      {/* MAIN GAME */}

      <section className="play-game-layout">

        {/* CHAT */}

        <section className="chat-card">

          <div className="chat-header">

            <div className="chat-avatar">
              <img
                src={manseeProfile}
                alt="Mansee"
              />
            </div>

            <div className="chat-header-info">
              <h2>
                Talk with me
              </h2>

              <span>
                Ask me anything
              </span>
            </div>

          </div>

          <div className="chat-messages">

            {messages.map((item) => (
              <div
                key={item.id}
                className={`chat-message ${
                  item.sender === "user"
                    ? "user-message"
                    : "bot-message"
                }`}
              >
                {item.text}
              </div>
            ))}

          </div>

          <form
            className="chat-input"
            onSubmit={handleChatSubmit}
          >
            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Type a message..."
            />

            <button type="submit">
              ➤
            </button>
          </form>

        </section>

        {/* SHARED CENTER GAME CARD */}

        <section className="chess-card center-game-card">

          <div className="chess-player">

            <div className="player-avatar">
              <img
                src={mansiProfile}
                alt="Mansi"
              />
            </div>

            <div className="player-info">
              <strong>
                Mansi
              </strong>

              <span>
                Software Engineer
              </span>
            </div>

          </div>

          <div className={`game-content game-content-${selectedGame}`} key={selectedGame}>
          {selectedGame === "chess" ? <div className="chess-board">

            <Chessboard
              options={{
                position: game.fen(),

                boardOrientation:
                  boardOrientation,

                allowDragging:
                  game.turn() ===
                    playerColor &&
                  !game.isGameOver() &&
                  !isComputerThinking,

                onPieceDrop:
                  handlePieceDrop,

                animationDurationInMs:
                  250,

                showAnimations:
                  true,

                darkSquareStyle: {
                  backgroundColor:
                    "#765f50",
                },

                lightSquareStyle: {
                  backgroundColor:
                    "#e4d1b5",
                },

                boardStyle: {
                  borderRadius:
                    "5px",

                  overflow:
                    "hidden",
                },
              }}
            />

          </div> : (
            <TicTacToe
              board={ticTacToeBoard}
              thinking={ticTacToeThinking}
              result={ticTacToeResult}
              winningCells={ticTacToeWinningCells}
              score={ticTacToeScore}
              onCellClick={handleTicTacToeCellClick}
              onNewGame={handleTicTacToeNewGame}
            />
          )}
          </div>

        </section>

        {/* RIGHT SIDEBAR */}

        <aside className="game-sidebar">

          <GameSelector
            selectedGame={selectedGame}
            onGameChange={setSelectedGame}
          />

          {selectedGame === "chess" ? <>

          {/* STATUS */}

          <div className="status-card">

            <span
              className={`status-dot ${
                isComputerThinking
                  ? "thinking-dot"
                  : ""
              }`}
            />

            <span>
              {getGameStatus()}
            </span>

          </div>

          {/* MOVES */}

          <div className="moves-card">

            <div className="moves-title">
              MOVES
            </div>

            <div className="moves-list" ref={movesListRef}>

              {movePairs.length === 0 ? (

                <div className="empty-moves">
                  No moves yet
                </div>

              ) : (

                movePairs.map(
                  (move) => (
                    <div
                      className="move-row"
                      key={move.number}
                    >

                      <span className="move-number">
                        {move.number}.
                      </span>

                      <span>
                        {move.white}
                      </span>

                      <span>
                        {move.black}
                      </span>

                    </div>
                  )
                )

              )}

            </div>

          </div>

          {/* NEW GAME */}

          <button
            type="button"
            className="game-button primary"
            onClick={handleNewGame}
          >
            New Game
          </button>

          {/* FLIP BOARD */}

          <button
            type="button"
            className="game-button"
            onClick={handleFlipBoard}
          >
            Flip Board
          </button>

          </> : (
            <div className="tic-tac-toe-sidebar-summary">
              <div className="sidebar-section-title">TIC-TAC-TOE</div>
              <div className="tic-tac-toe-sidebar-status" aria-live="polite">
                {ticTacToeThinking ? "Mansi is thinking..." : ticTacToeResult ? "Game complete" : "Your turn"}
              </div>
              <div className="sidebar-score">
                <span>You <strong>{ticTacToeScore.player}</strong></span>
                <span>Mansi <strong>{ticTacToeScore.computer}</strong></span>
                <span>Ties <strong>{ticTacToeScore.ties}</strong></span>
              </div>
              <button type="button" className="game-button primary" onClick={handleTicTacToeNewGame}>New Game</button>
            </div>
          )}

        </aside>

      </section>

    </main>
  );
}
