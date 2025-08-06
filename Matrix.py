#Reimagining this project with a Matrix class object
#It has a size (mxn), a state (which version/step of the matrix it is), and entries
#It has the three basic row operations on it: swap, add, scale.
#eventually these matrices could be multiplied, etc. But that's another project

from math import gcd

#helper function 
#note: math.gcd only accepts integers
def reduce_frac (x:int,y:int):
    g_c_d = gcd(x,y)
    x = x // g_c_d
    y = y // g_c_d
    return ((x,y))

def fraction_multiplier(no_1: tuple,no_2: tuple) -> tuple: #multiplies two tuples with numerator in position 0 and denominator in pos. 1
    numerator = no_1[0] * no_2[0]
    denominator = no_1[1] * no_2[1]
    solution = reduce_frac(numerator, denominator)
    return solution

class Matrix:
    """A matrix has a size mxn, state (which version/step it is in the reduction process) and entries represented as tuples, 
    with numerator as the first entry and denominator as the second.
    Entries are a list with a list of tuples for each row.
    
    Usage example:
        matrix1 = Matrix((3,2), (0,1), [[(2,1),(4,1)],[(0,1),(-7,1)],[(3,1),(1,1)]])
        matrix2 = Matrix((3,3)), (2,3), [[(1,1),(1,2),(1,10)],[(0,1),(-7,1),(-4,1)],[(3,1),(1,1),(-1,1)]])
        
    """
    def __init__(self, size: tuple, state: tuple, entries: list):
        """A matrix with a size m x n, and entries 
        The size m x n is a tuple in order (m,n).
        The state is in the form (version, step). A new version begins after change following a backtrack
        """
        assert len(entries) == size[0], f"number of rows must match m of m x n matrix size"
        assert [len(i) == size[1] for i in entries], f"number of columns must match n in m x n matrix size"
        self.size = size
        self.state = state 
        self.entries = entries



    def __str__(self) -> str:
        """The textual format of a matrix is
        a_{11} a_{12} ... a_{1n}
        a_{21} a_{22} ... a_{2n}
        ...
        a_{m1} a_{m2} ... a_{mn}
        
        """
        return "\n".join(str(self.entries[i]) for i in range(self.size[0]))


    def __repr__(self) -> str:
        return f"(({self.size}, {self.state},{self.entries}))"
    

    #operator: 0 = division, 1 = multiplication. operand: (numerator,denominator)
    def scale (self, row1: int, operator: int, operand: tuple):
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
        for i in range (len(self.entries[row1-1])):
            #multiplying by the operand(or one over the operand for division - switched above)
            placeholder_numerator = self.entries[row1-1][i][0] * operand[0]
            placeholder_denominator = self.entries[row1-1][i][1] * operand[1]
            #reducing the resulting fraction
            new_tuple = reduce_frac(placeholder_numerator, placeholder_denominator)
            self.entries[row1-1][i] = (new_tuple[0], new_tuple[1])
        return (self)
    

    def swap (self, row1: int,row2: int):
        temp = self.entries[row1 - 1]
        self.entries[row1 - 1] = self.entries[row2 - 1]
        self.entries[row2 - 1] = temp
        return (self)
    
    def add(self, change_row: int, scale_row: int, multiplier: tuple )-> list:
    #for i in self.entries[change_row - 1]:
        for i in range (len(self.entries[change_row-1])):
            temp_tuple = fraction_multiplier(self.entries[scale_row-1][i],multiplier)
            #print(temp_tuple[1])
            #print(self.entries[change_row - 1][i][1])


            #if the denominators of the two tuples are the same, add the tuples, reduce, and edit the matrix
            if temp_tuple[1] == self.entries[change_row - 1][i][1]:
                #print("hi")
                self.entries[change_row-1][i] = reduce_frac(temp_tuple[0] + self.entries[change_row - 1][i][0],self.entries[change_row - 1][i][1])
                #print(self.entries)
            else: #need to have a common denominator in order to add 
            #if the denominators of the two are different, cross-multiply and reduce

                large_den_temp1 = (self.entries[change_row - 1][i][0] * temp_tuple[1],self.entries[change_row - 1][i][1] * temp_tuple[1])
                #print(large_den_temp1)
                large_den_temp2 = (temp_tuple[0] * self.entries[change_row - 1][i][1],temp_tuple[1] * self.entries[change_row - 1][i][1])
                #print(large_den_temp2)
                new_tuple_temp = reduce_frac(large_den_temp1[0] + large_den_temp2[0],large_den_temp1[1])
                self.entries[change_row-1][i] = new_tuple_temp
        return self

    


def main():
     """Main program driver for row reduction calculator"""
     
     #matrix = input("Please input the matrix:")
     #testy_test = Matrix((3,3),(0,0),[[(1,1),(1,2),(1,10)],[(0,1),(-7,1),(-4,1)],[(3,1),(1,1),(-1,1)]])
     #print(testy_test.row_scale(1,1,(2,1)))
     #print(testy_test.row_swap(1,3))
     #print([testy_test])
     
     #testing with an integer matrix from a homework assignment. This works.
     """ hw_test_m = Matrix((3,1),(0,0),[[(1,1),(0,1),(2,1)],[(0,1),(1,1),(3,1)],[(-2,1),(2,1),(3,1)]])
     print(hw_test_m)
     print("")
     step1 = hw_test_m.add(3,1,(2,1))
     print(step1)
     print("")
     step2 = step1.add(3,2,(-2,1))
     print(step2)
     print("")
     step3 = step2.add(2,3,(-3,1))
     print(step3)
     print("")
     step4 = step3.add(1,3,(-2,1))
     print(step4) """

     #testing with a matrix from a homework that involves fractions with different denominators
     #this now works
     hw_fraction_test = Matrix((4,5),(0,0),[[(3,1),(9,1),(2,1),(1,1),(3,1)],[(0,1),(3,1),(-4,1),(1,1),(-1,1)],[(1,1),(2,1),(3,1),(0,1),(4,1)],[(3,1),(0,1),(5,1),(-2,1),(-1,1)]])
     print(hw_fraction_test)
     print("")
     step1 = hw_fraction_test.swap(1,3)
     print(step1)
     print("")
     step2 = step1.swap(2,4)
     print(step2)
     print("")
     step3 = step2.swap(2,3)
     print(step3)
     print("")
     step4 = step3.add(3,1,(-3,1))
     print(step4)
     print("")
     step5 = step4.scale(3,1,(1,2))
     print(step5)
     print("")
     step6 = step5.add(2,1,(-3,1))
     print(step6)
     print("")
     step7 = step6.add(4,3,(1,1))
     print(step7)
     print("")
     step8 = step7.add(3,2,(1,1))
     print(step8)
     print("")
     step9 = step8.scale(3,1,(-2,3))
     print(step9)
     print("")
     step10 = step9.add(4,3,(1,1)) 
     print(step10)



if __name__ == "__main__":
    main()
