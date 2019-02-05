const tictactoe = function() {
       
    const krestiki = [];
    const noliki = [];
    const winnerComb = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
    let withCPU;  
    let current = true; 
    const xod = document.querySelectorAll(".box-element");
    const z = document.querySelector(".table");
    const modal = document.querySelector(".modal");
    const reset = document.getElementById("reset").addEventListener("click", () => window.location.href=window.location.href);   
     
    const buttonCPU = document.getElementById("buttonCPU").addEventListener("click", () => {
        withCPU = true;
        modal.classList.toggle("show-modal");
    })
    const buttonPlayer = document.getElementById("buttonPlayer").addEventListener("click", () => {
        withCPU = false;
        modal.classList.toggle("show-modal")
    })
  
    const checkCurrent = currentXod => {
        currentXod.sort( (a,b) => a - b);
        return winnerComb.some( curr => curr.every( x => currentXod.includes(x))) 
    };

    const win = value => {
        if (value.length>=3) {
            if (checkCurrent(value)) {
                if (value == krestiki) {
                    z.innerHTML = `the winner is: Krestiki`;
                    alert (`the winner is: Krestiki`)}
                else {
                    z.innerHTML = `the winner is: Noliki`;
                    alert (`the winner is: Noliki`)
                }
                window.location.href=window.location.href;
                return;
            }
        }
    };

    const checkWin = () => {
          
        win(krestiki);
        win(noliki)
        const arr=[];
        for (let i=0; i<9; i++) {
            if ( !xod[i].classList.contains("pressed")) {
               arr.push(i)
            }
        }    
        if (arr.length ===0) {
            z.innerHTML = `it seems to be a draw`;
            alert (`it seems to be a draw`)
            window.location.href=window.location.href;
            return;
        }
    };

    const playerXod = value => { 

        const thisSideAction = (side) => {
            let link;
            side === krestiki ? value.className += " pressed x" : value.className += " pressed o"
            side === krestiki ? z.innerHTML = "Its tacks turn" : z.innerHTML = "Its ticks turn"
            side === krestiki ? link = "./tic.png" : link = "./tac.png";
            value.innerHTML =  `<img src=${link} style="max-width: 92%; top: 2px; opacity: 0.7"> `
            side.push(+(value.id));
            checkWin()
        }
        
        if (value.classList.contains("pressed")) { 
            alert("Already pressed")
        }    
        else if (!withCPU ) {         
            if (!value.classList.contains("pressed")) {               
                current ? thisSideAction(krestiki) : thisSideAction(noliki) 
                current = !current 
           }     
        }    
        else if (current) {          
            thisSideAction(krestiki)
            current = !current;             
            compXod()
        } 
    }  
 
    const compXod = () => {  
        z.innerHTML = "Its computer's turn";
        setTimeout(function() {
            let k = compLogic();
            let j = xod[k-1];
            j.innerHTML =  '<img src="./tac.png" style="width: 92%; top: 2px; opacity: 0.7">' ;  
            j.className += " pressed o";
            noliki.push(+(j.id));
            checkWin();
            z.innerHTML = "Its your turn";
            current = true;      
        }, 700)           
    }

    const checkPossibleWinningComs = () => {            
            
            let possibleCombsKrestiki = [];
            let possibleCombsNoliki = [];

            const fillPossibleCombsArray = (array, possibleCombsArray, symb) => {

                winnerComb.forEach( current => {                
                    array.forEach( e => { 
                        if (current.indexOf(e)!== -1)  {
                            possibleCombsArray.push(current)
                        }                  
                    })              
                })    
                possibleCombsArray === possibleCombsKrestiki ?
                possibleCombsKrestiki=possibleCombsKrestiki.filter( i => !i.some( z => xod[z-1].classList.contains("o")) ) :
                possibleCombsNoliki = possibleCombsNoliki.filter( i => !i.some( z => xod[z-1].classList.contains("x")) )            
            }
            
            fillPossibleCombsArray(krestiki, possibleCombsKrestiki)
               
            if (noliki.length ===0) {      
                  possibleCombsNoliki = winnerComb.filter( curr => !possibleCombsKrestiki.some( e => e.every( (element, index) => element === curr[index]  )))
            }            

            fillPossibleCombsArray(noliki, possibleCombsNoliki)
                             
            let finalX = {};
            let finalY = {};

            const makeObjectWithCombinationsNumbers = (comb, object) => {                
                comb.forEach (array => {                
                    array.forEach ( number => { 
                        if ( number ) {
                            if (object.hasOwnProperty(number))  {
                                object[number] ++
                            }  else { object[number] = 1}    
                        }
                 }) 
             })     
            }

            makeObjectWithCombinationsNumbers(possibleCombsKrestiki, finalX)
            makeObjectWithCombinationsNumbers(possibleCombsNoliki, finalY)
                    
            const maxOfObject = object => {
                let arr = Object.values(object);                
                let max = Math.max(...arr);                
                let y = Object.keys(object).filter(key => object[key] === max );
                if (y.length === 1 && !xod[y-1].classList.contains("pressed")) {
                    return y}
                else if (y.length > 1 && y.some( z => !xod[z-1].classList.contains("pressed")) ) {
                    return y.filter(e => !xod[e-1].classList.contains("pressed"))}
                else {
                    let arr2 = arr.filter (e => e!==max)
                    max = Math.max(...arr2)
                    let z = Object.keys(object).filter(key => object[key] === max )
                    return z;
                }
            }

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
                    return resultY2[Math.floor(Math.random() * (resultY2.length))] 
                }
                return resultY[Math.floor(Math.random() * (resultY.length))]
            } 
     
            return resultX[Math.floor(Math.random() * (resultX.length))]                  
    }

    const compLogic = () => {
        
        const win = (currentCombination) => {
            let winnerNumber;      
            let possibleWinnerCombinations =  winnerComb.filter( current => {
                    let arr = [];
                    if(!current.every( y => xod[y-1].classList.contains("pressed"))) {
                        current.forEach( z => {
                            if (currentCombination.indexOf(z)!==-1 ) {
                                  arr.push(z)
                                }
                        })
                        if (arr.length>=2) {
                               return arr;
                           }
                    }
                })                     
            possibleWinnerCombinations.forEach( current => {
                let final = current.filter( z => currentCombination.indexOf(z) <0)             
                if (!xod[final[0] -1].classList.contains("pressed")) {
                    winnerNumber = final[0];
                }
            })    
            return winnerNumber;
        };                       
      
        krestiki.sort((a,b)  => a - b);
        noliki.sort((a,b) => a - b);
        let winner = win(noliki) || win (krestiki);       
        if (winner !=undefined) {return winner}              
        return checkPossibleWinningComs();
    }
   
    function main() {    
        modal.classList.toggle("show-modal"); 
        xod.forEach(i => i.addEventListener("click", () => {playerXod(i)})); 
    }

    main();

}();  
 
  




