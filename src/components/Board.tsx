import React, {MouseEventHandler, useEffect, useState} from "react";

const BoardInfo: React.FC<{ curr: number }> = props => {
    return (<>
        <div className={`info`}>Current Player: {props.curr} : Please Drop A Coin</div>
    </>);
}

const DropButton: React.FC<{ key: string, player: number, onClickHdl: MouseEventHandler }> = props => {

    return (
        <div
            onClick={props.onClickHdl}
            className={`drop-btn`}
        >Drop</div>
    );

}

const ActionBar: React.FC<{ currentPlayer: number, dropBtnOnClick: (arg0: number) => void }> = props => {
    return <>
        {[1, 2, 3, 4, 5, 6, 7].map(
            (col, idx) => {
                return <DropButton
                    key={`h-${idx}`}
                    player={props.currentPlayer}
                    onClickHdl={() => props.dropBtnOnClick(idx)}
                />
            }
        )}</>

}

const SlotBox = (props: { slotCls: string, slotPlayerCls: string, i: number, j: number, slot: number }) => (
    <div className={`row`}>
        <div className={`slot-box`}>
            <div className={`${props.slotCls} ${props.slotPlayerCls}`}>({props.i},{props.j}):{props.slot}</div>
        </div>
    </div>);

const BoardRow: React.FC<{ numbers: number[], col:number}> = props => {

    let slotCls = `slot-ct`;

    let col = props.col;

    return <div className={`board-col`}>{
        props.numbers.map(
            (slot, j) => {

                // add p1, p2 classname
                let slotPlayerCls = ``;
                if (slot === 1) {
                    slotPlayerCls = `slot-p1`
                }
                else if (slot === 2) {
                    slotPlayerCls = `slot-p2`
                }

                return <SlotBox key={`C${col}R${j}`} slotCls={slotCls} slotPlayerCls={slotPlayerCls}
                                i={col} j={j} slot={slot}/>
            })
    }</div>;
};

/**
 * # Plan.
 * ## Create the board data types and structure.
 *  a) Matrix: board 7 cols, for 6 rows.
 *  b) Current User.
 *  c) Coin used count.
 *  d) coin data.
 *
 * ## UI
 *  a) CSS planning
 *  b) Grid container for layout (center game board)
 *  c) Grid layout for de 7 for 6 matrix.
 *  d) Slot: colored cirlce (hover, click, both players and default.
 *
 *  ## Create the board logic and biz logic.
 *  - a) switch between player one and two interaction. (turn switch)
 *  - b) interaction will drop a coin on top of the board. (user drop coin use case)
 *  - c) create test functions for game rules. (4 in line, all possible)
 *  - d) create app lifecycle methods. (start, stop, reset)
 *
 *  ## Create UI interaction.
 *  - User add coin handler.
 *
 * @param props
 * @constructor
 */
export const Board: React.FC<{}> = props => {

    // which player turn is.
    const [currentPlayer, setCurrentPlayer] = useState(1);


    /**
     * Board State
     *
     * States
     * - 0 no player (default)
     * - 1 player one (yellow)
     * - 2 player two (red)
     */
    const [slots, setSlots] = useState(
        [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ]
    );

    /* use this instead for biz rule check */
    // const [slots, setSlots] = useState(
    //         TestMatrix.diagTest3
    //     );


    // The game has a max coin count, full board test.
    const [coinsLeft, setCoinsLeft] = useState(42);

    /* Game Rules Check Funcitions */
    function testDraw() {
        return (coinsLeft === 0);
        // return (coinCount === 42);
    }

    /**
     * Test for 4 horizontal
     */
    function test4Hor() {
        let p1 = 0;
        let p2 = 0;
        let curr = 0;

        console.clear();
        console.log(`testing horz for player = ${currentPlayer}`)

        for (let row = 0; row < slots[0].length; row++) {

            for (let col = 0; col < slots.length; col++) {

                let slot = slots[col][row];

                console.log(`testing ${currentPlayer} slot=${slot} count=${curr} col=${col} row=${row}`)

                if (slot !== currentPlayer) {
                    curr = 0
                }
                else {
                    curr++;
                }


                if (curr === 4) {
                    return true
                }
            }


        }
        console.clear();
        return false;

    }

    /**
     * Test for 4 Vertical
     */
    function test4Vert() {

        let p1 = 0;
        let p2 = 0;
        let curr = 0;

        console.clear();
        // console.log(`testing vert for player = ${currentPlayer}`)
        for (let col = 0; col < slots.length; col++) {
            // for (let row = 0; row < slots[0].length; row++) {
            let row: number;
            for (row = slots[0].length - 1; row >= 0; row--) {

                let slot = slots[col][row];

                if (slot !== currentPlayer) {
                    curr = 0
                }
                else {
                    curr++;
                }

                console.log(`[Vert] ${currentPlayer} col=${col} row=${row} player=${slot} count=${curr} `)


                if (curr === 4) {
                    return true
                }
            }


        }

        console.clear();
        return false;
    }

    /**
     * Diagonal 4 in line test.
     */
    function test4Diag() {

        console.clear();
        // console.log('...');
        // console.log('');
        // console.log(`testing diagonal for player = ${currentPlayer}`)

        /**
         * Combined diagonal test for both up down diagonals.
         * @param array
         */
        function combined(array: number[][]) {

            function diagonal(array: number[][], bottomToTop: boolean = false) {

                const Ylength = array.length;
                const Xlength = array[0].length;
                const maxLength = Math.max(Xlength, Ylength);

                let temp: number[] = [];

                let count = 0;

                for (let k = 0; k <= 2 * (maxLength - 1); ++k) {

                    let hasPlayer = false;
                    temp = [];

                    // build diagonal
                    for (let y = Ylength - 1; y >= 0; --y) {
                        const x = k - (bottomToTop ? Ylength - y : y);
                        if (x >= 0 && x < Xlength) {
                            temp.push(array[y][x]);
                        }
                    }

                    // comply with length eq 4
                    if (temp.length >= 4) {

                        // values should have player
                        let s1 = new Set(temp);
                        hasPlayer = s1.has(currentPlayer);

                        // console.warn(`temp length ${temp} L=${temp.length} `,temp)
                        let hasFour = temp.some(val => {

                            if (val === 0) {
                                count = 0;
                            }
                            else if (currentPlayer === val) {
                                ++count;
                            }
                            else {
                                count = 0;
                            }

                            // if(count>=0) console.warn(`Count ${temp} L=${temp.length} count=${count} val=${val}`)

                            return (count >= 4);


                        });
                        if (hasPlayer && hasFour) {
                            // console.warn(`RETURN diagonal L=${temp.length} count=${count}`,hasPlayer , hasFour, temp)
                            return true
                        }
                    }
                }
                // return returnArray;
                return false;
            }

            // test for upwards and downwards diags.
            if (diagonal(array)) {
                return true;
            }
            else {
                return diagonal(array, true);
            }

        }


        // return walkDiag(slots);
        return combined(slots)

    }

    /* Game functionality */
    const stopGame = () => {
        console.warn(`STOPPING`);
    };

    const switchPlayer = () => {
        setCurrentPlayer((prevState) => (prevState === 1) ? 2 : 1);
    };

    const dropCoin = (currentPlayer: number, column: number) => {
        setSlots((prevState) => {

            let newState: number[][] = [];

            newState = prevState.reduce(
                (acc, col, colIdx) => {

                    // console.log(colIdx, col);

                    let newCol = [...col];
                    // update
                    if (colIdx === column) {
                        let found = false;
                        newCol = newCol.reduceRight(
                            (acc: number[], val, rowIdx) => {
                                if (val !== 0) {
                                    acc.unshift(val);
                                }
                                else if (found) {
                                    acc.unshift(0)
                                }
                                else {
                                    setCoinsLeft(prevState => coinsLeft - 1);
                                    found = true;
                                    acc.unshift(currentPlayer)

                                }

                                return acc;

                            }, [])
                    }

                    acc.push(newCol);

                    return acc;

                }, newState)

            console.log('new state', newState, 'coins left', coinsLeft)

            return newState
        })

    };

    // update the game after user interaction.
    // react to player change and perform game logic change before rendering.
    useEffect(() => {

        console.info(`useEffect > Coins Left: ${coinsLeft} testing rules`);

        let continueGame: boolean = false;

        if (testDraw()) {
            console.info(`GameOver:draw`)
        }
        else if (test4Hor()) {
            console.info(`Player ${currentPlayer} Won! : Has horz`)
        }
        else if (test4Vert()) {
            console.info(`Player ${currentPlayer} Won!:has VERTICAL`)
        }
        else if (test4Diag()) {
            console.info(`Player ${currentPlayer} Won! : Got Diagonal`)
        }
        else {
            console.info(`No Winner: Continue`);
            continueGame = true;
        }

        if (!continueGame) {
            stopGame();
        }

        switchPlayer();

        return () => {
            console.warn(`cleaning up actions`)
        }

    }, [slots]);


    /* event listeners */
    const dropBtnOnClick = (column: number) => {
        console.info(`onClick: player ${currentPlayer} drop coin into col ${column}`);
        dropCoin(currentPlayer, column);
    }

    return (
        <>
            <BoardInfo curr={1}></BoardInfo>

            <div className={`board-ct`}>

                <ActionBar
                    currentPlayer={currentPlayer}
                    dropBtnOnClick={dropBtnOnClick}
                />

                {
                    slots.map((rowArr, i) => {

                        return (
                            <BoardRow key={`slotR${i}`} col={i} numbers={rowArr}/>
                        )
                    })
                }

            </div>
        </>
    );
};