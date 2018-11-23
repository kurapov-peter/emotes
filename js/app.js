function handleFileSelect(evt) {
    let file = evt.target.files[0];
    console.log(file.name);
}

document.getElementById('myFile').addEventListener('change', handleFileSelect, false);