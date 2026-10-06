import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import "./PlayWithMe.css";

const CHAT_TIMEOUT_MS = 30000;

const createChatId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const CHAT_API_URL =
  import.meta.env.VITE_CHAT_API_URL || "http://127.0.0.1:8000/api/chat/";

const AI_MOVE_DELAY_MS = 450;
const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const evaluatePosition = (position) => {
  let score = 0;
  for (const row of position.board()) {
    for (const piece of row) {
      if (piece) score += piece.color === "b" ? PIECE_VALUES[piece.type] : -PIECE_VALUES[piece.type];
    }
  }
  return score;
};

const minimax = (position, depth, alpha, beta) => {
  if (depth === 0 || position.isGameOver()) {
    if (position.isCheckmate()) return position.turn() === "w" ? 100000 : -100000;
    return evaluatePosition(position);
  }

  const aiTurn = position.turn() === "b";
  let bestScore = aiTurn ? -Infinity : Infinity;
  for (const move of position.moves({ verbose: true })) {
    const nextPosition = new Chess(position.fen());
    nextPosition.move(move);
    const score = minimax(nextPosition, depth - 1, alpha, beta);
    if (aiTurn) {
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, score);
    } else {
      bestScore = Math.min(bestScore, score);
      beta = Math.min(beta, score);
    }
    if (beta <= alpha) break;
  }
  return bestScore;
};

const getBestAiMove = (position) => {
  let bestScore = -Infinity;
  const bestMoves = [];
  for (const move of position.moves({ verbose: true })) {
    const nextPosition = new Chess(position.fen());
    nextPosition.move(move);
    const score = minimax(nextPosition, 2, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMoves.length = 0;
      bestMoves.push(move);
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
};

export default function PlayWithMe() {
  const [game, setGame] = useState(new Chess());

  const [boardOrientation, setBoardOrientation] =
    useState("white");
  const [isComputerThinking, setIsComputerThinking] = useState(false);

  const [message, setMessage] = useState("");
  const chatInFlightRef = useRef(false);
  const chatAbortControllerRef = useRef(null);
  const aiMoveTimerRef = useRef(null);
  const isMountedRef = useRef(false);

  const [messages, setMessages] = useState([
    {
      id: createChatId(),
      sender: "bot",
      text: "Hello there! 👋 I'm Mansi. Want to play a quick game?"
    }
  ]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      chatAbortControllerRef.current?.abort();
      window.clearTimeout(aiMoveTimerRef.current);
    };
  }, []);

  /* =====================================================
     COMPUTER MOVE
  ===================================================== */

  useEffect(() => {
    if (game.isGameOver() || game.turn() !== "b") {
      setIsComputerThinking(false);
      return undefined;
    }

    const positionBeforeMove = game.fen();
    setIsComputerThinking(true);
    aiMoveTimerRef.current = window.setTimeout(() => {
      setGame((currentGame) => {
        // Do not apply a stale AI move after a new game starts.
        if (
          currentGame.fen() !== positionBeforeMove ||
          currentGame.turn() !== "b" ||
          currentGame.isGameOver()
        ) {
          return currentGame;
        }

        const nextGame = new Chess(currentGame.fen());
        const bestMove = getBestAiMove(nextGame);
        if (bestMove) nextGame.move(bestMove);
        return nextGame;
      });
      setIsComputerThinking(false);
    }, AI_MOVE_DELAY_MS);

    return () => window.clearTimeout(aiMoveTimerRef.current);
  }, [game]);


  /* =====================================================
     PLAYER MOVE
  ===================================================== */

  const handlePieceDrop = (
    sourceSquare,
    targetSquare
  ) => {
    // The visitor always plays White. Flipping only changes the view.
    if (game.turn() !== "w" || game.isGameOver() || isComputerThinking) {
      return false;
    }

    try {
      const newGame = new Chess(
        game.fen()
      );

      const move = newGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q"
      });

      // Illegal move
      if (!move) {
        return false;
      }

      setGame(newGame);

      // Game ended after player's move
      if (newGame.isGameOver()) {
        return true;
      }

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
    window.clearTimeout(aiMoveTimerRef.current);
    setGame(new Chess());
    setBoardOrientation("white");
    setIsComputerThinking(false);
  };


  /* =====================================================
     FLIP BOARD
  ===================================================== */

  const handleFlipBoard = () => {
    setBoardOrientation((current) =>
      current === "white"
        ? "black"
        : "white"
    );
  };


  /* =====================================================
     CHAT
  ===================================================== */
  const handleChatSubmit = async (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text || chatInFlightRef.current) return;

    chatInFlightRef.current = true;
    setMessages((previous) => [
      ...previous,
      {
        id: createChatId(),
        sender: "user",
        text,
      },
    ]);
    setMessage("");

    // Preserve enough context for natural follow-up questions without sending
    // the entire conversation with every request.
    const history = messages.slice(-10).map(({ sender, text: content }) => ({
      role: sender === "user" ? "user" : "model",
      content,
    }));

    const controller = new AbortController();
    const botMessageId = createChatId();
    let replyText = "";
    let botMessageAdded = false;
    let timedOut = false;
    let timeoutId;

    chatAbortControllerRef.current = controller;
    const timeoutMessage = "Sorry, my reply is taking too long. Please try again.";
    const connectionErrorMessage =
      "Sorry, I couldn't connect to my AI assistant right now.";

    const updateStreamedReply = (textChunk) => {
      if (!isMountedRef.current) return;

      replyText += textChunk;
      const shouldAddBotMessage = !botMessageAdded;
      botMessageAdded = true;

      setMessages((previous) => {
        if (!shouldAddBotMessage) {
          return previous.map((item) =>
            item.id === botMessageId
              ? { ...item, text: replyText }
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
      });
    };

    const handleServerEvent = (eventBlock) => {
      let eventName = "message";
      const dataLines = [];

      for (const line of eventBlock.split(/\r?\n/)) {
        if (line.startsWith("event:")) {
          eventName = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          dataLines.push(line.slice(5).trim());
        }
      }

      if (!dataLines.length) return false;

      const data = JSON.parse(dataLines.join("\n"));

      if (eventName === "token" && typeof data.text === "string") {
        updateStreamedReply(data.text);
      } else if (eventName === "error") {
        throw new Error(
          typeof data.message === "string"
            ? data.message
            : "The chat service could not finish the reply."
        );
      }

      return eventName === "done";
    };

    try {
      const timeout = new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => {
          timedOut = true;
          controller.abort();
          reject(new Error("Chat request timed out"));
        }, CHAT_TIMEOUT_MS);
      });

      const request = fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text, history }),
        signal: controller.signal,
      });

      const response = await Promise.race([request, timeout]);

      if (!response.ok) {
        throw new Error(`Chat API failed with status ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await response.json();
        if (typeof data.reply !== "string" || !data.reply.trim()) {
          throw new Error("Invalid response from chat API");
        }
        updateStreamedReply(data.reply);
      } else if (contentType.includes("text/event-stream") && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let streamFinished = false;

        while (!streamFinished) {
          const readResult = await Promise.race([reader.read(), timeout]);
          buffer += decoder.decode(readResult.value || new Uint8Array(), {
            stream: !readResult.done,
          });

          let boundary = buffer.search(/\r?\n\r?\n/);

          while (boundary !== -1) {
            const eventBlock = buffer.slice(0, boundary);
            const delimiter = buffer.match(/\r?\n\r?\n/)[0];
            buffer = buffer.slice(boundary + delimiter.length);
            streamFinished = handleServerEvent(eventBlock);

            if (streamFinished) break;
            boundary = buffer.search(/\r?\n\r?\n/);
          }

          if (readResult.done) {
            if (buffer.trim()) {
              streamFinished = handleServerEvent(buffer);
            }
            break;
          }
        }

        if (!replyText.trim()) {
          throw new Error("Chat API returned an empty response");
        }
      } else {
        throw new Error("Invalid response format from chat API");
      }
    } catch (error) {
      if (error.name !== "AbortError" || timedOut) {
        console.error("Chat error:", error);
        if (isMountedRef.current) {
          setMessages((previous) => [
            ...previous,
            {
              id: createChatId(),
              sender: "bot",
              text: timedOut
                ? timeoutMessage
                : error.message || connectionErrorMessage,
            },
          ]);
        }
      }
    } finally {
      window.clearTimeout(timeoutId);
      chatAbortControllerRef.current = null;
      chatInFlightRef.current = false;

    }
  };

  /* =====================================================
     GAME STATUS
  ===================================================== */

  const getGameStatus = () => {
    if (game.isCheckmate()) {
      return game.turn() === "w"
        ? "Checkmate — Black wins"
        : "Checkmate — You win!";
    }

    if (game.isDraw()) {
      return "Game drawn";
    }

    if (isComputerThinking) {
      return "AI is thinking...";
    }

    if (game.inCheck()) {
      return game.turn() === "w"
        ? "You're in check!"
        : "Black is in check!";
    }

    return game.turn() === "w"
      ? "Your turn"
      : "Black's turn";
  };


  /* =====================================================
     MOVE HISTORY
  ===================================================== */

  const history = game.history();

  const movePairs = [];

  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: history[i] || "",
      black: history[i + 1] || ""
    });
  }


  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <main className="play-page">

      {/* ================================
          TOP BAR
      ================================= */}

      <header className="play-topbar">

        <a
          href="/"
          className="back-home"
        >
          ← Back to Home
        </a>

        <span className="play-label">
          PLAY WITH ME
        </span>

      </header>


      {/* ================================
          MAIN GAME
      ================================= */}

      <section className="play-game-layout">

        {/* =================================
            CHAT
        ================================= */}

        <section className="chat-card">

          <div className="chat-header">

            <div className="chat-avatar">
              ✦
            </div>

            <div>
              <h2>Talk with me</h2>

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


        {/* =================================
            CHESS
        ================================= */}

        <section className="chess-card">

          {/* PLAYER HEADER */}

          <div className="chess-player">

            <div className="player-avatar">
              M
            </div>

            <div className="player-info">

              <strong>
                Mansi
              </strong>

              <span>
                Web Developer
              </span>

            </div>

          </div>


          {/* BOARD */}

          <div className="chess-board">

            <Chessboard
              position={game.fen()}
              onPieceDrop={
                handlePieceDrop
              }
              boardOrientation={
                boardOrientation
              }
              arePiecesDraggable={
                game.turn() === "w" &&
                !game.isGameOver() &&
                !isComputerThinking
              }
              customDarkSquareStyle={{
                backgroundColor:
                  "#765f50"
              }}
              customLightSquareStyle={{
                backgroundColor:
                  "#e4d1b5"
              }}
              customBoardStyle={{
                borderRadius: "5px",
                overflow: "hidden"
              }}
              animationDuration={250}
            />

          </div>

        </section>


        {/* =================================
            RIGHT SIDEBAR
        ================================= */}

        <aside className="game-sidebar">

          {/* STATUS */}

          <div className="status-card">

            <span
              className={`status-dot ${
                isComputerThinking ? "thinking-dot" : ""
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

            <div className="moves-list">

              {movePairs.length === 0 ? (
                <div className="empty-moves">
                  No moves yet
                </div>
              ) : (
                movePairs.map((move) => (
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
                ))
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


          {/* FLIP */}

          <button
            type="button"
            className="game-button"
            onClick={handleFlipBoard}
          >
            Flip Board
          </button>

        </aside>

      </section>

    </main>
  );
}
