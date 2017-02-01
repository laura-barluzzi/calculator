function printValues(mainValue, history) {
  $("#entry-field").text(mainValue);
  $("#history").text(history);
  console.log("mainValue: " +mainValue+ " history: " +history);
}

function buildMyCalculation(str, myCalculation) {
  var currentValue = str;
  myCalculation.push(str);
  var strCalculation = myCalculation.join("");
  printValues(currentValue, strCalculation);
}

function lastIsDigit(lastCharacter) {
  var lastCharCode = lastCharacter.charCodeAt(0);
  var isDigit = false;  
  for (i = 48; i <= 57; i++) {
    if (lastCharCode === i) {
      isDigit = true;
    }
  }
  return isDigit;
}

function findLastCharacterOf(myCalculation) {
  var length = myCalculation.length;
  var lastCharacter = myCalculation[length-1];
  return lastCharacter;
}

function noPeriodsInMyCalculation(myCalculation) {
  var length = myCalculation.length;
  var noPeriod = true;
  for (i = 0; i < length; i++) {
    var char = myCalculation[i];
    if (char === ".") {
      noPeriod = false;
    }
  }
  return noPeriod;
}

function addOpeningParIn(myCalculation, lastCharacter) {
  var operands = ["%", "/", "+", "-", "*"];
  var okToAdd = false;

  for (i = 0; i < operands.length; i++) {
    if (lastCharacter === operands[i]) {
      okToAdd = true;
    }
  }
  return okToAdd;
}

function addClosingParIn(myCalculation, lastCharacter) {
  var sumOpening = 0;
  var sumClosing = 0;
  var okToAdd = false;
  
  for (i = 0; i < myCalculation.length; i++) {
    if (myCalculation[i] === "(") {
      sumOpening++;
    } else if (myCalculation[i] === ")") {
      sumClosing++;
    }
  }
    
  if (lastIsDigit(lastCharacter) && (sumOpening > sumClosing)) {
    okToAdd = true;
  }    

  return okToAdd;
}

function checkValue(str, type, myCalculation) {
  console.log(type);
  // if first entry allows only these
  if (myCalculation.length === 0) {
    
    if (type === "number" || type === "period" || type === "opening-par") {
      buildMyCalculation(str, myCalculation);
    }
  
  } else {  
    
      var lastCharacter = findLastCharacterOf(myCalculation);
      var noPeriods = noPeriodsInMyCalculation(myCalculation);
      var okOpeningPar = addOpeningParIn(myCalculation, lastCharacter);
      console.log("I can add the opening par: " + okOpeningPar);
      var okClosingPar = addClosingParIn(myCalculation, lastCharacter);

      if (type !== "number") {
        if (type === "period" && noPeriods) {
          console.log("I can add a period");
          buildMyCalculation(str, myCalculation);

        } else if (type === "opening-par" && okOpeningPar) {
          console.log("I can add an opening par");
          buildMyCalculation(str, myCalculation);

        } else if (type === "closing-par" && okClosingPar) {
          console.log("I can add a closing par");
          buildMyCalculation(str, myCalculation);

        } else if (lastIsDigit(lastCharacter) && type !== "opening-par") {
          console.log("I can add the symbol as after a digit");
          buildMyCalculation(str, myCalculation);
        
        } else if (type === "light-blue" && lastCharacter === ")") {
          console.log("I can add this operand after a closing par");
          buildMyCalculation(str, myCalculation);
        }        

      } else {
        buildMyCalculation(str, myCalculation);
      }
  }
}

function storeValue(myCalculation) {
  return function(event) {
  var clicked = $(event.target);
  var str = clicked.attr("value");
  var type = clicked.attr("class");
  checkValue(str, type, myCalculation);
  }
}

function resetMyCalculation(myCalculation) {
  return function(event) {
    myCalculation.length = 0; 
    console.log("it should be empty: " + myCalculation);
    printValues("0", "0");
  }
}

function calculateResult(myCalculation) {
  return function(event) {
    var strCalculation = myCalculation.join("");
    try {
      var result = eval(strCalculation);
    } catch (e) {
    }
    console.log("result = " + result);
    if (result) {
      var history = strCalculation + "=" + result;
      printValues(result, history);
    }
  } 
}

function main() {
  var myCalculation = [];
  
  $(".light-blue, .number, .period, .opening-par, .closing-par").click(storeValue(myCalculation));
  
  $(".red").click(resetMyCalculation(myCalculation));

  $(".blue").click(calculateResult(myCalculation));
  
}

$(document).ready(main);
