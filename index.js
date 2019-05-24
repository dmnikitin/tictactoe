const tictactoe = function() {

    const x_Array = [];
    const o_Array = [];
    const winnerComb = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
    ];
    let withCPU;
    let current = true;
    const box = document.querySelectorAll('.box-element');
    const modal = document.querySelector('.modal');
    const buttonCPU = document.getElementById('buttonCPU');
    const buttonPlayer = document.getElementById('buttonPlayer');
    const reset = document.getElementById('reset');
    const score = document.getElementById('score');

    reset.addEventListener('click', () => document.location.reload(true));

    buttonCPU.addEventListener('click', () => {
        withCPU = true;
        modal.classList.toggle('show-modal');
    });

    buttonPlayer.addEventListener('click', () => {
        withCPU = false;
        modal.classList.toggle('show-modal')
    });

    const setAttributes = (el, attrs) => {
        for (let key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                el.setAttribute(key, attrs[key]);
            }
        }
    };

    const searchForWinnerCombination = currentTurn => {
        currentTurn.sort((a, b) => a - b);
        return winnerComb.some(curr => curr.every(x => currentTurn.includes(x)))
    };

    const checkCurrentSituation = value => {
        const arr = [];
        if (value.length >= 3 && searchForWinnerCombination(value)) {
            score.textContent = `the winner is: ${value === x_Array ? (withCPU ? 'Player' : ' X\'s') : (withCPU ? 'Computer' : ' O\'s') }`;
            setTimeout(() => alert(score.textContent), 1000);
            setTimeout(() => document.location.reload(true), 1000);
            withCPU = false;
            return;
        }
        for (let i = 0; i < 9; i++) {
            if (!box[i].classList.contains('pressed')) {
                arr.push(i);
            }
        }
        if (arr.length === 0) {
            score.textContent = 'it seems to be a draw';
            setTimeout(() => alert(score.textContent), 1000);
            setTimeout(() => document.location.reload(true), 2000);
            withCPU = false;
            return;
        }
    };

    const playerTurn = value => {
        const thisSideAction = (side) => {
            let link;
            side === x_Array ? value.className += ' pressed x' : value.className += ' pressed o';
            side === x_Array ? score.textContent = 'It\'s O\'s turn' : score.textContent = 'It\'s X\'s turn';
            side === x_Array ? link = './tic.png' : link = './tac.png';
            const img = document.createElement('img');
            setAttributes(img, { src: link, style: 'max-width: 92%; top: 2px; opacity: 0.7' });
            value.appendChild(img);
            side.push(+(value.id));
            checkCurrentSituation(side);
        };
        if (value.classList.contains('pressed')) {
            alert('Already pressed');
        } else if (!withCPU) {
            if (!value.classList.contains('pressed')) {
                current ? thisSideAction(x_Array) : thisSideAction(o_Array);
                current = !current;
            }
        } else if (current) {
            thisSideAction(x_Array);
            current = !current;
            withCPU ? compTurn() : null;
        }
    }

    const compTurn = () => {
        score.textContent = 'It\'s computer\'s turn';
        setTimeout(function() {
            let compLogicResult = compLogic();
            let desiredBox = box[compLogicResult - 1];
            let img = document.createElement('img');
            setAttributes(img, { src: './tac.png', style: 'width: 92%; top: 2px; opacity: 0.7' })
            desiredBox.appendChild(img)
            desiredBox.className += ' pressed o';
            o_Array.push(+(desiredBox.id));
            checkCurrentSituation(o_Array);
            withCPU ? score.textContent = 'It\'s your turn' : null;
            current = true;
        }, 1000)
    }

    const checkPossibleWinningComs = () => {
        let possibleCombsX = [];
        let possibleCombsO = [];
        let finalX = {};
        let finalY = {};

        const fillPossibleCombsArray = (array, possibleCombsArray) => {
            winnerComb.forEach(current => {
                array.forEach(e => {
                    if (current.indexOf(e) !== -1) {
                        possibleCombsArray.push(current);
                    }
                })
            });
            possibleCombsArray === possibleCombsX ?
                possibleCombsX = possibleCombsX.filter(i => !i.some(z => box[z - 1].classList.contains('o'))) :
                possibleCombsO = possibleCombsO.filter(i => !i.some(z => box[z - 1].classList.contains('x')))
        };

        fillPossibleCombsArray(x_Array, possibleCombsX);
        if (o_Array.length === 0) {
            possibleCombsO = winnerComb.filter(curr => !possibleCombsX.some(e => e.every((element, index) => element === curr[index])))
        }
        fillPossibleCombsArray(o_Array, possibleCombsO);

        const makeObjectWithCombinationsNumbers = (comb, object) => {
            comb.forEach(array => {
                array.forEach(number => {
                    if (number) {
                        if (object.hasOwnProperty(number)) {
                            object[number]++
                        } else { object[number] = 1 }
                    }
                })
            })
        };

        makeObjectWithCombinationsNumbers(possibleCombsX, finalX)
        makeObjectWithCombinationsNumbers(possibleCombsO, finalY)

        const maxOfObject = object => {
            let arr = Object.values(object);
            let max = Math.max(...arr);
            let y = Object.keys(object).filter(key => object[key] === max);
            if (y.length === 1 && !box[y - 1].classList.contains('pressed')) {
                return y;
            } else if (y.length > 1 && y.some(z => !box[z - 1].classList.contains('pressed'))) {
                return y.filter(e => !box[e - 1].classList.contains('pressed'));
            } else {
                let arr2 = arr.filter(e => e !== max);
                max = Math.max(...arr2);
                let z = Object.keys(object).filter(key => object[key] === max);
                return z;
            }
        };

        let resultX = maxOfObject(finalX);
        let resultY = maxOfObject(finalY);

        if (resultY.length !== 0) {
            let resultY2;
            if (resultX.every(e => resultY.indexOf(e) > -1) && resultX.length > 1) {
                resultY2 = resultY.filter(e => resultX.indexOf(e) === -1);
            } else {
                resultY2 = resultY.filter(e => resultX.indexOf(e) !== -1);
            }
            if (resultY2.length > 0) {
                return resultY2[Math.floor(Math.random() * (resultY2.length))];
            }
            return resultY[Math.floor(Math.random() * (resultY.length))];
        }
        return resultX[Math.floor(Math.random() * (resultX.length))];
    };

    const compLogic = () => {
        const checkForWinningPossibility = (currentCombination) => {
            let winnerNumber;
            let possibleWinnerCombinations = winnerComb.filter(current => {
                let arr = [];
                if (!current.every(y => box[y - 1].classList.contains('pressed'))) {
                    current.forEach(z => {
                        if (currentCombination.indexOf(z) !== -1) {
                            arr.push(z);
                        }
                    })
                    if (arr.length >= 2) {
                        return arr;
                    }
                }
            });
            possibleWinnerCombinations.forEach(current => {
                let final = current.filter(z => currentCombination.indexOf(z) < 0)
                if (!box[final[0] - 1].classList.contains('pressed')) {
                    winnerNumber = final[0];
                }
            });
            return winnerNumber;
        };
        let winner = checkForWinningPossibility(o_Array.sort((a, b) => a - b)) || checkForWinningPossibility(x_Array.sort((a, b) => a - b));
        if (winner != undefined) { return winner }
        return checkPossibleWinningComs();
    }

    const main = () => {
        modal.classList.toggle('show-modal');
        box.forEach(i => i.addEventListener('click', () => { playerTurn(i) }));
    }
    main();

}();
