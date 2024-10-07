// HTML stuff
var bStart = document.getElementById("start")
var bStop = document.getElementById("stop")
var bDownload = document.getElementById("download")

var sRes = document.getElementById("res")
var sAud1 = document.getElementById("aud1")
var sAud2 = document.getElementById("aud2")

var preview = document.getElementById("preview")

//varibles
let vid,aud1,aud2,medRec,recChunks

//init
async function init() {
    await navigator.mediaDevices.getUserMedia({audio:true})
    const devices = await navigator.mediaDevices.enumerateDevices();

    let i=1
    for (let v of devices) {
        if (v.kind === "audioinput") {
            let opt1 = document.createElement("option")
            let opt2 = document.createElement("option")
            opt1.value = v.deviceId
            opt2.value = v.deviceId
            opt1.textContent = v.label || `device ${i}`
            opt2.textContent = v.label || `device ${i}`
            sAud1.appendChild(opt1)
            sAud2.appendChild(opt2)
            i++
        }
    }
}
init()

// OH BOY TIME FOR PAINNNNNN

async function startRec() {
    recChunks = []
    preview.control = false;
    preview.muted = true;
    preview.autoplay = true;
    preview.srcObject = null

    let [width, height] = res.value.split('x').map(Number);
    let bitrate = Math.min(width * height * 60, 20000000)

    aud1 = await navigator.mediaDevices.getUserMedia({
        audio: {deviceId:{exact:sAud1.value},noiseSuppression:true}
    });

    aud2 = await navigator.mediaDevices.getUserMedia({
        audio: {deviceId:{exact:sAud2.value},noiseSuppression:true}
    })

    vid = await navigator.mediaDevices.getDisplayMedia({
        video: {width:{ideal:width},height:{ideal:height},frameRate:{ideal:60}}
    })

    const ac = new AudioContext()
    const s1 = ac.createMediaStreamSource(aud1)
    const s2 = ac.createMediaStreamSource(aud2)
    const dest = ac.createMediaStreamDestination()
    s1.connect(dest)
    s2.connect(dest)

    let stream = new MediaStream([
        ...dest.stream.getAudioTracks(),
        ...vid.getVideoTracks()
    ])
    preview.srcObject = stream
}

bStart.addEventListener("click",startRec)
