 //Create a stage by getting a reference to the canvas
    
    var stage = new createjs.Stage("demoCanvas");
    var obj = [], lines = [];
    var colors  = ['red', 'blue','yellow','magenta','cyan','green'];
    var doDragging = function(evt)
    {
        evt.target.x = evt.stageX;
        evt.target.y = evt.stageY;
        for(var i=0;i<lines.length;i++)
        {
            var one = lines[i].one;
            var two = lines[i].two;
            stage.removeChild(lines[i]);
            lines[i] = connectTwo(one, two);
        }
        stage.update();
    };
    var endDragging = function(evt)
    {
        // do nothing..
    };
    var connectTwo = function (one, two)
    {
        var line = new createjs.Graphics();
        line.moveTo(one.x,one.y);
        line.setStrokeStyle(1);
        line.beginStroke("gray");
        line.lineTo(two.x,two.y);
       
        var shape = new createjs.Shape(line);
         shape.one = one;
        shape.two = two;
        stage.addChildAt(shape,0);
        return shape;
    };



    for (var i=0;i<10; i++)
    {
        obj.push(new createjs.Shape());
        var tmp = obj[obj.length-1]; 
        tmp.graphics.beginFill(colors[ i % colors.length  ]);
        if (i % 2)
        {

            tmp.graphics.drawCircle(0, 0, 20 + Math.random()*20);
        }
        else
        {
            var w = 40 + Math.random()*20;
            var h = 30 + Math.random()*30;
            tmp.graphics.drawRoundRect(-w/2, -h/2,w,h , w/10);
        }


        tmp.on("pressmove", doDragging);
        tmp.on("pressup",endDragging);
        
        tmp.x = (stage.canvas.width-50) * Math.random() + 25;
        tmp.y = (stage.canvas.height-50) * Math.random() + 25;
        console.log(tmp.x, tmp.y, colors[ i % colors.length  ]);

        for (var j=0;j<i;j++)
        {

            var line = connectTwo(obj[j], tmp);

            lines.push(line);
        }
        stage.addChild(tmp);
    }
    
   

    stage.update();
