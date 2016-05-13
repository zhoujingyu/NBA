<?php
    header("Content-Type:text/html;charset=utf-8");

    $sql=$_GET['sql'];
    $db='nba';
    $conn=mysql_connect('localhost','root','') or die("连接数据库失败");
    mysql_select_db($db,$conn) or die("选择数据库失败");
    mysql_query("set names 'utf8'");
    $result=mysql_query($sql,$conn) or die("查询数据失败");
    mysql_close($conn);
    echo $result;
?>
