// ==UserScript==
// @name         潭州课堂助手
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  去除潭州课堂播轮播广告，头像下增加我的作业菜单，昵称完整展示。
// @author       QQ：619877197   Email：zjc877@outlook.com
// @match        *://*.shiguangkey.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function () {

        // 移除轮播广告
        $("div[class='_1-j4s']").remove();

        // 直接展示课程目录
        var tabs = $("div[role='tab']");
        $.each(tabs, function (i, item) {
            if ($(item).text() === "课程目录") {
                $(item).click();
                return false;
            }
        });

        // 头像下面添加我的作业菜单
        var avatarlis = $("div[class='memberHome___ReVBw']").length > 0 ? $("div[class='memberHome___ReVBw']").find("ul").find("li") : $("div[class='_2v85p']").find("ul").find("li");
        $.each(avatarlis, function(i, item) {
            if ($(item).find("a").text() === "我的课表") {
                var homeworkdom = $("<li><a href='/i/homework'>我的作业</a></li>");
                $(item).after(homeworkdom);
            }
        })

        // 昵称完整展示
        var nickdom = $("span[class='avatarNick___3PfCp userNickname']").length > 0 ? $("span[class='avatarNick___3PfCp userNickname']") : $("span[class='_3Au-A userNickname']")
        nickdom.css({
            "margin-right": "30px",
            "overflow": "visible"
        })

        // 待完成/已完成作业数量展示
        setInterval(function(){
            var homeworktabs = $("div[role='tab']")
            $.each(homeworktabs, function(i, item) {
                var labelp = $(item).find("p");
                if (RegExp(/待完成/).exec(labelp.text())) {
                    $.ajax({
                        type: "GET",
                        async: false,
                        cache: false,
                        headers: {
                            "token": $.cookie("token"),
                            "terminaltype": 4
                        },
                        cookie: document.cookie,
                        url: "https://www.shiguangkey.com/api/student/homework/getUnCompletedList?classId=" + getUrlParam("classId") + "&activeKey=1&pageIndex=1&pageSize=10&terminalType=4",
                        dataType: "json",
                        success: function (res) {
                            var uncompleted = $("<span style='color: red;'>（" + res.data.totalItem + "）</span>");
                            labelp.find("span[style='color: red;']").remove();
                            labelp.append(uncompleted);
                        },
                        error: function () {}
                    });
                } else if (RegExp(/已完成/).exec(labelp.text())) {
                    $.ajax({
                        type: "GET",
                        async: false,
                        cache: false,
                        headers: {
                            "token": $.cookie("token"),
                            "terminaltype": 4
                        },
                        cookie: document.cookie,
                        url: "https://www.shiguangkey.com/api/student/homework/getCompletedList?classId=" + getUrlParam("classId") + "&activeKey=1&pageIndex=1&pageSize=10&terminalType=4",
                        dataType: "json",
                        success: function (res) {
                            var completed = $("<span style='color: green;'>（" + res.data.totalItem + "）</span>");
                            labelp.find("span[style='color: green;']").remove();
                            labelp.append(completed);
                        },
                        error: function () {}
                    });
                }
            })
        }, 500);

        // 待完成作业数数量加粗标红醒目展示
        setInterval(function () {
            var thead = $("thead[class='rc-table-thead']");
            var thead_th = $(thead).find("tr").find("th")[7];
            if ($(thead_th).text() == "待完成作业数") {
                var tbody = $(thead).next();
                $.each(tbody, function (i, item) {
                    var trs = $(item).find("tr");
                    $.each(trs, function (i, item) {
                        var td = $(item).find("td")[7];
                        if ($(td).text() != 0) {
                            console.log($(td).text());
                            $(td).css({
                                "color": "red",
                                "font-weight": "bold",
                                "font-size": "200%"
                            });
                        }

                    })
                })
            }
        }, 500)

        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }

        
    };
    
})();
