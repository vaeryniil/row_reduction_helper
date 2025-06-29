#this is me  just messing around. A question: what would it be like if there were a matrix object? Would it be easier?
#What qualities would a matrix object have? 
#size. Or else row number and column number
#entries for each row
#the ability to do the row operations on it. So, swap, add, scale.
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
    """A matrix has a size mxn and entries represented as tuples, with numerator as the first entry and denominator as the second.
    Entries are a list with a list of tuples for each row.
    
    Usage example:
        matrix1 = Matrix((3,2), [[(2,1),(4,1)],[(0,1),(-7,1)],[(3,1),(1,1)]])
        matrix2 = Matrix((3,3)), [[(1,1),(1,2),(1,10)],[(0,1),(-7,1),(-4,1)],[(3,1),(1,1),(-1,1)]])
        
    """
    def __init__(self, size: tuple, state: tuple, entries: list):
        """A matrix with a size m x n, and entries 
        The size m x n is a tuple in order (m,n).
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
    def row_scale (self, row1: int, operator: int, operand: tuple):
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
    

    def row_swap (self, row1: int,row2: int):
        temp = self.entries[row1 - 1]
        self.entries[row1 - 1] = self.entries[row2 - 1]
        self.entries[row2 - 1] = temp
        return (self)

    


def main():
     """Main program driver for row reduction calculator"""
     #import add
     #import scale
     #import swap


     #matrix = input("Please input the matrix:")
     testy_test = Matrix((3,3),(0,0),[[(1,1),(1,2),(1,10)],[(0,1),(-7,1),(-4,1)],[(3,1),(1,1),(-1,1)]])
     print(testy_test)
     print("")
     
     #print(testy_test.row_scale(1,1,(2,1)))
     print(testy_test.row_swap(1,3
                               ))
     #print([testy_test])

if __name__ == "__main__":
    main()

