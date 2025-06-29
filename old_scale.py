#a function to do a basic row operation: multiply or divide all entries in a row by a constant

#All entries in the matrix are represented as tuples, with intgers having the form (x,1).

#3.30.25 Basic funtionality complete. Later I'd like to take out the error messages and put them in the main. Whatever reaches this 
#point would be in the proper format


from math import gcd

#test_matrix = [[2,4,6],[0,-7,-4],[3,1,-1]]
test_matrix = [[(2,1),(4,1),(6,1)],[(0,1),(-7,1),(-4,1)],[(3,1),(1,1),(-1,1)]]


#note: math.gcd only accepts integers
def reduce_frac (x:int,y:int):
    g_c_d = gcd(x,y)
    x = x // g_c_d
    y = y // g_c_d
    return ((x,y))


#operator: 0 = division, 1 = multiplication. operand: (numerator,denominator)
def row_scale (my_matrix: list, row1: int, operator: int, operand: tuple) -> list:
    if operator != 0 and operator != 1:
        print("Scaling supports multilpicaton and division. Type 0 for division, 1 for multiplication.")
        return
    numerator = operand[0]
    denominator = operand[1]
    if operand[1] == 0:
        print("Division by zero is not allowed")
        return
    if operator == 0:
        if operand[0] == 0:
            print("Entries cannot be divided by zero")
            return
        #flipping the numerator and denominator of the operand so that I can avoid division
        operand = (denominator, numerator)
        #print (operand) #scaffolding
    #scaling the row
    for i in range (len(my_matrix[row1-1])):
        #multiplying by the operand(or one over the operand for division - switched above)
        placeholder_numerator = my_matrix[row1-1][i][0] * operand[0]
        placeholder_denominator = my_matrix[row1-1][i][1] * operand[1]
        #reducing the resulting fraction
        new_tuple = reduce_frac(placeholder_numerator, placeholder_denominator)
        my_matrix[row1-1][i] = (new_tuple[0], new_tuple[1])
    return (my_matrix)

print (row_scale(test_matrix, 1,0,(2,1)))    
