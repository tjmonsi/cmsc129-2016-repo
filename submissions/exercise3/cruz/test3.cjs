function main(){

	var in = load("input.file");
	print(fibo(in[0]));	

}

function fibo(n){
	if(n==0){
		return 0;
	}
	else if(n==1){
		return 1;
	}
	else{
		return fibo(n-2) + fibo(n-1);
	}
}