#a function to do a basic row operation: replace one row by the sum of itself and a multiple of another row

# This function requires that fractions be represented in the matrix as tuples with the numerator in the first position and the 
#denominator in the second position

#3.30.25 As far as I can tell, this works! Could use rigorous testing but it passes my three test cases

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

#print(fraction_multiplier((2,3),(1,2)))

test_matrix2 = [[(1,1),(2,1),(3,1)],[(0,1),(-7,1),(-4,1)],[(3,1),(1,1),(-1,1)]]
test_matrix3 = [[(1,1),(2,1),(3,1)],[(0,1),(-7,1),(-4,1)],[(3,1),(1,2),(-1,2)]]
test_matrix4 = [[(1,1),(1,2),(1,10)],[(0,1),(-7,1),(-4,1)],[(3,1),(1,1),(-1,1)]]


#note: multiplier parameter must be passed in as a tuple
def add(my_matrix: list, change_row: int, scale_row: int, multiplier: tuple )-> list:
    #for i in my_matrix[change_row - 1]:
    for i in range (len(my_matrix[change_row-1])):
        temp_tuple = fraction_multiplier(my_matrix[scale_row-1][i],multiplier)
        #print(temp_tuple[0])
        #print(my_matrix[change_row - 1][i][0])

        #if the denominators of the two tuples are the same, add the tuples and edit the matrix
        if temp_tuple[1] == my_matrix[change_row - 1][i][1]:
            my_matrix[change_row-1][i] = (temp_tuple[0] + my_matrix[change_row - 1][i][0],my_matrix[change_row - 1][i][1])
        else: #need to have a common denominator in order to add 
            #if the denominator of the multiplied row is greater, multiply the change row by that amount and then add 
            if temp_tuple[1] > my_matrix[change_row - 1][i][1]:
                large_den_temp = (my_matrix[change_row - 1][i][0] * temp_tuple[1],my_matrix[change_row - 1][i][1] * temp_tuple[1])
                new_tuple_temp = reduce_frac(temp_tuple[0] + large_den_temp[0],large_den_temp[1])
                my_matrix[change_row-1][i] = new_tuple_temp

            else: #if the denominator of the multiplied row is less, multiply the mult row by the den. of the temp tuple and then add
                large_den_temp = (temp_tuple[0] * my_matrix[change_row - 1][i][1],temp_tuple[1] * my_matrix[change_row - 1][i][1])
                new_tuple_temp = reduce_frac(my_matrix[change_row - 1][i][0] + large_den_temp[0],large_den_temp[1])
                my_matrix[change_row-1][i] = new_tuple_temp
    return my_matrix

#print(add(test_matrix3,3,1,(-3,1)))