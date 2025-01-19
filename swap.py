#a function to swap two rows of a matrix
from math import gcd

test_matrix = [[2,4,6],[0,-7,-4],[3,1,-1]]

def row_swap (my_matrix: list, row1: int,row2: int) -> list:
    temp = my_matrix[row1 - 1]
    my_matrix[row1 - 1] = my_matrix[row2 - 1]
    my_matrix[row2 - 1] = temp
    return (my_matrix)

new_matrix = row_swap(test_matrix,3,2)
print(new_matrix)

def row_scale (my_matrix: list, row1: int, multiplier: float) -> list:
    for i in range (len(my_matrix[row1-1])):
        my_matrix[row1-1][i] =  my_matrix[row1-1][i]* multiplier
    return (my_matrix)

scaled_matrix = row_scale (test_matrix,1,0.5)
print (scaled_matrix)


def reduce_frac (x,y):
    g_c_d = gcd(x,y)
    x = x // g_c_d
    y = y // g_c_d
    return ((x,y))

reduce_frac(8,10)