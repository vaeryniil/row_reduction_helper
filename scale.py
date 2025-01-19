#moving the scaling funtion to its own folder so I can attempt to add the fraction reduction feature
#Question: can I represent fractions in the matrix as tuples? Tuples can't be changed, but I can overwrite them, right?

#Answer: this seems to work. However, now I'v introduced a pretty large issue in that not all the values in my 
#matrix are actually numbers that can have math done on them. Is there a better solution? I don't want, for example,
#1/3 to become 0.33, because that will cause problems later.
from math import gcd

test_matrix = [[2,4,6],[0,-7,-4],[3,1,-1]]

def reduce_frac (x,y):
    g_c_d = gcd(x,y)
    x = x // g_c_d
    y = y // g_c_d
    return ((x,y))

def row_scale (my_matrix: list, row1: int, divider: float) -> list:
    for i in range (len(my_matrix[row1-1])):
        temp_element = reduce_frac(my_matrix[row1-1][i],divider)
        if temp_element[1] == 1:
            my_matrix[row1-1][i] = temp_element[0]
        else:
            my_matrix[row1-1][i] = temp_element
    return (my_matrix)

scaled_matrix = row_scale (test_matrix,2,2)
print (scaled_matrix)

# test_frac = reduce_frac(2,4)
# print(type(test_frac))