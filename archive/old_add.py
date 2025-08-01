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
    for i in range (len(my_matrix[0])):
        temp_tuple = fraction_multiplier(my_matrix[scale_row-1][i],multiplier) #this scales the appropriate row before adding
        #print(temp_tuple)
        #print(my_matrix[scale_row - 1][i])

        #if the denominators of the two tuples are the same, add the tuples, reduce,  and edit the matrix
        if temp_tuple[1] == my_matrix[change_row - 1][i][1]:
            print("same")
            my_matrix[change_row-1][i] = reduce_frac(temp_tuple[0] + my_matrix[change_row - 1][i][0],my_matrix[change_row - 1][i][1])
            
        else: #need to have a common denominator in order to add 
            #if the denominators of the two are different, cross-multiply and reduce

            print("boop")
            large_den_temp1 = (my_matrix[change_row - 1][i][0] * temp_tuple[1],my_matrix[change_row - 1][i][1] * temp_tuple[1])
            print(large_den_temp1)
            large_den_temp2 = (temp_tuple[0] * my_matrix[change_row - 1][i][1],temp_tuple[1] * my_matrix[change_row - 1][i][1])
            print(large_den_temp2)
            new_tuple_temp = reduce_frac(large_den_temp1[0] + large_den_temp2[0],large_den_temp1[1])
            my_matrix[change_row-1][i] = new_tuple_temp

    return my_matrix



#this is a matrix from a homework assignment. 'add' works on this
""" hw_test_m = [[(1,1),(0,1),(2,1)],[(0,1),(1,1),(3,1)],[(-2,1),(2,1),(3,1)]]
step1 = add(hw_test_m,3,1,(2,1))
step2 = add(step1,3,2,(-2,1))
step3 = add(step2, 2,3,(-3,1))
step4 = add(step3, 1,3,(-2,1))
print(step4) """

"""#the fraction test (with different denominators) now works
fraction_test = [[(1,1),(2,1),(3,1),(0,1),(4,1)],[(0,1),(3,1),(-7,1),(1,1),(-9,1)],[(0,1),(0,1),(6,1),(0,1),(31,3)],[(0,1),(0,1),(-6,1),(0,1),(-15,2)]]
#for i in range(4):
    #print(fraction_test[i])
fstep1 = add(fraction_test,4,3,(1,1))
for i in range(4):
    print(fstep1[i])"""

#testing with a smaller matrix
fraction_test = [[(1,1),(31,3)],[(0,1),(-15,2)]]
#for i in range(2):
   # print(fraction_test[i])
frac_test_step1 = add(fraction_test,2,1,(1,1))
for i in range(2):
    print(frac_test_step1[i])
