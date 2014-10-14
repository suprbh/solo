app = {

  resolution: '176x144',
  // height: 144,
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

    $('.submit').on('click', function(){
      app.resolution = $('#resolution').val();
      console.log("width: height: ", app.resolution);
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
    var dataURI = app.base64ArrayBuffer(results); //fixme
    alert("File Conversion Successful!");
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
  },

  base64ArrayBuffer: function(arrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
 
  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder
 
  var a, b, c, d;
  var chunk;
 
  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
 
    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 ;// 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 ;// 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 ;// 4032     = (2^6 - 1) << 6
    d = chunk & 63  ;             // 63       = 2^6 - 1
 
    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }
 
  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength];
 
    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
 
    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4; // 3   = 2^2 - 1
 
    base64 += encodings[a] + encodings[b] + '==' ;
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
 
    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4; // 1008  = (2^6 - 1) << 4
 
    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 ;// 15    = 2^4 - 1
 
    base64 += encodings[a] + encodings[b] + encodings[c] + '=';
  }
  
  return base64;
},

/* Array of bytes to base64 string decoding */

b64ToUint6: function (nChr) {

  return nChr > 64 && nChr < 91 ?
      nChr - 65
    : nChr > 96 && nChr < 123 ?
      nChr - 71
    : nChr > 47 && nChr < 58 ?
      nChr + 4
    : nChr === 43 ?
      62
    : nChr === 47 ?
      63
    :
      0;

},

base64DecToArr: function (sBase64, nBlocksSize) {

  var
    sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
    nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);

  for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
    nMod4 = nInIdx & 3;
    nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
    if (nMod4 === 3 || nInLen - nInIdx === 1) {
      for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
      }
      nUint24 = 0;

    }
  }

  return taBytes;
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