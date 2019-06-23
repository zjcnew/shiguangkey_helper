// ==UserScript==
// @name         潭州课堂助手
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  去除潭州课堂播轮播广告，头像下增加我的作业菜单，昵称完整展示。
// @author       QQ：619877197   Email：zjc877@outlook.com
// @match        *://*.shiguangkey.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
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

    };


})();
