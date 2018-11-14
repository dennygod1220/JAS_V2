var ColorBrick = {

	init: function(option){

		var keyword_name = option.member;

		function init_new_item()
		{
			var keyword_array = [];
			var left_array = [];
			var leftcolor_array = [];
			var color_array = [];
			var current_array = [];
			var current_class = [];
			var count = 0;

			keyword_array = getRandomArray(0, 5, 2);
			color_array = ['tb_01','tb_02','tb_03','tb_04','tb_05','tb_06','tb_07','tb_08'];

			$('.tagbox').children().each(function(){
				current_array.push($(this).html());
				current_class.push($(this).attr('class'));
			});

			// 取得目前關鍵字
			for (var name in keyword_name) {
				if( current_array.indexOf(keyword_name[name]) == -1 )
				{
					left_array.push(keyword_name[name]);
				} 
			};
			left_array = hotkeyword_shuffle(left_array);

			// 取得目前class
			for (var color in color_array) {
				if( current_class.indexOf(color_array[color]) == -1 )
				{
					leftcolor_array.push(color_array[color]);
				} 
			};
			leftcolor_array = hotkeyword_shuffle(leftcolor_array);

			// 改變關鍵字
			for(var key in keyword_array)
			{
				var keyword_class = $('#hotkeyword_' + keyword_array[key]).attr('class');
				$('#hotkeyword_' + keyword_array[key]).attr('href', 'topic/' + left_array[count] );
				$('#hotkeyword_' + keyword_array[key]).html( left_array[count] );
				$('#hotkeyword_' + keyword_array[key]).removeClass();
				$('#hotkeyword_' + keyword_array[key]).addClass( leftcolor_array[count] , 500, "easeInOutCubic" );

				count++;
			}

			window.setTimeout(function(){
				init_new_item();
			}, 3000);
		}

		// 隨機產生不重覆的n個數字
		function getRandomArray(minNum, maxNum, n)
		{
			var rdmArray = [n];
			for(var i=0; i<n; i++)
			{
				var rdm = 0;
				do {
					var exist = false;
					rdm = getRandom(minNum, maxNum);
					if(rdmArray.indexOf(rdm) != -1) exist = true;
		 
				} while (exist);
				rdmArray[i] = rdm;
			}
			return rdmArray;
		}

		function getRandom(minNum, maxNum)
		{
			return Math.floor( Math.random() * (maxNum - minNum + 1) ) + minNum;
		}

		// 亂數陣列
		function hotkeyword_shuffle(o)
		{
			for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
		}

		$(document).ready(function(){
			init_new_item();
		});
	}

} // hot_tag