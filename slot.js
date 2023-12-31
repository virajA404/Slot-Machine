//1. Deposit some money
//2. Add number of lines to bet on
//3. Collect the bet amount.
//4. Spin the slot machine.
//5. Check if the user won
//6. Give the user their winnings
//7. Play the game again


const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3; 

//symbols in each column
const SYMBOLS_COUNT = {
    "A":2,    //"key":value 
    "B":4,
    "C":6,
    "D":8,
}

const SYMBOLS_VALUES = {
    "A":5,    //"key":value 
    "B":4,
    "C":3,
    "D":2,
}

//1. Collecting Deposit money
const deposit =()=>{
    while(true) {
        const amount = prompt("How much would you like to deposit?: ");
        const numberAmount = parseFloat(amount);

        if(isNaN(numberAmount) || numberAmount <= 0) {
            console.log("The deposit amount is not valid. Please try again.");
        }
        else{
            return(numberAmount);
        }
    }
};
//1. Collecting Deposit money -- ENDS HERE


//2. Add number of lines to bet 
const getNumberOfBetLines =()=>{
    while(true) {
        const lines = prompt("How many lines you want to bet? (1-3): ");
        const numberOfLines = parseFloat(lines); //convert numberOfLines to a number 

        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines. Please try again");
        }
        else{
            return(numberOfLines);
        }
    }        
};

//2. Add number of lines to bet -- ENDS HERE


//3. Collect the bet amount.
const getBet = (balanceAmount, lines)=>{
    while(true) {
        const betAmount = prompt("How much would you like to bet for each reel?: ");
        const numberBetAmount = parseFloat(betAmount)

        if(isNaN(numberBetAmount) || numberBetAmount <= 0) {
            console.log("The bet amount is not valid. Please try again.");
        }
        else if(numberBetAmount > balanceAmount / lines) {
            console.log("You do not have enough money. Please try again.");
        }
        else{
            return(numberBetAmount);
        }
    }
};    
//3. Collect the bet amount. -- ENDS HERE


//4. Spin the slot machine
const spin = ()=> {
    //adding symbols to a array
    const symbols = [];
    for(const[symbol,count] of Object.entries(SYMBOLS_COUNT)){
        for(let i=0; i<count; i++){
            symbols.push(symbol);
        }
    }
    
    // Getting symbols from "symbols" array and adding them to each reel   
    const reels = []; 
    for(let i=0; i<COLS; i++){
        reels.push([]); //adding a reel 
        const reelSymbols = [...symbols];
        for(let j=0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length); //math.floor - round the number to the nearest lower number
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol); //Adding the selected symbol to the array(column)
            reelSymbols.splice(randomIndex,1); //Removing the selected symbol from the reelSymbols array. 1 = remove one element
        }
    }
    return(reels);
};
//4. Spin the slot machine -- ENDS HERE


//5. Check if the user won
const transpose = (reels) => {
    //creating array for each row
    const rows = [];

    //pushing symbols from reels array to rows array
    for(let i=0; i<ROWS; i++){
        rows.push([]);
        for(let j=0; j<COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return(rows);
};

//print rows
const printRows = (rows) => {
    for(const row of rows){
        let rowString = "";
        for(const[i,symbol] of row.entries()){
            rowString += symbol;
            if(i != row.length - 1){
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};
//5. Check if the user won --ENDS HERE


//6. Give the user their winnings
const getWinner = (rows,betAmount,numberOfLines) => {
    let winnings = 0;
    for(let row=0; row<numberOfLines; row++){   
        const symbols = rows[row];
        let allSame = true;
        
        for(const symbol of symbols){
            if(symbol!= symbols[0]){
                allSame = false;
                break;
            }
        }
        if(allSame){
            winnings += betAmount * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return (winnings);
};
//6. Give the user their winnings --ENDS HERE 

//7. Play the game again  
const game = () => {
    let balanceAmount = deposit();

    while(true){
        console.log("Your balance is $" + balanceAmount.toString());
        const numberOfLines = getNumberOfBetLines();
        const betAmount = getBet(balanceAmount,numberOfLines);
        balanceAmount -= betAmount * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const win = getWinner(rows,betAmount,numberOfLines);
        balanceAmount += win;
        console.log("You won, " + "$" + win.toString());

        if(balanceAmount <= 0){
            console.log("You ran out of Money.");
            break;
        }

        const playAgain = prompt("Do you want to play again? (y/n)? ");

        if(playAgain != "y") break;
    }
};

game();




