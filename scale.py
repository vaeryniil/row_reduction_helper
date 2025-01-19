#a function to do a basic row operation: multiply all entries in a row by a nonzero constant

#Question: can I represent fractions in the matrix as tuples? 
#Answer; yes, but you need to account for them!

#Another question: Would this be simpler if I represented _all_ elements in the matrix as tuples? (Integers would just be (x,1))?
#Answer: I'm not sure. Will ponder


from math import gcd

test_matrix = [[2,4,6],[0,-7,-4],[3,1,-1]]

def reduce_frac (x,y):
    g_c_d = gcd(x,y)
    x = x // g_c_d
    y = y // g_c_d
    return ((x,y))

#this function cannot yet handle the case where there are fraction tuples in the incoming matrix
def row_scale (my_matrix: list, row1: int, divider: float) -> list:
    if divider == 0:
        print("Entries cannot be divided by zero")
        return 
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