function main(){
	
	var data = load("p3.txt");

	var i = 0;
	var j = 0;
	var l = len(data);
	var n = 0;
	while(i < l){

		if(data[i] != "\n"){
			n[j] = num(data[i]);
			print(n[j]," ");
			j=j+1;
		}else{}

		i = i+1;
	
	}

	print("\n");
	
	i = 0;
	var k;
	var nl = len(n);
	var nl1 = nl-1;
	while(i < l){

		k = 0;
		while(k < nl1){

			if(n[k] > n[k+1]){

				var temp = n[k];
				n[k] = n[k+1];
				n[k+1] = temp;

			}
			else{}

			k=k+1;
		}
		
		i=i+1;
	}

	i = 0;
	while(i < nl){

		print(n[i]," ");

		i=i+1;
	}

}