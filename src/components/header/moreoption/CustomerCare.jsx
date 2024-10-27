import React, { useState } from 'react';

function CustomerCare() {
    const gridSize = 5;
    const [points, setPoints] = useState([{ row: 0, col: 0 }]);
    const [visited, setVisited] = useState(new Set(["0,0"]));
    const [isLocked, setIsLocked] = useState(false);
    const [lockPoint, setLockPoint] = useState(null);

    const handleMouseMove = (row, col) => {
        if (!isLocked) {
            const lastPoint = points[points.length - 1];

            // Movement allowed only to the right, left, or up from the initial point (0,0)
            if (
                (lastPoint.row === row && Math.abs(lastPoint.col - col) === 1) || // Move left/right
                (lastPoint.col === col && Math.abs(lastPoint.row - row) === 1) || // Move up/down
                (lastPoint.row === row && col === 0) || // Move to the left from the initial point
                (lastPoint.col === col && row === 0) // Move to the top from the initial point
            ) {
                if (!visited.has(`${row},${col}`)) {
                    setPoints([...points, { row, col }]);
                    setVisited(new Set([...visited, `${row},${col}`]));

                    // Lock if the endpoint (top-left second dot) is reached
                    if (row === 0 && col === 1) {
                        setIsLocked(true);
                    }
                } else {
                    // Lock drawing if a previously visited dot is touched
                    setIsLocked(true);
                    setLockPoint({ row, col });
                }
            }
        }
    };

    const calculatePath = () => {
        return points
            .map((point) => {
                const x = point.col * 50 + 25; // Center of each dot
                const y = point.row * 50 + 25; // Center of each dot
                return `${x},${y}`;
            })
            .join(' ');
    };

    const handleReset = () => {
        setPoints([{ row: 0, col: 0 }]);
        setVisited(new Set(["0,0"]));
        setIsLocked(false);
        setLockPoint(null);
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="relative">
                <svg
                    className="absolute inset-0"
                    width="250"
                    height="250"
                    style={{ zIndex: -1 }}
                >
                    <polyline
                        points={calculatePath()}
                        stroke="black"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>
                <div className="grid grid-cols-5 gap-4">
                    {Array.from({ length: gridSize }).map((_, row) => (
                        <React.Fragment key={row}>
                            {Array.from({ length: gridSize }).map((_, col) => (
                                <div
                                    key={`${row}-${col}`}
                                    onMouseEnter={() => handleMouseMove(row, col)}
                                    className={`w-10 h-10 rounded-full cursor-pointer ${points.some(
                                        (point) =>
                                            point.row === row && point.col === col
                                    )
                                        ? lockPoint && lockPoint.row === row && lockPoint.col === col
                                            ? 'bg-pink-500'
                                            : 'bg-red-500'
                                        : 'bg-blue-500'
                                        } ${visited.has(`${row},${col}`)
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                        }`}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <button
                onClick={handleReset}
                className="mt-6 px-4 py-2 bg-green-500 text-white rounded"
            >
                Reset
            </button>
        </div>
    );
}

export default CustomerCare;
