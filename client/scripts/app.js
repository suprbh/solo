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
		for (var i = 0; i < files.length; i++){
			var f = files[i];
			output.push('<li>', escape(f.name), '(', f.type || 'n/a', ') - ', f.size, 'bytes</li>');
		}
		document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
	},

	handleDragOver: function(evnt) {
		evnt.stopPropagation();
		evnt.preventDefault();

		evnt.dataTransfer.dropEffect = 'copy';
	}

};