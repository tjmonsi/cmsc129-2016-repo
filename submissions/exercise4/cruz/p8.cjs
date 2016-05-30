function main() {

    var nums;
    var negnums;
    var summ = 0;
    var negsumm = 0;
    var ave;
    var sd;

    var i = 0;
    while(i < 50){
        nums[i] = generate();
        summ = summ + nums[i];
        negsumm = negsumm - nums[i];

        print(i+1,": ",nums[i],"\n");
        i = i+1;
    }

    print("Summation: ", summ, "\n");
    print("-Summation: ", negsumm, "\n");    
    ave = summ/50;
    print("Average: ", ave, "\n");

    i = 0;
    var res;
    var sdsumm = 0;
    while(i < 50){
    
        res[i] = nums[i]-ave;
        res[i] = res[i]*res[i];
        sdsumm = sdsumm + res[i];
        i = i+1;

    }

    print("StDev: ", sqrt(sdsumm/50), "\n");

}

function generate(){
    
    var n = rand(10001);

    if(rand(2)){
        n = n*-1;
    }else{}

    return n;

}
