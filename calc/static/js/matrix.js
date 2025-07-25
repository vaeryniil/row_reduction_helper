//we put matrix functionality hr





//herlper greatest common divisor function
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }

    return a;
}

