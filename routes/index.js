var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')
require('express-ws')(router)
const connect = require('../mysql/connect')
const {userSql,schemaSql} = require('../mysql/userSql')
const md5 = require('blueimp-md5')
const _dirname = path.resolve();
const uuidv4 = require('uuid')
connect.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//webSocket路由
//登录
router.ws('/login',function(ws,req){
  ws.on('message',function(msg){
    const user = JSON.parse(msg.toString())
    user.password = md5(user.password)
    connect.query(userSql.queryByNamePassword,[user.username,user.password],function(error,result){
      console.log(result)
      if(result){
        if(result.length){
          ws.send(JSON.stringify({code:0,msg:'登录成功'}))
          console.log('ok')
        }else{
          ws.send(JSON.stringify({code:1,msg:'用户名或密码错误'}))
          console.log('no')
        }
      }
    })
  })
})
//注册
router.ws('/register',function(ws,req){
  ws.on('message',function(msg){
    const user = {username,password,tel,idcord} = JSON.parse(msg.toString())
    console.log(user)
    connect.query(userSql.queryByName,user.username,function(error,result){
      console.log(result)
      if(result){
        if(result.length){
          console.log('no')
          ws.send(JSON.stringify({code:1,msg:'用户已存在'}))
        }else{
          user.password = md5(user.password)
          connect.query(userSql.insert,user,(error,result) =>{
            if(result){
              console.log('ok')
              ws.send(JSON.stringify({code:0,msg:'注册成功'}))
            }else{
              console.log(error)
              ws.send(JSON.stringify({code:2,msg:'注册失败'}))
            }
          })
        }
      }
    })
  })
})
//获取饮品列表
router.ws('/get_drink',function(ws,req){
  ws.on('message',function(msg){
    connect.query(userSql.queryDrinkAll,function(error,result){
      console.log(result)
      ws.send(JSON.stringify(result))
    })
  })
})
//增加饮品
router.ws('/add_drink',function(ws,req){
  ws.on('message',function(msg){
    const drinklist = JSON.parse(msg.toString())
    drinklist.drinkurl = url
    console.log(drinklist)
    connect.query(userSql.queryByDrinkName,drinklist.drinkname,function(error,result){
      if(error){
        console.log(error)
      }
      if(result){
        if(result.length){
          console.log('饮品已存在')
          ws.send(JSON.stringify({code:1,msg:'饮品已存在'}))
        }else{
          connect.query(userSql.insertDrink,drinklist,(error,result) =>{
            if(result){
              console.log('饮品添加成功')
              ws.send(JSON.stringify({code:0,msg:'饮品添加成功'}))
            }else{
              console.log('饮品添加失败')
              console.log(error)
              ws.send(JSON.stringify({code:2,msg:'饮品添加失败'}))
            }
          })
        }
      }
    })
  })
})
//删除饮品
router.ws('/del_drink',function(ws,req){
  ws.on('message',function(msg){
    console.log(msg)
    connect.query(userSql.deleteDrink,msg,function(error,result){
      if(error){
        console.log(error)
      }
      if(result){
        console.log('删除饮品成功')
        ws.send(JSON.stringify({code:0,msg:'删除饮品成功'}))
        
      }
    })
  })
})
//上传图片
var url = ''
router.post('/img_upload',function(req,res){
  fs.readFile(req.files[0].path,function(err,data){
    var des_file = _dirname + '/public/images/img' + req.files[0].originalname;
    fs.writeFile(des_file,data,function(err){
      if(err){
        console.log(err)
      }else{
        url = 'http://localhost:3000/public/images' + req.files[0].originalname
      }
    })
  })
})
//获取评论列表
router.ws('/get_comment',function(ws,req){
  ws.on('message',function(msg){
    connect.query(userSql.queryCommentAll,function(error,result){
      console.log(result)
      ws.send(JSON.stringify(result))
    })
  })
})
//增加评论
router.ws('/add_comment',function(ws,req){
  ws.on('message',function(msg){
    const comm = JSON.parse(msg.toString())
    comm.id = uuidv4.v4()
    connect.query(userSql.insertComment,comm,(error,result) =>{
      if(result){
        console.log('评论成功')
        ws.send(JSON.stringify({code:0,msg:'评论成功'}))
      }else{
        console.log('评论失败')
        console.log(error)
        ws.send(JSON.stringify({code:2,msg:'评论失败'}))
      }
    })
  })
})
//删除评论
router.ws('/del_comment',function(ws,req){
  ws.on('message',function(msg){
    console.log(msg)
    connect.query(userSql.deleteComment,msg,function(error,result){
      if(error){
        console.log(error)
      }
      if(result){
        console.log('删除评论成功')
        ws.send(JSON.stringify({code:0,msg:'删除评论成功'}))
        
      }
    })
  })
})
//获取订单列表
router.ws('/get_order',function(ws,req){
  ws.on('message',function(msg){
    connect.query(userSql.queryOrderAll,function(error,result){
      console.log(result)
      ws.send(JSON.stringify(result))
    })
  })
})
//增加订单
router.ws('/add_order',function(ws,req){
  ws.on('message',function(msg){
    const order = JSON.parse(msg.toString())
    order.id = uuidv4.v4()
    connect.query(userSql.insertOrder,order,(error,result) =>{
      if(result){
        console.log('下单成功')
        ws.send(JSON.stringify({code:0,msg:'下单成功'}))
      }else{
        console.log('下单失败')
        console.log(error)
        ws.send(JSON.stringify({code:2,msg:'下单失败'}))
      }
    })
  })
})
//修改订单状态
router.ws('/rev_status',function(ws,req){
  ws.on('message',function(msg){
    const data = JSON.parse(msg.toString())
    console.log(data)
    connect.query(userSql.queryReviseOrder,[data.status,data.id],function(error,result){
      if(error){
        console.log(error)
      }
    })
  })
})
//获取地址
router.ws('/get_address',function(ws,req){
  ws.on('message',function(msg){
    const user = msg
    connect.query(userSql.queryByAddress,'456',function(error,result){
      if(error){
        console.log(error)
      }
      if(result.length){
        console.log(msg)
        ws.send(JSON.stringify(result))
      }else{
        console.log(ok)
        ws.send(JSON.stringify([]))
      }
    })
  })
})
//保存地址
router.ws('/add_address',function(ws,req){
  ws.on('message',function(msg){
    const address = JSON.parse(msg.toString())
    console.log(address)
    connect.query(userSql.queryByAddressusername,[address.username,address.address],function(error,result){
      if(result){
        if(result.length){
          console.log('no')
        }else{
          connect.query(userSql.insertAddress,address,(error,result) =>{
            if(result){
              console.log('ok')
            }else{
              console.log(error)
            }
          })
        }
      }
    })
  })
})
module.exports = router;
