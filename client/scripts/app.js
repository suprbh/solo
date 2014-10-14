app = {

  width: 176,
  height: 144,
  format: 'mp4',
  sharpen: false,
  blur: false,
  inputFileData: "",
  inputFile: "",

	init: function() {
		if (window.File && window.FileReader && window.FileList && window.Blob){
			console.log("Success! all File APIs are supported");
		} else {
			console.log("The File APIs are not fully supported in this browser!");
		}

    // setup options listeners
    var $w = document.getElementById('')

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
      console.log("Files:", f);
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

            console.log(e.target.result, escape(theFile.name));
            $('.convert').on('click', function(){
              if (app.ffmpeg_convert(e.target.result, theFile.name)){
                console.log("Conversion successful");
              } else {
                console.log("Conversion Failed");
              }
            });
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

  ffmpeg_convert: function(data, fileName){
    var byteArray = app.dataURItoArrayBuffer(data);

    console.log("starting video conversion");
    var path = prompt("Give the full path to destination directory") || "~/";
    var args = "-i " + fileName + " -f " + app.format + " output.avi";
    console.log("format: app: ", args);
    var results = ffmpeg_run({
        arguments: args.split(" "),
        files: [
          {
              'data': byteArray,
              'name': fileName
              // data: new Uint8Array(buffer),
          }
        ]
    });
    console.log("Conversion complete", results);
    return results;
  },

  dataURItoArrayBuffer: function (dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return ia;
  }

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