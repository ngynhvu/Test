import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from "react";

function App() {
    const [play, setPlay] = useState(false);
    const [time, setTime] = useState(0);
    const [isCleared, setIsCleared] = useState(false);
    const [circles, setCircles] = useState([]);
    const [nextExpectedId, setNextExpectedId] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);
    const [level, setLevel] = useState(4000);
    const [showGuide, setShowGuide] = useState(false);

    //set time
    useEffect(() => {
        if (play) {
            const timer = setInterval(() => {
                setTime((prev) => prev + 0.1);
            }, 100);
            return () => clearInterval(timer);
        }
    }, [play])

    //set circle
    useEffect(() => {
        let interval;
        if (play) {
            interval = setInterval(() => {
                setCircles(generateCircles(6));
                setNextExpectedId(1);
            },level);
        }else {
            setCircles([]);
        }
        return () => clearInterval(interval);
    },[play]);

    //auto play
    useEffect(() => {
        if (autoPlay && circles.length > 0) {
            const interval = setInterval(() => {
                handleCircleClick(circles[0].id);
            }, 50);
            return () => clearInterval(interval);
        }
    }, [autoPlay, circles])

    const generateCircles = (count) => {
        const newCircles = [];
        for (let i = 1; i <= count; i++) {
            newCircles.push({
                id: i,
                x: Math.random() * 90,
                y: Math.random() * 90,
            });
        }
        return newCircles;
    };
    const handleCircleClick = (id) => {
        if (id === nextExpectedId) {
            setNextExpectedId((prev) => prev + 1);
            setCircles((prev) => prev.filter((circle) => circle.id !== id));
            if (circles.length === 1) {
                setIsCleared(true);
                setPlay(false);
            }
        } else {
            setGameOver(true);
            setPlay(false);
        }
    };
    return (
        <div className="container">
            <h1>LET'S PLAY</h1>
            {/* Nút hiển thị hướng dẫn */}
            <button onClick={() => setShowGuide((prev) => !prev)}>
                {showGuide ? "Hide Guide" : "Show Guide"}
            </button>

            {/* Note: Hướng dẫn chơi */}
            {showGuide && (
                <div className="guide-note">
                    <h3>How to Play:</h3>
                    <ul>
                        <li>Click on the circles in ascending order (e.g., 1 → 2 → 3).</li>
                        <li>If you click in the wrong order, the game is over.</li>
                        <li>When all circles are clicked in the correct order, you win!</li>
                        <li>You can select a difficulty level before starting the game.</li>
                        <li>Press "Restart" to play again.</li>
                    </ul>
                </div>
            )}
            <div>
                <strong>Level:</strong>
            </div>
            <div>
                <button className={"level"} onClick={() => setLevel(3000)}>Medium</button>
                <button className={"level"} onClick={() => setLevel(2000)}>Hard</button>
                <button className={"level"} onClick={() => setLevel(1000)}>Extreme</button>
                <button className={"level"} onClick={() => setLevel(500)}>Asian</button>
            </div>
            <div style={{ marginTop: "10px" }}>
                <strong>Time:</strong> {time.toFixed(1)}s
            </div>
            <div>
                <button onClick={() => window.location.reload()}>Restart</button>
                <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => setAutoPlay((prev) => !prev)}
                >
                    {autoPlay ? "Auto Play OFF" : "Auto Play ON"}
                </button>
                <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => setPlay((prevPlay) => !prevPlay)}
                    disabled={gameOver || isCleared}
                >
                    {play ? "Stop" : "Play"}
                </button>
            </div>
            <div className="game-board">
                {isCleared && <div className="message" style={{ color: "green" }}>YOU WIN!</div>}
                {gameOver && <div className="message" style={{ color: "red" }}>YOU LOSE!</div>}
                {/* Render circles */}
                {circles.map((circle) => (
                    <div
                        key={circle.id}
                        className="circle"
                        style={{
                            top: `${circle.y}%`,
                            left: `${circle.x}%`,
                        }}
                        onClick={() => handleCircleClick(circle.id)}
                    >
                        {circle.id}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
