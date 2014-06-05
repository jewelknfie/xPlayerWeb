function showPlayer(obj, title, videoName) {

    $("#vplayer").attr("src","http://localhost/video/" + videoName);//直接播放
//    $("#vplayer").attr("type","video/" + /\.[^\.]+/.exec(videoName));//直接播放
    $("#vplayer").attr("autoplay","true");//直接播放
	
	$(obj).toggleClass("active"); 
    
}


