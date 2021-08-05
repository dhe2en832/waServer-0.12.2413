const { dateTimeGeneratorClient } = require('../../utils/dateTimeGenerator');
const { durationGenerator } = require('../../utils/durationGenerator');
const { alertShow, alertDismiss } = require('../../utils/alertGenerator');
const scriptsHome = (ipcRenderer, socket) => {
  $('#loading').show();
  $('#app').hide();
  $('#content').hide();

  ipcRenderer.send('login-succeed');

  // Reload Then Exit
  window.addEventListener('beforeunload', () => {
    const totalRev = parseInt($('#rev_counter').text());
    const totalSen = parseInt($('#sen_counter').text());
    ipcRenderer.send('windows-closed', [totalRev, totalSen]);
  });

  // Web Socket
  socket.on('fatal-error', function (error) {
    $('#loading').hide();
    $('#app').hide();
    $('#content').hide();
    const timeout = 86400000;
    const errMsg =
      'UPDATE DIBUTUHKAN ATAU TERJADI ERROR : ' +
      error +
      '<br /> HARAP HUBUNGI CSA COMPUTER SUPPORT';
    const errCatch = alertShow(errMsg, 'danger');
    $('#alertContainer').append(errCatch);
    alertDismiss(timeout, 'danger');
  });

  socket.on('error', function (error) {
    const timeout = error.code === 'ENOENT' ? 100000 : 80000;
    const errMsg =
      error.code === 'ENOENT'
        ? error.code + ' : TIDAK DITEMUKAN ENTITAS ' + error.path || ' '
        : error.code;
    const errCatch = alertShow(errMsg, 'danger');
    $('#alertContainer').append(errCatch);
    alertDismiss(timeout, 'danger');
  });

  socket.on('logs', function (msg) {
    if ($('.logs').children().length > 6) $('.logs').html('');
    $('.logs').append($('<li>').text(msg));
  });

  socket.on('qr', function (src) {
    $('#qrcode').attr('src', src);
    $('#loading').hide();
    $('#app').show();
    $('#content').hide();
  });

  socket.on('ready', function (data) {
    $('#loading').hide();
    $('#app').hide();
    $('#content').show();
    $('.logs').html('');
    $('#rev_counter').text(data.totalReceived);
    $('#sen_counter').text(data.totalSent);
  });

  socket.on('authenticated', function (data) {
    // Clock With Date Time Generator and Duration Generator
    window.setInterval(() => {
      const lastTime = $('#onlineFromHidden').text();
      const duration = durationGenerator(lastTime);
      $('#onlineDuration').text(duration);
    }, 1000);
    const authCatch = alertShow('Anda telah terhubung dengan QR Code.', 'success');
    $('#alertContainer').append(authCatch);
    alertDismiss(5000, 'success');
  });

  socket.on('disconnected_client', async function () {
    const totalRev = parseInt($('#rev_counter').text());
    const totalSen = parseInt($('#sen_counter').text());
    await ipcRenderer.send('client_disconnected', [totalRev, totalSen]);
    $('#rev_counter').text(0);
    $('#sen_counter').text(0);
    $('#loading').show();
    $('#app').hide();
    $('#content').hide();
    const disconnectedCatch = alertShow(
      'Client Whatsapp Telah Terputus, Silahkan Scan QR Code Kembali',
      'danger'
    );
    $('#alertContainer').append(disconnectedCatch);
    alertDismiss(15000, 'danger');
  });

  socket.on('received_message', function (data) {
    const currentReceived = parseInt($('#rev_counter').text()) + data;
    $('#rev_counter').text(currentReceived);
  });

  socket.on('sent_message', function (data) {
    const currentSent = parseInt($('#sen_counter').text()) + data;
    $('#sen_counter').text(currentSent);
  });

  socket.on('info', function (pNumber, pName, pPlatform, pVersion) {
    $('#onlineFrom').text();
    $('#onlineNumber').text(pNumber);
    $('#onlineName').text(pName);
    $('#onlinePlatform').text(pPlatform);
    $('#onlineVersion').text(pVersion);
    $('#onlineFrom').text(dateTimeGeneratorClient());
    $('#onlineFromHidden').text(new Date());
  });
};

const home = (ipcRenderer, socket, path, wrapperElm) => {
  const pageHome = `
  <div class="container-fluid">
      <!-- loading -->
      <div id="loading" class="row mt-5">
         <div class="col-12 text-center mt-5">
            <h5>Mohon Tunggu <br />Sedang Memuat QR Code...</h5>
            <div class="spinner-grow text-primary" role="status">
               <span class="sr-only">Loading...</span>
            </div>
         </div>
      </div>

      <!-- app -->
      <div id="app" class="row">
         <div class="col-md-12 text-center">
            <h5>&nbsp;</h5>
            <h1>Whatsapp API</h1>
            <p>Powered by CSA Computer</p>
            <img src="" alt="Loading Whatsapp QR Code" id="qrcode" />
            <h3>Logs:</h3>
            <ul class="list-unstyled logs"></ul>
         </div>
      </div>

      <!-- alert -->
      <div id="alert" class="row">
         <div class="col-md-12 text-center m-2">
            <div id="alertContainer"></div>
         </div>
      </div>

      <!-- content -->
      <div id="content" class="row">
         <div class="col-md-12 m-2">
            <h5>Koneksi</h5>
            <div class="card p-4">
               <p>Nomor Whatsapp : <span class="float-right" id="onlineNumber"></span></p>
               <p>Pengguna Whatsapp : <span class="float-right" id="onlineName"></span></p>
               <p>Platform Perangkat : <span class="float-right" id="onlinePlatform"></span></p>
               <p>Versi Whatsapp di Perangkat : <span class="float-right" id="onlineVersion"></span></p>
               <p>Aktif Dari : <span class="float-right" id="onlineFrom"></span><span class="d-none" id="onlineFromHidden"></span></p>
               <p>Durasi : <span class="float-right" id="onlineDuration"></span></p>
            </div>
         </div>
         <div class="col-md-12 m-2">
            <h5>Aktivitas</h5>
            <div class="card p-4">
               <p>Pesan Masuk : <span class="float-right" id="rev_counter">0</span></p>
               <p>Pesan Keluar : <span class="float-right" id="sen_counter">0</span></p>
            </div>
         </div>
      </div>
   </div>
   `;
  wrapperElm.innerHTML = pageHome;
  scriptsHome(ipcRenderer, socket);
};

module.exports = { home };
