function badgeTranslate(str){
	if(isLevel(str)){
		var x=HASH.levelName[str];
		return x[0]+" ("+x[1]+"/16)";
	}
	var badgeRaw=str.split("_");
	var badge=badgeSearch(str);
	badge[0]=badge[0]||[];
	return (badge[0][0]||badgeRaw[0])+(badge[1]||badgeRaw[1]);
}

function isLevel(str){
	return !!HASH.levelName[str];
}

function badgeSearch(badgeName){
	var _b=badgeName.split("_");
	return [HASH.badgeName[_b[0]]||null,HASH.badgeLevel[_b[1]]||null];
}

//Used in sort
function compareBadgeLevel(a,b){
	return badgeOrder(a)>badgeOrder(b);
}

function badgeOrder(str){
	var x=str.split("_");
	var y=x[x.length-1];
	return ({bronze:0,silver:1,gold:2})[y];
}
