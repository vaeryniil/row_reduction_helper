#a function to do a basic row operation: replace one row by the sum of itself and a multiple of another row

# This function requires that fractions be represented in the matrix as tuples with the numerator in the first position and the 
#denominator in the second position
from math import gcd

def reduce_frac (x,y):
    g_c_d = gcd(x,y)
    x = x // g_c_d
    y = y // g_c_d
    return ((x,y))

def fraction_multiplier(no_1: tuple,no_2: tuple) -> tuple: #multiplies two tuples with numerator in position 0 and denominator in pos. 1
    numerator = no_1[0] * no_2[0]
    denominator = no_1[1] * no_2[1]
    solution = reduce_frac(numerator, denominator)
    return solution

#fraction_multiplier((2,3),(1,2))


#note: multiplier parameter can be entered as an integer, or as a tuple(for fractions). Otherwise it gives an error.
def add(my_matrix: list, change_row: int, scale_row: int, multiplier )-> list:
    if type(multiplier) == int:
        for i in my_matrix[change_row - 1]:
            pass #in-progress