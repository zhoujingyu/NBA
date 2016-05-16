<?php
    header("Content-Type:text/html;charset=utf-8");

    $table=$_GET['table'];

    $sqltable="create table $table (
                schedule_id int,
                guest_id int,
                guest_name varchar(30),
                home_id int,
                home_name varchar(30),
                liver_id int,
                liver_name varchar(30),
                section varchar(6),
                section1_guest_score int,
                section2_guest_score int,
                section3_guest_score int,
                section4_guest_score int,
                section1_home_score int,
                section2_home_score int,
                section3_home_score int,
                section4_home_score int,
                count_guest_score int,
                count_home_score int,
                remain_time varchar(10),
                end_flag smallint,
                insert_flag smallint
              );";
        
    $db='nba';
    $conn=mysql_connect('localhost','root','') or die("连接数据库失败");
    mysql_select_db($db,$conn) or die("选择数据库失败");
    mysql_query("set names 'utf8'");
    $result=mysql_query($sqltable,$conn) or die("查询数据失败");
    mysql_close($conn);
    echo $result;
?>
