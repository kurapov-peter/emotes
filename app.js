function handleFileSelect(evt) {
    let file = evt.target.files[0];
    console.log(file.name);

    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

}

document.getElementById('myFile').addEventListener('change', handleFileSelect, false);
