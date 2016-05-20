function main(){
	
	var n;
	var i = 0;
	var f = 0;
	var na = 0;
	var nb = 1;
	scan(n, "Input N (Fibonacci): ", "num");

	while(i < n){

		f = na + nb;
		na = nb;
		nb = f;

		print(f, " ");

		i = i+1;

	}

}