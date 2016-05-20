function main(){
	
	var x;
	var i = 0;
	scan(x, "Input number: ", "num");

	if(x == 0){
		print(0);
	}else{
		if(x < 0){
			while(i > x){
				i = i-1;
				print(i, " ");
			}
		}else{
			while(i < x){
				i = i+1;
				print(i, " ");
			}
		}
	}

}