 // Important! 
// To use node for testing the code, you must first type:
//  \. "$HOME/.nvm/nvm.sh"
//After that, typing 'node test2.js' will work
 
 // Carmen's gcd function:
//helper greatest common divisor function
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}


// a helper function to reduce a fraction
function reduce_frac (x,y) { // x is numerator, y is denominator
    let gCD = gcd(x,y) 
    x = Math.floor(x/gCD);
    y = Math.floor(y/gCD);
    
    return [x,y] 
}
 
 
 /* A matrix has a size mxn, state (which version/step it is in the reduction process) and entries represented as arrays of length 2, 
    with numerator as the first entry and denominator as the second.
    Entries are an array with an array of arrays(entries) for each row.
    Usage example:
        matrix1 = Matrix([3,2], [0,1], [[[2,1],[4,1]],
                                        [[0,1],[-7,1]],
                                        [[3,1],[1,1]]])
    */

class Matrix {
    constructor(size,state,entries) {
        this.size = size;
        this.state = state;
        this.entries = entries;
    }

    swap(row1,row2) { //this method works. 7.30.25
        let temp = this.entries[row1-1]
        //console.log(temp);
        this.entries[row1-1] = this.entries[row2-1];  
        //console.log(this.entries[row1-1]);
        this.entries[row2-1] = temp; 
        return this.entries;

    }

    //operator: 0 = division, 1 = multiplication. operand: [numerator,denominator]
    // operand is entered as an array of two entries, the first corresponding to the numerator and the second the denominator
    scale (row1, operator, operand) {
    
        //console.log(row1); // scaffolding
        //console.log(operator); // scaffolding
        //console.log(operand[0]); // scaffolding
        let numerator = operand[0];
        let denominator = operand[1];
        if (operand[1] == 0) {
            return;
        } // to prevent division by zero. probably can be removed from final verson b/c check will occur in main
        
        if (operator == 0) { //if the user wishes to divide a row by a number
            if (operand[0] == 0) {
                return;
            } //this prevention against division by zero can probably be removed, see similar comment above

            //flipping the numerator and denominator of the operand so that I can avoid division
            operand = [denominator, numerator]
            //console.log(operand) //scaffolding
        }

         //scaling the row
        //console.log(this.entries[row1-1].length); //scaffolding
        let row_len = this.entries[row1-1].length;
        //console.log("Row length is:"); //scaffolding
        //console.log(row_len); // scaffolding
        for (let i = 0; i < row_len; i++) { 
            //multiplying by the operand(or one over the operand for division - switched above)
            let placeholder_numerator = this.entries[row1-1][i][0] * operand[0];
            //console.log(placeholder_numerator); // scaffolding
            let placeholder_denominator = this.entries[row1-1][i][1] * operand[1];
            //console.log(placeholder_denominator); //scaffolding

            //reducing the resulting fraction
            let new_tuple = reduce_frac(placeholder_numerator, placeholder_denominator); //this is getting rid of the denominator!
            //console.log("New tuple"); //scaffolding
            //console.log(new_tuple); //scaffolding
            this.entries[row1-1][i] = [new_tuple[0], new_tuple[1]];
        }
        return this.entries;
    }

}



//let test_matrix = new Matrix ([3,2], [0,1], [[[2,1],[4,1]],[[0,1],[-7,1]],[[3,1],[1,2]]])

//console.log(test_matrix)

//console.log("Testing...");
//console.log("Original matrix");
//console.log(test_matrix.entries);

// testing swap
//console.log("Swapped Rows 2 and 3")
//console.log(test_matrix.swap(2,3))

//testing scale
//console.log("Multiplied row 2 by 2");
//console.log(test_matrix.scale(2,1,[2,1]));
//console.log("Divided row 3 by 2");
//console.log(test_matrix.scale(3,0,[2,1]))
   
//testing add