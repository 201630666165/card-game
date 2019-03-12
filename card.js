var sum=0;
var cards;
var posofup = new Array(4);//四个数分别是已经翻开的卡牌的坐标
var pre = new Array(2);//记录翻开卡牌的值，没有的话就是-1
pre[1]=-1;
pre[0]=-1;
var upno = 0;//记录已经翻开的卡牌数量
var time = 0;//记录时间
var protect = 0//为防止卡牌翻开过快，用此变量表示保护状态，值为1时，无法翻牌
var protect2 = 0;
var protect3 = 0;//保护下面两个按钮
var playing = 0;//判别是在读牌中还是游戏中
var height = window.screen.availHeight;
var width = window.screen.availWidth;
var g_total = 0;
var easypaintlink//定义内部函数的引用
var timespeedprotect=0;//防止再试一次导致的时间流逝过快
var timeoutprotect=0;
var isvictory = 0;//try again时判别是否胜利来选择元素
var iscrearec = 0;//判别是否刷新纪录
window.onload=function(){load();}
function load(){
    //document.getElementById("bgm").loop = "loop";
    //document.getElementById("bgm").play();
    document.getElementsByTagName('html').width=width+"px";
    document.getElementsByTagName('html').height=height+"px";
    document.getElementById('cardgame').style.fontSize=0.021*height+"px";
    document.getElementById("cardgame").style.lineHeight=0.05*height+"px";
    document.getElementById("easy").onclick = function () {easypaint(4)};
    document.getElementById("normal").onclick = function () {easypaint(5)};
    document.getElementById("hard").onclick = function () {easypaint(6)};
    document.getElementById("hero").onclick = function () {easypaint(7)};
    document.getElementById("evil").onclick = function () {
        document.getElementById('evilbg').play();
        protect=1;
        setTimeout(function () {
            if (protect2==1) {//防止用户在邪恶声音奏响之间多次点击噩梦按钮造成的多次执行绘制函数
                protect=0;
                return;
            }
            protect=0;
            protect2=1;
            easypaint(9);
        },3618);
        
    };
    easypaintlink=easypaint;
    function easypaint(total) {
        //document.getElementById("bgm").pause();
        g_total=total;
        if (protect==1) {return;}

        document.getElementById("back").src="back2.png";
        //document.getElementById("back").style.top="10vh";
    	document.getElementById("time").style.display = "block";
    	time = Math.floor(total*total*total/16)+1;
        document.getElementById("timer").loop = "loop";//重复播放时钟声
        document.getElementById("timer").play();
        if (!timespeedprotect) {
            window.setInterval(timere, 1000);
        }
    	function timere() {
	        time--;
	        document.getElementById("time").innerHTML=time;
	        if (time<=0&&!playing) {
                playing=1;
	        	time=Math.floor(total*total*total/2);
                document.getElementById("timeout").play();
                document.getElementById("timer").pause();
                setTimeout(function(){
                    //document.getElementById("bgm2").loop = "loop";
                    //document.getElementById("bgm2").play();
                },2000);
	        }
            else if (time<=0) {
                if (!timeoutprotect) document.getElementById("timeout").play();
                timeoutprotect=1;
                time=999;
                fail();
            }
            else if (time<=10&&time>0) {
                document.getElementById('timer').play();
            }
        }
    	sum=total;
    	cards = new Array(total);
    for (var f = 0; f <total; f++) {
	    	cards[f]=new Array(total);//二维数组
	    }
	    document.getElementById("cardgame").innerHTML = "";
        document.getElementById('lefttxt').innerHTML = "返回";
        document.getElementById('left').onclick=function () {location.reload();};
        document.getElementById('right').style.display="none";
        var maxtop=0;//最下排卡牌的top值
	    var s = 0;
	    var m = 0;
	    var judge = new Array(total*total);
	    for (var n =  0; n < total; n++) {
		    m = n;
		    for (var i = 0; i <total; i++) {
		    	//append
                var cw=14*4/total;
                var ch=16*4/total;
			    document.getElementById("cardgame").innerHTML += "<div id='card"+m+i+"' class='card'></div>";
                document.getElementById("card"+m+i).style.left = ((1-((cw)*7/400*(total-1)+(cw)/100))/2+(cw)*7/400*m)*100+"vw";
                document.getElementById("card"+m+i).style.top = (0.08-0.06+(1-((ch)*5/400*(total-1)+(ch)/100))/2+(ch)*5/400*i)*100+"vh";
                if(i==total-1)
                {
                    maxtop=(0.08-0.06+(1-((ch)*5/400*(total-1)+(ch)/100))/2+(ch)*5/400*i)*100;
                }
                document.getElementById("card"+m+i).style.width = cw+"vw";
                document.getElementById("card"+m+i).style.height = ch+"vh";
                document.getElementById("card"+m+i).style.position = "absolute";
                document.getElementById("card"+m+i).style.lineHeight = 0.07*height+"px";
                do
                {
                	s=Math.floor(Math.random()*(total*total));
                }
                while(judge[s]==1)
                if (judge[s]!=1) 
                {
                	judge[s]=1;
                	cards[m][i]= Math.floor(s/2);
                } //judge数组的作用是保证生成的所有随机数能够两两相等

		    }
	    }
        document.getElementById('left').style.width= (100-maxtop-16*4/total)+"vh";
        document.getElementById('left').style.height=(100-maxtop-16*4/total)+"vh";
        document.getElementById('left').style.fontSize=(100-maxtop-16*4/total)/5+"vh";
        document.getElementById('left').style.lineHeight=(100-maxtop-16*4/total)*4/15+"vh";


	    for (var n =  0; n < total; n++) {
		    m = n;
		    for (var i = 0; i <total; i++) {
		    	s=i;
                (function(m,s){
                	document.getElementById("card"+m+s).onclick=function(){click(m,s);}//闭包！！！！！
                    document.getElementById("card"+m+s).style.animation = "myfirst 0.5s";
                    document.getElementById("card"+m+s).style.backgroundImage = "url(41.png)";
                    document.getElementById("card"+m+s).style.backgroundSize=cw+"vw "+ch+"vh";
                    //document.getElementById("card"+m+s).style.backgroundRepeat="no-repeat";
                    setTimeout(function start(){
                        if (cards[m][s]<=0.8*Math.floor(total*total/2))//设置雷区
                        {
                            document.getElementById("card"+m+s).style.backgroundImage = "url("+cards[m][s]+".png)";
                        }
                        else{
                            document.getElementById("card"+m+s).style.backgroundImage = "url(40.png)";
                        }
                    },250);
                    //document.getElementById('card'+m+s).innerHTML = cards[m][s];
                    setTimeout(function sen()
                    {
                        //classList.add()
                        document.getElementById("card"+m+s).style.animation = "myfirst2 0.5s";
                        //document.getElementById("card"+m+s).style.backgroundColor = "red";
                        setTimeout(function down(){
                            document.getElementById('card'+m+s).style.backgroundImage = "url(41.png)";
                        }
                        ,250);  
                    }
                    ,500+Math.floor(total*total*total/16)*1000);
                }
                )(m,s);
		    }
		}
        protect = 1;
        setTimeout("protect = 0",1000+Math.floor(total*total*total/16)*1000);
    }
}
 function click(m,s)
            { 
                console.log(protect);
                if (!protect) {
                	document.getElementById("card"+m+s).style.animation = "myfirst 0.5s";
                    //document.getElementById("card"+m+s).style.backgroundColor = "green";
                	setTimeout(function start(){
                        if (cards[m][s]<=0.8*Math.floor(g_total*g_total/2))//设置雷区
                        {
                            document.getElementById("card"+m+s).style.backgroundImage = "url("+cards[m][s]+".png)";
                        }
                        else{
                            document.getElementById("card"+m+s).style.backgroundImage = "url(40.png)";
                        }
                    },250);
                    setTimeout(function(){
                        if (cards[m][s]>0.8*Math.floor(g_total*g_total/2)) {
                            //location.reload();
                            document.getElementById('explode').play();
                            fail();
                        }
                    },500);
                    /*if (cards[m][s]>0.8*Math.floor(total*total/2)) {
                            location.reload();
                        }*/
                	if (pre[0]==-1) {//当前除了已配对的卡牌之外没有翻开别的卡牌的情况
                		pre[0] = cards[m][s];
                		posofup[0]=m;
                		posofup[1]=s;
                        document.getElementById("card").play();
                	}
                	else if (pre[1]==-1) {//当前除了已配对的卡牌之外翻开一张卡牌的情况
                		if (m!=posofup[0]||s!=posofup[1]) {//确保第二张点击的卡牌和第一个点击的不是同一个卡牌
                		    	pre[1] = cards[m][s];
                                posofup[2]=m;
                		        posofup[3]=s;
                                document.getElementById("card2").play();
                		    if (pre[0]!=pre[1]) {//翻开的两张卡牌不匹配，同时翻转回去
                                protect = 1;
                                setTimeout("protect = 0",1000);
                		    	setTimeout(sen,500);
                		    	function sen()
                		    	{
                		    		//classList.add()
                		    		document.getElementById("card"+posofup[0]+posofup[1]).style.animation = "myfirst2 0.5s";
                                    //document.getElementById("card"+posofup[0]+posofup[1]).style.backgroundColor = "red";
                	                setTimeout("document.getElementById('card'+posofup[0]+posofup[1]).style.backgroundImage = 'url(41.png)'",250);
                	                document.getElementById("card"+posofup[2]+posofup[3]).style.animation = "myfirst2 0.5s";
                	                //document.getElementById("card"+posofup[2]+posofup[3]).style.backgroundColor = "red";
                	                setTimeout("document.getElementById('card'+posofup[2]+posofup[3]).style.backgroundImage = 'url(41.png)'",250);
                		   
                		    	}
                		    }
                		    else
                		    {
                		    	upno+=2;

                		    	if (upno>=(0.8*Math.floor(g_total*g_total/2))*2) {
                                    if (time>localStorage.getItem("r"+g_total)||!localStorage.getItem("r"+g_total)) {
                                        localStorage.setItem("r"+g_total, time);
                                        iscrearec=1;
                                    }
                                    time=999;
                                    victory(iscrearec);
                		    	}
                		    }
                		    pre[0]=-1;
                            pre[1]=-1;
                	    }
                	}
                }
            }
function fail() {
    isvictory=0;
    timespeedprotect=1;
    //document.getElementById("bgm2").pause();
    document.getElementById('failwav').play();
    document.getElementById('over').style.display = "block";
    document.getElementById('fail').style.display = "block";
    document.getElementById('fail').style.animation = "bigger 1s";
    document.getElementById('fail').style.transform = "scale(10,10)";
    document.getElementById('time').style.display = "none";
    document.getElementById('timer').pause();
    setTimeout(function() {
        document.getElementById('timer').pause();
    },2000)
}
function victory(createrecord) {
    isvictory=1;
    timespeedprotect=1;
    iscrearec=0;
    //document.getElementById("bgm2").pause();
    document.getElementById('victorywav').play();
    document.getElementById('over').style.display = "block";
    document.getElementById('victory').style.display = "block";
    if (createrecord) {
        document.getElementById('victory').src="record.png";
        document.getElementById('victory').style.animation = "bigger3 1s";
         document.getElementById('victory').style.transform = "scale(15,5)";
    }
    else{
        document.getElementById('victory').style.animation = "bigger2 1s";
         document.getElementById('victory').style.transform = "scale(10,5)";
    }
   
    document.getElementById('time').style.display = "none";
    document.getElementById('timer').pause();
    setTimeout(function() {
        document.getElementById('timer').pause();
    },2000)
}
function goback() {
    location.reload();
}
function again() {
    document.getElementById('victory').src="victory.png";
    document.getElementById('over').style.display = "none";
    if (isvictory) {
        document.getElementById('victory').style.display = "none";
        document.getElementById('victory').style.transform = "scale(0.1,0.1)";
    }
    else{
        document.getElementById('fail').style.display = "none";
        document.getElementById('fail').style.transform = "scale(0.1,0.1)";
    }
    document.getElementById("cardgame").innerHTML = '';
    playing=0;
    pre[1]=-1;
    pre[0]=-1;
    protect2=0;
    upno = 0;
    timeoutprotect=0;
    console.log(g_total);
    easypaintlink(g_total);
}
function intro() {
    if (protect2||protect3) return;
    protect3=1;
    setTimeout(function(){protect3=0;},1000);
    document.getElementById('cardgame').style.animation="trans 1s";
    var sav = document.getElementById('cardgame').innerHTML
    setTimeout(function () {
        document.getElementById('cardgame').innerHTML="<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这是一款老少皆宜的休闲益智游戏。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点击主页上的难度按钮以开始游戏。每当游戏开始会有较短的时间预览卡片内容，难度不同，预览时间也不同。时间到之后卡片同时反转，游戏正式开始。游戏开始之后点击卡牌后显示卡牌的内容，点击两个一样的卡牌后，卡牌不再翻转回去；若不一样，则两张同时反转。在规定时间内完成游戏，即视作游戏成功，否则游戏失败。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注意，游戏开始时会随机设置雷区（即某些卡牌设置为<img id='tnt' src='40.png'>）,若游戏过程中不慎翻到这些卡牌，炸弹爆炸，游戏即告失败</p>"
    },500)
    document.getElementById('lefttxt').innerHTML = "返回";
    document.getElementById('right').innerHTML = "";
    document.getElementById('left').onclick=function () {left()};
    document.getElementById('right').onclick=function() {};
    function left() {
        if (protect3) return;
        protect3=1;
        setTimeout(function(){protect3=0;load();},1000);
        document.getElementById('cardgame').style.animation="trans2 1s";
        setTimeout(function () {
            document.getElementById('cardgame').innerHTML=sav;
            document.getElementById('right').innerHTML = "<p id='righttxt'>最高<br>纪录</p>";
            document.getElementById('right').onclick=function () {record();}
            document.getElementById('left').innerHTML = "<p id='lefttxt'>游戏<br>说明</p>";
            document.getElementById('left').onclick=function () {intro();}
        },500)
    }
}
function record() {
    if (protect2||protect3) return;
    protect3=1;
    setTimeout(function(){protect3=0;},1000);
    document.getElementById('cardgame').style.animation="trans 1s";
    var sav = document.getElementById('cardgame').innerHTML
    setTimeout(function () {
        document.getElementById('cardgame').innerHTML="<p id='rectxt'>简单：剩余"+localStorage.getItem('r'+4)+"秒<br>普通：剩余"+localStorage.getItem('r'+5)+"秒<br>困难：剩余"+localStorage.getItem('r'+6)+"秒<br>英雄：剩余"+localStorage.getItem('r'+7)+"秒<br>噩梦：剩余"+localStorage.getItem('r'+9)+"秒</p>"
    },500)
    document.getElementById('lefttxt').innerHTML = "返回";
    document.getElementById('right').innerHTML = "<p id='righttxt'>清除<br>数据</p>";
    document.getElementById('left').onclick=function () {left()};
    document.getElementById('right').onclick=function() {
        localStorage.clear();
        document.getElementById('cardgame').style.animation="trans3 1s";
        setTimeout(function(){
            document.getElementById('cardgame').innerHTML="<p id='rectxt'>简单：剩余"+localStorage.getItem('r'+4)+"秒<br>普通：剩余"+localStorage.getItem('r'+5)+"秒<br>困难：剩余"+localStorage.getItem('r'+6)+"秒<br>英雄：剩余"+localStorage.getItem('r'+7)+"秒<br>噩梦：剩余"+localStorage.getItem('r'+9)+"秒</p>"
        }
    ,500);
        };
    function left() {
        if (protect3) return;
        protect3=1;
        setTimeout(function(){protect3=0;load();},1000);
        document.getElementById('cardgame').style.animation="trans2 1s";
        setTimeout(function () {
            document.getElementById('cardgame').innerHTML=sav;
            document.getElementById('right').innerHTML = "<p id='righttxt'>最高<br>纪录</p>";
            document.getElementById('right').onclick=function () {record();}
            document.getElementById('left').innerHTML = "<p id='lefttxt'>游戏<br>说明</p>";
            document.getElementById('left').onclick=function () {intro();}
        },500)
    }
}
