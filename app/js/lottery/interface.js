//把所有接口分装到一个类中
import $ from 'jquery';

//期号的更新，销售状态和服务端通性相关
class Interface{

	//获取遗漏数据 issue：当前期号
  getOmit(issue){
     let self=this;
     //箭头函数的this是定义时的指向而不是运行时 所以外面定义了一个self来存这个this
     return new Promise((resolve,reject)=>{
     	$.ajax({
     		url:'/get/omit',
     		data:{
     			issue:issue
     		},
     		dataType:'json',
     		success:function(res){
     			//数据保存到当前对象中
     			self.setOmit(res.data);
     			//将res扔到resolve 因为下一步的操作要使用到请求来的数据
                resolve.call(self,res);
     		},
     		error:function(err){
               reject.call(err);
     		}
     	})
     });
  }
  
  //获取开奖号码 issue:当前期号
  getOpenCode(issue){
     let self=this;
     return new Promise((resolve,reject)=>{
      $.ajax({
      	url:'/get/opencode',
      	data:{
      		issue:issue,
      	},
      	dataType:'json',
      	success:function(res){
      		//保存当前的开奖号码
      		self.setOpenCode(res.data);
      		resolve.call(self,res);
      	},
      	error:function(err){
      		reject.call(err);
      	}
      })
   });
  }

  //获取当前状态
  getState(issue){
  	let self=this;
  	return new Promise((resolve,reject)=>{
  		$.ajax({
  			url:'/get/state',
  			data:{
  				issue:issue,
  			},
  			dataType:'json',
  			success:function(res){
  			//状态涉及到期号的自动更新，所以不保存了都交给下一步去完成 				
  				resolve.call(self,res);
  			},
  			error:function(err){
  				reject.call(err);
  			}
  		})
  	});
  }
}

//导出接口
export default Interface;
//知识点：1.使用Promise作异步操作，避免回调
//       2.Promise中使用self.setOmit(res,data)等 (用对象的方法传递数据），避免在其他方法中用回调的方法解决