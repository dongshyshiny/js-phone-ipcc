var session;
var coolPhone;
var intervalId;
var timeCount = 0;
var audioRemote;
var isAutoAnswer = 1;
var usingCallJs = 1;

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
    addHtml();
    loadCredentials();
    onRegister();
    loadContentPhoneDial();
}

function addHtml() {
    document.getElementById('alohub_sipml5').innerHTML += '<!--Form Login\'-->\n' +
        '    <!--Form nhập số điện thoại(có validate số, enter sẽ gọi ra, và có 2 position khi người dùng thay đổi)-->\n' +
        '    <div id="alohub_call_dial">\n' +
        '            <span class="alohub_icon_full" onclick="minimizeContent();">\n' +
        '                    <svg width="25" height="25" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none"\n' +
        '                         stroke="customColor">\n' +
        '                        <polyline points="36 48 48 48 48 36"/>\n' +
        '                        <polyline points="28 16 16 16 16 28"/>\n' +
        '                        <rect x="8" y="8" width="48" height="48"/>\n' +
        '                        <line x1="16" y1="16" x2="28" y2="28"/>\n' +
        '                        <line x1="48" y1="48" x2="36" y2="36"/>\n' +
        '                    </svg>\n' +
        '                </span>\n' +
        '        <span class="alohub_icon_minimize" onclick="minimizeContent();">\n' +
        '                    <svg width="25" height="25" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
        '                        <g id="icomoon-ignore">\n' +
        '                        </g>\n' +
        '                        <path d="M6.576 6.576c-5.205 5.205-5.205 13.643 0 18.849s13.643 5.205 18.849-0c5.206-5.206 5.206-13.643 0-18.849s-13.643-5.205-18.849 0zM24.67 24.67c-4.781 4.781-12.56 4.781-17.341 0s-4.781-12.56 0-17.341c4.781-4.781 12.56-4.781 17.341 0s4.78 12.56-0 17.341z"\n' +
        '                              fill="customColor">\n' +
        '                        </path>\n' +
        '                       <path d="M10.722 9.969l-0.754 0.754 5.278 5.278-5.253 5.253 0.754 0.754 5.253-5.253 5.253 5.253 0.754-0.754-5.253-5.253 5.278-5.278-0.754-0.754-5.278 5.278z"\n' +
        '                             fill="customColor">\n' +
        '                       </path>\n' +
        '                    </svg>\n' +
        '                </span>\n' +
        '        <label for="txtPhoneNumber">Số điện thoại</label>\n' +
        '        <div class="d-flex">\n' +
        '            <input type="text" id="txtPhoneNumber">\n' +
        '            <button id="btnClickCall" class="alohub_button-call" onclick="onCall();">\n' +
        '                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '                    <path d="M9 16C2.814 9.813 3.11 5.134 5.94 3.012l.627-.467a1.483 1.483 0 0 1 2.1.353l1.579 2.272a1.5 1.5 0 0 1-.25 1.99L8.476 8.474c-.38.329-.566.828-.395 1.301.316.88 1.083 2.433 2.897 4.246 1.814 1.814 3.366 2.581 4.246 2.898.474.17.973-.015 1.302-.396l1.314-1.518a1.5 1.5 0 0 1 1.99-.25l2.276 1.58a1.48 1.48 0 0 1 .354 2.096l-.47.633C19.869 21.892 15.188 22.187 9 16z"\n' +
        '                          fill="customColor"/>\n' +
        '                </svg>\n' +
        '            </button>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <!--End form nhập số điện thoại(có validate số, enter sẽ gọi ra, và có 2 position khi người dùng thay đổi)-->\n' +
        '    <!--Form Calling(có 2 giao diện khi người dùng thay đổi)-->\n' +
        '    <div id="alohub_calling_content">\n' +
        '            <span class="alohub_icon_full" onclick="minimizeContent();">\n' +
        '                    <svg width="25" height="25" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none"\n' +
        '                         stroke="customColor">\n' +
        '                        <polyline points="36 48 48 48 48 36"/>\n' +
        '                        <polyline points="28 16 16 16 16 28"/>\n' +
        '                        <rect x="8" y="8" width="48" height="48"/>\n' +
        '                        <line x1="16" y1="16" x2="28" y2="28"/>\n' +
        '                        <line x1="48" y1="48" x2="36" y2="36"/>\n' +
        '                    </svg>\n' +
        '                </span>\n' +
        '        <span class="alohub_icon_minimize" onclick="minimizeContent();">\n' +
        '                    <svg width="25" height="25" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
        '                        <g id="icomoon-ignore">\n' +
        '                        </g>\n' +
        '                        <path d="M6.576 6.576c-5.205 5.205-5.205 13.643 0 18.849s13.643 5.205 18.849-0c5.206-5.206 5.206-13.643 0-18.849s-13.643-5.205-18.849 0zM24.67 24.67c-4.781 4.781-12.56 4.781-17.341 0s-4.781-12.56 0-17.341c4.781-4.781 12.56-4.781 17.341 0s4.78 12.56-0 17.341z"\n' +
        '                              fill="customColor">\n' +
        '                        </path>\n' +
        '                        <path d="M10.722 9.969l-0.754 0.754 5.278 5.278-5.253 5.253 0.754 0.754 5.253-5.253 5.253 5.253 0.754-0.754-5.253-5.253 5.278-5.278-0.754-0.754-5.278 5.278z"\n' +
        '                              fill="customColor">\n' +
        '                        </path>\n' +
        '                    </svg>\n' +
        '                </span>\n' +
        '        <div class="alohub_icon">\n' +
        '            <svg width="25" height="25" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
        '                <title>call [#191]</title>\n' +
        '                <desc>Created with Sketch.</desc>\n' +
        '                <defs>\n' +
        '                </defs>\n' +
        '                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
        '                    <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7319.000000)" fill="customColor">\n' +
        '                        <g id="icons" transform="translate(56.000000, 160.000000)">\n' +
        '                            <path d="M94,7167 L94,7169 L96,7169 C96,7167.895 95.105,7167 94,7167 M94,7163 L94,7165 C96.206,7165 98,7166.794 98,7169 L100,7169 C100,7165.686 97.314,7163 94,7163 M94,7159 L94,7161 C98.411,7161 102,7164.589 102,7169 L104,7169 C104,7163.477 99.523,7159 94,7159 M98.652,7177.234 C98.641,7177.265 98.64,7177.27 98.652,7177.234 M98.117,7174.578 C97.422,7174.204 96.719,7173.778 95.992,7173.481 C94.587,7172.908 94.682,7174.602 93.679,7175.151 C93.027,7175.508 92.107,7174.861 91.538,7174.503 C90.544,7173.877 89.663,7173.053 88.931,7172.1 C88.556,7171.613 87.728,7170.697 87.83,7170.014 C87.992,7168.93 89.274,7168.876 88.907,7167.55 C88.711,7166.84 88.36,7166.141 88.097,7165.457 C87.745,7164.54 87.6,7163.953 86.573,7164.003 C85.831,7164.039 85.339,7164.356 84.883,7164.951 C83.649,7166.558 83.835,7168.725 84.664,7170.488 C85.838,7172.983 87.85,7175.335 89.999,7176.855 C91.461,7177.889 93.387,7178.828 95.157,7178.987 C96.453,7179.104 98.266,7178.403 98.73,7176.996 C98.698,7177.094 98.667,7177.189 98.652,7177.234 C98.663,7177.199 98.687,7177.128 98.73,7176.996 C98.777,7176.854 98.8,7176.783 98.811,7176.751 C98.797,7176.793 98.765,7176.891 98.731,7176.993 C99.139,7175.753 99.189,7175.155 98.117,7174.578 M98.811,7176.751 C98.819,7176.727 98.819,7176.725 98.811,7176.751"\n' +
        '                                  id="call-[#191]">\n' +
        '                            </path>\n' +
        '                        </g>\n' +
        '                    </g>\n' +
        '                </g>\n' +
        '            </svg>\n' +
        '        </div>\n' +
        '        <div class="alohub_title">\n' +
        '            Đang gọi...\n' +
        '        </div>\n' +
        '        <div class="alohub_content_information">\n' +
        '            <div class="alohub_infomation_call">\n' +
        '                <div class="alohub_information_title">\n' +
        '                    Số điện thoại\n' +
        '                </div>\n' +
        '                <div id="txtPhoneCalling"></div>\n' +
        '                <div class="alohub_title_calling">\n' +
        '                    Đang gọi ...\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <button class="alohub_button-hangup" onclick="onHangUp();">\n' +
        '                <svg width="25" height="25" viewBox="0 0 24 24" fill=\\"none\\" xmlns="http://www.w3.org/2000/svg">\n' +
        '                    <path d="M9 16C2.814 9.813 3.11 5.134 5.94 3.012l.627-.467a1.483 1.483 0 0 1 2.1.353l1.579 2.272a1.5 1.5 0 0 1-.25 1.99L8.476 8.474c-.38.329-.566.828-.395 1.301.316.88 1.083 2.433 2.897 4.246 1.814 1.814 3.366 2.581 4.246 2.898.474.17.973-.015 1.302-.396l1.314-1.518a1.5 1.5 0 0 1 1.99-.25l2.276 1.58a1.48 1.48 0 0 1 .354 2.096l-.47.633C19.869 21.892 15.188 22.187 9 16z"\n' +
        '                          fill="customColor"/>\n' +
        '                </svg>\n' +
        '                <span class="alohub_button-title">Kết thúc</span>\n' +
        '            </button>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <!--End form Calling(có 2 giao diện khi người dùng thay đổi)-->\n' +
        '    <!--Form answer-->\n' +
        '    <div id="alohub_answer_content">\n' +
        '            <span class="alohub_icon_full" onclick="minimizeContent();">\n' +
        '                   <svg width="25" height="25" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none"\n' +
        '                        stroke="customColor">\n' +
        '                       <polyline points="36 48 48 48 48 36"/>\n' +
        '                       <polyline points="28 16 16 16 16 28"/>\n' +
        '                       <rect x="8" y="8" width="48" height="48"/>\n' +
        '                       <line x1="16" y1="16" x2="28" y2="28"/>\n' +
        '                        <line x1="48" y1="48" x2="36" y2="36"/>\n' +
        '                   </svg>\n' +
        '              </span>\n' +
        '        <span class="alohub_icon_minimize" onclick="minimizeContent();">\n' +
        '                    <svg width="25" height="25" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
        '                       <g id="icomoon-ignore"></g>\n' +
        '                       <path d="M6.576 6.576c-5.205 5.205-5.205 13.643 0 18.849s13.643 5.205 18.849-0c5.206-5.206 5.206-13.643 0-18.849s-13.643-5.205-18.849 0zM24.67 24.67c-4.781 4.781-12.56 4.781-17.341 0s-4.781-12.56 0-17.341c4.781-4.781 12.56-4.781 17.341 0s4.78 12.56-0 17.341z"\n' +
        '                             fill="customColor"></path>\n' +
        '                       <path d="M10.722 9.969l-0.754 0.754 5.278 5.278-5.253 5.253 0.754 0.754 5.253-5.253 5.253 5.253 0.754-0.754-5.253-5.253 5.278-5.278-0.754-0.754-5.278 5.278z"\n' +
        '                             fill="customColor"></path>\n' +
        '                   </svg>\n' +
        '                </span>\n' +
        '        <div class="alohub_icon">\n' +
        '            <svg width="25" height="25" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
        '                <title>call [#191]</title>\n' +
        '                <desc>Created with Sketch.</desc>\n' +
        '                <defs></defs>\n' +
        '                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
        '                    <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7319.000000)" fill="#000000">\n' +
        '                        <g id="icons" transform="translate(56.000000, 160.000000)">\n' +
        '                            <path d="M94,7167 L94,7169 L96,7169 C96,7167.895 95.105,7167 94,7167 M94,7163 L94,7165 C96.206,7165 98,7166.794 98,7169 L100,7169 C100,7165.686 97.314,7163 94,7163 M94,7159 L94,7161 C98.411,7161 102,7164.589 102,7169 L104,7169 C104,7163.477 99.523,7159 94,7159 M98.652,7177.234 C98.641,7177.265 98.64,7177.27 98.652,7177.234 M98.117,7174.578 C97.422,7174.204 96.719,7173.778 95.992,7173.481 C94.587,7172.908 94.682,7174.602 93.679,7175.151 C93.027,7175.508 92.107,7174.861 91.538,7174.503 C90.544,7173.877 89.663,7173.053 88.931,7172.1 C88.556,7171.613 87.728,7170.697 87.83,7170.014 C87.992,7168.93 89.274,7168.876 88.907,7167.55 C88.711,7166.84 88.36,7166.141 88.097,7165.457 C87.745,7164.54 87.6,7163.953 86.573,7164.003 C85.831,7164.039 85.339,7164.356 84.883,7164.951 C83.649,7166.558 83.835,7168.725 84.664,7170.488 C85.838,7172.983 87.85,7175.335 89.999,7176.855 C91.461,7177.889 93.387,7178.828 95.157,7178.987 C96.453,7179.104 98.266,7178.403 98.73,7176.996 C98.698,7177.094 98.667,7177.189 98.652,7177.234 C98.663,7177.199 98.687,7177.128 98.73,7176.996 C98.777,7176.854 98.8,7176.783 98.811,7176.751 C98.797,7176.793 98.765,7176.891 98.731,7176.993 C99.139,7175.753 99.189,7175.155 98.117,7174.578 M98.811,7176.751 C98.819,7176.727 98.819,7176.725 98.811,7176.751"\n' +
        '                                  id="call-[#191]">\n' +
        '                            </path>\n' +
        '                        </g>\n' +
        '                    </g>\n' +
        '                </g>\n' +
        '            </svg>\n' +
        '        </div>\n' +
        '        <div class="alohub_title">\n' +
        '            Đang nghe máy...\n' +
        '        </div>\n' +
        '        <div class="alohub_content_information">\n' +
        '            <div class="alohub_infomation_call">\n' +
        '                <div class="alohub_information_title">\n' +
        '                    Số điện thoại\n' +
        '                </div>\n' +
        '                <div id="txtPhoneAnswer"></div>\n' +
        '                <div id="txtCallTime"></div>\n' +
        '            </div>\n' +
        '            <button class="alohub_button-hangup" onclick="onHangUp();">\n' +
        '                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '                    <path d="M9 16C2.814 9.813 3.11 5.134 5.94 3.012l.627-.467a1.483 1.483 0 0 1 2.1.353l1.579 2.272a1.5 1.5 0 0 1-.25 1.99L8.476 8.474c-.38.329-.566.828-.395 1.301.316.88 1.083 2.433 2.897 4.246 1.814 1.814 3.366 2.581 4.246 2.898.474.17.973-.015 1.302-.396l1.314-1.518a1.5 1.5 0 0 1 1.99-.25l2.276 1.58a1.48 1.48 0 0 1 .354 2.096l-.47.633C19.869 21.892 15.188 22.187 9 16z"\n' +
        '                          fill="customColor"/>\n' +
        '                </svg>\n' +
        '                <span class="alohub_button-title">Kết thúc</span>\n' +
        '            </button>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <!--End form answer-->'
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

function loadContentPhoneRinging() {
    alohub_call_dial.style.display = 'none';
    alohub_calling_content.style.display = 'block';
    alohub_answer_content.style.display = 'none';
}

function loadContentPhoneDial() {
    alohub_call_dial.style.display = 'block';
    alohub_calling_content.style.display = 'none';
    alohub_answer_content.style.display = 'none';
}

function loadContentPhoneAnswer() {
    alohub_call_dial.style.display = 'none';
    alohub_calling_content.style.display = 'none';
    alohub_answer_content.style.display = 'block';
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
        password: txtPassword.value,
        session_timers: false
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

    if (usingCallJs === 1) {
        coolPhone.call(numberPhone);
    } else {
        alohubMakeCall(numberPhone);
    }

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
