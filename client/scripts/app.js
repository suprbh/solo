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
				return function(e) {
					var render = [];
					// render the image onto the same div box
					if (f.type.match('image.*')){
            var span = document.createElement('span');
						span.innerHTML = ['<img class="thumb" src="', e.target.result, '" title="', escape(theFile.name),'"/>'].join('');
            document.getElementById('drop').appendChild(span);

            // app.send(e.target.result);

					} else if (f.type.match('video.*')){
            var span = document.createElement('span');
            span.innerHTML = ['<video class="thumb" src="', e.target.result, '" title="', escape(theFile.name),'"controls></video>'].join('');
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
	},

  // send: function(data){
  
  //   $.ajax({
  //     type: 'POST',
  //     // dataType: 'jsonp',
  //     crossDomain: true,
  //     // cache: false,
  //     url: 'http://127.0.0.1:3000/ffmpeg',
  //     // accepts: 'application/jsonp',
  //     data: JSON.stringify({image: data}),
  //     contentType: 'application/json',
  //     async: false
  //   }).done(function(){
  //     console.log("Sent success");
  //   }).fail(function(){
  //     console.log("Error sending POST request");
  //   })
  // }

};