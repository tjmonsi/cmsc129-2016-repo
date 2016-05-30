function main(){
	
	var n;
	scan(n, "Input N (Fibonacci): ", "num");

	var i = 0;
	while(i < n){
		print(fibo(i), " ");
		i=i+1;
	}

	
}

function fibo(n){
	
	if(n == 0){
		return 1;
	}else{
		if(n == 1){
			return 2;
		}else{
			return fibo(n-2)+fibo(n-1);
		}
	}

}