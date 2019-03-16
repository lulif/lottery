import 'babel-polyfill';
import $ from 'jquery';
import Base from'./lottery/base.js';
import Timer from'./lottery/timer.js';
import Calculate from'./lottery/calculate.js';
import Interface from './lottery/interface.js';

//深拷贝的函数
const copyProperties=function(target,source){
	for(let key of Reflect.ownKeys(source)){
    if(key!=='constructor'&&key!=='prototype'&&key!=='name'){
      //返回指定对象中一个自有属性对应的属性描述符(自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性)
    	let desc=Object.getOwnPropertyDescriptor(source,key);
      //直接在一个对象上定义一个新属性 或者修改一个对象的现有属性, 并返回这个对象
    	Object.defineProperty(target,key,desc);
     }
	}
}
const mix=function(...mixins){
	class Mix{}
	for(let mixin of mixins){
		copyProperties(Mix,mixin);
		copyProperties(Mix.prototype,mixin.prototype);
	}
	return Mix;
}

//实现多继承的类
class Lottery extends mix(Base,Calculate,Interface,Timer){
	constructor(name='syy',cname='11选5',issue='**',state='**')
	{
		super();
    //对象的属性
	  this.name=name;
	  //对象的名字
    this.cname=cname;
    //当前期号
    this.issue=issue;
    //当前状态
    this.state=state;
    //当前选择器
    this.el='';
    //遗漏
    this.omit=new Map();
    //开奖号码
    this.open_code=new Set();
    //开奖记录
    this.open_code_list=new Set();
    //玩法列表
    this.play_list=new Map();
    //选号
    this.number=new Set();
    //当前期号的选择器
    this.issue_el='#curr_issue';
    //倒计时选择器
    this.countdown_el='#countdown';
    //状态的选择器
    this.state_el='.state_el';
    //购物车选择器
    this.cart_el='.codelist';
    //遗漏的选择器
    this.omit_el='';
    //当前默认玩法
    this.cur_play='r5';
    //奖金玩法
    this.initPlayList();
    //初始化号码
    this.initNumber();
    //更新状态
    this.updateState();
    //事件绑定
    this.initEvent();
	}

	updateState(){
    let self=this;

    //异步操作
    this.getState().then(function(res){
    //拿到期号 结束时间 状态
      self.issue=res.issue;
      self.end_time=res.end_time;
      self.state=res.state;
      //期号更新
      $(self.issue_el).text(res.issue);

      //关于倒计时的操作
      self.countdown(res.end_time,
      	//更新时间
      function(time){
            $(self.countdown_el).html(time)
        },
        //倒计时结束时干什么
      function(){
        setTimeout(function () {
        	//获取最新的销售状态
          self.updateState();
          //最新遗漏
          self.getOmit(self.issue).then(function(res){
          });
          //最新开奖号码
          self.getOpenCode(self.issue).then(function(res){
          })
        }, 500);
      }
       )
    })
  }

 //初始化事件（操作的地方绑定点击事件）
  initEvent(){
  let self=this;
  //玩法切换
  $('#plays').on('click','li',self.changePlayNav.bind(self));
  //号码选中
  $('.boll-list').on('click','.btn-boll',self.toggleCodeActive.bind(self));
  //添加号码
   $('#confirm_sel_code').on('click',self.addCode.bind(self));
   //操作区的事件
   $('.dxjo').on('click','li',self.assistHandle.bind(self));
   //随机号码
   $('.qkmethod').on('click','.btn-middle',self.getRandomCode.bind(self));
  }
 
}

export default Lottery;