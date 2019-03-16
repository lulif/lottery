var express = require('express');
var router = express.Router();
var mockjs=require('mockjs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//输出状态，期号，和截止时间
var makeIssue=function(){
	//服务端当前时间
	var date=new Date();

	//第一期截止时间 9：10：00(10分钟一期)
	var first_issue_date=new Date();
	first_issue_date.setHours(9);
	first_issue_date.setMinutes(10);
	first_issue_date.setSeconds(0);
	//当天销售截至时间（78期）
	var end_issue_date=new Date(first_issue_date.getTime()+77*10*60*1000);

     //当前期 当期截止时间 状态  
	var cur_issue,end_time,state;

	if(date.getTime()-first_issue_date.getTime()>0&&date.getTime()-end_issue_date.getTime()<0){
    //正常销售
        //设置9：00：00的时间(每天开始销售)
		var cur_issue_date=new Date();	
		cur_issue_date.setHours(9);
		cur_issue_date.setMinutes(0);
		cur_issue_date.setSeconds(0);
        //当前时间-9：00：00
		var minus_time=date.getTime()-cur_issue_date.getTime();

		var h=Math.ceil(minus_time/1000/60/10);
		console.log(h);   // 1
		var end_date=new Date(cur_issue_date.getTime()+1000*60*10*h);

		end_time=end_date.getTime();
		cur_issue=[end_date.getFullYear(),('0'+(end_date.getMonth()+1)).slice(-2),('0'+end_date.getDate()).slice(-2),('0'+h).slice(-2)].join('');
	}else{
    // 销售已截止
        //设置时间23：59：59
		var today_end=new Date();
		today_end.setHours(23);
		today_end.setMinutes(59);
		today_end.setSeconds(59);
		//是否超过22：00：00
		if(today_end.getTime()-date.getTime()<2*60*60*1000){
			//超过22点就是明天第一期
			first_issue_date.setDate(date.getDate()+1);
		}		

		end_time=first_issue_date.getTime();
		cur_issue=[first_issue_date.getFullYear(),('0'+(first_issue_date.getMonth()+1)).slice(-2),('0'+first_issue_date.getDate()).slice(-2),'01'].join('')
	  }

	var cur_date=new Date();
	//10分钟 最后两分钟开奖
	if(end_time-cur_date.getTime()>1000*60*2){
		state='正在销售'
	}else{
		state='开奖中'
	}

	return {
		issue:cur_issue,
		state:state,
		end_time:end_time
	}
}
//获取遗漏的接口
router.get('/get/omit',function(req,res,next){
	res.json(mockjs.mock({
		'data|11':[/[1-9]{1,3}|0/],
		'issue':/[1-9]{8}/
	}))
})

router.get('/get/opencode',function(req,res,next){
	var issue=makeIssue().issue;
	var data=mockjs.mock({
		'data':[/[1-3]/,/[4-5]/,/[6-7]/,/[8-9]/,/1[0-1]/]
	}).data;
	res.json({
		issue:issue,
		data:data
	})
})

router.get('/get/state/',function(req,res,next){
	var state=makeIssue();
	res.json(state);
})
module.exports = router;
