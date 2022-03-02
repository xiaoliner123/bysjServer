const userSql = {
    queryCommentAll:'select * from comment',  //查询所有评论
    queryOrderAll:'select * from ordersinfo',
    queryDrinkAll:'select * from drinksinfo',
    deleteDrink:'delete from drinksinfo where drinkid=?',
    queryReviseOrder:'update ordersinfo set status=? where id=?',
    queryByDrinkName:'select * from drinksinfo where drinkname=?',
    queryByAddress:'select * from address where username=?',
    queryByAddressusername:'select * from address where username=? and address=?',
    queryByNamePassword:'select * from usersinfo where username=? and password=?',   //通过用户名和密码索引查询用户
    insertDrink:'insert into drinksinfo set ?', //插入饮品
    insertComment:'insert into comment set ?', 
    insertOrder:'insert into ordersinfo set ?',
    insertAddress:'insert into address set ?' ,
    insert:'insert into usersinfo set ?',
    queryByName:'select * from usersinfo where username=?',
    deleteComment:'delete from comment where id=?'     //删除评论
}

const schemaSql = {
    queryAll: 'select * from users2',
    queryByFromorTo:'select * from users2 where from2=? or to2=?',
    updateRead:'update users2 set ? where from2=? and to2=?', 
    insert:'insert into users2 set ?'
}
module.exports = {userSql,schemaSql};