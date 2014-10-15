app = {

  resolution: '176x144',
  framerate: '15',
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

    // var $w = document.getElementById('')

		// setup Drag 'n' Drop Listeners
		var dropZone = document.getElementById('drop');
		dropZone.addEventListener('dragover', app.handleDragOver, false);
		dropZone.addEventListener('drop', app.handleFileSelect, false);


    // setup options listeners
    // Format
    $('input[type="radio"]').click(function(){
      var $radio = $(this);

      // if this was previously checked
      if ($radio.data('waschecked') == true)
      {
        $radio.prop('checked', false);
        $radio.data('waschecked', false);
      }
      else {
        $radio.data('waschecked', true);
        app.format = $radio.data('format');
        console.log(app.format);
      }

      // remove was checked from other radios
      $radio.siblings('input[type="radio"]').data('waschecked', false);
    });

    // Filter
    $('input[type="checkbox"]').click(function(){
      var $check = $(this);

      // if this was previously checked
      if ($check.data('waschecked') == true)
      {
        $check.prop('checked', false);
        $check.data('waschecked', false);
      }
      else {
        $check.data('waschecked', true);
        app.filter = $check.data('filter');
        console.log(app.filter);
      }

      // remove was checked from other radios
      $check.siblings('input[type="checkbox"]').data('waschecked', false);
    });

    // Resolution
    $('.submit').on('click', function(){
      app.resolution = $('#resolution').val();
      console.log("width: height: ", app.resolution);
    });

    // Framerate
    $('.submitFR').on('click', function(){
      app.framerate = $('#framerate').val();
      console.log("framerate: ", app.framerate);
    });


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
              var res = app.ffmpeg_convert(e.target.result, theFile.name);
              if (!!res){
                console.log("Conversion successful", res);
                var span = document.createElement('span');
                span.innerHTML = '<a download="output.'+ app.format+'" href="'+res+'">Click here to download output.'+ app.format+'!</a>';
                console.log("span: ", span);
                $('.col-md-4 #list').append(span);
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
    var args = "-i " + fileName + " -f " + app.format + " -s " + 
                app.resolution + " -r " + app.framerate + " output." + app.format;
    console.log("format: app: ", args);
    var results = ffmpeg_run({
        arguments: args.split(" "),
        files: [
          {
              'data': byteArray, //Uint8Array(buffer)
              'name': fileName
          }
        ]
    });

    alert("File Conversion Successful!");
    return app.getDownloadLink(results[0].data, results[0].name);;
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
  },

getDownloadLink: function (fileData, fileName) {
  var a = document.createElement('a');
  a.download = fileName;
  var blob = new Blob([fileData]);
  var src = window.URL.createObjectURL(blob);
  a.href = src;
  a.textContent = 'Click here to download ' + fileName + "!";
  return a;
}

// var result = ffmpeg_run(module);

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