#moving the scaling funtion to its own folder so I can attempt to add the fraction reduction feature
from math import gcd

test_matrix = [[2,4,6],[0,-7,-4],[3,1,-1]]

def reduce_frac (x,y):
    g_c_d = gcd(x,y)
    x = x // g_c_d
    y = y // g_c_d
    return ((x,y))

def row_scale (my_matrix: list, row1: int, multiplier: float) -> list:
    for i in range (len(my_matrix[row1-1])):
        my_matrix[row1-1][i] =  my_matrix[row1-1][i]* multiplier
    return (my_matrix)

scaled_matrix = row_scale (test_matrix,1,0.5)
print (scaled_matrix)