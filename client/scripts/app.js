app = {

	init: function() {
		if (window.File && window.FileReader && window.FileList && window.Blob){
			console.log("Success! all File APIs are supported");
		} else {
			console.log("The File APIs are not fully supported in this browser!");
		}

		// setup Drag 'n' Drop Listeners
		var dropZone = document.getElementById('drop');
		dropZone.addEventListener('dragover', app.handleDragOver, false);
		dropZone.addEventListener('drop', app.handleFileSelect, false);
	},

	handleFileSelect: function(evnt) {
		evnt.stopPropagation();
		evnt.preventDefault();

		var files = evnt.dataTransfer.files;

		var output = [];
		var render = [];
		for (var i = 0; i < files.length; i++){
			var f = files[i];
			if (!f.type.match('image.*') && !f.type.match('video.*') && !f.type.match('audio.*')){
				alert(f.name + " is not a media file (image/audio/video) !");
				continue;
			}


			output.push('<li>', escape(f.name), '(', f.type || 'n/a', ') - ', f.size, 'bytes</li>');

			var reader = new FileReader();
			reader.onload = (function(theFile) {
				// console.log(reader.result);
				return function(e) {
					var render = [];
					// render the image onto the same div box
					if (f.type.match('image.*')){
            var span = document.createElement('span');
						span.innerHTML = ['<img class="thumb" src="', e.target.result, '" title="', escape(theFile.name),'"/>'].join('');
            // console.log(span);
            document.getElementById('drop').appendChild(span);
					}
				}
			})(f);

			reader.readAsDataURL(f);
		}
		document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
	},

	handleDragOver: function(evnt) {
		evnt.stopPropagation();
		evnt.preventDefault();

		evnt.dataTransfer.dropEffect = 'copy';
	}

};