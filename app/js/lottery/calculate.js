//计算规则
class Calculate{

	//计算注数 active:选了几个 play_name:玩法的标识 return:注数
	computeCount(active,play_name){
		let count=0;
		const exist=this.play_list.has(play_name);
		//长度为active 默认元素为0的数组
		const arr=new Array(active).fill(0);
		if(exist&&play_name.at(0)==='r'){
			count=Calculate.combine(arr,play_name.split('')[1]).length;
		}
         return count;
	}

    //组合运算 arr：参与组合运算的数组 size:组合运算的基数 return:计算注数
    //Cxx
	static combine(arr,size){
		let allResult=[];
		//立即执行函数
		(function f(arr,size,result){
		let arrLen=arr.length;
           if(size>arr.length){
           	return;
           }
           if(size==arr.length){
           	allResult.push([].concat(result,arr));
           }else{
           	for(let i=0;i<arrLen;i++){
           		let newResult=[].concat(result);
           		newResult.push(arr[i]);
           		if(size==1){
           			allResult.push(newResult);
           		}else{
           			let newArr=[].concat(arr);
           			newArr.splice(0,i+1);
           			f(newArr,size-1,newResult);
           		}
           	 }
           }
		})(arr,size,[])
		return allResult
	}

    //奖金范围预测 active:选了几个 play_name:玩法标识 return:奖金范围
	computeBonus(active,play_name){
      const play=play_name.split('');
      const self=this;
      let arr=new Array(play[1]*1).fill(0);
      let min,max;
      if(play[0]=='r'){
      	//最小命中数(肯定有XX个是中的)
      	let min_active=5-(11-active);
      	if(min_active>0){
      		if(min_active-play[1]>=0){
                 arr=new Array(min_active).fill(0);
                 min=Calculate.combine(arr,play[1]).length;
      		}else{
      			if(play[1]-5>0&&active-play[1]>=0){
      				arr=new Array(active-5).fill(0);
      				min=Calculate.combine(arr,play[1]-5).length;
      			}else{
      				min=active-play[1]>-1?1:0;
      			}
      		}
      	}else{
      		min=active-play[1]>-1?1:0;
      	}

      let max_active=Math.min(active,5);
      if(play[1]-5>0){
        if(active-play[1]>=0){
          arr=new Array(active-5).fill(0);
          max=Calculate.combine(arr,play[1]-5).length;
        }else{
          max=0;
        }
      }else if(play[1]-5<0){
        arr=new Array(Math.min(active,5)).fill(0);
        max=Calculate.combine(arr,play[1]).length;
      }else{
        max=1;
       }
      }
      return [min,max].map(item=>item*self.play_list.get(play_name).bonus);
	}
}

export default Calculate;