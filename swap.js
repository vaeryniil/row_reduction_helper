
//IMPORTANT: this function works. 07/24/25


function swap(my_matrix,row1,row2) {
    
    let temp = my_matrix[row1-1]
    //console.log(temp);
    my_matrix[row1-1] = my_matrix[row2-1];  //this works!
    //console.log(my_matrix[row1-1]);
    my_matrix[row2-1] = temp; //this also works
    return my_matrix;

}


//testing
//let aMatrix = [[[1,2],2],[-3,4],[5,6]]; //test matrix. 
//console.log(aMatrix);
//let testy = swap(aMatrix,1,2);
//console.log(testy);