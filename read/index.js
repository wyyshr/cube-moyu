const fileInput = document.querySelector("#uploadFile")
let str, fakeStr = ''
let ready = false, preStr = ''
let inputLength = 0, totalLength = 0, startIndex = 0
const title = document.querySelector("#title")
fileInput.addEventListener('change', async e => {
    const file = e.target.files[0]
    if (!file) {
        console.log('未选择文件');
        return
    }
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer);
    const encoding = Encoding.detect(uint8Array)
    console.log(encoding);
    let encode = 'UTF8'
    if (encoding !== 'UTF8') {
        encode = 'gbk'
    }
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        const fileContent = e.target.result
        str = fileContent
        title.innerHTML = file.name
    };
    reader.readAsText(file, encode);
    reset()
})
const textarea = document.querySelector('.textarea')
textarea.addEventListener('input', function(event) {
    if (!str) return
    if (ready) {
        fakeStr += event.data
        inputLength = event.data.length
        textarea.value = preStr        
        change(textarea.value.length)  // 替换文本
        preStr = textarea.value
        startIndex += inputLength
        ready = false
    }
    if (textarea.value.length < preStr.length) {    // 删除文本
        preStr = textarea.value
        fakeStr = fakeStr.slice(0, textarea.value.length)
    }
    
});
document.addEventListener("keydown", e => {
    if (e.code == 'Space' && e.key == 'Process') {
        ready = true
    }
})

function change(startIndex) {
    if (startIndex >= str.length) return
    const endIndex = startIndex + inputLength
    const realStr = str.slice(startIndex, endIndex)
    textarea.value = preStr + realStr
}
function reset() {
    preStr = ''
    fakeStr = ''
    str = ''
    ready = false
    inputLength = 0
    totalLength = 0
    startIndex = 0
    textarea.value = ''
}
const fontSizeVal = document.querySelector('.font_size_value')
document.querySelector('.range').addEventListener('change', e => {
    textarea.style.fontSize = e.target.value + 'px'
    fontSizeVal.innerHTML = e.target.value
})

const mask = document.querySelector('.mask')
mask.addEventListener('click', e => {
    if(e.target == mask){
        mask.style.display = 'none'
    }
})
document.querySelector('.add_btn').addEventListener('click', () => {
    mask.style.display = 'flex'
})
const text_input = document.querySelector('.text_input')
document.querySelector('.confirm_btn').addEventListener("click", () => {
    if (!text_input.value) {
        // mask.style.display = 'none'
        alert('输入不能为空')
    } else {
        reset()
        str = text_input.value
        title.innerHTML = '自定义文本'
        mask.style.display = 'none'
    }
})

document.querySelector('.fullScreen').addEventListener('click', () => {
    if (!document.fullscreenEnabled) return
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        document.documentElement.requestFullscreen()
    }
})

document.querySelector('.switch_btn').addEventListener('click', () => {
    textarea.value = fakeStr
})

document.querySelector('.tutorial_btn').addEventListener('click', () => {
     window.open(window.location.href + 'assets/tutorial.mp4', '_blank');
})