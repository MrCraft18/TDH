function uploadFile() {
    document.getElementById('file-input').click();
}

function fileSelected(event) {
    var file = event.target.files[0];
    fileImported(file)
}

function dropHandler(ev) {
    ev.preventDefault();
    var file = ev.dataTransfer.files[0];
    fileImported(file)
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

let globalFile
function fileImported(file) {
    importBoxText = document.querySelector('.import-box').querySelector('span')

    importBoxText.innerText = `Upload this file?\n\n` + file.name

    document.querySelector('.upload-button').style.display = 'flex'
}

function sendFile() {
    console.log('Sending File to Server')

    const reader = new FileReader()
    reader.readAsArrayBuffer(globalFile)
    reader.onload = (event) => {
        const fileData = event.target.result
        serverRequest('excelUpload', { fileName: globalFile.name, fileData })
    }
}