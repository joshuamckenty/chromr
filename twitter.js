
function twitter_getNext() {

   return "http://search.twitter.com/search.json?q="+TWITTER_QUERYSTRING+"&callback=ShowTweet&rpp=3";
}

function show_twitter(url) {
	var fileref = document.createElement('script');
	fileref.setAttribute("type","text/javascript");
	fileref.setAttribute("src", url);
	// Setting its src to the search API URL; We provide TweetTick as a callback
	$("head")[0].appendChild(fileref);
};

function ShowTweet(ob)
{
	// This is the callback function

	var container=$('#tweet-container');
	container.html('');
	// Removing the loading gif animation

	$(ob.results).each(function(el){

		// ob contains all the tweets

		var str = '	<div class="tweet">\
		<div class="txt">'+formatTwitString(this.text)+'</div>\
		<div class="avatar"><a href="http://twitter.com/'+this.from_user+'" target="_blank"><img src="'+this.profile_image_url+'" alt="'+this.from_user+'" /></a></div>\
		<div class="user"><a href="http://twitter.com/'+this.from_user+'" target="_blank">'+this.from_user+'</a></div>\
		<div class="time">'+relativeTime(this.created_at)+'</div>\
		</div>';

		container.append(str);
		// Adding the tweet to the container
	});
	container.show();

}

function formatTwitString(str)
{
	// This function formats the tweet body text

	str=' '+str;

	str = str.replace(/((ftp|https?):\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?)/gm,'<a href="$1" target="_blank">$1</a>');
	// The tweets arrive as plain text, so we replace all the textual URLs with hyperlinks

	str = str.replace(/([^\w])\@([\w\-]+)/gm,'$1@<a href="http://twitter.com/$2" target="_blank">$2</a>');
	// Replace the mentions

	str = str.replace(/([^\w])\#([\w\-]+)/gm,'$1<a href="http://twitter.com/search?q=%23$2" target="_blank">#$2</a>');
	// Replace the hashtags

	return str;
}

function relativeTime(pastTime)
{
	// Generate a JavaScript relative time for the tweets

	var origStamp = Date.parse(pastTime);
	var curDate = new Date();
	var currentStamp = curDate.getTime();
	var difference = parseInt((currentStamp - origStamp)/1000);

	if(difference < 0) return false;

	if(difference <= 5)			return "Just now";
	if(difference <= 20)			return "Seconds ago";
	if(difference <= 60)			return "A minute ago";
	if(difference < 3600)		return parseInt(difference/60)+" minutes ago";
	if(difference <= 1.5*3600) 	return "One hour ago";
	if(difference < 23.5*3600)	return Math.round(difference/3600)+" hours ago";
	if(difference < 1.5*24*3600)	return "One day ago";

	// If the tweet is older than a day, show an absolute date/time value;

	var dateArr = pastTime.split(' ');

	return dateArr[4].replace(/\:\d+$/,'')+' '+dateArr[2]+' '+dateArr[1]+
	(dateArr[3]!=curDate.getFullYear()?' '+dateArr[3]:'');
}