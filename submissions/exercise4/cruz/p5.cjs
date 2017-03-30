function main(){
		
	var n;
	var base;
	var rev;
	scan(n, "Input Number (1-20): ", "num");

	var i = 0;
	var t;
	while(i < n){

		print(i+1,"-");
		scan(t, "Input Number (1-20): ", "num");

		base[i] = t;

		i = i + 1;

	}

	i = 0;
	while(i < n){

		print(base[i]," ");

		i = i + 1;

	}

	print("\n");

	i = 0;
	var m = n;
	while(m > 0){

		m = m-1;

		rev[i] = base[m];
		print(base[m]," ");

		i = i + 1;
	}

	print("\n");

	i = 0;
	while(i < n){

		t = base[i];
		t = rev[i] + t;
		print(t, " ");
		i = i+1;

	}

	print("\n");

	i = 0;
	while(i < n){

		t = base[i];
		t = rev[i] * t;
		print(t, " ");
		i = i+1;

	}

}