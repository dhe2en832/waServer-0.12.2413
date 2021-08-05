const { alertShow, alertDismiss } = require('../../utils/alertGenerator');
const scriptsLogin = (ipcRenderer, socket, path, wrapperElm, base_url, home) => {
  document.querySelector('#showHidePassword a').addEventListener('click', (e) => {
    e.preventDefault();
    const showHideBtn = e.currentTarget.firstElementChild;
    if (showHideBtn.classList.contains('fa-eye-slash')) {
      showHideBtn.classList.remove('fa-eye-slash');
      showHideBtn.classList.add('fa-eye');
      showHideBtn.parentNode.parentNode.parentNode.firstElementChild.setAttribute('type', 'text');
    } else {
      showHideBtn.classList.remove('fa-eye');
      showHideBtn.classList.add('fa-eye-slash');
      showHideBtn.parentNode.parentNode.parentNode.firstElementChild.setAttribute(
        'type',
        'password'
      );
    }
  });
  document.querySelector('#submitLogin').addEventListener('click', async (e) => {
    e.preventDefault();
    const alertContainer = document.querySelector('#alertContainer');
    const alertTimeout = 3000;
    const emailElm = document.querySelector('#inputEmail');
    const passwordElm = document.querySelector('#inputPassword');
    if (emailElm.value === '') {
      alertContainer.innerHTML = alertShow('Email anda masih kosong', 'warning');
      alertDismiss(alertTimeout, 'warning');
    } else if (passwordElm.value === '') {
      alertContainer.innerHTML = alertShow('Password anda masih kosong', 'warning');
      alertDismiss(alertTimeout, 'warning');
    } else {
      fetch(base_url + '/auth/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailElm.value, password: passwordElm.value }),
      })
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson.status === true) {
            alertContainer.innerHTML = alertShow(resJson.response, 'success');
            alertDismiss(alertTimeout, 'success');
            localStorage.setItem('sessionID', Date.now());
            home(ipcRenderer, socket, path, wrapperElm);
          } else {
            alertContainer.innerHTML = alertShow(resJson.message, 'danger');
            alertDismiss(alertTimeout, 'danger');
          }
        });
    }
  });
};

const login = (ipcRenderer, socket, path, wrapperElm, base_url, home) => {
  const pageLogin = `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4">
            <div class="text-center error-login"></div>
            <div class="text-center p-4 m-4">
              <form class="form-group">
                  <img class="mb-4" src="./images/icon.ico" alt="CSA-Logo" width="72" height="72" />
                  <h1 class="h3 mb-3 font-weight-normal">Login Prompt</h1>
                  <label for="inputEmail" class="sr-only">Email Address</label>
                  <input type="email" id="inputEmail" class="form-control" placeholder="Email" required autofocus />
                  <label for="inputPassword" class="sr-only">Password</label>
                  <div class="input-group" id="showHidePassword">
                    <input class="form-control" type="password" id="inputPassword" placeholder="Password" required />
                    <div class="input-group-append">
                        <a class="input-group-text text-decoration-none"><i class="fas fa-eye-slash" aria-hidden="true"></i></a>
                    </div>
                  </div>
                  <button id="submitLogin" class="btn btn-sm btn-primary btn-block mt-4" type="submit">Submit</button>
                  <p class="mt-5 mb-3 text-muted small">Copyright &copy; 2021 CSA Computer. All Right Reserved</p>
              </form>
            </div>
        </div>
        <div class="col-md-4"></div>
        <div class="col-md-12 text-center">
            <div id="alertContainer"></div>
        </div>
      </div>
    </div>
  `;
  wrapperElm.innerHTML = pageLogin;
  scriptsLogin(ipcRenderer, socket, path, wrapperElm, base_url, home);
};

module.exports = { login };
