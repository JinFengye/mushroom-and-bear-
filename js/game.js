
    //处理游戏参数的变量
    var gameloopId;
    var speed=3;
    var horizontalSpeed = speed;
    var verticalSpeed = -speed;
    //开始向上(给玩家一个改变以使鼠标处于位置)
    var screenWidth;
    var screenHeight;
    var gameRunning = false;
    var ctx;
    var showBounds = false;
    var frameCount = 0;
    var frameCountId;
    var score=0;


    //创建图像
    var mushroomImg = new Image();
    var mushroomWobbleImg = new Image();
    var backgroundForestImg = new Image();
    var bearEyesOpenImg = new Image();
    var bearEyesClosedImg = new Image();
    var flowerImg = new Image();
    var leafImg = new Image();
    var acornImg = new Image();
    var scoreImg = new Image();
    var bonusImg = new Image();
    var owl1 = new Image();
    var owl2 = new Image();
    var multiPoint = 0;
    var currentBonusImage = 0;
    var delayCount=0;
    //var showBonus = false;
    var bonusStarted;
    var bonusActive = false;


    //声明阻碍物
    var BADDY_OFF = 0;
    var BADDY_FLYING = 1;
    var BADDY_HIT = 3;
    var baddyX = 480;
    var baddyStatus = BADDY_OFF;
    var currentBaddyImage = 0;
    var baddyImages = new Array();

    //生命值
    var livesImages = new Array();

    //奖金 images
    var bonusImages = new Array();


    var soundType = "wav";

    //更改声音类型
    if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
    {
        soundType = "mp3";
    }

    //创建和加载声音
    var boing1 = new Audio("./sounds/boing_1." + soundType);
    var boing2 = new Audio("./sounds/boing_2." + soundType);
    var boing3 = new Audio("./sounds/boing_3." + soundType);
    var boing4 = new Audio("./sounds/boing_4." + soundType);
    var boing5 = new Audio("./sounds/boing_5." + soundType);
    var awwwww = new Audio("./sounds/crowdgroan." + soundType);
    var collisionPrize = new Audio("./sounds/collisionPrize." + soundType);
    var collisionStarPrize = new Audio("./sounds/collisionStarPrize." + soundType);
    var groan = new Audio("./sounds/groan." + soundType);
    var newLevel = new Audio("./sounds/newLevel." + soundType);
    var owl = new Audio("./sounds/owl." + soundType);
    var squawk = new Audio("./sounds/squawk." + soundType);

    //设置鸟的背景声音，循环和减少音量
    var birds = new Audio("./sounds/birds." + soundType);
    birds.loop = true;
    birds.volume = 0.1;

    //游戏的基本定义
    function GameObject()
    {
        this.x = 0;
        this.y = 0;
        this.image = null;
    }

    //让蘑菇继承GameObject
    function Mushroom() {};
    Mushroom.prototype = new GameObject();
    Mushroom.prototype.boing = false;
    Mushroom.prototype.wobble = false;
    Mushroom.prototype.startBoing = null;
    Mushroom.prototype.lastBoing = null;
    Mushroom.prototype.squashedImg = null;

    var mushroom = new Mushroom();

    //为Anima声明并扩展GameObjecl
    function Animal() {};
    Animal.prototype = new GameObject();
    Animal.prototype.angle = 0;
    Animal.prototype.eyesOpenImg = null;

    var animal = new Animal();

    //声明和扩展奖品的游戏对象
    var prizes = new Array();
    function Prize() {};
    Prize.prototype = new GameObject();
    Prize.prototype.row = 0;
    Prize.prototype.col = 0;
    Prize.prototype.angle = 0;
    Prize.spinning = false;
    Prize.hit = false;

    //Delcare和扩展GameOject为baddy
    function Baddy() {};
    Baddy.prototype = new GameObject();
    Baddy.prototype.angle = 0;
    Baddy.prototype.altImg = null;

    var baddy = new Baddy();
    baddy.y = 125;
    baddy.x = 480;

    //等待DOM加载和初始化游戏
    $(window).ready(function(){
        init();
    });

    function init(){

        loadImages();
        initSettings();
        addEventHandlers();
        startGame();
        startFPSCounter();
    }

    function startGame()
    {
        score=0;
        lives=3;
        startLevel(1);
    }

    function startLevel(level)
    {
        initPrizes();
    }


    function startFPSCounter()
    {
        var start = new Date().getTime(),
            time = 0;
        function instance()
        {
            time += 1000;
            fps();

            var diff = (new Date().getTime() - start) - time;
            window.setTimeout(instance, (1000 - diff));
        }
        window.setTimeout(instance, 1000);

    }

    //使用jQuery在加载DOM之后添加事件处理程序
    function addEventHandlers()
    {

        //向周围的DIV添加事件处理程序以监视鼠标移动和更新蘑菇的x位置
        $("#container").mousemove(function(e){
            mushroom.x = e.pageX - (mushroom.image.width/2);
        });

        //添加启动按钮的事件处理程序。
        $("#BtnImgStart").click(function (){
            toggleGameplay();
        });

        //添加show/hide bounds按钮的事件处理程序。
        $("#showHideBounds").click(function (){
            showBounds = !showBounds;
            gameLoop();
        });

    }


    //init所有的游戏变量，只有在DOM加载之后才能实现
    function initSettings()
    {
        //获取画布的2d上下文的句柄
        ctx = document.getElementById('canvas').getContext('2d');

        //屏幕高度和宽度
        screenWidth = parseInt($("#canvas").attr("width"));
        screenHeight = parseInt($("#canvas").attr("height"));

        //中心蘑菇在水平轴上
        mushroom.x = parseInt(screenWidth/2);
        mushroom.y = screenHeight - 40;

        //把动物放在蘑菇上
        animal.x = parseInt(screenWidth/2);
        animal.y = parseInt(screenHeight/2);

    }

    //载入游戏的所有图像
    function loadImages()
    {

        mushroomImg.src = "images/mushroom.png";
        mushroomWobbleImg.src = "images/mushroom2.png";
        backgroundForestImg.src = "images/timg.jpg";
        bearEyesOpenImg.src = "images/bear_eyesopen.png";
        bearEyesClosedImg.src = "images/bear_eyesclosed.png";
        flowerImg.src = "images/flower.png";
        acornImg.src = "images/acorn.png";
        leafImg.src = "images/leaf.png";
        scoreImg.src = "images/score.png";
        owl1.src = "images/owl1.png";
        owl2.src = "images/owl2.png";

        //组合奖金图片
        for(var x=0; x<3; x++)
        {
            bonusImages[x] = new Image();
            bonusImages[x].src = "images/comboBonus" + (x + 1) + ".png";
        }

        //生命图片
        for(var x=0; x<6; x++)
        {
            livesImages[x] = new Image();
            livesImages[x].src = "images/lives" + x + ".png";
        }

        baddy.image = owl1;
        baddy.altImg = owl2;
        mushroom.image = mushroomImg;
        mushroom.squashedImg = mushroomWobbleImg;
        animal.image = bearEyesClosedImg;
        animal.eyesOpenImg = bearEyesOpenImg;

        //等待背景图像加载，然后调用gameLoop来绘制初始阶段
        backgroundForestImg.onload = function(){gameLoop(); };

    }

    function initPrizes()
    {
        var count=0;
        for(var x=0; x<3; x++)
        {
            for(var y=0; y<23; y++)
            {
                prize = new Prize();
                if(x==0)
                    prize.image = flowerImg;
                if(x==1)
                    prize.image = acornImg;
                if(x==2)
                    prize.image = leafImg;


                prize.row = x;
                prize.col = y;
                prize.x = 20 * prize.col + 10;
                prize.y = 30 * prize.row + 40;
                prize.hit = false;
                prizes[count] = prize;
                count++;
            }
        }
    }

    function drawPrizes()
    {

        for(var x=0; x<prizes.length; x++)
        {
            currentPrize = prizes[x];
            if(!currentPrize.hit)
            {
                if(currentPrize.spinning)
                {
                    //alert("spinning" + currentPrize.angle);
                    currentPrize.angle += 10;
                    ctx.save();

                    //转换到奖品的中心(即我们将要进行旋转的点
                    ctx.translate(currentPrize.x + (currentPrize.image.width/2), currentPrize.y + (currentPrize.image.height/2));

                    //根据当前的奖励角度进行旋转
                    ctx.rotate(currentPrize.angle * Math.PI/180);

                    ctx.drawImage(currentPrize.image, - (currentPrize.image.width/2), - (currentPrize.image.width/2));

                    showObjectBounds(currentPrize, - (currentPrize.image.width/2), - (currentPrize.image.width/2));

                    ctx.restore();

                    if(currentPrize.angle == 360)
                    {
                        currentPrize.hit = true;
                        multiPoint++;

                        //基于行的更新分数
                        if(multiPoint > 3)
                        {
                            //我们已经连续打了3个奖项，所以增加奖金和显示奖金。
                            score += (3-currentPrize.row) * (multiPoint);

                            //showBonus = true;
                            showBonus();
                            //bonusStarted = new Date().getTime();
                        }
                        else
                        {
                            score += (3-currentPrize.row);
                        }

                        //检查所有奖品是否被击中!
                        if(allPrizesHit())
                        {
                            newLevel.play();
                            gameOver();

                        }
                    }
                }
                else
                {
                    ctx.drawImage(currentPrize.image, prizes[x].x, prizes[x].y);
                    showObjectBounds(currentPrize);

                }
            }
        }

    }

    function allPrizesHit()
    {
        for(var c=0; c<prizes.length; c++)
        {
            checkPrize = prizes[c];
            if(checkPrize.hit == false)
                return false;

        }
        return true;
    }

    //绘制蘑菇(取决于它的当前状态)
    function drawMushroom()
    {
        showObjectBounds(mushroom);
        if(!mushroom.boing)
        {
            ctx.drawImage(mushroom.image, mushroom.x, mushroom.y);

        }
        else
        {
            //计算自上次boing以来的时间差异
            var sinceLastBoing = (new Date().getTime() - mushroom.lastBoing);
            var sinceStartBoing = (new Date().getTime() - mushroom.startBoing);

            //摆动约每40毫秒
            if(sinceLastBoing > 40)
            {
                //切换的摆动
                mushroom.wobble = !mushroom.wobble;
                mushroom.lastBoing = new Date().getTime();
            }

            //500毫秒后停止摆动
            if(sinceStartBoing > 500)
            {
                mushroom.boing = false;
                mushroom.wobble = false;
            }

            //蘑菇刚刚被击中，所以让它摇晃
            if(mushroom.wobble)
                ctx.drawImage(mushroom.squashedImg, mushroom.x, mushroom.y);
            else
                ctx.drawImage(mushroom.image, mushroom.x, mushroom.y);

        }
    }

    function drawAnimal()
    {
        ctx.save();

        //转换到熊的中心(即我们要进行旋转的点)。
        ctx.translate(animal.x + (animal.image.width/2), animal.y + (animal.image.height/2));

        //根据水平速度调整角度。
        animal.angle += horizontalSpeed;
        if(animal.angle < 0) animal.angle=360;
        else if(animal.angle>360) animal.angle=0;

        //根据当前的熊角进行旋转
        ctx.rotate(animal.angle * Math.PI/180);


        showObjectBounds(animal, - (animal.image.width/2), - (animal.image.width/2));
        if(verticalSpeed>0)
        {
            ctx.drawImage(animal.eyesOpenImg, - (animal.eyesOpenImg.width/2), - (animal.eyesOpenImg.width/2));
        }
        else
        {
            ctx.drawImage(animal.image, - (animal.image.width/2), - (animal.image.width/2));
        }

        ctx.restore();

    }

    function drawScore()
    {
        ctx.drawImage(scoreImg, screenWidth-(scoreImg.width),0);
        ctx.font = "12pt Arial";
        ctx.fillText("" + score, 425, 25);
    }

    function drawLives()
    {
        //livesImg.src = "images/lives"+lives+".png";
        ctx.drawImage(livesImages[lives], 0, 0);
    }

    function hasAnimalHitEdge()
    {

        //熊够到最右边吗?
        if(animal.x>screenWidth - animal.image.width)
        {
            //在右手边反弹，这样就可以在水平速度上进行倒转和倒转
            boing2.play();
            if(horizontalSpeed > 0)
                horizontalSpeed =-horizontalSpeed;
        }

        //熊已经到了最左边了？
        if(animal.x<-10)
        {
            //在左手边弹跳，这样就可以在水平速度上来回摆动
            boing3.play();
            if(horizontalSpeed < 0)
                horizontalSpeed = -horizontalSpeed;
        }

        //熊已经触到了屏幕的底部!
        if(animal.y>screenHeight - animal.image.height)
        {
            //从底部反弹，动物呻吟和游戏停止，失去生命。
            verticalSpeed = -speed;

            multiPoint = 0;

            //现在停止游戏
            toggleGameplay();

            //等待2秒，重置为下一个生命。
            setTimeout(function(){

                if(lives != 0)
                {
                    //把动物放在蘑菇上。
                    animal.x = parseInt(screenWidth/2);
                    animal.y = parseInt(screenHeight/2);
                    $("#BtnImgStart").show();
                    gameLoop();
                }

            }, 2000);

            //扣除生命，检查我们是否还有剩余
            lives -= 1;

            if(lives > 0)
            {
                groan.play();
                drawLives();
            }
            else
            {
                awwwww.play();
                gameOver();
            }
        }

        //熊打到屏幕的顶部了吗?
        if(animal.y<0)
        {
            //弹跳脱顶，所以玩起球和反向的垂直速度。
            boing4.play();
            verticalSpeed = speed;
        }

    }

    function hasAnimalHitMushroom()
    {
        //已经承载了蘑菇
        if(checkIntersect(animal, mushroom, 5))
        {

            if((animal.x + animal.image.width/2) < (mushroom.x + mushroom.image.width*0.25))
            {
                horizontalSpeed = -speed;
            }
            else if((animal.x + animal.image.width/2) < (mushroom.x + mushroom.image.width*0.5))
            {
                horizontalSpeed = -speed/2;
            }
            else if((animal.x + animal.image.width/2) < (mushroom.x + mushroom.image.width*0.75))
            {
                horizontalSpeed = speed/2;
            }
            else
            {
                horizontalSpeed = speed;
            }
            boing1.play();
            mushroom.startBoing = new Date().getTime();
            mushroom.lastBoing = mushroom.lastBoing;
            mushroom.boing = true;
            verticalSpeed = -speed;
            multiPoint = 0;

        }
    }

    function hasAnimalHitPrize()
    {
        for(var x=0; x<prizes.length; x++)
        {
            var prize = prizes[x];

            if(!prize.hit)
            {
                if(checkIntersect(prize, animal, 0))
                {
                    //alert("hit prize");
                    //prize.hit = true;
                    prize.spinning = true;
                    verticalSpeed = speed;
                    //根据奖品的高度播放声音
                    if(prize.row == 0)
                        collisionStarPrize.play();
                    else
                        collisionPrize.play();
                }
            }
        }

    }

    function showBaddy()
    {


        if(baddyStatus == BADDY_OFF)
        {
            setTimeout(changeBaddyImage, 100);
            baddyStatus = BADDY_FLYING;
        }
    }

    function drawBaddy()
    {

        //如果baddy(猫头鹰)现在走了，那就拉它回来。
        if(baddyStatus == BADDY_OFF)
        {
            //选择1到100之间的数字
            shallWeStart = Math.floor(Math.random()*100);

            if (shallWeStart == 50)
                showBaddy();
        }

        //看看这只动物是不是撞到了捣蛋鬼。
        if(checkIntersect(baddy, animal, 5))
        {
            //如果还没有，改变动物的水平速度。
            if(baddyStatus != BADDY_HIT)
                horizontalSpeed = -horizontalSpeed;

            //更新状态，发送动物，发出叫声。
            baddyStatus = BADDY_HIT;
            verticalSpeed = speed;
            squawk.play();
        }

        //如果睡眠重置x坐标
        if(baddyStatus == BADDY_OFF)
            baddy.x = 500;

        //如果baddy (owl)正在飞行，那么将它从右向左移动
        if(baddyStatus == BADDY_FLYING)
            baddy.x -=2;

        //如果baddy(猫头鹰)被击中，就会让他崩溃
        if(baddyStatus == BADDY_HIT)
        {
            baddy.y +=2;
            //如果他离开地面，然后重新设置
            if(baddy.y > 320)
            {
                baddyStatus = BADDY_OFF;
                baddy.x = 500;
                baddy.y = 125;
            }
        }

        //如果baddy(owl)在没有被击中的情况下飞过去了，那么就休息一下x的位置，更新状态，并玩一个hoot!
        if(baddy.x < -20)
        {
            baddyStatus = BADDY_OFF;
            owl.play();
            baddy.x = 500;
        }

        //如果baddy(猫头鹰)没有睡着，那就把他弄出来。
        if(baddyStatus != BADDY_OFF)
        {
            //旋转襟翼，即交替图像
            if(currentBaddyImage == 0)
                currentBaddy = baddy.image;
            else
                currentBaddy = baddy.altImg;

            //如果他没有命中，就像正常一样。
            if(baddyStatus != BADDY_HIT)
            {
                showObjectBounds(baddy, baddy.x, baddy.y);
                ctx.drawImage(currentBaddy, baddy.x, baddy.y);
            }
            else
            {
                //他被击中了，所以当他飞出控制的时候，他会旋转。
                ctx.save();

                //转换到熊的中心(即我们要进行旋转的点)。
                ctx.translate(baddy.x + (baddy.image.width/2), baddy.y + (baddy.image.height/2));

                //根据水平速度调整角度
                baddy.angle += 7;

                if(baddy.angle < 0) baddy.angle=360;
                else if(baddy.angle>360) baddy.angle=0;

                //根据当前的熊角进行旋转。
                ctx.rotate(baddy.angle * Math.PI/180);

                showObjectBounds(baddy, - (baddy.image.width/2), - (baddy.image.width/2));

                ctx.drawImage(currentBaddy, - (baddy.image.width/2), - (baddy.image.width/2));

                ctx.restore();
            }


        }
    }

    //如果不是alseep，那么就调用它自己来替代当前的baddy图像
    function changeBaddyImage()
    {
        currentBaddyImage++;

        if(currentBaddyImage == 2)
            currentBaddyImage = 0;

        if(baddyStatus != BADDY_OFF)
            setTimeout(changeBaddyImage, 100);

    }


    function showBonus()
    {
        if(!bonusActive)
        {
            bonusStarted = new Date().getTime();
            setTimeout(changeBonusImage, 50);
            bonusActive = true;
        }
    }


    function drawBonus()
    {
        if(bonusActive)
            ctx.drawImage(bonusImages[currentBonusImage], 200, 150);
    }

    function changeBonusImage()
    {
        currentBonusImage++;

        if(currentBonusImage == 3)
            currentBonusImage = 0;

        now = new Date().getTime();
        if((now-bonusStarted) < 1000)
        {
            setTimeout(changeBonusImage, 50);
        }
        else
        {
            bonusActive = false;
        }
    }

    //主游戏循环，这一切都发生在这里!
    function gameLoop(){

        //清除屏幕(例如，绘制一个屏幕大小的清晰矩形)
        ctx.clearRect(0, 0, screenWidth, screenHeight);

        //将熊移动到当前的方向
        animal.x += horizontalSpeed;
        animal.y += verticalSpeed;

        //画的背景森林
        ctx.drawImage(backgroundForestImg, 0, 0);

        //画出分数
        drawScore();

        //生命值
        drawLives();

        //画奖金
        drawPrizes();

        drawBaddy();

        drawBonus();

        //绘制蘑菇(取决于它的当前状态)
        drawMushroom();

        //画动物
        drawAnimal();

        //检查动物的碰撞
        hasAnimalHitEdge();

        hasAnimalHitMushroom();

        hasAnimalHitPrize();

        //增加帧数
        frameCount++;


    }

    function checkIntersect(object1, object2, overlap)
    {

        A1 = object1.x + overlap;
        B1 = object1.x + object1.image.width - overlap;
        C1 = object1.y + overlap;
        D1 = object1.y + object1.image.height - overlap;

        A2 = object2.x + overlap;
        B2 = object2.x + object2.image.width - overlap;
        C2 = object2.y + overlap;
        D2 = object2.y + object2.image.width - overlap;

        //它们在x轴上重叠吗?
        if(A1 > A2 && A1 < B2
           || B1 > A2 && B1 < B2)
        {
            //x轴相交于y轴
            if(C1 > C2 && C1 < D2
           || D1 > C2 && D1 < D2)
            {
                //重叠
                return true;
            }

        }

        return false;
    }


    function showObjectBounds(gameObject, transitionX, transitionY)
    {

        if(showBounds)
        {
            if(typeof(transitionX) != 'undefined')
                rectX = transitionX;
            else
                rectX = gameObject.x;

            if(typeof(transitionY) != 'undefined')
                rectY = transitionY;
            else
                rectY = gameObject.y;

            ctx.save();

            ctx.strokeStyle = '#f00'; // red
            ctx.lineWidth   = 2;
            ctx.strokeRect(rectX, rectY, gameObject.image.width, gameObject.image.height);

            ctx.restore();
        }
    }

    //更新显示器以显示每秒帧数，并为下一次计数进行重置。
    function fps()
    {
        $("#fps").html(frameCount + " fps");
        frameCount=0;
    }

    //启动游戏计时器，即调用自己的setTimeout
    //时间的实际差别对比
    function startGameTimer()
    {
        var start = new Date().getTime(),
            time = 0;
        function timer()
        {
            time += 15;
            var diff = (new Date().getTime() - start) - time;
            if(gameRunning)
            {
                gameLoop();
                window.setTimeout(timer, (15 - diff));
            }
        }
        if(gameRunning)
            window.setTimeout(timer, 15);
    }

    //开始/停止游戏循环(更重要的是，那烦人的游戏!)
    function toggleGameplay()
    {
        gameRunning = !gameRunning;

        if(gameRunning)
        {
            $("#BtnImgStart").hide();
            birds.play();
            startGameTimer();
        }
        else
        {
            birds.pause();
        }
    }

    function gameOver()
    {
        gameRunning = false;
        birds.pause();

        alert("你已经Game over了 ~~吽");

    }

