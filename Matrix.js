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

//a helper function to multiply (and reduce) fractions
function fraction_multiplier(no_1,no_2) {///multiplies two arrays with numerator in position 0 and denominator in pos. 1
    const numerator = no_1[0] * no_2[0];
    const denominator = no_1[1] * no_2[1];
    let solution = reduce_frac(numerator, denominator);
    return solution
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
    constructor(size, state = 0, entries) {
        this.size = size;
        this.state = state;
        this.entries = entries;
    }

    //im adding init entries to help me
    init_entries() {
        let rows = this.size[0];
        let cols = this.size[1];
        let temp = [];

        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < cols; j++) {
                row.push([0,1]); //initializing all entries to nuthin
            }
            temp.push(row);
        }   
        this.entries = temp;//no return here, just setting space for entries
    }


    print() {
        console.log("Matrix Values:");
        this.entries.forEach(row => {
        console.log(row.map(entry => `[${entry[0]},${entry[1]}]`).join(' '));
        });
    }
    

    //also need an add entry function
    add_value(row, col, value) { //value is an array [numerator, denominator]
        this.entries[row-1][col-1] = value; 
    }

    //way to grab an entry
    get_entry(row, col) {
        return this.entries[row-1][col-1]; 
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


    //note: multiplier parameter must be passed in as an array. Ex: 1/2 is entered as [1,2]; -8 is entered as [-8,1]
    // change row is entered as an int, as is scale_row
    add(change_row, scale_row, multiplier) {

        let row_len = this.entries[change_row-1].length;
        for (let i = 0; i < row_len; i++) { 
    
            let temp_tuple = fraction_multiplier(this.entries[scale_row-1][i],multiplier); //this scales the appropriate row before adding
            //console.log(temp_tuple); // scaffolding
            //console.log(this.entries[scale_row - 1][i]); //scaffolding

            //if the denominators of the two arrays are the same, add the arrays, reduce,  and edit the matrix
            if (temp_tuple[1] == this.entries[change_row - 1][i][1]) {
                //console.log("same"); //scaffolding
                this.entries[change_row-1][i] = reduce_frac(temp_tuple[0] + this.entries[change_row - 1][i][0],this.entries[change_row - 1][i][1]);
            }
            
        else { //need to have a common denominator in order to add 
            //if the denominators of the two are different, cross-multiply and reduce

            //console.log('different'); //scaffolding
            let large_den_temp1 = [this.entries[change_row - 1][i][0] * temp_tuple[1],this.entries[change_row - 1][i][1] * temp_tuple[1]];
            //console.log(large_den_temp1); //scaffolding
            let large_den_temp2 = [temp_tuple[0] * this.entries[change_row - 1][i][1],temp_tuple[1] * this.entries[change_row - 1][i][1]];
            //console.log(large_den_temp2); //scaffolding
            let new_tuple_temp = reduce_frac(large_den_temp1[0] + large_den_temp2[0],large_den_temp1[1]);
            //console.log(new_tuple_temp); // scaffolding
            this.entries[change_row-1][i] = new_tuple_temp;
        }
    }

    return this.entries;
}

}



//let test_matrix = new Matrix ([3,2], [0,1], [[[2,1],[4,1]],[[0,1],[-7,1]],[[3,1],[1,2]]])
//let test_matrix2 = new Matrix ([3,2], [0,1], [[[2,1],[4,1]],[[0,1],[-7,1]],[[3,1],[-15,2]]])

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
//fraction test with different denominators
//let fraction_test = new Matrix([4,5],[0,1],[[[1,1],[2,1],[3,1],[0,1],[4,1]],[[0,1],[3,1],[-7,1],[1,1],[-9,1]],[[0,1],[0,1],[6,1],[0,1],[31,3]],[[0,1],[0,1],[-6,1],[0,1],[-15,2]]]);


let fraction_test2 = new Matrix ([2,2], [0,1], [[[1,1],[31,3]],[[0,1],[-15,2]]]);
console.log(fraction_test2.add(1,2,[62,45])); //should return [ [ [ 1, 1 ], [ 0, 1 ] ], [ [ 0, 1 ], [ -15, 2 ] ] ]
//fraction test 2 works

/*
//this is a matrix from a homework assignment. 'add' method works on this. Note: no fractions.
//final matrix is [[[1,1],[0,1],[0,1]],[[0,1],[1,1],[0,1]],[[0,1],[0,1],[1,1]]]
let hw_test_m = new Matrix ([3,3],[0,1],[[[1,1],[0,1],[2,1]],[[0,1],[1,1],[3,1]],[[-2,1],[2,1],[3,1]]]);
console.log("Original matrix:");
console.log(hw_test_m.entries);
let step1 = hw_test_m.add(3,1,[2,1]);
console.log("Step 1");
console.log(step1);
let step2 = hw_test_m.add(3,2,[-2,1]);
console.log("Step 2");
console.log(step2);
let step3 = hw_test_m.add(2,3,[-3,1]);
console.log("Step 3");
console.log(step3);
let step4 = hw_test_m.add(1,3,[-2,1]);
console.log("Row reduced:");
console.log(step4);
*/