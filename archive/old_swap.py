#a function to do a basic row operation: swap two rows of a matrix

#3.30.25 basic functionality complete

# This function does _not_ require that fractions be represented in the matrix as tuples with the numerator in the first position and the 
#denominator in the second position. However, to mesh this basic row operation with the others in this project, use that matrix format.

from math import gcd

#test_matrix = [[2,4,6],[0,-7,-4],[3,1,-1]]
test_matrix = [[(2,1),(4,1),(6,1)],[(0,1),(-7,1),(-4,1)],[(3,1),(1,1),(-1,1)]]

def row_swap (my_matrix: list, row1: int,row2: int) -> list:
    temp = my_matrix[row1 - 1]
    my_matrix[row1 - 1] = my_matrix[row2 - 1]
    my_matrix[row2 - 1] = temp
    return (my_matrix)

new_matrix = row_swap(test_matrix,1,2)
print(new_matrix)