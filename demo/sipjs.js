var session;
var coolPhone;
var intervalId;
var timeCount = 0;
var audioRemote;
var isAutoAnswer = 1;

var callOptions = {
    pcConfig: {
        rtcpMuxPolicy: 'negotiate',
        iceServers: [{'urls': ['stun:stun.l.google.com:19302']}]
    },
    mediaConstraints: {
        audio: true,
        video: false
    }
};

window.onload = function () {
    audioRemote = document.getElementById("audio_remote");
    loadCredentials();
    loadContentPhone();
}

function formatTime(timer) {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

    return `${getHours} : ${getMinutes} : ${getSeconds}`
}

function startRingTone() {
    try {
        ringtone.play();
    } catch (e) {
    }
}

function stopRingTone() {
    try {
        ringtone.pause();
    } catch (e) {
    }
}

function startRingbackTone() {
    try {
        ringbacktone.play();
    } catch (e) {
    }
}

function stopRingbackTone() {
    try {
        ringbacktone.pause();
    } catch (e) {
    }
}

function onTogglePhone() {
    alohub_login_form.classList.toggle("is_open");
}

function minimizeContent() {
    alohub_call_dial.classList.toggle("minimize");
    alohub_calling_content.classList.toggle("minimize");
    alohub_answer_content.classList.toggle("minimize");
}

function loadContentPhone() {
    alohub_call_dial.style.display = 'none';
    alohub_calling_content.style.display = 'none';
    alohub_answer_content.style.display = 'none';
    alohub_login_content.style.display = 'block';
}

function loadContentPhoneRinging() {
    alohub_call_dial.style.display = 'none';
    alohub_calling_content.style.display = 'block';
    alohub_answer_content.style.display = 'none';
    alohub_login_content.style.display = 'none';
}

function loadContentPhoneDial() {
    alohub_call_dial.style.display = 'block';
    alohub_calling_content.style.display = 'none';
    alohub_answer_content.style.display = 'none';
    alohub_login_content.style.display = 'none';
}

function loadContentPhoneAnswer() {
    alohub_call_dial.style.display = 'none';
    alohub_calling_content.style.display = 'none';
    alohub_answer_content.style.display = 'block';
    alohub_login_content.style.display = 'none';
}

function loadCredentials() {
    if (window.localStorage) {
        var s_value;

        if ((s_value = window.localStorage.getItem('alohub.identity.websocket_server_url'))) {
            txtWebsocketServerUrl.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.impu'))) {
            txtPublicIdentity.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.password'))) {
            txtPassword.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.endpoint'))) {
            txtDomain.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.key'))) {
            txtApiKey.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.display_name'))) {
            txtDisplayName.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.impi'))) {
            txtPrivateIdentity.value = s_value;
        }
    }
}

function saveCredentials() {
    if (window.localStorage) {
        var s_value;

        if ((s_value = window.localStorage.getItem('alohub.identity.websocket_server_url'))) {
            txtWebsocketServerUrl.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.ice_servers'))) {
            txtIceServers.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.display_name'))) {
            txtDisplayName.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.impi'))) {
            txtPrivateIdentity.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.impu'))) {
            txtPublicIdentity.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.password'))) {
            txtPassword.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.realm'))) {
            txtRealm.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.endpoint'))) {
            txtDomain.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.key'))) {
            txtApiKey.value = s_value;
        }
    }
}

function onClearInterVal() {
    clearInterval(intervalId);
    timeCount = 0;
}

function timeAnswer() {
    txtCallTime.innerHTML = formatTime(timeCount);
    intervalId = setInterval(() => {
        timeCount = timeCount + 1;
        txtCallTime.innerHTML = formatTime(timeCount);
    }, 1000);
}

function addPhoneNumber(number) {
    txtPhoneAnswer.innerHTML = number;
    txtPhoneCalling.innerHTML = number;
}

function onRegister() {
    var socket = new JsSIP.WebSocketInterface(txtWebsocketServerUrl.value);
    var configuration = {
        sockets: [socket],
        display_name: txtDisplayName.value,
        uri: txtPublicIdentity.value,
        password: txtPassword.value
    };

    saveCredentials();

    JsSIP.debug.enable('JsSIP:*');

    coolPhone = new JsSIP.UA(configuration);

    coolPhone.on('connected', function (e) {
        /* Your code here */
        console.log('===connected===');
        loadContentPhoneDial();
    });

    coolPhone.on('disconnected', function (e) {
        /* Your code here */
        console.log('===disconnected===');
    });

    coolPhone.on('newRTCSession', function (e) {
        /* Your code here */
        console.log('===newRTCSession==');
        var newSession = e.session;

        if (session) {
            //hangup any existing call
            session.terminate();
            onClearInterVal();
        }

        session = newSession;

        session.on('ended', function () {
            session = null;
            console.log('===ended===');
            loadContentPhoneDial();
            onClearInterVal();
        });

        session.on('connecting', function () {
            console.log('=====Rung chuong========')
            console.log(session.remote_identity.uri.user);
            loadContentPhoneRinging();
        });

        session.on('failed', function () {
            session = null;
            console.log('===failed===');
            loadContentPhoneDial();
        });

        session.on('accepted', function () {
            console.log('===accepted===');
            loadContentPhoneAnswer();
        });

        session.on('confirmed', function () {
            console.log('===confirmed===');
            stopRingTone();
        });

        session.on('addstream', function (e) {
            console.log('===addstream===');
        });

        session.on('peerconnection', (e) => {
            console.log('peerconnection');
            let logError = '';
            const peerconnection = e.peerconnection;

            peerconnection.onaddstream = function (e) {
                console.log('addstream', e);
            };

            var remoteStream = new MediaStream();
            console.log(peerconnection.getReceivers());
            peerconnection.getReceivers().forEach(function (receiver) {
                console.log(receiver);
                remoteStream.addTrack(receiver.track);
            });
        });

        session.on("icecandidate", function (event) {
            if (event.candidate.type === "srflx" &&
                event.candidate.relatedAddress !== null &&
                event.candidate.relatedPort !== null) {
                event.ready();
            }
        });

        // session.on("icecandidate", function (event) {
        //     event.ready();
        // });

        if (session.direction === 'incoming') {
            console.log('===incoming===');
            console.log('===number===');
            if (isAutoAnswer === 0) {
                startRingTone();
                console.log(session.remote_identity.uri.user);
            } else {
                onAnswer();
            }
        } else {
            console.log('con', session.connection)
            session.connection.addEventListener('addstream', function (e) {
                this.audioRemote.srcObject = e.stream;
                this.audioRemote.play();
            });
        }
    });

    coolPhone.on('newMessage', function (e) {
        /* Your code here */
        console.log('===newMessage===');
    });

    coolPhone.on('registered', function (e) {
        /* Your code here */
        console.log('===registered===');
        loadContentPhoneDial();
    });

    coolPhone.on('unregistered', function (e) {
        /* Your code here */
        console.log('===unregistered===');
    });

    coolPhone.on('registrationFailed', function (e) {
        /* Your code here */
        console.log('===registrationFailed===');
    });

    coolPhone.start();
}

async function alohubMakeCall(phoneNumber) {
    if (txtDomain.value !== '' && txtApiKey.value !== '') {
        const response = await fetch(txtDomain.value, {
            method: 'POST',
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                ipPhone: txtPrivateIdentity.value,
                transactionId: `ALOHUB_${new Date().getTime()}`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': txtApiKey.value
            }
        });
        const myJson = await response.json();
        console.log('==ResponseMakeCall==', myJson);
        if (myJson.success !== '1') {
            loadContentPhoneDial();
            oSipSessionCall = null;
            alert(myJson.error_message);
        }
    } else {
        alert('Vui lòng nhập thông tin API endpoint và API key');
    }
}

function onCall() {
    var numberPhone = txtPhoneNumber.value;
    //alohubMakeCall(numberPhone);
    loadContentPhoneRinging();
    addPhoneNumber(numberPhone);
}

function onAnswer() {
    if (session) {
        session.answer(callOptions);
        session.connection.addEventListener('addstream', function (e) {
            audioRemote.srcObject = e.stream;
            audioRemote.play();
        });
        addPhoneNumber(session.remote_identity.uri.user);
        timeAnswer();
    }
}

function onHangUp() {
    loadContentPhoneDial();
    stopRingTone();
    stopRingbackTone();

    if (session) {
        session.terminate();
    }
}
