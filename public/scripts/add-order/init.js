let globalFile

function uploadFile() {
    document.getElementById('file-input').click();
}

function fileSelected(event) {
    const file = event.target.files[0];
    globalFile = file
    fileImported(file)
}

function dropHandler(ev) {
    ev.preventDefault();
    const file = ev.dataTransfer.files[0];
    globalFile = file
    fileImported(file)
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

function fileImported(file) {
    importBoxText = document.querySelector('.import-box').querySelector('span')

    importBoxText.innerText = `Upload this file?\n\n` + file.name

    document.querySelector('.upload-button').style.display = 'flex'
}

function sendFile(event) {
    event.preventDefault()
    event.stopPropagation();

    console.log('Sending File to Server')

    let today = new Date();
    let date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();


    const reader = new FileReader()
    reader.readAsArrayBuffer(globalFile)
    reader.onload = async (event) => {
        const fileData = event.target.result
        const response = await serverRequest('excelUpload', { fileName: globalFile.name, fileData, date })

        importBoxText = document.querySelector('.import-box').querySelector('span')
        
        if (response.ok) {
            console.log('Good Response')

            importBoxText.innerText = `${file.name}\n\nAdded Order Successfully`
        } else {
            console.log('Bad Response')

            if(response.userError) {
                importBoxText.innerText = `${file.name}\n\n${response.err}`
            }

            importBoxText.innerText = `${file.name}\n\nError Adding Order`
        }
    }
}